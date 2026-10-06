'use client';
import React, { useId } from 'react';
import { BaseField, BaseInputProps } from './BaseField';
import { RadioGroup, RadioGroupItem } from '../Radio';
import { cn } from '@adatrack/utils';

export interface OptionItem {
  value: string;
  label: string;
  description?: string;
}

export interface InputOptionsProps extends Omit<BaseInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  options: OptionItem[];
  layout?: 'vertical' | 'horizontal' | 'cards';
}

export function InputOptions({
  label,
  id: propId,
  value,
  onChange,
  options = [],
  error,
  helpText,
  required,
  className,
  disabled,
  layout = 'vertical',
}: InputOptionsProps) {
  const defaultId = useId();
  const id = propId || defaultId;

  return (
    <BaseField
      label={label}
      id={id}
      error={error}
      helpText={helpText}
      required={required}
      className={className}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(
          layout === 'horizontal' ? 'flex flex-row gap-5 flex-wrap' : 
          layout === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 
          'flex flex-col gap-3',
          'pt-1'
        )}
      >
        {options.map((option, index) => {
          if (layout === 'cards') {
            const isSelected = value === option.value;
            return (
              <label
                key={option.value}
                htmlFor={`${id}-${index}`}
                className={cn(
                  "flex items-start gap-3 p-3 border rounded-xl transition-all duration-200",
                  disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : !disabled ? "border-border/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:border-border" : "border-border/60 bg-neutral-50/50"
                )}
              >
                <div className="pt-0.5">
                  <RadioGroupItem
                    value={option.value}
                    id={`${id}-${index}`}
                    disabled={disabled}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-[11px] text-muted-foreground leading-snug">
                      {option.description}
                    </span>
                  )}
                </div>
              </label>
            );
          }
          
          return (
            <RadioGroupItem
              key={option.value}
              value={option.value}
              id={`${id}-${index}`}
              label={option.label}
              helperText={option.description}
              disabled={disabled}
            />
          );
        })}
      </RadioGroup>
    </BaseField>
  );
}
