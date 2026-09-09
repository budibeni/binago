'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Filter, List } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import type { DataTableInstance, RowData, DataTableLabels } from './types';

export interface DataTablePaginationProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  pageSizeOptions?: number[];
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  fetchState?: 'idle' | 'loading' | 'loading-more' | 'error';
  leftContent?: React.ReactNode;
  labels?: DataTableLabels;
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function DataTablePagination<TData extends RowData = RowData>({
  table,
  pageIndex: controlledPageIndex,
  pageSize: controlledPageSize,
  totalCount: controlledTotalCount,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  fetchState = 'idle',
  leftContent,
  labels,
  className,
}: DataTablePaginationProps<TData>) {

  const [showFilters, setShowFilters] = useState(true);

  const isServerSide = typeof controlledTotalCount !== 'undefined';

  // Use controlled props if provided, otherwise fallback to TanStack internal state
  const pageIndex = isServerSide ? controlledPageIndex! : table.state.pagination.pageIndex;
  const pageSize = isServerSide ? controlledPageSize! : table.state.pagination.pageSize;

  const totalCount = isServerSide ? controlledTotalCount! : table.getFilteredRowModel().rows.length;

  // Always calculate manually to ensure it works even if TanStack pagination features are missing
  const pageCount = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const handlePageChange = (newIndex: number) => {
    if (isServerSide && onPageChange) {
      onPageChange(newIndex);
    } else {
      table.setPageIndex(newIndex);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (isServerSide && onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      table.setPageSize(newSize);
    }
  };

  const isLoading = fetchState === 'loading';

  // Display range: e.g. "1-10 dari 120"
  const from = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalCount);

  // Generate page numbers
  const generatePagination = () => {
    // pageIndex is 0-indexed internally, but we display 1-indexed
    const current = pageIndex + 1;
    const total = pageCount;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    if (current >= total - 2) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const pages = generatePagination();

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 text-xs text-foreground-muted',
        className,
      )}
      aria-label="Navigasi halaman"
    >
      {/* Left: row info & custom toggle */}
      <div className="flex flex-wrap items-center gap-3">
        {leftContent ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setShowFilters(true)}
                className={cn(
                  "p-1 rounded transition-colors flex items-center justify-center",
                  showFilters ? "bg-neutral-100 dark:bg-neutral-800 text-foreground" : "text-foreground-muted hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-foreground"
                )}
                aria-label="Tampilkan Filter"
                title="Tampilkan Filter"
              >
                <Filter className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className={cn(
                  "p-1 rounded transition-colors flex items-center justify-center",
                  !showFilters ? "bg-neutral-100 dark:bg-neutral-800 text-foreground" : "text-foreground-muted hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-foreground"
                )}
                aria-label="Tampilkan Info Data"
                title="Tampilkan Info Data"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center ml-1">
              {showFilters ? (
                leftContent
              ) : (
                <span className="shrink-0 text-xs text-foreground-muted">
                  {labels?.paginationShowing ? labels.paginationShowing(from, to, totalCount) : `Menampilkan ${from}-${to} dari ${totalCount.toLocaleString('id-ID')} data`}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="shrink-0 text-xs text-foreground-muted">
            {labels?.paginationShowing ? labels.paginationShowing(from, to, totalCount) : `Menampilkan ${from}-${to} dari ${totalCount.toLocaleString('id-ID')} data`}
          </span>
        )}
      </div>

      {/* Right: page size + page navigation */}
      <div className="flex items-center gap-3">
        {/* Page Size Selector */}
        <div className="flex items-center">
          <select
            id="datatable-page-size"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            disabled={isLoading}
            className={cn(
              'h-7 rounded-md border border-border bg-background px-2 py-0 text-xs text-foreground',
              'focus:outline-none focus:ring-1 focus:ring-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            aria-label="Baris per halaman"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} {labels?.paginationPerPage || '/ halaman'}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={!canPreviousPage || isLoading}
            aria-label="Halaman sebelumnya"
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pages.map((p, i) => {
            if (p === '...') {
              return (
                <div key={`dots-${i}`} className="flex h-7 w-7 items-center justify-center text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }
            const isCurrentPage = (p as number) - 1 === pageIndex;
            return (
              <Button
                key={p}
                variant={isCurrentPage ? "primary" : "ghost"}
                size="sm"
                onClick={() => handlePageChange((p as number) - 1)}
                disabled={isLoading}
                className={cn(
                  "h-7 w-7 p-0 text-xs",
                  isCurrentPage ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-foreground-muted"
                )}
              >
                {p}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={!canNextPage || isLoading}
            aria-label="Halaman berikutnya"
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
