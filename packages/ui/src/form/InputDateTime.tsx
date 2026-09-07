import React, { useId } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';

export interface InputDateTimeProps extends BaseInputProps {
  value: string; // ISO yyyy-MM-ddThh:mm
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

export function InputDateTime({
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
}: InputDateTimeProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type="datetime-local"
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
