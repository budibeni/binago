'use client';

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { cn } from '@adatrack/utils';
import type { RowData, DataTableRowInstance } from './types';

export interface DataTableRowProps<TData extends RowData = RowData> {
  row: DataTableRowInstance<TData>;
  onClick?: (row: DataTableRowInstance<TData>) => void;
  className?: string;
}

export function DataTableRow<TData extends RowData = RowData>({
  row,
  onClick,
  className,
}: DataTableRowProps<TData>) {
  return (
    <tr
      className={cn(
        'group border-b border-border/40 bg-white dark:bg-background transition-colors hover:bg-neutral-50/80 dark:hover:bg-muted/20',
        row.getIsSelected() && 'bg-primary/5',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick ? () => onClick(row) : undefined}
    >
      {row.getVisibleCells().map((cell) => {
        const isPinned = cell.column.getIsPinned();
        return (
          <td
            key={cell.id}
            className={cn(
              'px-3 py-2 align-middle',
              isPinned && 'sticky z-10 bg-background group-hover:bg-muted/30 transition-colors shadow-[1px_0_0_0_rgba(0,0,0,0.05)]',
              (isPinned === 'start' || (isPinned as string) === 'left') && 'left-0',
              (isPinned === 'end' || (isPinned as string) === 'right') && 'right-0',
            )}
            style={(cell.column.columnDef.meta as any)?.fixedWidth ? {
              width: cell.column.getSize(),
              minWidth: cell.column.getSize(),
              maxWidth: cell.column.getSize(),
            } : undefined}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
