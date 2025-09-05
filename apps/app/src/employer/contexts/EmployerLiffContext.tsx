import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { logger } from '@/shared/utils/logger';

interface EmployerLiffContextType {
  isLiffReady: boolean;
  liff: any;
  isInClient: boolean;
  profile: any;
  error: string | null;
  liffError: string | null;
  initializeLiff: () => Promise<void>;
}

const EmployerLiffContext = createContext<EmployerLiffContextType | undefined>(undefined);

export const EmployerLiffProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [liffInstance, setLiffInstance] = useState<any>(null);
  const [isInClient, setIsInClient] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadLiffSdk = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.liff) return resolve();
      const script = document.createElement('script');
      script.src = `https://static.line-scdn.net/liff/edge/2/sdk.js?v=${Date.now()}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load LIFF SDK'));
      document.head.appendChild(script);
    });
  };

  const initializeLiff = async () => {
    try {
      logger.info('EmployerLiff: Initializing LIFF...');

      // ใช้ LIFF ID เฉพาะ employer จาก root .env
      const liffId = import.meta.env.VITE_LIFF_ID_EMPLOYER;
      if (!liffId) {
        throw new Error('VITE_LIFF_ID_EMPLOYER is not configured in root .env file');
      }

      // Ensure LIFF SDK is loaded (align behavior with Seeker)
      await loadLiffSdk();
      if (!window.liff) throw new Error('LIFF SDK not available after loading');

      await window.liff.init({ liffId });

      setLiffInstance(window.liff);
      setIsInClient(window.liff.isInClient());
      setError(null);

      if (window.liff.isLoggedIn()) {
        const userProfile = await window.liff.getProfile();
        setProfile(userProfile);
        logger.info('EmployerLiff: User profile loaded', userProfile);
      }

      setIsLiffReady(true);
      logger.info('EmployerLiff: LIFF initialized successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('EmployerLiff: LIFF initialization failed', { error: errorMessage });
      setError(errorMessage);
      setIsLiffReady(false);
    }
  };

  useEffect(() => {
    initializeLiff();
  }, []);

  const value: EmployerLiffContextType = {
    isLiffReady,
    liff: liffInstance,
    isInClient,
    profile,
    error,
    liffError: error, // Use the same error for liffError
    initializeLiff,
  };

  return (
    <EmployerLiffContext.Provider value={value}>
      {children}
    </EmployerLiffContext.Provider>
  );
};

export const useEmployerLiff = (): EmployerLiffContextType => {
  const context = useContext(EmployerLiffContext);
  if (!context) {
    throw new Error('useEmployerLiff must be used within EmployerLiffProvider');
  }
  return context;
};
