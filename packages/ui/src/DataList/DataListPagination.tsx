import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@adatrack/utils';

export interface DataListPaginationProps {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  canNextPage: boolean;
  canPrevPage: boolean;
  className?: string;
}

export function DataListPagination({
  pageIndex,
  pageSize,
  totalRows,
  onNextPage,
  onPrevPage,
  canNextPage,
  canPrevPage,
  className
}: DataListPaginationProps) {
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);
  
  return (
    <div className={cn("flex items-center justify-between px-3 py-2 border-t border-border bg-background", className)}>
      <div className="text-[11px] text-muted-foreground">
        {start}-{end} dari {totalRows}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevPage}
          disabled={!canPrevPage}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNextPage}
          disabled={!canNextPage}
          className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
