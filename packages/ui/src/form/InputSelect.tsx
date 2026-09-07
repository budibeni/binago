import React, { useId, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { BaseField, BaseInputProps, formInputClass } from './BaseField';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Select';

export interface SelectOption {
  value: string;
  label: string;
}

export interface InputSelectProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export function InputSelect({
  label,
  id: propId,
  name,
  value,
  onChange,
  options,
  error,
  helpText,
  required,
  disabled,
  className,
  placeholder = 'Pilih salah satu...',
}: InputSelectProps) {
  const generatedId = useId();
  const id = propId || generatedId;

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const showSearch = options.length > 5;

  const filteredOptions = useMemo(() => {
    if (!showSearch || !search) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lowerSearch));
  }, [options, search, showSearch]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setSearch(''), 200); // Clear search after close animation
    }
  };

  return (
    <BaseField label={label} id={id} error={error} helpText={helpText} required={required} className={className}>
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled} name={name} open={open} onOpenChange={handleOpenChange}>
        <SelectTrigger id={id} error={!!error} className={formInputClass}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {showSearch && (
            <div className="px-2 pb-2 pt-1 relative sticky top-0 bg-background z-10 border-b border-border/50 mb-1">
              <div className="relative flex items-center w-full">
                <Search className="w-4 h-4 absolute left-2 text-foreground-muted" />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()} // Prevent Radix from closing or stealing key events
                  onClick={(e) => e.stopPropagation()} // Prevent Radix from closing
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-transparent border rounded border-border focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-foreground-muted/60 transition-all"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="max-h-[220px] overflow-y-auto overflow-x-hidden p-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-foreground-muted">
                Tidak ada hasil ditemukan.
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </BaseField>
  );
}
