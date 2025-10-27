import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed';

    const variantStyles = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-neomorph-sm hover:shadow-neomorph',
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-neomorph-sm hover:shadow-neomorph',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-neomorph-sm hover:shadow-neomorph',
      success: 'bg-success text-success-foreground hover:bg-success/90 shadow-neomorph-sm hover:shadow-neomorph',
      warning: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-neomorph-sm hover:shadow-neomorph',
      error: 'bg-error text-error-foreground hover:bg-error/90 shadow-neomorph-sm hover:shadow-neomorph',
      outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/10',
      ghost: 'hover:bg-accent/10 text-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizeStyles = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-13 px-8 text-lg',
      icon: 'h-10 w-10',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
