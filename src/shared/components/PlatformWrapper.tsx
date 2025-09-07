import React from 'react';
import { PlatformDetector } from '@/shared/lib/platform';

interface PlatformWrapperProps {
  children: React.ReactNode;
}

export function PlatformWrapper({ children }: PlatformWrapperProps) {
  const platform = PlatformDetector.detect();
  const config = PlatformDetector.getConfig();
  
  return (
    <div className={`platform-${platform}`} data-platform={platform}>
      {/* Native mobile status bar spacing */}
      {config.isNative && (
        <div className="status-bar-spacer h-12 bg-gray-900"></div>
      )}
      
      {children}
    </div>
  );
}

export default PlatformWrapper;
