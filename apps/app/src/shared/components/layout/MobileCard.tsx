import React from 'react';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const MobileCard: React.FC<MobileCardProps> = ({ 
  children, 
  className = "", 
  onClick,
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-4'
  };

  const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200 w-full";
  const hoverClasses = hover ? "hover:shadow-md transition-shadow cursor-pointer" : "";
  const clickClasses = onClick ? "active:scale-[0.98] transition-transform" : "";

  return (
    <div
      className={`${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
