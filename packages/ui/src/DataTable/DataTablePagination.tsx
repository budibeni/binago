'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import type { DataTablePaginationConfig } from './types';

export interface DataTablePaginationProps {
  paginationConfig: DataTablePaginationConfig;
  fetchState?: 'idle' | 'loading' | 'loading-more' | 'error';
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function DataTablePagination({
  paginationConfig,
  fetchState = 'idle',
  className,
}: DataTablePaginationProps) {
  const {
    pageIndex,
    pageSize,
    totalCount,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    onPageChange,
    onPageSizeChange,
  } = paginationConfig;

  const isLoading = fetchState === 'loading';
  const pageCount = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  // Display range: e.g. "1-10 dari 120"
  const from = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 px-1 py-2 text-sm text-foreground-muted',
        className,
      )}
      aria-label="Navigasi halaman"
    >
      {/* Left: row info + page size selector */}
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-xs">
          {totalCount > 0
            ? `${from}-${to} dari ${totalCount.toLocaleString('id-ID')} baris`
            : 'Tidak ada data'}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-xs">
            <label
              htmlFor="datatable-page-size"
              className="shrink-0 text-foreground-muted"
            >
              Baris per halaman:
            </label>
            <select
              id="datatable-page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={isLoading}
              className={cn(
                'h-7 rounded border border-border bg-background px-2 text-xs text-foreground',
                'focus:outline-none focus:ring-1 focus:ring-neutral-400',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: page navigation */}
      <div className="flex items-center gap-1">
        <span className="shrink-0 text-xs tabular-nums">
          Halaman {pageCount > 0 ? pageIndex + 1 : 0} dari {pageCount}
        </span>

        <div className="flex items-center gap-0.5 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.(0)}
            disabled={!canPreviousPage || isLoading}
            aria-label="Halaman pertama"
            className="h-7 w-7 p-0"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.(pageIndex - 1)}
            disabled={!canPreviousPage || isLoading}
            aria-label="Halaman sebelumnya"
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.(pageIndex + 1)}
            disabled={!canNextPage || isLoading}
            aria-label="Halaman berikutnya"
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange?.(pageCount - 1)}
            disabled={!canNextPage || isLoading}
            aria-label="Halaman terakhir"
            className="h-7 w-7 p-0"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
