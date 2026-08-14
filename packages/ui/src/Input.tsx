import React from 'react';
import { cn } from '@adatrack/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, prefixIcon, suffixIcon, disabled, id, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {prefixIcon && (
            <span className="absolute left-3 flex items-center text-foreground-muted pointer-events-none">
              {prefixIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={cn(
              'h-9 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground',
              'placeholder:text-foreground-subtle',
              'transition-colors duration-base',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              error
                ? 'border-danger focus:ring-danger'
                : 'border-border hover:border-border-strong focus:ring-neutral-400',
              disabled && 'cursor-not-allowed opacity-50 bg-neutral-50',
              prefixIcon && 'pl-9',
              suffixIcon && 'pr-9',
              className,
            )}
            aria-invalid={error}
            aria-describedby={helperText && id ? `${id}-helper` : undefined}
            {...props}
          />
          {suffixIcon && (
            <span className="absolute right-3 flex items-center text-foreground-muted pointer-events-none">
              {suffixIcon}
            </span>
          )}
        </div>
        {helperText && (
          <p
            id={id ? `${id}-helper` : undefined}
            className={cn('mt-1 text-xs', error ? 'text-danger' : 'text-foreground-muted')}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
