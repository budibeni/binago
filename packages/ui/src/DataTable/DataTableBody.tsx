'use client';

import React from 'react';
import type { RowData } from '@tanstack/react-table';
import type { FetchState } from '@adatrack/types';
import { DataTableRow } from './DataTableRow';
import { Skeleton } from '../Skeleton';
import { EmptyState } from '../patterns/EmptyState';
import { Button } from '../Button';
import { AlertCircle, SearchX } from 'lucide-react';
import type { DataTableInstance, DataTableLabels } from './types';

export interface DataTableBodyProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  fetchState?: FetchState;
  errorMessage?: string;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ElementType;
  labels?: DataTableLabels;
}

export function DataTableBody<TData extends RowData = RowData>({
  table,
  fetchState = 'idle',
  errorMessage = 'Gagal memuat data.',
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  labels,
}: DataTableBodyProps<TData>) {
  const columnCount = table.getVisibleFlatColumns().length || 1;
  let rows = table.getRowModel().rows;
  const isFiltered = Boolean(
    table.state.globalFilter || table.state.columnFilters.length > 0,
  );

  // Apply manual client-side pagination fallback
  const paginationState = table.state.pagination;
  if (paginationState && rows.length > paginationState.pageSize) {
    const start = paginationState.pageIndex * paginationState.pageSize;
    const end = start + paginationState.pageSize;
    rows = rows.slice(start, end);
  }

  if (fetchState === 'loading') {
    return (
      <tbody suppressHydrationWarning>
        {Array.from({ length: 5 }).map((_, idx) => (
          <tr key={idx} className="border-b border-border">
            <td colSpan={columnCount} className="px-3 py-3">
              <Skeleton className="h-5 w-full" />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  if (fetchState === 'error') {
    return (
      <tbody suppressHydrationWarning>
        <tr>
          <td colSpan={columnCount} className="px-3 py-6">
            <EmptyState
              icon={AlertCircle}
              title={labels?.errorTitle || "Terjadi Kesalahan"}
              description={errorMessage || labels?.errorLoadData || "Gagal memuat data."}
              action={
                onRetry ? (
                  <Button variant="outline" size="sm" onClick={onRetry}>
                    {labels?.errorTryAgain || "Coba Lagi"}
                  </Button>
                ) : undefined
              }
            />
          </td>
        </tr>
      </tbody>
    );
  }

  if (rows.length === 0) {
    return (
      <tbody suppressHydrationWarning>
        <tr>
          <td colSpan={columnCount} className="px-3 py-6">
            {isFiltered ? (
              <EmptyState
                icon={SearchX}
                title={labels?.noResultTitle || "Hasil Tidak Ditemukan"}
                description={labels?.noResultDesc || "Tidak ada data yang sesuai dengan pencarian atau filter Anda."}
              />
            ) : (
              <EmptyState
                icon={emptyIcon}
                title={emptyTitle}
                description={emptyDescription}
              />
            )}
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody suppressHydrationWarning>
      {rows.map((row) => (
        <DataTableRow key={row.id} row={row} />
      ))}
    </tbody>
  );
}
