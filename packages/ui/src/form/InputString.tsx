import React, { useId } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';

export interface InputStringProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  autoFocus?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  readOnly?: boolean;
}

export function InputString({
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
  maxLength,
  autoFocus,
  prefixIcon,
  suffixIcon,
  readOnly,
}: InputStringProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={!!error}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        prefixIcon={prefixIcon}
        suffixIcon={suffixIcon}
        readOnly={readOnly}
      className={formInputClass}
      />
    </BaseField>
  );
}
