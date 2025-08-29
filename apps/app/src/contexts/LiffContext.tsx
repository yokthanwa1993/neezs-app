import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';

declare global {
  interface Window {
    liff: any;
  }
}

interface LiffContextType {
  isLiffReady: boolean;
  isLiffLoading: boolean;
  liff: any;
  initializeLiffForRole: (role: 'seeker' | 'employer') => Promise<void>;
}

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error('useLiff must be used within a LiffProvider');
  }
  return context;
};

interface LiffProviderProps {
  children: ReactNode;
}

let liffInitializing = false;
let liffInitialized = false;

export const resetLiffState = () => {
  liffInitialized = false;
  liffInitializing = false;
  console.log('🔄 LIFF state reset');
};

export const LiffProvider: React.FC<LiffProviderProps> = ({ children }) => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isLiffLoading, setIsLiffLoading] = useState(false);
  const { setUser } = useAuth();

  const loadLiffSdk = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="liff"]')) {
        return resolve();
      }
      const script = document.createElement('script');
      script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('ไม่สามารถโหลด LINE SDK ได้'));
      document.head.appendChild(script);
    });
  };

  const authenticateWithBackend = async (idToken: string, profile: any, role: 'seeker' | 'employer') => {
    try {
      // Always use relative path - Vite will proxy to the correct backend
      const endpoint = '/api/auth/line';
      
      console.log(`🌐 Authenticating with backend via ${endpoint} for role: ${role}`);
      console.log('📝 Sending data:', { hasIdToken: !!idToken, profile, role });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, profile, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Backend authentication error response:', errorData);
        throw new Error(`Backend authentication failed: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const { token: customToken, user: firebaseUser } = await response.json();
      
      localStorage.setItem('firebase_custom_token', customToken);
      localStorage.setItem('firebase_user_data', JSON.stringify(firebaseUser));

      const userCredential = await signInWithCustomToken(auth, customToken);
      const userObj = {
        id: userCredential.user.uid,
        name: firebaseUser.displayName || profile.displayName,
        email: firebaseUser.email || '',
        picture: firebaseUser.photoURL || profile.pictureUrl,
      };

      setUser(userObj);
      localStorage.setItem('auth_user', JSON.stringify(userObj));
      localStorage.setItem('auth_completed_at', new Date().toISOString());
      console.log('✅ Firebase authentication successful, user set:', userObj);

    } catch (error) {
      console.error('❌ Error in authenticateWithBackend:', error);
      localStorage.removeItem('firebase_custom_token');
      localStorage.removeItem('firebase_user_data');
    }
  };

  const handleLoggedInUser = async () => {
    try {
      const idToken = window.liff.getIDToken();
      if (!idToken) {
        console.warn('⚠️ No ID Token available from LIFF.');
        window.liff.login();
        return;
      }
      console.log('🎫 Got ID Token from LIFF');
      localStorage.setItem('liff_id_token', idToken);

      const profile = await window.liff.getProfile();
      console.log('👤 LIFF Profile:', profile);
      
      const currentRole = localStorage.getItem('login_role') as 'seeker' | 'employer' || 'seeker';
      await authenticateWithBackend(idToken, profile, currentRole);

    } catch (error) {
      console.error('❌ Error handling logged in user:', error);
    }
  };

  const initializeLiffForRole = async (role: 'seeker' | 'employer') => {
    if (liffInitializing) {
      console.log('⏳ LIFF initialization already in progress');
      return;
    }
    if (liffInitialized) {
      console.log('✅ LIFF already initialized.');
      // If user is logged in, re-verify auth, otherwise do nothing.
      if (window.liff && window.liff.isLoggedIn()) {
        await handleLoggedInUser();
      }
      return;
    }
    
    liffInitializing = true;
    setIsLiffLoading(true);
    
    try {
      console.log('🚀 Initializing LIFF for role:', role);
      await loadLiffSdk();

      const liffId = role === 'seeker' 
        ? import.meta.env.VITE_LIFF_ID_SEEKER
        : import.meta.env.VITE_LIFF_ID_EMPLOYER;
      
      if (!liffId) {
        throw new Error(`LIFF ID for ${role} not configured`);
      }
      console.log(`🆔 Using ${role.toUpperCase()} LIFF ID:`, liffId);

      await window.liff.init({ liffId });
      liffInitialized = true;
      setIsLiffReady(true);
      console.log('✅ LIFF initialized successfully');

      if (window.liff.isLoggedIn()) {
        console.log('✅ User already logged in to LIFF');
        await handleLoggedInUser();
      } else {
        console.log('ℹ️ User not logged in to LIFF, redirecting to login...');
        window.liff.login();
      }

    } catch (error) {
      console.error('❌ LIFF initialization error:', error);
      liffInitialized = false;
      setIsLiffReady(false);
    } finally {
      setIsLiffLoading(false);
      liffInitializing = false;
    }
  };

  const value = {
    isLiffReady,
    isLiffLoading,
    liff: window.liff,
    initializeLiffForRole
  };

  return (
    <LiffContext.Provider value={value}>
      {children}
    </LiffContext.Provider>
  );
};