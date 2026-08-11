'use client';

import React from 'react';
import { Columns3 } from 'lucide-react';
import { cn } from '@binago/utils';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../Dropdown';
import type { ColumnVisibilityState, DataTableInstance, RowData } from './types';

export interface DataTableColumnToggleProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  className?: string;
}

export function DataTableColumnToggle<TData extends RowData = RowData>({
  table,
  className,
}: DataTableColumnToggleProps<TData>) {
  // Ambil kolom yang memiliki header string dan dapat di-toggle
  const toggleableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanHide());

  if (toggleableColumns.length === 0) return null;

  // Hitung kolom yang tersembunyi
  const hiddenCount = toggleableColumns.filter(
    (col) => !col.getIsVisible(),
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('gap-1.5', className)}
          aria-label="Toggle kolom"
        >
          <Columns3 className="h-3.5 w-3.5" />
          <span>Kolom</span>
          {hiddenCount > 0 && (
            <span className="ml-0.5 rounded bg-primary/10 px-1 text-[10px] font-medium text-primary tabular-nums">
              -{hiddenCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <div className="px-2 py-1.5 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
          Tampilkan Kolom
        </div>
        <div className="my-1 border-t border-border" />
        <div className="max-h-60 overflow-y-auto">
          {toggleableColumns.map((column) => {
            const isVisible = column.getIsVisible();
            const headerDef = column.columnDef.header;
            const label =
              typeof headerDef === 'string'
                ? headerDef
                : column.id;

            return (
              <button
                key={column.id}
                type="button"
                onClick={() => column.toggleVisibility(!isVisible)}
                className={cn(
                  'flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm',
                  'transition-colors hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100',
                  !isVisible && 'text-foreground-muted',
                )}
              >
                {/* Custom checkbox visual */}
                <span
                  className={cn(
                    'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border',
                    isVisible
                      ? 'border-primary bg-primary'
                      : 'border-border bg-background',
                  )}
                  aria-hidden="true"
                >
                  {isVisible && (
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  )}
                </span>
                <span className="flex-1 text-left">{label}</span>
              </button>
            );
          })}
        </div>
        {hiddenCount > 0 && (
          <>
            <div className="my-1 border-t border-border" />
            <button
              type="button"
              onClick={() => {
                const visibility: ColumnVisibilityState = {};
                toggleableColumns.forEach((col) => {
                  visibility[col.id] = true;
                });
                table.setColumnVisibility(visibility);
              }}
              className="flex w-full items-center justify-center rounded px-2 py-1.5 text-xs text-primary hover:bg-neutral-100 transition-colors focus:outline-none"
            >
              Tampilkan Semua
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
