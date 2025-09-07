import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface SeekerLiffContextType {
  isLiffReady: boolean;
  isLiffLoading: boolean;
  liff: any;
  initializeLiff: () => Promise<void>;
  getLiffToken: () => Promise<string | null>;
  getLiffProfile: () => Promise<any>;
  isInLiffBrowser: () => boolean;
  isLiffLoggedIn: () => boolean;
  liffLogin: () => void;
  liffError: string | null;
  initializationAttempted: boolean;
  forceLiffReload: () => void;
}

const SeekerLiffContext = createContext<SeekerLiffContextType | undefined>(undefined);

export const useSeekerLiff = () => {
  const context = useContext(SeekerLiffContext);
  if (context === undefined) {
    throw new Error('useSeekerLiff must be used within a SeekerLiffProvider');
  }
  return context;
};

interface SeekerLiffProviderProps {
  children: ReactNode;
}

// LIFF ID สำหรับ Seeker จาก environment variable
const SEEKER_LIFF_ID = import.meta.env.VITE_LIFF_ID_SEEKER;

export const SeekerLiffProvider: React.FC<SeekerLiffProviderProps> = ({ children }) => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isLiffLoading, setIsLiffLoading] = useState(false);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const loadLiffSdk = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.liff) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      // Add cache busting parameter
      const cacheBuster = Date.now();
      script.src = `https://static.line-scdn.net/liff/edge/2/sdk.js?v=${cacheBuster}`;
      script.onload = () => {
        console.log('✅ SeekerLiff: LIFF SDK loaded with cache buster');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ SeekerLiff: Failed to load LIFF SDK');
        reject(new Error('Failed to load LIFF SDK'));
      };
      document.head.appendChild(script);
    });
  };

  const initializeLiff = useCallback(async (): Promise<void> => {
    // Prevent multiple initialization attempts
    if (isLiffLoading || isLiffReady) {
      console.log('🔄 SeekerLiff: Already initialized or initializing');
      return;
    }

    // ตรวจสอบ LIFF ID
    if (!SEEKER_LIFF_ID) {
      console.error('❌ SeekerLiff: VITE_LIFF_ID_SEEKER not found in environment variables');
      setLiffError('LIFF ID not configured');
      setInitializationAttempted(true);
      return;
    }

    setInitializationAttempted(true);
    setIsLiffLoading(true);
    setLiffError(null);
    console.log(`🔄 SeekerLiff: Starting LIFF initialization (attempt ${retryCount + 1}/${maxRetries}) for seeker with ID:`, SEEKER_LIFF_ID);

    try {
      // Check if we're in a development environment
      if (import.meta.env.DEV) {
        console.log('⚠️ SeekerLiff: Development mode detected - LIFF may not work outside LINE app');
      }

      // Check if we're actually in LINE browser
      const userAgent = navigator.userAgent.toLowerCase();
      const isInLine = userAgent.includes('line/') || userAgent.includes('line-ios/') || userAgent.includes('line-android/');
      console.log('🔄 SeekerLiff: User agent check - In LINE app:', isInLine);
      console.log('🔄 SeekerLiff: User agent:', userAgent);

      // Load LIFF SDK
      await loadLiffSdk();

      if (!window.liff) {
        throw new Error('LIFF SDK not available after loading');
      }

      console.log('🔄 SeekerLiff: LIFF SDK available, initializing...');

      // Initialize LIFF with shorter timeout for faster failure detection
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('LIFF initialization timeout (5s)')), 5000);
      });

      await Promise.race([
        window.liff.init({ liffId: SEEKER_LIFF_ID }),
        timeoutPromise
      ]);
      
      setIsLiffReady(true);
      setLiffError(null);
      setRetryCount(0); // Reset retry count on success
      console.log('✅ SeekerLiff: LIFF initialized successfully');
      console.log('🔄 SeekerLiff: In LIFF browser:', window.liff.isInClient());
      console.log('🔄 SeekerLiff: Is logged in:', window.liff.isLoggedIn());
      
    } catch (error: any) {
      console.error(`❌ SeekerLiff: Initialization failed (attempt ${retryCount + 1})`, error);
      setIsLiffReady(false);
      
      // Retry logic
      if (retryCount < maxRetries - 1) {
        console.log(`🔄 SeekerLiff: Retrying in 2 seconds... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          setIsLiffLoading(false);
          setInitializationAttempted(false);
          initializeLiff();
        }, 2000);
        return;
      }
      
      // Max retries reached
      setLiffError(`LIFF initialization failed after ${maxRetries} attempts: ${error.message}`);
      
      // Don't throw error in development mode to prevent app crash
      if (!import.meta.env.DEV) {
        throw error;
      }
    } finally {
      if (retryCount >= maxRetries - 1) {
        setIsLiffLoading(false);
      }
    }
  }, [isLiffLoading, isLiffReady, retryCount, maxRetries]);

  const getLiffToken = useCallback(async (): Promise<string | null> => {
    if (!isLiffReady || !window.liff) {
      console.log('⚠️ SeekerLiff: LIFF not ready for token');
      return null;
    }

    try {
      if (!window.liff.isLoggedIn()) {
        console.log('⚠️ SeekerLiff: User not logged in to LIFF');
        return null;
      }

      const accessToken = window.liff.getAccessToken();
      console.log('✅ SeekerLiff: Access token obtained');
      return accessToken;
    } catch (error) {
      console.error('❌ SeekerLiff: Failed to get access token', error);
      return null;
    }
  }, [isLiffReady]);

  const getLiffProfile = useCallback(async (): Promise<any> => {
    if (!isLiffReady || !window.liff) {
      console.log('⚠️ SeekerLiff: LIFF not ready for profile');
      return null;
    }

    try {
      if (!window.liff.isLoggedIn()) {
        console.log('⚠️ SeekerLiff: User not logged in to LIFF');
        return null;
      }

      const profile = await window.liff.getProfile();
      console.log('✅ SeekerLiff: Profile obtained', profile.displayName);
      return profile;
    } catch (error) {
      console.error('❌ SeekerLiff: Failed to get profile', error);
      return null;
    }
  }, [isLiffReady]);

  const isInLiffBrowser = useCallback((): boolean => {
    return isLiffReady && window.liff && window.liff.isInClient();
  }, [isLiffReady]);

  const isLiffLoggedIn = useCallback((): boolean => {
    return isLiffReady && window.liff && window.liff.isLoggedIn();
  }, [isLiffReady]);

  const liffLogin = useCallback(() => {
    if (!isLiffReady || !window.liff) {
      console.log('⚠️ SeekerLiff: LIFF not ready for login');
      return;
    }
    console.log('🔄 SeekerLiff: Redirecting to LIFF login...');
    window.liff.login();
  }, [isLiffReady]);

  const forceLiffReload = useCallback(() => {
    console.log('🔄 SeekerLiff: Force reloading LIFF...');
    
    // Clear LIFF state
    setIsLiffReady(false);
    setInitializationAttempted(false);
    setLiffError(null);
    setRetryCount(0);
    
    // Add cache buster to current URL and reload
    const url = new URL(window.location.href);
    url.searchParams.set('_t', Date.now().toString());
    window.location.href = url.toString();
  }, []);

  const value = {
    isLiffReady,
    isLiffLoading,
    liff: window.liff,
    initializeLiff,
    getLiffToken,
    getLiffProfile,
    isInLiffBrowser,
    isLiffLoggedIn,
    liffLogin,
    liffError,
    initializationAttempted,
    forceLiffReload
  };

  return (
    <SeekerLiffContext.Provider value={value}>
      {children}
    </SeekerLiffContext.Provider>
  );
};

declare global {
  interface Window {
    liff: any;
  }
}
