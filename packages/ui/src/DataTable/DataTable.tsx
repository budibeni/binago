import React from 'react';
import type { RowData } from '@tanstack/react-table';
import { cn } from '@binago/utils';
import type { DataTableBaseProps } from './types';
import { useDataTable } from './useDataTable';
import { useInfiniteScroll } from './useInfiniteScroll';
import { DataTableHeader } from './DataTableHeader';
import { DataTableBody } from './DataTableBody';
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
  } = props;

  const table = useDataTable(props);

  const { sentinelRef } = useInfiniteScroll({
    hasNextPage: infiniteConfig?.hasNextPage,
    isFetchingNextPage: fetchState === 'loading-more' || infiniteConfig?.isFetchingNextPage,
    onFetchNextPage: infiniteConfig?.onFetchNextPage,
    disabled: mode !== 'infinite',
  });

  return (
    <div className={cn('w-full space-y-3', className)}>
      {toolbarSlot && <div className="w-full">{toolbarSlot}</div>}

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

      {mode === 'pagination' && paginationSlot && (
        <div className="w-full">{paginationSlot}</div>
      )}
    </div>
  );
}
