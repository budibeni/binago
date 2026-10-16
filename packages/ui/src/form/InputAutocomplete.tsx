import React, { useId, useState, useMemo, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Input } from '../Input';
import { Popover, PopoverTrigger, PopoverContent } from '../Popover';
import { cn } from '@adatrack/utils';

export interface AutocompleteOption {
  value: string;
  label: string;
  sublabel?: string;
  description?: string;
}

export interface InputAutocompleteProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  emptyText?: string;
  autoFocus?: boolean;
  prefixIcon?: React.ReactNode;
}

export function InputAutocomplete({
  label,
  id: propId,
  name,
  value,
  onChange,
  options = [],
  error,
  helpText,
  required,
  disabled,
  className,
  placeholder = 'Pilih atau ketik...',
  emptyText = 'Ketik manual atau tidak ada kecocokan',
  autoFocus,
  prefixIcon,
}: InputAutocompleteProps) {
  const generatedId = useId();
  const id = propId || generatedId;
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const filteredOptions = useMemo(() => {
    if (!value || !value.trim()) return options;
    const lower = value.toLowerCase().trim();
    return options.filter((opt) =>
      opt.value.toLowerCase().includes(lower) ||
      opt.label.toLowerCase().includes(lower) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(lower)) ||
      (opt.description && opt.description.toLowerCase().includes(lower))
    );
  }, [options, value]);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex items-center w-full">
            <Input
              ref={inputRef}
              id={id}
              name={name}
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                if (!open) setOpen(true);
              }}
              onFocus={() => {
                if (!disabled) setOpen(true);
              }}
              disabled={disabled}
              error={!!error}
              placeholder={placeholder}
              autoFocus={autoFocus}
              prefixIcon={prefixIcon}
              className={cn(formInputClass, 'w-full pr-14')}
            />
            <div className="absolute right-2 flex items-center gap-1">
              {value && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  tabIndex={-1}
                  className="p-1 text-foreground-muted hover:text-foreground rounded transition-colors"
                  title="Hapus"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!disabled) setOpen((prev) => !prev);
                }}
                tabIndex={-1}
                className="p-1 text-foreground-muted hover:text-foreground rounded transition-colors"
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", open && "rotate-180")} />
              </button>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="p-1 max-h-60 overflow-y-auto w-[var(--radix-popover-trigger-width)] min-w-[280px] z-50 shadow-lg"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "flex flex-col px-3 py-2 cursor-pointer rounded-md text-sm transition-colors",
                  opt.value === value
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-foreground"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{opt.label}</span>
                  {opt.sublabel && (
                    <span className="text-xs text-foreground-muted shrink-0 font-normal">
                      {opt.sublabel}
                    </span>
                  )}
                </div>
                {opt.description && (
                  <p className="text-xs text-foreground-muted/80 mt-0.5 line-clamp-1">
                    {opt.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-foreground-muted">
              {emptyText}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </BaseField>
  );
}
