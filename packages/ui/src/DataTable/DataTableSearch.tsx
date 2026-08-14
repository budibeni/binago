'use client';

import React from 'react';
import { SearchBar } from '../patterns/SearchBar';
import type { FetchState } from '@adatrack/types';

export interface DataTableSearchProps {
  /**
   * Nilai pencarian saat ini.
   */
  value: string;
  /**
   * Dipanggil saat nilai pencarian berubah (sudah di-debounce di dalam komponen).
   * Untuk server-side: sambungkan ke onGlobalFilterChange / onFetch.
   */
  onChange: (value: string) => void;
  /**
   * Placeholder input pencarian.
   */
  placeholder?: string;
  /**
   * FetchState digunakan untuk menampilkan loading indicator saat fetch sedang berjalan.
   */
  fetchState?: FetchState;
  /**
   * Delay debounce dalam milidetik. Default 300ms.
   */
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
}

export function DataTableSearch({
  value,
  onChange,
  placeholder = 'Cari...',
  fetchState = 'idle',
  debounceMs = 300,
  disabled = false,
  className,
}: DataTableSearchProps) {
  // Local state untuk debounce â€” menghindari trigger server-side fetch tiap keystroke
  const [localValue, setLocalValue] = React.useState(value);

  // Sync local state jika value prop berubah dari luar (controlled reset)
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce: panggil onChange hanya setelah user berhenti mengetik
  React.useEffect(() => {
    if (localValue === value) return;
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, value, onChange, debounceMs]);

  const isLoading = fetchState === 'loading';

  return (
    <SearchBar
      id="datatable-search"
      value={localValue}
      onChange={setLocalValue}
      onClear={() => {
        setLocalValue('');
        onChange('');
      }}
      placeholder={placeholder}
      loading={isLoading}
      disabled={disabled || isLoading}
      className={className}
    />
  );
}
