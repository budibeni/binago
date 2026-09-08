'use client';

import React, { useState, useEffect } from 'react';
import { Columns3 } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover';
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

  // Hitung kolom yang tersembunyi berdasarkan state table asli
  const hiddenCount = toggleableColumns.filter(
    (col) => !col.getIsVisible(),
  ).length;

  const [isOpen, setIsOpen] = useState(false);
  const [localVisibility, setLocalVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const current: Record<string, boolean> = {};
      toggleableColumns.forEach(col => {
        current[col.id] = col.getIsVisible();
      });
      setLocalVisibility(current);
    }
  }, [isOpen, toggleableColumns]);

  const handleApply = () => {
    table.setColumnVisibility(localVisibility);
    setIsOpen(false);
  };

  const handleReset = () => {
    const allVisible: Record<string, boolean> = {};
    toggleableColumns.forEach(col => {
      allVisible[col.id] = true;
    });
    setLocalVisibility(allVisible);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 gap-2 text-[13px] font-medium',
            isOpen && 'bg-muted text-foreground',
            className
          )}
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
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[280px] p-0" sideOffset={8}>
        <div className="px-3 py-3 border-b border-border text-sm font-semibold">
          Tampilkan Kolom
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {toggleableColumns.map((column) => {
            const isVisible = localVisibility[column.id] ?? column.getIsVisible();
            const headerDef = column.columnDef.header;
            const label =
              typeof headerDef === 'string'
                ? headerDef
                : column.id;

            return (
              <label
                key={column.id}
                className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setLocalVisibility(prev => ({ ...prev, [column.id]: e.target.checked }))}
                  className="rounded border-border text-danger focus:ring-danger h-4 w-4"
                />
                <span className="text-[13px] text-foreground flex-1">{label}</span>
              </label>
            );
          })}
        </div>
        <div className="p-3 border-t border-border flex items-center justify-between gap-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="destructive" className="flex-1" onClick={handleApply}>
            Terapkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
