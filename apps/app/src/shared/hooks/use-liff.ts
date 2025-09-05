import { useState, useCallback, useEffect } from 'react';
import { liffService, LiffProfile } from '../services/liff/auth';
import { usePlatform } from './use-platform';

export interface UseLiffReturn {
  isAvailable: boolean;
  isLoggedIn: boolean;
  profile: LiffProfile | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string>;
  shareMessage: (data: any) => Promise<void>;
  openWindow: (url: string, external?: boolean) => Promise<void>;
  closeWindow: () => Promise<void>;
  scanQRCode: () => Promise<{ value: string }>;
  isInClient: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useLiff(liffId?: string): UseLiffReturn {
  const { isLIFF } = usePlatform();
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const [isInClient, setIsInClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const available = await liffService.isAvailable();
        setIsAvailable(available);

        if (available) {
          await liffService.initialize(liffId);
          
          const loggedIn = await liffService.isLoggedIn();
          setIsLoggedIn(loggedIn);

          const inClient = await liffService.isInClient();
          setIsInClient(inClient);

          if (loggedIn) {
            try {
              const userProfile = await liffService.getProfile();
              setProfile(userProfile);
            } catch (profileError) {
              console.warn('Failed to get LIFF profile:', profileError);
            }
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize LIFF';
        setError(errorMessage);
        console.error('LIFF initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLIFF) {
      initializeLiff();
    } else {
      setIsLoading(false);
    }
  }, [isLIFF, liffId]);

  const login = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await liffService.login();
      // After login redirect, the page will reload and useEffect will handle the new state
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await liffService.logout();
      setIsLoggedIn(false);
      setProfile(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getAccessToken = useCallback(async (): Promise<string> => {
    try {
      setError(null);
      return await liffService.getAccessToken();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get access token';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const shareMessage = useCallback(async (data: any): Promise<void> => {
    try {
      setError(null);
      await liffService.shareMessage(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to share message';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const openWindow = useCallback(async (url: string, external = false): Promise<void> => {
    try {
      setError(null);
      await liffService.openWindow(url, external);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open window';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const closeWindow = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await liffService.closeWindow();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to close window';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const scanQRCode = useCallback(async (): Promise<{ value: string }> => {
    try {
      setError(null);
      return await liffService.scanQRCode();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan QR code';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    isAvailable,
    isLoggedIn,
    profile,
    login,
    logout,
    getAccessToken,
    shareMessage,
    openWindow,
    closeWindow,
    scanQRCode,
    isInClient,
    isLoading,
    error,
  };
}
