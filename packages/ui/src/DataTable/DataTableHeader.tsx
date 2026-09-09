'use client';

import React from 'react';
import { flexRender, type RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@adatrack/utils';
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
        'border-b border-border/60 text-[11px] font-semibold text-foreground-muted uppercase tracking-wide bg-gray-100 dark:bg-gray-800/50',
        stickyHeader && 'sticky top-0 z-20',
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
                  'px-3 py-2 text-left align-middle font-medium select-none whitespace-nowrap group',
                  canSort && 'cursor-pointer hover:bg-muted/30 transition-colors',
                  isPinned &&
                  'sticky z-30 bg-background shadow-[1px_0_0_0_rgba(0,0,0,0.05)]',
                  (isPinned === 'start' || (isPinned as string) === 'left') && 'left-0',
                  (isPinned === 'end' || (isPinned as string) === 'right') && 'right-0',
                )}
                onClick={header.column.getToggleSortingHandler()}
                style={(header.column.columnDef.meta as any)?.fixedWidth ? {
                  width: header.column.getSize(),
                  minWidth: header.column.getSize(),
                  maxWidth: header.column.getSize(),
                } : undefined}
              >
                {header.isPlaceholder ? null : (
                  <div className="flex items-center gap-1.5">
                    <span>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {canSort && (
                      <span className="shrink-0 text-foreground-muted">
                        {isSorted === 'asc' ? (
                          <ArrowUp className="h-3 w-3 text-primary" />
                        ) : isSorted === 'desc' ? (
                          <ArrowDown className="h-3 w-3 text-primary" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
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
