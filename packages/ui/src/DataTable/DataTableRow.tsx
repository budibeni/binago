'use client';

import React from 'react';
import { flexRender, type RowData } from '@tanstack/react-table';
import { cn } from '@adatrack/utils';
import type { DataTableRowInstance } from './types';

export interface DataTableRowProps<TData extends RowData = RowData> {
  row: DataTableRowInstance<TData>;
  className?: string;
}

export function DataTableRow<TData extends RowData = RowData>({
  row,
  className,
}: DataTableRowProps<TData>) {
  return (
    <tr
      className={cn(
        'border-b border-border bg-background transition-colors duration-fast hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30',
        className,
      )}
    >
      {row.getVisibleCells().map((cell) => {
        const isPinned = cell.column.getIsPinned();
        return (
          <td
            key={cell.id}
            className={cn(
              'px-3 py-1.5 text-[13px] text-foreground align-middle whitespace-nowrap',
              isPinned && 'sticky z-10 bg-background shadow-[1px_0_0_0_rgba(0,0,0,0.05)]',
              (isPinned === 'start' || (isPinned as string) === 'left') && 'left-0',
              (isPinned === 'end' || (isPinned as string) === 'right') && 'right-0',
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
