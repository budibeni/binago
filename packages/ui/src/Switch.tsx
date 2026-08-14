'use client';

import React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '@adatrack/utils';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof RadixSwitch.Root> {
  label?: string;
  helperText?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(({ className, label, helperText, disabled, id, ...props }, ref) => {
  const generatedId = React.useId();
  const switchId = id || generatedId;

  return (
    <div className="flex items-start gap-3">
      <RadixSwitch.Root
        ref={ref}
        id={switchId}
        disabled={disabled}
        className={cn(
          'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-base',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary data-[state=unchecked]:bg-neutral-200',
          className,
        )}
        {...props}
      >
        <RadixSwitch.Thumb
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm ring-0 transition-transform duration-base',
            'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
          )}
        />
      </RadixSwitch.Root>
      {(label || helperText) && (
        <div className="grid gap-0.5 leading-none pt-0.5">
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                'text-sm font-medium text-foreground select-none cursor-pointer',
                disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {label}
            </label>
          )}
          {helperText && (
            <p className="text-xs text-foreground-muted">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});
Switch.displayName = 'Switch';
