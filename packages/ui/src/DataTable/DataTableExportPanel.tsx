'use client';

import React from 'react';
import { X, FileText, FileSpreadsheet, FileDown } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { DataTableInstance, RowData } from './types';
import type { DataTableExportConfig } from './types';

function toCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportToCsv<TData extends RowData>(
  table: DataTableInstance<TData>,
  filename: string,
): void {
  const visibleColumns = table.getVisibleFlatColumns();
  const rows = table.getRowModel().rows;

  const headers = visibleColumns.map((col) => {
    const headerDef = col.columnDef.header;
    return toCsvCell(typeof headerDef === 'string' ? headerDef : col.id);
  });

  const dataRows = rows.map((row) =>
    visibleColumns.map((col) => toCsvCell(row.getValue(col.id))).join(','),
  );

  const csvContent = [headers.join(','), ...dataRows].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface DataTableExportPanelProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  exportConfig?: DataTableExportConfig;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function DataTableExportPanel<TData extends RowData = RowData>({
  table,
  exportConfig,
  isOpen,
  onClose,
  className,
}: DataTableExportPanelProps<TData>) {
  if (!isOpen) return null;
  if (exportConfig?.enabled === false) return null;

  const filename = exportConfig?.filename ?? 'export';

  const handleExportCSV = () => {
    exportToCsv(table, filename);
    onClose();
  };

  const handleExportExcel = () => {
    // TODO: Implement real Excel export
    exportToCsv(table, `${filename}_excel`);
    onClose();
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    onClose();
  };

  return (
    <div className={cn('flex flex-col bg-background border border-border rounded-lg w-[180px] shrink-0 overflow-hidden', className)}>
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <span className="text-[13px] font-semibold text-foreground">Export Data</span>
        <button type="button" onClick={onClose} className="text-foreground-muted hover:text-foreground transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="py-2 px-1">
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-2.5 w-full rounded px-2 py-2 text-[13px] text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
        >
          <FileText className="h-4 w-4 text-foreground-muted shrink-0" />
          Export CSV
        </button>
        <button
          type="button"
          onClick={handleExportExcel}
          className="flex items-center gap-2.5 w-full rounded px-2 py-2 text-[13px] text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
        >
          <FileSpreadsheet className="h-4 w-4 text-foreground-muted shrink-0" />
          Export Excel
        </button>
        <button
          type="button"
          onClick={handleExportPDF}
          className="flex items-center gap-2.5 w-full rounded px-2 py-2 text-[13px] text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
        >
          <FileDown className="h-4 w-4 text-foreground-muted shrink-0" />
          Export PDF
        </button>
      </div>
    </div>
  );
}
