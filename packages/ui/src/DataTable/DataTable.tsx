'use client';

import React, { useState } from 'react';
import type { RowData } from '@tanstack/react-table';
import { cn } from '@adatrack/utils';
import type { DataTableProps } from './types';
import { useDataTable } from './useDataTable';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
import { DataTableFilterPanel } from './DataTableFilterPanel';
import { DataTableColumnPanel } from './DataTableColumnPanel';
import { DataTableExportPanel } from './DataTableExportPanel';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTablePagination } from './DataTablePagination';
import { DataTableActiveFilters } from './DataTableActiveFilters';

export function DataTable<TData extends RowData = RowData>(
  props: DataTableProps<TData>,
) {
  const {
    // Props
    filterConfig,
    isFilterOpen: controlledFilterOpen,
    onFilterOpenChange: controlledFilterOpenChange,
    className,
    tableClassName,
    toolbarActions,
    exportFilename,

    // Status
    isLoading,
    isError,
    errorMessage,
    onRetry,
    emptyTitle,
    emptyDescription,
    emptyIcon,

    // Search
    searchable,
    searchValue,
    onSearchChange,
    searchPlaceholder,

    // Capabilities
    columnVisibility = false,
    exportable = false,
    pagination = false,
    onRefresh,
  } = props;

  // Internal panel state (uncontrolled)
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Use controlled state if provided, otherwise internal
  const isFilterOpen = controlledFilterOpen !== undefined ? controlledFilterOpen : internalFilterOpen;
  const handleFilterOpenChange = controlledFilterOpenChange ?? setInternalFilterOpen;

  // Close other panels when one opens
  const handleFilterOpen = (open: boolean) => {
    handleFilterOpenChange(open);
    if (open) {
      setIsColumnOpen(false);
      setIsExportOpen(false);
    }
  };

  const handleColumnOpen = (open: boolean) => {
    setIsColumnOpen(open);
    if (open) {
      handleFilterOpenChange(false);
      setIsExportOpen(false);
    }
  };

  const handleExportOpen = (open: boolean) => {
    setIsExportOpen(open);
    if (open) {
      handleFilterOpenChange(false);
      setIsColumnOpen(false);
    }
  };

  const table = useDataTable(props);

  const activeFilterCount = filterConfig
    ? Object.values(filterConfig.state).flat().filter(Boolean).length
    : 0;

  let fetchState: 'idle' | 'loading' | 'error' = 'idle';
  if (isLoading) fetchState = 'loading';
  if (isError) fetchState = 'error';

  const hasRightPanel = isExportOpen && exportable;

  return (
    <div className={cn('w-full flex flex-col gap-0 h-full', className)}>
      {/* Card wrapper - white background with border */}
      <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-background border border-border rounded-lg shadow-sm overflow-hidden">

        {/* Toolbar - inside card, with bottom border separator */}
        <div className="px-4 py-3 border-b border-border shrink-0">
          <DataTableToolbar
            table={table}
            showSearch={searchable}
            showColumnToggle={columnVisibility}
            showExport={exportable}
            showFilter={!!filterConfig}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={handleFilterOpen}
            isColumnOpen={isColumnOpen}
            onColumnOpenChange={handleColumnOpen}
            isExportOpen={isExportOpen}
            onExportOpenChange={handleExportOpen}
            activeFilterCount={activeFilterCount}
            filterConfig={filterConfig}
            exportConfig={{ filename: exportFilename, enabled: exportable }}
            onRefresh={onRefresh}
            customActions={toolbarActions}
          />
        </div>

        {/* Active Filters - inside card */}
        {filterConfig && activeFilterCount > 0 && (
          <div className="px-4 py-2 border-b border-border/50 shrink-0">
            <DataTableActiveFilters config={filterConfig} />
          </div>
        )}

        {/* Table + Side Panels */}
        <div className={cn('flex flex-1 items-start min-h-0 overflow-hidden')}>

          {/* Table area */}
          <div className="flex-1 h-full overflow-auto">
            <table className={cn('w-full text-left border-collapse text-[12px]', tableClassName)}>
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                fetchState={fetchState}
                errorMessage={errorMessage}
                onRetry={onRetry}
                emptyTitle={emptyTitle}
                emptyDescription={emptyDescription}
                emptyIcon={emptyIcon}
                noResultTitle="Data tidak ditemukan"
                noResultDescription="Pencarian atau filter tidak menghasilkan data."
              />
            </table>
          </div>

          {/* Right side panels - Export only */}
          {hasRightPanel && (
            <div className="flex gap-0 items-stretch shrink-0 h-full border-l border-border">
              {isExportOpen && exportable && (
                <DataTableExportPanel
                  table={table}
                  exportConfig={{ filename: exportFilename, enabled: exportable }}
                  isOpen={isExportOpen}
                  onClose={() => handleExportOpen(false)}
                  className="border-0 rounded-none h-full"
                />
              )}
            </div>
          )}
        </div>

        {/* Pagination - inside card with top border */}
        {pagination && (
          <div className="px-4 py-2 border-t border-border shrink-0 bg-white dark:bg-background">
            <DataTablePagination
              table={table}
              pageIndex={props.pageIndex}
              pageSize={props.pageSize}
              totalCount={props.totalCount}
              onPageChange={props.onPageChange}
              onPageSizeChange={props.onPageSizeChange}
              pageSizeOptions={props.pageSizeOptions}
            />
          </div>
        )}
      </div>
    </div>
  );
}
