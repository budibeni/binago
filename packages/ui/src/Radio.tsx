'use client';

import React from 'react';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@binago/utils';

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Root> {}

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return (
    <RadixRadioGroup.Root
      ref={ref}
      className={cn('grid gap-2', className)}
      {...props}
    />
  );
});
RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixRadioGroup.Item> {
  label?: string;
  helperText?: string;
}

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadixRadioGroup.Item>,
  RadioGroupItemProps
>(({ className, label, helperText, disabled, id, ...props }, ref) => {
  const generatedId = React.useId();
  const radioId = id || generatedId;

  return (
    <div className="flex items-start gap-2">
      <RadixRadioGroup.Item
        ref={ref}
        id={radioId}
        disabled={disabled}
        className={cn(
          'aspect-square h-4 w-4 shrink-0 rounded-full border border-border bg-background transition-colors duration-base',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:border-primary data-[state=checked]:text-primary',
          className,
        )}
        {...props}
      >
        <RadixRadioGroup.Indicator className="flex items-center justify-center">
          <Circle className="h-2 w-2 fill-primary text-primary" />
        </RadixRadioGroup.Indicator>
      </RadixRadioGroup.Item>
      {(label || helperText) && (
        <div className="grid gap-0.5 leading-none">
          {label && (
            <label
              htmlFor={radioId}
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
RadioGroupItem.displayName = 'RadioGroupItem';
