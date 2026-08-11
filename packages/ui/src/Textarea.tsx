import React from 'react';
import { cn } from '@binago/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, disabled, id, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          disabled={disabled}
          className={cn(
            'w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground',
            'placeholder:text-foreground-subtle',
            'transition-colors duration-base',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            'resize-y min-h-[80px]',
            error
              ? 'border-danger focus:ring-danger'
              : 'border-border hover:border-border-strong focus:ring-neutral-400',
            disabled && 'cursor-not-allowed opacity-50 bg-neutral-50',
            className,
          )}
          aria-invalid={error}
          aria-describedby={helperText && id ? `${id}-helper` : undefined}
          {...props}
        />
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
Textarea.displayName = 'Textarea';
