import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface MobileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const MobileTextarea = React.forwardRef<HTMLTextAreaElement, MobileTextareaProps>(
  ({ className, label, error, helper, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-mobile-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          className={cn(
            "mobile-textarea",
            error && "border-red-300 focus:ring-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        
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

MobileTextarea.displayName = "MobileTextarea";
