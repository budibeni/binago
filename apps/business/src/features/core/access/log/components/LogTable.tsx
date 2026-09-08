'use client';

import React from 'react';
import { User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { CardLog } from '../types/log';

function buildColumns(t: any): DataTableColumnDef<CardLog>[] {
  return [
    {
      id: 'timestamp',
      header: t.columns.time,
      accessorKey: 'timestamp',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const date = new Date(row.original.timestamp);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">
              {date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <span className="text-xs text-muted-foreground">
              {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        );
      },
    },
    {
      id: 'card',
      header: t.columns.card,
      accessorFn: (row) => row.cardName,
      enableSorting: true,
      size: 190,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{d.cardName}</span>
            <span className="text-xs text-muted-foreground font-mono">{d.cardUid}</span>
          </div>
        );
      },
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
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted shrink-0">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {d.holderName ?? t.holder.unknown}
              </span>
              {d.holderType && (
                <span className="text-xs text-muted-foreground">
                  {d.holderType === 'DRIVER' ? t.holder.driver : t.holder.personel}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: 'activity',
      header: t.columns.activity,
      accessorKey: 'activityType',
      enableSorting: true,
      size: 170,
      cell: ({ row }) => {
        const activity = row.original.activityType;
        let label = '';
        switch (activity) {
          case 'ATTENDANCE':
            label = t.activity.attendance;
            break;
          case 'CHECKER':
            label = t.activity.checker;
            break;
          case 'ENGINE_AUTH':
            label = t.activity.engineAuth;
            break;
        }
        return (
          <span className="text-[13px] font-medium text-foreground-muted">
            {label}
          </span>
        );
      },
    },
    {
      id: 'vehicle',
      header: t.columns.vehicle,
      accessorFn: (row) => row.vehiclePlateNumber ?? '',
      enableSorting: true,
      size: 170,
      cell: ({ row }) => {
        const d = row.original;
        if (!d.vehicleId) return <span className="text-muted-foreground text-sm">{t.none}</span>;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">{d.vehiclePlateNumber}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{d.vehicleName}</span>
          </div>
        );
      },
    },
    {
      id: 'status',
      header: t.columns.status,
      accessorKey: 'status',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const d = row.original;
        const isSuccess = d.status === 'SUCCESS';
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              {isSuccess ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              )}
              <span className={cn('text-sm font-medium', isSuccess ? 'text-emerald-700 dark:text-emerald-400' : 'text-destructive')}>
                {isSuccess ? t.status.success : t.status.failed}
              </span>
            </div>
            {d.message && (
              <span className="text-xs text-muted-foreground leading-snug line-clamp-2" title={d.message}>
                {d.message}
              </span>
            )}
          </div>
        );
      },
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
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={t.searchPlaceholder}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // Default Sort
      sorting={[{ id: 'timestamp', desc: true }]}
      // UI Slots
      emptyTitle="Belum ada data log"
      emptyDescription="Aktivitas Card akan tampil di sini setelah digunakan."
    />
  );
}
