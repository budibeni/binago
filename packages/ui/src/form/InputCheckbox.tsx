import React, { useId } from 'react';
import { BaseField, BaseInputProps } from './BaseField';
import { Checkbox } from '../Checkbox';

export interface InputCheckboxProps extends Omit<BaseInputProps, 'label'> {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}

export function InputCheckbox({
  label,
  description,
  id: propId,
  value,
  onChange,
  error,
  helpText,
  required,
  className,
}: InputCheckboxProps) {
  const defaultId = useId();
  const id = propId || defaultId;

  return (
    <div className={className}>
      <Checkbox
        id={id}
        label={label}
        helperText={(description || helpText) as string}
        checked={value}
        onCheckedChange={(checked) => onChange(checked === true)}
        error={!!error}
        disabled={false} // Allow props extension if needed
      />
      {error && <p className="text-[10px] text-danger mt-1">{error}</p>}
    </div>
  );
}
