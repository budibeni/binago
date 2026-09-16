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
              isPinned && 'sticky z-10 bg-white dark:bg-background group-hover:bg-neutral-50/80 dark:group-hover:bg-muted/20 transition-colors',
              (isPinned === 'start' || (isPinned as string) === 'left') &&
                'shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]',
              (isPinned === 'end' || (isPinned as string) === 'right') &&
                'shadow-[-2px_0_4px_-1px_rgba(0,0,0,0.06)]',
            )}
            style={{
              ...((cell.column.columnDef.meta as any)?.fixedWidth ? {
                width: cell.column.getSize(),
                minWidth: cell.column.getSize(),
                maxWidth: cell.column.getSize(),
              } : {}),
              ...(isPinned === 'left' || isPinned === 'start'
                ? { left: `${cell.column.getStart('left')}px` }
                : isPinned === 'right' || isPinned === 'end'
                ? { right: `${cell.column.getAfter('right')}px` }
                : {}),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
