import React, { useId, useState, useEffect } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';

export interface InputDecimalProps extends BaseInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export function InputDecimal({
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
  prefixIcon,
  suffixIcon,
}: InputDecimalProps) {
  const generatedId = useId();
  const id = propId || generatedId;
  
  const [localValue, setLocalValue] = useState(value === null ? '' : value.toString());

  // Sync prop value to local state if changed externally
  useEffect(() => {
    if (value === null) {
      setLocalValue('');
    } else if (parseFloat(localValue) !== value) {
      setLocalValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    // Allow valid float formats like "1.", ".5", "-1"
    if (raw === '' || /^-?\d*\.?\d*$/.test(raw)) {
      setLocalValue(raw);
      if (raw === '' || raw === '-' || raw.endsWith('.')) {
        // Intermediate states, don't trigger onChange with NaN
        // Could trigger with null or keep previous
        if (raw === '') onChange(null);
      } else {
        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) {
          onChange(parsed);
        }
      }
    }
  };

  const handleBlur = () => {
    if (localValue === '-' || localValue === '.') {
      setLocalValue('');
      onChange(null);
    } else if (localValue.endsWith('.')) {
      const clean = localValue.slice(0, -1);
      setLocalValue(clean);
      onChange(parseFloat(clean));
    }
  };

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        error={!!error}
        placeholder={placeholder}
        prefixIcon={prefixIcon}
        suffixIcon={suffixIcon}
      className={formInputClass}
      />
    </BaseField>
  );
}
