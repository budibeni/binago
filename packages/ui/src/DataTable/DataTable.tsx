'use client';

import React, { useState } from 'react';
import type { RowData } from '@tanstack/react-table';
import { cn } from '@adatrack/utils';
import type { DataTableProps, DataTableColumnDef } from './types';
import { Eye } from 'lucide-react';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { useDataTable } from './useDataTable';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
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
    extraMiddleActions,
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
    showFullscreen = false,
    hideToolbarLabels = false,
    pagination = false,
    onRefresh,

    // Fullscreen State
    isFullscreen,
    onToggleFullscreen,

    // i18n
    labels,

    // Action
    onRowActionClick,

    // Selection
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    getRowId,
  } = props;

  // Internal panel state (uncontrolled)
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);

  // Use controlled state if provided, otherwise internal
  const isFilterOpen = controlledFilterOpen !== undefined ? controlledFilterOpen : internalFilterOpen;
  const handleFilterOpenChange = controlledFilterOpenChange ?? setInternalFilterOpen;

  // Close other panels when one opens
  const handleFilterOpen = (open: boolean) => {
    handleFilterOpenChange(open);
    if (open) {
      setIsColumnOpen(false);
    }
  };

  const handleColumnOpen = (open: boolean) => {
    setIsColumnOpen(open);
    if (open) {
      handleFilterOpenChange(false);
    }
  };

  const enhancedColumns = React.useMemo(() => {
    let newCols = [...props.columns];

    if (onRowActionClick) {
      const actionCol: DataTableColumnDef<TData> = {
        id: 'actions',
        header: '',
        enableSorting: false,
        size: 50,
        meta: { fixedWidth: true, pin: 'left', className: 'w-[40px] px-1 max-w-[40px]', align: 'center' },
        cell: ({ row }) => (
          <div className="flex items-center justify-center w-full">
            <Button
              variant="ghost-danger"
              size="icon"
              onClick={() => onRowActionClick(row.original)}
              title={labels?.actionDetail || 'Lihat Detail'}
            >
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        ),
      };
      newCols.unshift(actionCol);
    }

    if (selectable) {
      const getRowIdValue = (row: TData): string => {
        if (getRowId) return getRowId(row);
        return (row as any).id || (row as any).vehicleId || '';
      };

      const checkboxCol: DataTableColumnDef<TData> = {
        id: 'select',
        header: ({ table }) => {
          const rows = table.getRowModel().rows;
          const visibleIds = rows.map(r => getRowIdValue(r.original)).filter(Boolean);
          const isAllSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));
          return (
            <div className="flex items-center justify-center w-full">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => {
                  if (!onSelectionChange) return;
                  if (checked) {
                    onSelectionChange(Array.from(new Set([...selectedIds, ...visibleIds])));
                  } else {
                    onSelectionChange(selectedIds.filter(id => !visibleIds.includes(id)));
                  }
                }}
                aria-label="Select all"
              />
            </div>
          );
        },
        cell: ({ row }) => {
          const id = getRowIdValue(row.original);
          return (
            <div className="flex items-center justify-center w-full">
              <Checkbox
                checked={selectedIds.includes(id)}
                onCheckedChange={(checked) => {
                  if (!onSelectionChange) return;
                  if (checked) {
                    onSelectionChange([...selectedIds, id]);
                  } else {
                    onSelectionChange(selectedIds.filter(vId => vId !== id));
                  }
                }}
                aria-label={`Select ${id}`}
                className="data-[state=checked]:bg-danger data-[state=checked]:border-danger"
              />
            </div>
          );
        },
        enableSorting: false,
        size: 40,
        meta: { fixedWidth: true, pin: 'left', className: 'w-10 max-w-[40px] px-1', align: 'center' },
      };
      newCols.unshift(checkboxCol);
    }

    return newCols;
  }, [props.columns, onRowActionClick, labels?.actionDetail, selectable, selectedIds, onSelectionChange, getRowId]);

  const table = useDataTable({
    ...props,
    columns: enhancedColumns,
  });

  const activeFilterCount = filterConfig
    ? Object.values(filterConfig.state).flat().filter(v => Boolean(v) && v !== 'all' && v !== 'ALL').length
    : 0;

  let fetchState: 'idle' | 'loading' | 'error' = 'idle';
  if (isLoading) fetchState = 'loading';
  if (isError) fetchState = 'error';

  return (
    <div className={cn('w-full flex flex-col gap-0 h-full', className)}>
      {/* Card wrapper - white background */}
      <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-background overflow-hidden">

        {/* Toolbar - inside card, with bottom border separator */}
        <div className="px-4 py-3.5 border-b border-border shrink-0">
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
            activeFilterCount={activeFilterCount}
            filterConfig={filterConfig}
            exportConfig={{ filename: exportFilename, enabled: exportable }}
            showFullscreen={showFullscreen}
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
            hideToolbarLabels={hideToolbarLabels}
            onRefresh={onRefresh}
            customActions={toolbarActions}
            extraMiddleActions={extraMiddleActions}
            labels={labels}
          />
        </div>

        {/* Active Filters removed from here, moved to footer */}

        {/* Table + Side Panels */}
        <div className={cn('flex flex-1 items-start min-h-0 overflow-hidden')}>

          {/* Table area */}
          <div className="flex-1 h-full overflow-auto">
            <table className={cn('w-full text-left border-collapse text-[13px]', tableClassName)}>
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                fetchState={fetchState}
                errorMessage={errorMessage}
                onRetry={onRetry}
                emptyTitle={emptyTitle}
                emptyDescription={emptyDescription}
                emptyIcon={emptyIcon}
                labels={labels}
                groupBy={props.groupBy}
                renderGroupHeader={props.renderGroupHeader}
              />
            </table>
          </div>
        </div>

        {/* Footer: Pagination & Active Filters */}
        {(pagination || (filterConfig && activeFilterCount > 0)) && (
          <div className="px-3 py-1.5 border-t border-border shrink-0 bg-white dark:bg-background">
            {pagination ? (
              <DataTablePagination
                table={table}
                pageIndex={props.pageIndex}
                pageSize={props.pageSize}
                totalCount={props.totalCount}
                onPageChange={props.onPageChange}
                onPageSizeChange={props.onPageSizeChange}
                pageSizeOptions={props.pageSizeOptions}
                labels={labels}
                leftContent={
                  filterConfig && activeFilterCount > 0 ? (
                    <DataTableActiveFilters config={filterConfig} labels={labels} className="pt-0 pb-0" />
                  ) : undefined
                }
              />
            ) : (
              filterConfig && activeFilterCount > 0 && (
                <div className="flex items-center">
                  <DataTableActiveFilters config={filterConfig} labels={labels} className="pt-0 pb-0" />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
