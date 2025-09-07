import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
  size?: 'mobile' | 'content' | 'app';
  className?: string;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ 
  children, 
  size = 'mobile',
  className = "" 
}) => {
  const sizeClasses = {
    mobile: 'mobile-container',
    content: 'content-container', 
    app: 'app-container'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
};
