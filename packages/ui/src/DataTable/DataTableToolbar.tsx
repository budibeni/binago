'use client';

import React from 'react';
import { cn } from '@binago/utils';
import { DataTableSearch } from './DataTableSearch';
import { DataTableColumnToggle } from './DataTableColumnToggle';
import { DataTableExport } from './DataTableExport';
import type { DataTableInstance, DataTableExportConfig, RowData } from './types';
import type { FetchState } from '@binago/types';

export interface DataTableToolbarProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;

  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchDebounceMs?: number;

  // Feature toggles
  showSearch?: boolean;
  showColumnToggle?: boolean;
  showExport?: boolean;

  // Export config (opsional, bisa di-override via exportConfig)
  exportConfig?: DataTableExportConfig;

  // State
  fetchState?: FetchState;

  // Custom slot untuk action tambahan di sisi kanan
  rightSlot?: React.ReactNode;
  // Custom slot untuk elemen di sisi kiri (di luar search)
  leftSlot?: React.ReactNode;

  className?: string;
}

/**
 * DataTableToolbar menggabungkan search, column toggle, export, dan custom action slot.
 * Dirancang untuk dirender di atas tabel — biasanya dipass melalui prop `toolbarSlot` pada DataTable.
 *
 * Layout:
 * [leftSlot] [search]          [rightSlot] [columnToggle] [export]
 */
export function DataTableToolbar<TData extends RowData = RowData>({
  table,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  searchDebounceMs,
  showSearch = true,
  showColumnToggle = true,
  showExport = true,
  exportConfig,
  fetchState = 'idle',
  rightSlot,
  leftSlot,
  className,
}: DataTableToolbarProps<TData>) {
  const isLoading = fetchState === 'loading';

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3',
        className,
      )}
      role="toolbar"
      aria-label="Toolbar tabel"
    >
      {/* Left area: leftSlot + search */}
      <div className="flex flex-1 items-center gap-2 min-w-0">
        {leftSlot}
        {showSearch && onSearchChange && (
          <DataTableSearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            fetchState={fetchState}
            debounceMs={searchDebounceMs}
            disabled={isLoading}
          />
        )}
      </div>

      {/* Right area: custom slot + column toggle + export */}
      <div className="flex items-center gap-2 shrink-0">
        {rightSlot}
        {showColumnToggle && (
          <DataTableColumnToggle table={table} />
        )}
        {showExport && exportConfig?.enabled !== false && (
          <DataTableExport
            table={table}
            exportConfig={exportConfig}
          />
        )}
      </div>
    </div>
  );
}
