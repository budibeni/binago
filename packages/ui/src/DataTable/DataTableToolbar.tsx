'use client';

import React from 'react';
import { cn } from '@adatrack/utils';
import { DataTableSearch } from './DataTableSearch';
import { DataTableFilterPanel } from './DataTableFilterPanel';
import { DataTableColumnPanel } from './DataTableColumnPanel';
import { Filter, RefreshCw, Columns3, Download } from 'lucide-react';
import { Button } from '../Button';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
import type { DataTableInstance, DataTableExportConfig, RowData, DataTableFilterConfig, DataTableLabels } from './types';
import type { FetchState } from '@adatrack/types';

function toCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportToCsv<TData extends RowData>(
  table: DataTableInstance<TData>,
  filename: string,
): void {
  const visibleColumns = table.getVisibleFlatColumns();
  const rows = table.getRowModel().rows;

  const headers = visibleColumns.map((col) => {
    const headerDef = col.columnDef.header;
    return toCsvCell(typeof headerDef === 'string' ? headerDef : col.id);
  });

  const dataRows = rows.map((row) =>
    visibleColumns.map((col) => toCsvCell(row.getValue(col.id))).join(','),
  );

  const csvContent = [headers.join(','), ...dataRows].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

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

  labels?: DataTableLabels;

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
  labels,
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
          <div className="flex-1">
            <DataTableSearch
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              fetchState={fetchState}
              debounceMs={searchDebounceMs}
              disabled={isLoading}
              className="max-w-none"
            />
          </div>
        )}
      </div>

      {/* Right area: utilities */}
      <div className="flex items-center gap-3 shrink-0">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 gap-2 text-[13px] font-medium border-neutral-200 dark:border-neutral-800 text-foreground-muted hover:text-foreground"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
            <span className="hidden sm:inline-block">{labels?.toolbarRefresh || 'Refresh'}</span>
          </Button>
        )}

        {/* Button Group: Filter, Kolom, Export */}
        <div className="flex items-center h-8 divide-x divide-neutral-200 dark:divide-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-800 bg-background overflow-hidden">
          {/* Filter toggle button — Popover */}
          {showFilter && filterConfig && (
            <Popover open={isFilterOpen} onOpenChange={onFilterOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 gap-2 text-[13px] font-medium rounded-none text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                    isFilterOpen && 'bg-neutral-100 text-foreground dark:bg-neutral-800'
                  )}
                >
                  <Filter className={cn("h-3.5 w-3.5", activeFilterCount ? "text-danger" : "")} />
                  <span className="hidden sm:inline-block">{labels?.toolbarFilter || 'Filter'}</span>
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
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 gap-2 text-[13px] font-medium rounded-none text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                    isColumnOpen && 'bg-neutral-100 text-foreground dark:bg-neutral-800'
                  )}
                  aria-label="Toggle kolom"
                >
                  <Columns3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline-block">{labels?.toolbarColumns || 'Kolom'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[220px] p-0" sideOffset={8}>
                <DataTableColumnPanel
                  table={table}
                  isOpen
                  onClose={() => onColumnOpenChange?.(false)}
                  labels={labels}
                />
              </PopoverContent>
            </Popover>
          )}

          {/* Export toggle button */}
          {showExport && exportConfig?.enabled !== false && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const filename = exportConfig?.filename ?? 'export';
                exportToCsv(table, `${filename}_excel.csv`);
              }}
              className="h-8 gap-2 text-[13px] font-medium rounded-none text-foreground-muted hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              aria-label="Export Data"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels?.toolbarExport || 'Ekspor'}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
