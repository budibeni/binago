import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@binago/utils';

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  loading?: boolean;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      value = '',
      onChange,
      onClear,
      placeholder = 'Cari...',
      loading = false,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    };

    const handleClear = () => {
      onChange?.('');
      onClear?.();
    };

    return (
      <div className={cn('relative flex items-center w-full max-w-xs', className)}>
        <Search className="absolute left-3 h-4 w-4 text-foreground-muted pointer-events-none shrink-0" />
        <input
          ref={ref}
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'h-9 w-full rounded-md border border-border bg-background pl-9 pr-8 text-sm text-foreground',
            'placeholder:text-foreground-subtle transition-colors duration-base',
            'focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50',
          )}
          {...props}
        />
        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 rounded-sm p-0.5 text-foreground-muted hover:text-foreground hover:bg-neutral-100 transition-colors"
            aria-label="Bersihkan pencarian"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {loading && (
          <div className="absolute right-2.5 flex items-center">
            <svg
              className="animate-spin h-3.5 w-3.5 text-foreground-muted"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}
      </div>
    );
  },
);
SearchBar.displayName = 'SearchBar';
