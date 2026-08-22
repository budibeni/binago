'use client';

import React from 'react';
import { cn } from '@adatrack/utils';
import { DataTableSearch } from './DataTableSearch';
import { DataTableColumnToggle } from './DataTableColumnToggle';
import { DataTableExport } from './DataTableExport';
import { Filter } from 'lucide-react';
import { Button } from '../Button';
import type { DataTableInstance, DataTableExportConfig, RowData } from './types';
import type { FetchState } from '@adatrack/types';

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
  showFilter?: boolean;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  activeFilterCount?: number;

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
 * Dirancang untuk dirender di atas tabel - biasanya dipass melalui prop `toolbarSlot` pada DataTable.
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
  showFilter = false,
  isFilterOpen,
  onFilterOpenChange,
  activeFilterCount,
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
        'flex flex-wrap items-center justify-between gap-2',
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

      {/* Right area: custom slot + filter + column toggle + export */}
      <div className="flex items-center gap-2 shrink-0">
        {rightSlot}
        {showFilter && onFilterOpenChange && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterOpenChange(!isFilterOpen)}
            className={cn(
              "h-8 gap-1.5 border-dashed text-[13px]",
              isFilterOpen && "bg-accent text-accent-foreground"
            )}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline-block">Filter</span>
            {activeFilterCount ? (
              <>
                <span className="mx-1 h-4 w-[1px] bg-border" />
                <span className="rounded-sm bg-primary px-1 text-[10px] font-semibold tabular-nums text-primary-foreground">
                  {activeFilterCount}
                </span>
              </>
            ) : null}
          </Button>
        )}
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
