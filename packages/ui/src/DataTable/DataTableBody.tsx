'use client';

import React from 'react';
import type { RowData } from '@tanstack/react-table';
import type { FetchState } from '@adatrack/types';
import { DataTableRow } from './DataTableRow';
import { Skeleton } from '../Skeleton';
import { EmptyState } from '../patterns/EmptyState';
import { Button } from '../Button';
import { AlertCircle, SearchX } from 'lucide-react';
import type { DataTableInstance } from './types';

export interface DataTableBodyProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  fetchState?: FetchState;
  errorMessage?: string;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ElementType;
  noResultTitle?: string;
  noResultDescription?: string;
}

export function DataTableBody<TData extends RowData = RowData>({
  table,
  fetchState = 'idle',
  errorMessage = 'Gagal memuat data.',
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  noResultTitle = 'Hasil Tidak Ditemukan',
  noResultDescription = 'Tidak ada data yang sesuai dengan pencarian atau filter Anda.',
}: DataTableBodyProps<TData>) {
  const columnCount = table.getVisibleFlatColumns().length || 1;
  const rows = table.getRowModel().rows;
  const isFiltered = Boolean(
    table.state.globalFilter || table.state.columnFilters.length > 0,
  );

  if (fetchState === 'loading') {
    return (
      <tbody>
        {Array.from({ length: 5 }).map((_, idx) => (
          <tr key={idx} className="border-b border-border">
            <td colSpan={columnCount} className="p-4">
              <Skeleton className="h-5 w-full" />
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  if (fetchState === 'error') {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount} className="p-4">
            <EmptyState
              icon={AlertCircle}
              title="Terjadi Kesalahan"
              description={errorMessage}
              action={
                onRetry ? (
                  <Button variant="outline" size="sm" onClick={onRetry}>
                    Coba Lagi
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
      <tbody>
        <tr>
          <td colSpan={columnCount} className="p-4">
            {isFiltered ? (
              <EmptyState
                icon={SearchX}
                title={noResultTitle}
                description={noResultDescription}
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
    <tbody>
      {rows.map((row) => (
        <DataTableRow key={row.id} row={row} />
      ))}
    </tbody>
  );
}
