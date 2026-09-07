import React, { useId } from 'react';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select';

export interface SelectOption {
  value: string;
  label: string;
}

export interface InputSelectProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function InputSelect({
  label,
  id: propId,
  name,
  value,
  onChange,
  options,
  error,
  helpText,
  required,
  disabled,
  className,
  placeholder = 'Pilih salah satu...',
}: InputSelectProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled} name={name}>
        <SelectTrigger id={id} error={!!error} className={formInputClass}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseField>
  );
}
