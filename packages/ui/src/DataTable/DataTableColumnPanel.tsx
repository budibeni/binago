'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import type { ColumnVisibilityState, DataTableInstance, RowData } from './types';

export interface DataTableColumnPanelProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function DataTableColumnPanel<TData extends RowData = RowData>({
  table,
  isOpen,
  onClose,
  className,
}: DataTableColumnPanelProps<TData>) {
  const toggleableColumns = table
    .getAllColumns()
    .filter((col) => col.getCanHide());

  const [localVisibility, setLocalVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      const current: Record<string, boolean> = {};
      toggleableColumns.forEach(col => {
        current[col.id] = col.getIsVisible();
      });
      setLocalVisibility(current);
    }
  }, [isOpen]);

  const handleApply = () => {
    table.setColumnVisibility(localVisibility as ColumnVisibilityState);
    onClose();
  };

  const handleReset = () => {
    const allVisible: Record<string, boolean> = {};
    toggleableColumns.forEach(col => {
      allVisible[col.id] = true;
    });
    setLocalVisibility(allVisible);
  };

  if (!isOpen) return null;

  return (
    <div className={cn('flex flex-col bg-background border border-border rounded-lg w-[220px] shrink-0 overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <span className="text-[13px] font-semibold text-foreground">Tampilkan Kolom</span>
        <button type="button" onClick={onClose} className="text-foreground-muted hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-1 max-h-[320px]">
        {toggleableColumns.map((column) => {
          const isVisible = localVisibility[column.id] ?? column.getIsVisible();
          const headerDef = column.columnDef.header;
          const label = typeof headerDef === 'string' ? headerDef : column.id;

          return (
            <label
              key={column.id}
              className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setLocalVisibility(prev => ({ ...prev, [column.id]: e.target.checked }))}
                className="rounded-sm border-border accent-danger h-4 w-4 cursor-pointer"
              />
              <span className="text-[13px] text-foreground flex-1">{label}</span>
            </label>
          );
        })}
      </div>

      <div className="p-2.5 border-t border-border flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1 h-8 text-[12px]" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="destructive" size="sm" className="flex-1 h-8 text-[12px]" onClick={handleApply}>
          Terapkan
        </Button>
      </div>
    </div>
  );
}
