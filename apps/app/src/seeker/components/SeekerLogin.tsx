import React from 'react';
import { MobileButton } from '@/shared/components/ui/mobile-button';
import { MobileContainer } from '@/shared/components/layout/MobileContainer';
import { Loader2 } from 'lucide-react';
import { useSeekerAuth } from '../contexts/SeekerAuthContext';
import { useMobile } from '@/shared/hooks/useMobile';
import { logger } from '@/shared/utils/logger';

const SeekerLogin: React.FC = () => {
  const { login, isLoading } = useSeekerAuth();
  const { isMobile, deviceType } = useMobile();

  logger.info('SeekerLogin: Component rendered', { isLoading, isMobile, deviceType });

  const handleLogin = () => {
    logger.info('SeekerLogin: Login button clicked');
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 px-4 py-4">
      <MobileContainer className="max-w-mobile-lg">
        <div className="mobile-card text-center">
          <h1 className="text-mobile-2xl font-bold text-black mb-2">NEEZS</h1>
          <p className="text-mobile-sm text-gray-600 mb-6 sm:mb-8">สำหรับผู้หางาน</p>

          {isLoading ? (
            <div className="mobile-loading">
              <div className="flex flex-col items-center">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-yellow-500" />
                <p className="mt-3 sm:mt-4 text-mobile-sm text-gray-600">กำลังเตรียมพร้อม...</p>
              </div>
            </div>
          ) : (
            <MobileButton
              onClick={handleLogin}
              variant="line"
              size="full"
              className="mb-4"
              leftIcon={
                <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.49 16.21c-.42-1.83-2.28-3.21-4.29-3.21h-1.37c-.34 0-.68.04-.99.13-.91.25-1.83.7-2.59 1.34-.97.82-1.76 1.8-2.28 2.92-.52 1.12-.76 2.33-.76 3.54h12.28c0-.01 0-.02 0-.03zm-16.95-4.24c.34-1.53 1.2-2.91 2.4-3.96 1.2-1.05 2.69-1.7 4.29-1.83V4.8c0-1.9 1.55-3.45 3.45-3.45S19.4 2.9 19.4 4.8v1.38c1.6.13 3.09.78 4.29 1.83 1.2 1.05 2.06 2.43 2.4 3.96.07.3.11.61.11.94v.03H3.54v-.03c0-.33.04-.64.1-.94z"/>
                </svg>
              }
            >
              เข้าสู่ระบบด้วย LINE
            </MobileButton>
          )}

          <p className="text-mobile-xs text-gray-400 px-2 leading-relaxed">
            การเข้าสู่ระบบแสดงว่าคุณยอมรับข้อตกลงและนโยบายความเป็นส่วนตัวของเรา
          </p>
        </div>
      </MobileContainer>
    </div>
  );
};

export default SeekerLogin;
