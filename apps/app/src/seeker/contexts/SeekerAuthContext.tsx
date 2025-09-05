import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { User } from 'firebase/auth';
import { seekerAuth, seekerDb } from '../lib/seekerFirebase';
import { onAuthStateChanged, signOut, signInWithCustomToken } from 'firebase/auth';
import { buildCallbackUrl } from '@/shared/lib/codespaces';
import { useSeekerLiff } from './SeekerLiffContext';
import { logger } from '@/shared/utils/logger';
import { AuthErrorBoundary } from '@/shared/components/AuthErrorBoundary';
import { AuthCircuitBreaker, AuthCircuitBreakerFactory } from '@/shared/utils/AuthCircuitBreaker';
import { authHealthChecker } from '@/shared/utils/AuthHealthChecker';

// Enterprise-grade authentication context with advanced security features
interface SeekerUser extends User {
  role: 'seeker';
  profile?: {
    lineUserId?: string;
    displayName?: string;
    pictureUrl?: string;
    statusMessage?: string;
  };
  sessionId?: string;
  lastActivity?: number;
  loginAttempts?: number;
}

interface AuthMetrics {
  loginCount: number;
  failedLoginCount: number;
  sessionDuration: number;
  lastLoginTime: number;
}

interface SeekerAuthContextType {
  user: SeekerUser | null;
  isLoading: boolean;
  isLogoutInProgress: boolean;
  isAuthenticated: boolean;
  isOnline: boolean;
  login: (options?: { rememberMe?: boolean }) => Promise<void>;
  logout: (options?: { silent?: boolean }) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearSession: () => void;
  metrics: AuthMetrics;
  retryLogin: (maxAttempts?: number) => Promise<void>;
  circuitBreakerStats?: {
    firebase: any;
    liff: any;
  };
  healthStatus?: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: any[];
    lastChecked: number;
  };
  checkHealthNow?: () => Promise<void>;
}

const SeekerAuthContext = createContext<SeekerAuthContextType | undefined>(undefined);

export const useSeekerAuth = () => {
  const context = useContext(SeekerAuthContext);
  if (context === undefined) {
    throw new Error('useSeekerAuth must be used within a SeekerAuthProvider');
  }
  return context;
};

interface SeekerAuthProviderProps {
  children: ReactNode;
  enableOfflineSupport?: boolean;
  sessionTimeout?: number; // in milliseconds
  maxLoginAttempts?: number;
}

