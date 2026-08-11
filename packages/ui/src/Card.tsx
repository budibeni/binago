import React from 'react';
import { cn } from '@binago/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-background border border-border shadow-sm',
      bordered: 'bg-background border-2 border-border',
      flat: 'bg-surface',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-lg', variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = 'Card';
