import React, { useId } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';

export interface InputDateProps extends BaseInputProps {
  value: string; // ISO yyyy-MM-dd
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

export function InputDate({
  label,
  id: propId,
  name,
  value,
  onChange,
  error,
  helpText,
  required,
  disabled,
  className,
  min,
  max,
}: InputDateProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={!!error}
        min={min}
        max={max}
      className={formInputClass}
      />
    </BaseField>
  );
}
