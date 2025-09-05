import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, label, error, helper, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-mobile-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-mobile-sm">
                {leftIcon}
              </span>
            </div>
          )}
          
          <input
            className={cn(
              "mobile-input",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-300 focus:ring-red-500 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="text-gray-400 text-mobile-sm">
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-mobile-xs text-red-600">{error}</p>
        )}
        
        {helper && !error && (
          <p className="text-mobile-xs text-gray-500">{helper}</p>
        )}
      </div>
    );
  }
);

MobileInput.displayName = "MobileInput";
