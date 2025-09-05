import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const mobileButtonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background touch-target",
  {
    variants: {
      variant: {
        default: "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700",
        destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        link: "text-yellow-500 underline-offset-4 hover:underline",
        success: "bg-green-500 text-white hover:bg-green-600 active:bg-green-700",
        line: "bg-[#00B900] text-white hover:bg-[#00A300] active:bg-[#009200]",
      },
      size: {
        sm: "btn-mobile-sm",
        default: "btn-mobile", 
        lg: "btn-mobile-lg",
        icon: "h-12 w-12",
        full: "btn-mobile w-full",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

export interface MobileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof mobileButtonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  className,
  variant,
  size,
  rounded,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(mobileButtonVariants({ variant, size, rounded, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2 flex-shrink-0">
          {leftIcon}
        </span>
      )}
      
      <span className={size === 'full' ? 'flex-1' : ''}>
        {children}
      </span>
      
      {!loading && rightIcon && (
        <span className="ml-2 flex-shrink-0">
          {rightIcon}
        </span>
      )}
    </button>
  );
};
