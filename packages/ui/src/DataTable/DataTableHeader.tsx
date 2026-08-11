import React from 'react';
import { flexRender, type RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@binago/utils';
import type { DataTableInstance } from './types';

export interface DataTableHeaderProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  stickyHeader?: boolean;
}

export function DataTableHeader<TData extends RowData = RowData>({
  table,
  stickyHeader = true,
}: DataTableHeaderProps<TData>) {
  return (
    <thead
      className={cn(
        'bg-surface border-b border-border text-xs font-semibold text-foreground-muted uppercase tracking-wider',
        stickyHeader && 'sticky top-0 z-20 bg-surface shadow-sm',
      )}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const isSorted = header.column.getIsSorted();
            const isPinned = header.column.getIsPinned();

            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className={cn(
                  'px-4 py-3 text-left align-middle font-semibold select-none whitespace-nowrap',
                  canSort && 'cursor-pointer hover:bg-neutral-200/50 transition-colors',
                  isPinned &&
                    'sticky z-30 bg-surface shadow-[1px_0_0_0_rgba(0,0,0,0.05)]',
                  (isPinned === 'start' || (isPinned as string) === 'left') && 'left-0',
                  (isPinned === 'end' || (isPinned as string) === 'right') && 'right-0',
                )}
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex items-center gap-1.5">
                    <span>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {canSort && (
                      <span className="shrink-0 text-foreground-muted">
                        {isSorted === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5 text-primary" />
                        ) : isSorted === 'desc' ? (
                          <ArrowDown className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
