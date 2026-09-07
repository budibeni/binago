import React from 'react';
import { cn } from '@adatrack/utils';
import { Label } from '../Label';

export const formInputClass = cn(
  "h-10 rounded-[8px] px-3.5 text-[14px]",
  "group-data-[layout=drawer]/form:!h-8 group-data-[layout=drawer]/form:!px-2.5 group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=drawer]/form:!rounded-md",
  "group-data-[layout=dialog]/form:!h-8 group-data-[layout=dialog]/form:!px-2.5 group-data-[layout=dialog]/form:!text-[12px] group-data-[layout=dialog]/form:!rounded-md",
  "group-data-[layout=default]/form:!h-8 group-data-[layout=default]/form:!px-2.5 group-data-[layout=default]/form:!text-[13px] group-data-[layout=default]/form:!rounded-md"
);

export const formTextareaClass = cn(
  "min-h-[80px] py-2 rounded-[8px] px-3.5 text-[14px]",
  "group-data-[layout=drawer]/form:!min-h-[56px] group-data-[layout=drawer]/form:!py-1.5 group-data-[layout=drawer]/form:!px-2.5 group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=drawer]/form:!rounded-md",
  "group-data-[layout=dialog]/form:!min-h-[56px] group-data-[layout=dialog]/form:!py-1.5 group-data-[layout=dialog]/form:!px-2.5 group-data-[layout=dialog]/form:!text-[12px] group-data-[layout=dialog]/form:!rounded-md",
  "group-data-[layout=default]/form:!min-h-[56px] group-data-[layout=default]/form:!py-1.5 group-data-[layout=default]/form:!px-2.5 group-data-[layout=default]/form:!text-[13px] group-data-[layout=default]/form:!rounded-md"
);

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
        <Label 
          htmlFor={id} 
          required={required} 
          className={cn(
            error && 'text-danger',
            'group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=drawer]/form:!mb-1',
            'group-data-[layout=dialog]/form:!text-[12px] group-data-[layout=dialog]/form:!mb-1',
            'group-data-[layout=default]/form:!text-[13px] group-data-[layout=default]/form:!mb-1'
          )}
        >
          {label}
        </Label>
      )}
      {children}
      {(error || helpText) && (
        <p className={cn(
          'text-xs mt-1.5 group-data-[layout=drawer]/form:!mt-0.5 group-data-[layout=drawer]/form:!text-[11px] group-data-[layout=dialog]/form:!mt-0.5 group-data-[layout=dialog]/form:!text-[11px] group-data-[layout=default]/form:!mt-0.5 group-data-[layout=default]/form:!text-[11px]', 
          error ? 'text-danger font-medium' : 'text-muted-foreground'
        )}>
          {error || helpText}
        </p>
      )}
    </div>
  );
}
