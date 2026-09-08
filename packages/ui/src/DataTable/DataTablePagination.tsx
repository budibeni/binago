'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import type { DataTableInstance, RowData } from './types';

export interface DataTablePaginationProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  pageSizeOptions?: number[];
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  fetchState?: 'idle' | 'loading' | 'loading-more' | 'error';
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
  className,
}: DataTablePaginationProps<TData>) {
  
  const isServerSide = typeof controlledTotalCount !== 'undefined';
  
  // Use controlled props if provided, otherwise fallback to TanStack internal state
  const pageIndex = isServerSide ? controlledPageIndex! : table.state.pagination.pageIndex;
  const pageSize = isServerSide ? controlledPageSize! : table.state.pagination.pageSize;
  
  const totalCount = isServerSide ? controlledTotalCount! : table.getFilteredRowModel().rows.length;
  const pageCount = isServerSide 
    ? (pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0)
    : table.getPageCount();
    
  const canPreviousPage = isServerSide ? pageIndex > 0 : table.getCanPreviousPage();
  const canNextPage = isServerSide ? pageIndex < pageCount - 1 : table.getCanNextPage();
  
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
      {/* Left: row info */}
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-xs">
          Menampilkan {from}-{to} dari {totalCount.toLocaleString('id-ID')} data
        </span>
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
              'h-8 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground',
              'focus:outline-none focus:ring-1 focus:ring-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
            aria-label="Baris per halaman"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} / halaman
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
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {pages.map((p, i) => {
            if (p === '...') {
              return (
                <div key={`dots-${i}`} className="flex h-8 w-8 items-center justify-center text-muted-foreground">
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
                  "h-8 w-8 p-0 text-[13px]",
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
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
