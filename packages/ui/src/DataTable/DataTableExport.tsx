'use client';

import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../Dropdown';
import type { DataTableInstance, RowData } from './types';
import type { DataTableExportConfig } from './types';

export interface DataTableExportProps<TData extends RowData = RowData> {
  table: DataTableInstance<TData>;
  exportConfig?: DataTableExportConfig;
  className?: string;
}

/**
 * Konversi nilai cell ke string yang aman untuk CSV.
 * Nilai yang mengandung koma, newline, atau kutip akan dibungkus tanda kutip.
 */
function toCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Ambil nilai cell dari row menggunakan column getValue.
 * Menggunakan visible columns agar kolom tersembunyi tidak ikut diexport.
 */
function exportToCsv<TData extends RowData>(
  table: DataTableInstance<TData>,
  filename: string,
): void {
  const visibleColumns = table.getVisibleFlatColumns();
  const rows = table.getRowModel().rows;

  // Header row: gunakan header string jika tersedia, fallback ke column id
  const headers = visibleColumns.map((col) => {
    const headerDef = col.columnDef.header;
    return toCsvCell(typeof headerDef === 'string' ? headerDef : col.id);
  });

  // Data rows
  const dataRows = rows.map((row) =>
    visibleColumns.map((col) => toCsvCell(row.getValue(col.id))).join(','),
  );

  const csvContent = [headers.join(','), ...dataRows].join('\n');

  // Buat dan trigger download
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

export function DataTableExport<TData extends RowData = RowData>({
  table,
  exportConfig,
  className,
}: DataTableExportProps<TData>) {
  if (exportConfig?.enabled === false) return null;

  const filename = exportConfig?.filename ?? 'export';

  const handleExportCSV = () => {
    exportToCsv(table, filename);
  };

  const handleExportExcel = () => {
    // TODO: Implement real Excel export (needs backend or XLSX library)
    // For now, fallback to CSV to prevent broken functionality
    exportToCsv(table, `${filename}_excel`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('h-9 gap-2 text-[13px] font-medium', className)}
          aria-label="Export Data"
        >
          <Download className="h-4 w-4 text-muted-foreground" />
          <span className="hidden sm:inline-block">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider">
          Export Data
        </div>
        <div className="my-1 border-t border-border" />
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 text-[13px] cursor-pointer p-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel} className="gap-2 text-[13px] cursor-pointer p-2">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          Export Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
