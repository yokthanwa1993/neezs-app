import React from 'react';

interface MobilePageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  headerActions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const MobilePageLayout: React.FC<MobilePageLayoutProps> = ({
  children,
  title,
  showHeader = true,
  showBackButton = false,
  onBack,
  headerActions,
  className = "",
  contentClassName = ""
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className={`mobile-page ${className}`}>
      {showHeader && (
        <div className="mobile-header">
          <div className="flex items-center justify-between">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="touch-target p-2 -ml-2 text-gray-700 hover:text-gray-900"
                aria-label="กลับ"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {title && (
              <h1 className={`text-mobile-lg font-bold ${showBackButton ? '' : 'text-center flex-1'}`}>
                {title}
              </h1>
            )}
            
            {headerActions && (
              <div className="flex items-center gap-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}
      
      <main className={`mobile-content ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
};
