import React from 'react';
import { cn } from '@adatrack/utils';
import { Label } from '../Label';

export const formInputClass = "h-10 rounded-[8px] px-3.5 text-[14px]";

export interface BaseInputProps {
  label?: string;
  id?: string;
  name?: string;
  error?: string;
  helpText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface BaseFieldProps extends BaseInputProps {
  children: React.ReactNode;
}

export function BaseField({ label, id, error, helpText, required, className, children }: BaseFieldProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <Label htmlFor={id} required={required} className={cn(error && 'text-danger')}>
          {label}
        </Label>
      )}
      {children}
      {(error || helpText) && (
        <p className={cn('text-xs mt-1.5', error ? 'text-danger font-medium' : 'text-muted-foreground')}>
          {error || helpText}
        </p>
      )}
    </div>
  );
}
