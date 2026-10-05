'use client';

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { cn } from '@adatrack/utils';
import type { RowData, DataTableRowInstance } from './types';
import { CellErrorBoundary } from './CellErrorBoundary';

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
      {row.getVisibleCells().map((cell, index, cells) => {
        const isPinned = cell.column.getIsPinned();
        const auxiliaryIds = ['actions', 'select', 'checkbox', 'no', 'number', 'index'];
        const firstPrimaryColIndex = cells.findIndex(c => !auxiliaryIds.includes(String(c.column.id).toLowerCase()));
        const isFirstPrimary = index === firstPrimaryColIndex;
        
        const hasSize = cell.column.columnDef.size !== undefined;
        const hasMinSize = cell.column.columnDef.minSize !== undefined;
        const hasMaxSize = cell.column.columnDef.maxSize !== undefined;
        const isFixedWidth = (cell.column.columnDef.meta as any)?.fixedWidth || hasSize;

        let widthStyle = {};
        if (isFixedWidth) {
          widthStyle = {
            width: cell.column.getSize(),
            minWidth: cell.column.getSize(),
            maxWidth: cell.column.getSize(),
          };
        } else {
          if (hasMinSize) widthStyle = { ...widthStyle, minWidth: cell.column.columnDef.minSize };
          if (hasMaxSize) widthStyle = { ...widthStyle, maxWidth: cell.column.columnDef.maxSize };
        }

        return (
          <td
            key={cell.id}
            className={cn(
              'px-3 py-2 align-middle whitespace-nowrap text-[13px]',
              isFirstPrimary ? 'font-semibold text-foreground' : 'text-foreground-muted',
              isPinned && 'sticky z-10 bg-white dark:bg-background group-hover:bg-neutral-50/80 dark:group-hover:bg-muted/20 transition-colors',
              (isPinned === 'start' || (isPinned as string) === 'left') &&
                'shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]',
              (isPinned === 'end' || (isPinned as string) === 'right') &&
                'shadow-[-2px_0_4px_-1px_rgba(0,0,0,0.06)]',
              (cell.column.columnDef.meta as any)?.className,
            )}
            style={{
              ...widthStyle,
              ...((isPinned as string) === 'left' || isPinned === 'start'
                ? { left: `${cell.column.getStart('left' as any)}px` }
                : (isPinned as string) === 'right' || isPinned === 'end'
                ? { right: `${cell.column.getAfter('right' as any)}px` }
                : {}),
            }}
          >
            <CellErrorBoundary>
              {(() => {
                const rendered = flexRender(cell.column.columnDef.cell, cell.getContext());
                if (rendered === null || rendered === undefined || rendered === '') {
                  return <span className="text-foreground-muted/50">-</span>;
                }
                return rendered;
              })()}
            </CellErrorBoundary>
          </td>
        );
      })}
    </tr>
  );
}
