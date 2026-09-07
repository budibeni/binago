import React, { useId } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Mail } from 'lucide-react';

export interface InputEmailProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function InputEmail({
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
  placeholder = 'example@email.com',
}: InputEmailProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={!!error}
        className={formInputClass}
        placeholder={placeholder}
        prefixIcon={<Mail className="w-4 h-4" />}
      />
    </BaseField>
  );
}
