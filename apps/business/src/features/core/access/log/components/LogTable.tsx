'use client';

import React from 'react';
import { cn } from '@adatrack/utils';
import { DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { CardLog } from '../types/log';

function buildColumns(t: any): DataTableColumnDef<CardLog>[] {
  return [
    {
      id: 'timestamp',
      header: t.columns.time,
      accessorKey: 'timestamp',
      enableSorting: true,
      size: 160,
      cell: ({ row }) => {
        const date = new Date(row.original.timestamp);
        return (
          <span suppressHydrationWarning className="text-[13px] text-foreground-muted font-mono">
            {date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            {' '}
            {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        );
      },
    },
    {
      id: 'card',
      header: t.columns.card,
      accessorFn: (row) => row.cardName,
      enableSorting: true,
      size: 180,
      cell: ({ row }) => (
        <span className="font-medium text-foreground whitespace-nowrap">{row.original.cardName}</span>
      ),
    },
    {
      id: 'cardUid',
      header: 'UID',
      accessorFn: (row) => row.cardUid,
      enableSorting: true,
      size: 170,
      cell: ({ row }) => (
        <span className="text-[13px] font-mono text-foreground-muted">{row.original.cardUid}</span>
      ),
    },
    {
      id: 'holder',
      header: t.columns.holder,
      accessorFn: (row) => row.holderName ?? '',
      enableSorting: true,
      size: 180,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <span className="text-[13px] text-foreground">
            {d.holderName ?? '-'}
          </span>
        );
      },
    },
    {
      id: 'holderType',
      header: t.columns.holder + ' Tipe',
      accessorFn: (row) => row.holderType ?? '',
      enableSorting: true,
      size: 120,
      cell: ({ row }) => {
        const d = row.original;
        if (!d.holderType) return <span className="text-[13px] text-foreground-muted/50">-</span>;
        return (
          <span className="text-[13px] text-info">
            {d.holderType === 'DRIVER' ? t.holder.driver : t.holder.personel}
          </span>
        );
      },
    },
    {
      id: 'activity',
      header: t.columns.activity,
      accessorKey: 'activityType',
      enableSorting: true,
      size: 160,
      cell: ({ row }) => {
        const activity = row.original.activityType;
        let label = '';
        switch (activity) {
          case 'ATTENDANCE': label = t.activity.attendance; break;
          case 'CHECKER': label = t.activity.checker; break;
          case 'ENGINE_AUTH': label = t.activity.engineAuth; break;
        }
        return <span className="text-[13px] text-foreground-muted">{label}</span>;
      },
    },
    {
      id: 'vehicle',
      header: t.columns.vehicle,
      accessorFn: (row) => row.vehiclePlateNumber ?? '',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const d = row.original;
        if (!d.vehicleId) return <span className="text-[13px] text-foreground-muted/50">-</span>;
        return <span className="text-[13px] text-foreground">{d.vehiclePlateNumber}</span>;
      },
    },
    {
      id: 'status',
      header: t.columns.status,
      accessorKey: 'status',
      enableSorting: true,
      size: 110,
      cell: ({ row }) => {
        const isSuccess = row.original.status === 'SUCCESS';
        return (
          <div className="flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', isSuccess ? 'bg-success' : 'bg-danger')} />
            <span className="text-[13px] text-foreground-muted">
              {isSuccess ? t.status.success : t.status.failed}
            </span>
          </div>
        );
      },
    },
    {
      id: 'message',
      header: 'Keterangan',
      accessorKey: 'message',
      enableSorting: false,
      size: 220,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground-muted block truncate max-w-[200px]" title={row.original.message || ''}>
          {row.original.message || '-'}
        </span>
      ),
    },
  ];
}

interface LogTableProps {
  data: CardLog[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  t: any;
  className?: string;
  dtLabels?: any;
  exportFilename?: string;
}

export function LogTable({
  data,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  t,
  className,
  dtLabels,
  exportFilename,
}: LogTableProps) {
  const columns = React.useMemo(() => buildColumns(t), [t]);

  return (
    <DataTable<CardLog>
      className={className}
      data={data}
      columns={columns}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      exportable
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={t.searchPlaceholder}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // Export
      exportFilename={exportFilename}
      labels={dtLabels}
      // Default Sort
      sorting={[{ id: 'timestamp', desc: true }]}
      // UI Slots
      emptyTitle="Belum ada data log"
      emptyDescription="Aktivitas Card akan tampil di sini setelah digunakan."
    />
  );
}
