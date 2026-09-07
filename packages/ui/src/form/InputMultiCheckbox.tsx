import React, { useId } from 'react';
import { BaseField, BaseInputProps } from './BaseField';
import { Checkbox } from '../Checkbox';

export interface MultiCheckboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface InputMultiCheckboxProps extends Omit<BaseInputProps, 'value' | 'onChange'> {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiCheckboxOption[];
}

export function InputMultiCheckbox({
  label,
  id: propId,
  value = [],
  onChange,
  options = [],
  error,
  helpText,
  required,
  className,
}: InputMultiCheckboxProps) {
  const defaultId = useId();
  const id = propId || defaultId;

  const handleToggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <BaseField
      label={label}
      id={id}
      error={error}
      helpText={helpText}
      required={required}
      className={className}
    >
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {options.map((option, index) => (
          <Checkbox
            key={option.value}
            id={`${id}-${index}`}
            label={option.label}
            helperText={option.description}
            checked={value.includes(option.value)}
            onCheckedChange={(checked) => handleToggle(option.value, checked === true)}
            disabled={false}
          />
        ))}
      </div>
    </BaseField>
  );
}
