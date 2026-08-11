'use client';

import React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@binago/utils';

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root> {
  label?: string;
  helperText?: string;
  error?: boolean;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, label, helperText, error, disabled, id, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;

  return (
    <div className="flex items-start gap-2">
      <RadixCheckbox.Root
        ref={ref}
        id={checkboxId}
        disabled={disabled}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded border border-border bg-background transition-colors duration-base',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
          error && 'border-danger focus-visible:ring-danger',
          className,
        )}
        {...props}
      >
        <RadixCheckbox.Indicator className="flex items-center justify-center text-current">
          <Check className="h-3 w-3 stroke-[3]" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {(label || helperText) && (
        <div className="grid gap-0.5 leading-none">
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-sm font-medium text-foreground select-none cursor-pointer',
                disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {label}
            </label>
          )}
          {helperText && (
            <p className={cn('text-xs', error ? 'text-danger' : 'text-foreground-muted')}>
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});
Checkbox.displayName = 'Checkbox';
