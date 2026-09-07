import React, { useId } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';

export interface InputNumberProps extends BaseInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export function InputNumber({
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
  min,
  max,
  step = 1,
  prefixIcon,
  suffixIcon,
}: InputNumberProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  // Render raw string so we don't flash NaN
  const displayValue = value === null || value === undefined ? '' : value.toString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(null);
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type="number"
        value={displayValue}
        onChange={handleChange}
        disabled={disabled}
        error={!!error}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        prefixIcon={prefixIcon}
        suffixIcon={suffixIcon}
      className={formInputClass}
      />
    </BaseField>
  );
}
