'use client';

import React from 'react';
import { cn } from '@adatrack/utils';
import { DataTableSearch } from './DataTableSearch';
import { DataTableFilterPanel } from './DataTableFilterPanel';
import { DataTableColumnPanel } from './DataTableColumnPanel';
import { Filter, RefreshCw, Columns3, Download } from 'lucide-react';
import { Button } from '../Button';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import type { DataTableInstance, DataTableExportConfig, RowData, DataTableFilterConfig } from './types';
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

  // Panel open states (controlled from DataTable parent)
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  isColumnOpen?: boolean;
  onColumnOpenChange?: (open: boolean) => void;
  isExportOpen?: boolean;
  onExportOpenChange?: (open: boolean) => void;

  activeFilterCount?: number;
  filterConfig?: DataTableFilterConfig;

  // Export config
  exportConfig?: DataTableExportConfig;

  // State
  fetchState?: FetchState;

  // Refresh
  onRefresh?: () => void;

  // Custom Actions (rendered on the far left)
  customActions?: React.ReactNode;

  className?: string;
}

/**
 * DataTableToolbar
 *
 * Layout:
 * [customActions] [search]          [Refresh] [Filter] [Kolom] [Export]
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
  isColumnOpen,
  onColumnOpenChange,
  isExportOpen,
  onExportOpenChange,
  activeFilterCount,
  filterConfig,
  exportConfig,
  fetchState = 'idle',
  onRefresh,
  customActions,
  className,
}: DataTableToolbarProps<TData>) {
  const isLoading = fetchState === 'loading';

  // Hitung kolom tersembunyi untuk badge
  const hiddenColumnCount = table
    .getAllColumns()
    .filter((col) => col.getCanHide() && !col.getIsVisible()).length;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2',
        className,
      )}
      role="toolbar"
      aria-label="Toolbar tabel"
    >
      {/* Left area: customActions + search */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {customActions}
        {showSearch && onSearchChange && (
          <div className="w-full max-w-[380px]">
            <DataTableSearch
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              fetchState={fetchState}
              debounceMs={searchDebounceMs}
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      {/* Right area: utilities */}
      <div className="flex items-center gap-2 shrink-0">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9 gap-2 text-[13px] font-medium"
          >
            <RefreshCw className={cn('h-4 w-4 text-muted-foreground', isLoading && 'animate-spin')} />
            <span className="hidden sm:inline-block">Refresh</span>
          </Button>
        )}

        {/* Filter toggle button — Popover */}
        {showFilter && filterConfig && (
          <Popover open={isFilterOpen} onOpenChange={onFilterOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 gap-2 text-[13px] font-medium',
                  isFilterOpen && 'bg-muted text-foreground border-neutral-400'
                )}
              >
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline-block">Filter</span>
                {activeFilterCount ? (
                  <span className="rounded-sm bg-danger px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[260px] p-0" sideOffset={8}>
              <DataTableFilterPanel
                config={filterConfig}
                onClose={() => onFilterOpenChange?.(false)}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Column visibility toggle — Popover */}
        {showColumnToggle && (
          <Popover open={isColumnOpen} onOpenChange={onColumnOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 gap-2 text-[13px] font-medium',
                  isColumnOpen && 'bg-muted text-foreground border-neutral-400'
                )}
                aria-label="Toggle kolom"
              >
                <Columns3 className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline-block">Kolom</span>
                {hiddenColumnCount > 0 && (
                  <span className="ml-0.5 rounded bg-primary/10 px-1 text-[10px] font-medium text-primary tabular-nums">
                    -{hiddenColumnCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[220px] p-0" sideOffset={8}>
              <DataTableColumnPanel
                table={table}
                isOpen
                onClose={() => onColumnOpenChange?.(false)}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Export toggle button */}
        {showExport && exportConfig?.enabled !== false && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExportOpenChange?.(!isExportOpen)}
            className={cn(
              'h-9 gap-2 text-[13px] font-medium',
              isExportOpen && 'bg-muted text-foreground border-neutral-400'
            )}
            aria-label="Export Data"
          >
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="hidden sm:inline-block">Export</span>
          </Button>
        )}
      </div>
    </div>
  );
}
