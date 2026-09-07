import React, { useId } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Search, X } from 'lucide-react';

export interface InputSearchProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function InputSearch({
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
  placeholder = 'Cari...',
  autoFocus,
}: InputSearchProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={!!error}
        className={formInputClass}
        placeholder={placeholder}
        autoFocus={autoFocus}
        prefixIcon={<Search className="w-4 h-4" />}
        suffixIcon={
          value ? (
            <button 
              type="button" 
              onClick={() => onChange('')} 
              className="focus:outline-none hover:text-foreground text-foreground-muted"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
      />
    </BaseField>
  );
}
