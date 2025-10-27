import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-primary/10 text-primary border-transparent',
      primary: 'bg-primary text-primary-foreground border-transparent',
      secondary: 'bg-secondary text-secondary-foreground border-transparent',
      success: 'bg-success text-success-foreground border-transparent',
      warning: 'bg-warning text-warning-foreground border-transparent',
      error: 'bg-error text-error-foreground border-transparent',
      outline: 'text-foreground border-border bg-transparent',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
