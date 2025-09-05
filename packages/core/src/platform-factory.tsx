import { PlatformAdapter, PlatformConfig } from './platform';

// Platform Detection
export const detectPlatform = (): PlatformConfig['name'] => {
  if (typeof window === 'undefined') return 'web';
  
  // Check for LINE LIFF
  if ((window as any).liff) return 'line';
  
  // Check for Capacitor (iOS/Android)
  if ((window as any).Capacitor?.isNativePlatform?.()) {
    const platform = (window as any).Capacitor.getPlatform();
    if (platform === 'ios') return 'ios';
    if (platform === 'android') return 'android';
  }
  
  return 'web';
};

// Platform Factory
export const createPlatformAdapter = async (): Promise<PlatformAdapter> => {
  const platform = detectPlatform();
  
  switch (platform) {
    case 'line':
      const { LinePlatformAdapter } = await import('./adapters/line');
      return new LinePlatformAdapter();
      
    case 'ios':
      const { IosPlatformAdapter } = await import('./adapters/ios');
      return new IosPlatformAdapter();
      
    case 'android':
      const { AndroidPlatformAdapter } = await import('./adapters/android');
      return new AndroidPlatformAdapter();
      
    default:
      const { WebPlatformAdapter } = await import('./adapters/web');
      return new WebPlatformAdapter();
  }
};

// React Context for Platform
import React, { createContext, useContext, useEffect, useState } from 'react';

const PlatformContext = createContext<PlatformAdapter | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adapter, setAdapter] = useState<PlatformAdapter | null>(null);
  
  useEffect(() => {
    createPlatformAdapter().then(setAdapter);
  }, []);
  
  if (!adapter) {
    return <div>Loading platform...</div>;
  }
  
  return (
    <PlatformContext.Provider value={adapter}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};
