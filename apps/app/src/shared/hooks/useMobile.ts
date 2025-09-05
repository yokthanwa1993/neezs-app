import { useState, useEffect } from 'react';

interface ScreenSize {
  width: number;
  height: number;
}

interface UseMobileReturn {
  isMobile: boolean;
  isSmallMobile: boolean;
  isLargeMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: ScreenSize;
  orientation: 'portrait' | 'landscape';
  isLIFF: boolean;
  isStandalone: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const useMobile = (): UseMobileReturn => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [isLIFF, setIsLIFF] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkEnvironment = () => {
      // Check if running in LIFF
      if (typeof window !== 'undefined') {
        setIsLIFF(!!window.liff);
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
      }
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
    };

    checkEnvironment();
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const isMobile = screenSize.width < 768;
  const isSmallMobile = screenSize.width < 375;
  const isLargeMobile = screenSize.width >= 375 && screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;
  
  const orientation = screenSize.width > screenSize.height ? 'landscape' : 'portrait';
  
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  return {
    isMobile,
    isSmallMobile,
    isLargeMobile,
    isTablet,
    isDesktop,
    screenSize,
    orientation,
    isLIFF,
    isStandalone,
    deviceType,
  };
};
