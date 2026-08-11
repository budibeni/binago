'use client';

import React from 'react';
import type { RowData } from '@tanstack/react-table';
import { cn } from '@binago/utils';
import type { DataTableBaseProps } from './types';
import { useDataTable } from './useDataTable';
import { useInfiniteScroll } from './useInfiniteScroll';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
import { DataTableFilterPanel } from './DataTableFilterPanel';
import { Spinner } from '../Spinner';

export function DataTable<TData extends RowData = RowData>(
  props: DataTableBaseProps<TData>,
) {
  const {
    mode = 'pagination',
    fetchState = 'idle',
    errorMessage,
    onRetry,
    emptyTitle,
    emptyDescription,
    emptyIcon,
    noResultTitle,
    noResultDescription,
    infiniteConfig,
    className,
    tableClassName,
    toolbarSlot,
    paginationSlot,
    filterConfig,
    isFilterOpen,
    onFilterOpenChange,
  } = props;

  const table = useDataTable(props);

  const { sentinelRef } = useInfiniteScroll({
    hasNextPage: infiniteConfig?.hasNextPage,
    isFetchingNextPage: fetchState === 'loading-more' || infiniteConfig?.isFetchingNextPage,
    onFetchNextPage: infiniteConfig?.onFetchNextPage,
    disabled: mode !== 'infinite',
  });

  const activeFilterCount = filterConfig
    ? Object.values(filterConfig.state).flat().filter(Boolean).length
    : 0;

  const toolbarProps = {
    table,
    showFilter: !!filterConfig,
    isFilterOpen,
    onFilterOpenChange,
    activeFilterCount,
  };

  const renderedToolbar =
    typeof toolbarSlot === 'function'
      ? toolbarSlot(toolbarProps)
      : React.isValidElement(toolbarSlot)
      ? React.cloneElement(toolbarSlot as React.ReactElement, toolbarProps)
      : toolbarSlot;

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Toolbar */}
      {renderedToolbar && (
        <div className="w-full relative z-20">
          {renderedToolbar}
        </div>
      )}

      {/* Table + Filter panel side-by-side */}
      <div className={cn('flex items-start gap-4', isFilterOpen && filterConfig ? 'flex-col lg:flex-row' : '')}>
        {/* Table area */}
        <div className="flex-1 min-w-0 w-full">
          <div className="relative w-full overflow-x-auto rounded-lg border border-border bg-background shadow-sm max-h-[600px] overflow-y-auto">
            <table className={cn('w-full text-left border-collapse text-sm', tableClassName)}>
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                fetchState={fetchState}
                errorMessage={errorMessage}
                onRetry={onRetry}
                emptyTitle={emptyTitle}
                emptyDescription={emptyDescription}
                emptyIcon={emptyIcon}
                noResultTitle={noResultTitle}
                noResultDescription={noResultDescription}
              />
            </table>

            {/* Infinite scroll sentinel */}
            {mode === 'infinite' && (
              <div ref={sentinelRef} className="p-4 flex items-center justify-center">
                {fetchState === 'loading-more' || infiniteConfig?.isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <Spinner size="sm" />
                    <span>Memuat data tambahan...</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {isFilterOpen && filterConfig && (
          <div className="w-full lg:w-[280px] shrink-0">
            <DataTableFilterPanel config={filterConfig} />
          </div>
        )}
      </div>

      {/* Pagination */}
      {mode === 'pagination' && paginationSlot && (
        <div className="w-full">{paginationSlot}</div>
      )}
    </div>
  );
}
