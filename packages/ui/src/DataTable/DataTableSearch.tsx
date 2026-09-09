'use client';

import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { FetchState } from '@adatrack/types';
import { Spinner } from '../Spinner';

export interface DataTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fetchState?: FetchState;
  debounceMs?: number;
}

export function DataTableSearch({
  value,
  onChange,
  placeholder = 'Cari...',
  className,
  disabled,
  fetchState,
  debounceMs = 300,
}: DataTableSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync prop value -> local state
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce local -> prop
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localValue, onChange, value, debounceMs]);

  const isLoading = fetchState === 'loading';

  return (
    <div className={cn('relative flex items-center w-full max-w-[280px] group', className)}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted group-focus-within:text-foreground transition-colors" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'h-8 w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-gray-50 dark:bg-gray-900/40 pl-8 pr-8 text-sm transition-colors',
          'placeholder:text-foreground-muted/70',
          'focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />

      {isLoading ? (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      ) : localValue ? (
        <button
          type="button"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm text-foreground-muted hover:text-foreground focus:outline-none"
        >
          <X className="h-3.5 w-3.5" />
          <span className="sr-only">Clear</span>
        </button>
      ) : null}
    </div>
  );
}
