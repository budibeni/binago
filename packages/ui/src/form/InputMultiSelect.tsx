import React, { useId, useState } from 'react';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge } from '../Badge';
import type { SelectOption } from './InputSelect';

export interface InputMultiSelectProps extends BaseInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function InputMultiSelect({
  label,
  id: propId,
  value,
  onChange,
  options,
  error,
  helpText,
  required,
  disabled,
  className,
  placeholder = 'Pilih beberapa...',
}: InputMultiSelectProps) {
  const generatedId = useId();
  const id = propId || generatedId;
  const [open, setOpen] = useState(false);

  const handleSelect = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedLabels = value.map(v => options.find(o => o.value === v)?.label).filter(Boolean);

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            id={id}
            type="button"
            className={cn(
              formInputClass,
              'flex min-h-10 w-full items-center justify-between',
              'transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-offset-1',
              error ? 'border-danger focus:ring-danger' : 'hover:border-border-strong focus:ring-neutral-400',
              disabled && 'cursor-not-allowed opacity-50 bg-neutral-50'
            )}
          >
            <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
              {selectedLabels.length > 0 ? (
                selectedLabels.map((lbl, i) => (
                  <Badge key={i} variant="default" className="px-1.5 py-0 text-[10px] h-5 truncate max-w-[120px]">
                    {lbl}
                  </Badge>
                ))
              ) : (
                <span className="text-foreground-subtle text-sm truncate">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-foreground-muted opacity-70 shrink-0 ml-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[200px] p-1" align="start">
          <div className="max-h-[250px] overflow-y-auto">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {value.includes(opt.value) && <Check className="h-4 w-4 text-primary" />}
                </span>
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </BaseField>
  );
}
