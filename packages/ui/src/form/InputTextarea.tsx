import React, { useId } from 'react';
import { Textarea } from '../Textarea';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';

export interface InputTextareaProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export function InputTextarea({
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
  placeholder,
  rows = 3,
  maxLength,
}: InputTextareaProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={!!error}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={formInputClass.replace('h-10', 'min-h-[80px] py-2')}
      />
    </BaseField>
  );
}
