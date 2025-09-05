import { useState, useEffect, useCallback } from 'react';
import { platformService, PlatformType, PlatformCapabilities } from '../services/platform';
import { configService } from '../config/app';

export interface UsePlatformReturn {
  platform: PlatformType;
  isNative: boolean;
  isLIFF: boolean;
  isWeb: boolean;
  isPWA: boolean;
  capabilities: PlatformCapabilities;
  hasCapability: (capability: keyof PlatformCapabilities) => boolean;
  requestPermissions: (permissions: Array<keyof PlatformCapabilities>) => Promise<Record<string, boolean>>;
  isLoading: boolean;
  error: string | null;
}

export function usePlatform(): UsePlatformReturn {
  const [platform, setPlatform] = useState<PlatformType>('web');
  const [capabilities, setCapabilities] = useState<PlatformCapabilities>({
    camera: false,
    location: false,
    pushNotifications: false,
    fileUpload: false,
    contacts: false,
    sharing: false,
    biometric: false,
    backgroundSync: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePlatform = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const detectedPlatform = platformService.getPlatform();
        const detectedCapabilities = platformService.getCapabilities();

        setPlatform(detectedPlatform);
        setCapabilities(detectedCapabilities);

        console.log(`🔍 Platform detected: ${detectedPlatform}`);
        console.log('🎯 Capabilities:', detectedCapabilities);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize platform';
        setError(errorMessage);
        console.error('Platform initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializePlatform();
  }, []);

  const hasCapability = useCallback((capability: keyof PlatformCapabilities): boolean => {
    return capabilities[capability];
  }, [capabilities]);

  const requestPermissions = useCallback(async (permissions: Array<keyof PlatformCapabilities>) => {
    try {
      setError(null);
      return await platformService.requestPermissions(permissions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permissions';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    platform,
    isNative: platform === 'ios' || platform === 'android',
    isLIFF: platform === 'line',
    isWeb: platform === 'web' || platform === 'pwa',
    isPWA: platform === 'pwa',
    capabilities,
    hasCapability,
    requestPermissions,
    isLoading,
    error,
  };
}