export const SeekerAuthProvider: React.FC<SeekerAuthProviderProps> = ({
  children,
  enableOfflineSupport = true,
  sessionTimeout = 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts = 3
}) => {
  const [user, setUser] = useState<SeekerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutInProgress, setIsLogoutInProgress] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [metrics, setMetrics] = useState<AuthMetrics>({
    loginCount: 0,
    failedLoginCount: 0,
    sessionDuration: 0,
    lastLoginTime: 0
  });

  const loginAttemptsRef = useRef(0);
  const sessionStartTimeRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Circuit breakers for different services
  const firebaseBreaker = useRef(AuthCircuitBreakerFactory.createAuthBreaker('FirebaseAuth'));
  const liffBreaker = useRef(AuthCircuitBreakerFactory.createLIFFBreaker());

  // Health monitoring
  const [healthStatus, setHealthStatus] = useState(authHealthChecker.getOverallHealth());

  const { liff, isLiffReady, initializeLiff, liffError } = useSeekerLiff();

  // Start health monitoring (skip in development to avoid UI churn)
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    authHealthChecker.startMonitoring();
    const healthInterval = setInterval(() => {
      setHealthStatus(authHealthChecker.getOverallHealth());
    }, 10000);
    return () => {
      authHealthChecker.stopMonitoring();
      clearInterval(healthInterval);
    };
  }, []);

  // Metrics tracking
  useEffect(() => {
    if (user && !sessionStartTimeRef.current) {
      sessionStartTimeRef.current = Date.now();
      setMetrics(prev => ({
        ...prev,
        loginCount: prev.loginCount + 1,
        lastLoginTime: Date.now()
      }));
      logger.info('AuthProvider: Session started', { userId: user.uid });
    }
  }, [user]);

  // Session duration tracking
  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionStartTimeRef.current) {
        const duration = Date.now() - sessionStartTimeRef.current;
        setMetrics(prev => ({
          ...prev,
          sessionDuration: duration
        }));
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    logger.info('AuthProvider: Setting up persistent auth state listener');
    const unsubscribe = onAuthStateChanged(seekerAuth, (firebaseUser) => {
      logger.info('AuthProvider: Auth state changed', {
        user: firebaseUser ? `${firebaseUser.uid} (${firebaseUser.email})` : 'null'
      });
      
      // Dev bypass: allow mock authentication when localStorage flag is set
      try {
        const bypass = localStorage.getItem('bypass_mode') === 'true';
        if (!firebaseUser && bypass) {
          const mock: SeekerUser = {
            // @ts-expect-error allow minimal mock of Firebase User
            uid: `mock_seeker_${Date.now()}`,
            email: 'mock_seeker@dev.neeiz.com',
            providerId: 'custom',
            displayName: 'Mock ผู้หางาน',
            role: 'seeker',
            getIdToken: async () => 'mock-token',
          } as any;
          setUser(mock);
          setIsLoading(false);
          logger.info('AuthProvider: Bypass mode active, using mock seeker user');
          return;
        }
      } catch {}

      if (firebaseUser) {
        const seekerUser: SeekerUser = { ...firebaseUser, role: 'seeker' };
        setUser(seekerUser);
        logger.info('AuthProvider: User state set', { userId: seekerUser.uid });
      } else {
        setUser(null);
        logger.info('AuthProvider: User state set to null');
        // If no user, we might need to initialize LIFF for a potential login
        try {
          const bypass = localStorage.getItem('bypass_mode') === 'true';
          if (!bypass) initializeLiff();
        } catch { initializeLiff(); }
      }
      // We set loading to false only after the initial check is complete.
      setIsLoading(false);
      logger.info('AuthProvider: Loading state set to false');
    });

    // Cleanup subscription on unmount
    return () => {
      logger.info('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, [initializeLiff]);

  // Effect for LIFF-specific auto-login
  useEffect(() => {
    // This should only run if there's no user, and LIFF is ready.
    if (!user && isLiffReady) {
      // Skip auto-login for a brief window after explicit logout
      try {
        const until = parseInt(localStorage.getItem('suppress_auto_login_until') || '0', 10);
        if (until && Date.now() < until) {
          logger.info('AuthProvider: Suppressing LIFF auto-login due to recent logout');
          return;
        }
      } catch {}
      if (liff.isInClient() && liff.isLoggedIn()) {
        logger.info('AuthProvider: LIFF auto-login initiated');
        setIsLoading(true); // Show loading during the token exchange
        
        const performLiffAutoLogin = async () => {
          try {
            const accessToken = liff.getAccessToken();
            if (!accessToken) throw new Error("Could not get LIFF access token.");

            // Use circuit breaker for API call
            const response = await liffBreaker.current.execute(async () => {
              return await fetch('/api/auth/seeker-liff-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken, role: 'seeker' }),
              });
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Failed to exchange LIFF token.');
            }

            const { firebaseToken } = await response.json();
            // The onAuthStateChanged listener will handle setting the user and isLoading state.
            await firebaseBreaker.current.execute(async () => {
              await signInWithCustomToken(seekerAuth, firebaseToken);
            });

            logger.info('AuthProvider: LIFF auto-login successful');
          } catch (error) {
            logger.error('AuthProvider: LIFF auto-login failed', { error: error.message });
            liff.logout(); // Log out to ensure a clean state for the next attempt
            setIsLoading(false); // Stop loading on failure
          }
        };
        
        performLiffAutoLogin();
      }
    }
  }, [user, isLiffReady, liff]);

  const login = useCallback(async () => {
    setIsLoading(true);
    logger.info('AuthProvider: Login initiated by user');

    try {
      // ตรวจสอบว่าเป็น LIFF environment หรือไม่
      if (liff && liff.isInClient()) {
        logger.info('AuthProvider: In LIFF, redirecting to LIFF login');
        await liffBreaker.current.execute(async () => {
          liff.login({ redirectUri: window.location.href });
        });
      } else {
        logger.info('AuthProvider: In web browser, requesting secure authorize URL (PKCE + state)');
        const redirectUri = (import.meta as any).env?.VITE_CODESPACES_BASE_DOMAIN
          ? buildCallbackUrl('seeker', 5000)
          : (import.meta as any).env?.VITE_LINE_REDIRECT_URI_SEEKER || `${window.location.origin}/seeker/auth/callback`;
        const resp = await fetch('/api/auth/authorize', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'seeker', redirectPath: '/seeker/home', redirectUri })
        });
        if (!resp.ok) {
          const err = await resp.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to initialize OAuth');
        }
        const data = await resp.json();
        const { authorizeUrl } = data;
        if (!authorizeUrl) throw new Error('No authorizeUrl received');
        window.location.href = authorizeUrl;
      }
    } catch (error) {
      logger.error('AuthProvider: Login failed with circuit breaker', { error: error.message });
      setMetrics(prev => ({ ...prev, failedLoginCount: prev.failedLoginCount + 1 }));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [liff]);

  const logout = async () => {
    logger.info('AuthProvider: Logging out');
    // Prevent auto-login immediately after logout
    try {
      localStorage.setItem('suppress_auto_login_until', String(Date.now() + 15000));
    } catch {}
    setIsLoading(true);
    setIsLogoutInProgress(true);
    try {
      // 1) Resolve LINE userId before altering LIFF session
      let lineUserId: string | null = null;
      try {
        if (liff && typeof liff.isLoggedIn === 'function' && liff.isLoggedIn() && typeof liff.getProfile === 'function') {
          const profile = await liff.getProfile();
          lineUserId = profile?.userId || null;
          if (lineUserId) localStorage.setItem('line_user_id', lineUserId);
        }
      } catch {}
      if (!lineUserId) {
        lineUserId = (user as any)?.profile?.lineUserId || localStorage.getItem('line_user_id');
      }

      // 2) Notify backend BEFORE closing LIFF window for reliability
      try {
        if (lineUserId) {
          const payload = JSON.stringify({ lineUserId, message: 'ออกจากระบบ Neezs Seeker แล้ว' });
          let notified = false;
          if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
            try {
              const blob = new Blob([payload], { type: 'application/json' });
              notified = navigator.sendBeacon('/api/auth/line/logout-notify', blob);
              // Give the browser a brief moment to enqueue the beacon
              await new Promise((r) => setTimeout(r, 200));
            } catch {}
          }
          if (!notified) {
            const notify = fetch('/api/auth/line/logout-notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              // @ts-ignore keepalive for webview unload
              keepalive: true,
              body: payload,
            }).catch(() => {});
            // Wait slightly longer to maximize delivery reliability in webviews
            await Promise.race([
              notify,
              new Promise((resolve) => setTimeout(resolve, 1500)),
            ]);
          }
        }
      } catch {}

      // 3) Sign out from Firebase
      await firebaseBreaker.current.execute(async () => {
        await signOut(seekerAuth);
      });

      setUser(null);
      // Preserve suppress flag to prevent immediate auto-login loop
      const suppressKey = 'suppress_auto_login_until';
      let suppressUntil = localStorage.getItem(suppressKey);
      if (!suppressUntil) {
        suppressUntil = String(Date.now() + 60_000); // suppress for 60s by default
      }
      localStorage.clear();
      try { localStorage.setItem(suppressKey, suppressUntil); } catch {}

      // 4) Finally, clear LIFF session and close window if applicable
      try {
        if (liff && typeof liff.isInClient === 'function' && liff.isInClient()) {
          if (typeof liff.isLoggedIn === 'function' && liff.isLoggedIn()) {
            await liffBreaker.current.execute(async () => {
              try { liff.logout(); } catch {}
            });
          }
          if (typeof liff.closeWindow === 'function') {
            liff.closeWindow();
            return;
          }
        }
      } catch {}

      logger.info('AuthProvider: Logout successful');
      // No hard navigation; keep user on current page. If in LIFF, close window above.
    } catch (error: any) {
      logger.error('AuthProvider: Logout failed', { error: error.message });
      // Even if logout fails, clear local state
      setUser(null);
      const suppressKey2 = 'suppress_auto_login_until';
      const until = String(Date.now() + 60_000);
      localStorage.clear();
      try { localStorage.setItem(suppressKey2, until); } catch {}
    } finally {
      setIsLoading(false);
      setIsLogoutInProgress(false);
    }
  };

  // Effect for session timeout handling
  useEffect(() => {
    if (!user) return;

    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
        const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours

        if (timeSinceLastActivity > sessionTimeout) {
          logger.info('AuthProvider: Session timeout detected, logging out');
          logout();
          return;
        }
      }
    };

    // Check session timeout every minute
    const interval = setInterval(checkSessionTimeout, 60 * 1000);

    // Update last activity on user interaction
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Add event listeners for user activity
    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // Set initial activity
    updateActivity();

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [user, logout]);

  // Enterprise-grade features
  const refreshToken = useCallback(async () => {
    if (!user) return;

    try {
      logger.info('AuthProvider: Refreshing token');
      // Firebase automatically handles token refresh
      // This is just for explicit refresh if needed
      await firebaseBreaker.current.execute(async () => {
        await user.getIdToken(true);
      });
      logger.info('AuthProvider: Token refreshed successfully');
    } catch (error) {
      logger.error('AuthProvider: Token refresh failed', { error: error.message });
      throw error;
    }
  }, [user]);

  const clearSession = useCallback(() => {
    logger.info('AuthProvider: Clearing session');
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('sessionId');
    sessionStartTimeRef.current = null;
  }, []);

  const retryLogin = useCallback(async (maxAttempts = 3) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        logger.info(`AuthProvider: Retry login attempt ${attempt}/${maxAttempts}`);
        await login();
        return; // Success, exit retry loop
      } catch (error) {
        logger.warn(`AuthProvider: Retry login attempt ${attempt} failed`, { error: error.message });

        if (attempt === maxAttempts) {
          throw new Error(`Login failed after ${maxAttempts} attempts: ${error.message}`);
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [login]);

  const value = {
    user,
    isLoading,
    isLogoutInProgress,
    isAuthenticated: !!user,
    isOnline,
    login,
    logout,
    refreshToken,
    clearSession,
    metrics,
    retryLogin,
    // Circuit breaker stats for monitoring
    circuitBreakerStats: {
      firebase: firebaseBreaker.current.getStats(),
      liff: liffBreaker.current.getStats()
    },
    // Health monitoring
    healthStatus,
    checkHealthNow: () => authHealthChecker.checkNow().then(() => {
      setHealthStatus(authHealthChecker.getOverallHealth());
    })
  };

  return (
    <AuthErrorBoundary>
      <SeekerAuthContext.Provider value={value}>
        {children}
      </SeekerAuthContext.Provider>
    </AuthErrorBoundary>
  );
};

declare global {
  interface Window {
    liff: any;
  }
}
