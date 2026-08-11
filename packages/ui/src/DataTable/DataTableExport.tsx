'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../Button';
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

  const handleExport = () => {
    exportToCsv(table, filename);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className={className}
      aria-label="Export CSV"
    >
      <Download className="h-3.5 w-3.5" />
      <span>Export</span>
    </Button>
  );
}
