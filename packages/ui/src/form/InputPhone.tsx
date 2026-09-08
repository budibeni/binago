import React, { useId } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Phone } from 'lucide-react';

export interface InputPhoneProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function InputPhone({
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
  placeholder = '081234567890',
}: InputPhoneProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={!!error}
        className={formInputClass}
        placeholder={placeholder}
      />
    </BaseField>
  );
}
