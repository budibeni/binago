import React, { useId, useState } from 'react';
import { Input } from '../Input';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Eye, EyeOff } from 'lucide-react';

export interface InputPasswordProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function InputPassword({
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
  placeholder = '••••••••',
}: InputPasswordProps) {
  const generatedId = useId();
  const id = propId || generatedId;
  const [show, setShow] = useState(false);

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        error={!!error}
        className={formInputClass}
        placeholder={placeholder}
        suffixIcon={
          <button 
            type="button" 
            onClick={() => setShow(!show)} 
            className="focus:outline-none hover:text-foreground transition-colors"
            tabIndex={-1}
            disabled={disabled}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />
    </BaseField>
  );
}
