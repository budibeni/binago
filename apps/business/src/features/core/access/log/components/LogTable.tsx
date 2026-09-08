'use client';

import React from 'react';
import { User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Badge } from '@adatrack/ui';
import {
  useDataTable,
  DataTableHeader,
  DataTableBody,
  DataTableToolbar,
  DataTablePagination,
  DataTableFilterPanel,
  type DataTableColumnDef,
  type DataTableFilterConfig,
  type DataTablePaginationConfig,
  type ColumnVisibilityState,
  type SortingState,
} from '@adatrack/ui';
import type { CardLog } from '../types/log';

// ─── Column Factory ────────────────────────────────────────────────────────────

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
        let variant: 'default' | 'outline' | 'secondary' = 'secondary';
        switch (activity) {
          case 'ATTENDANCE':
            label = t.activity.attendance;
            variant = 'outline';
            break;
          case 'CHECKER':
            label = t.activity.checker;
            variant = 'secondary';
            break;
          case 'ENGINE_AUTH':
            label = t.activity.engineAuth;
            variant = 'default';
            break;
        }
        return <Badge variant={variant} className="font-medium whitespace-nowrap">{label}</Badge>;
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

// ─── LogTable Component ────────────────────────────────────────────────────────

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
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'timestamp', desc: true }]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const columns = React.useMemo(() => buildColumns(t), [t]);

  const processedData = React.useMemo(() => {
    const result = [...data];
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a, b) => {
        const valA = (a[id as keyof CardLog] ?? '') as string;
        const valB = (b[id as keyof CardLog] ?? '') as string;
        if (typeof valA === 'string' && typeof valB === 'string') {
          return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        return 0;
      });
    }
    return result.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [data, sorting, pageIndex, pageSize]);

  const paginationConfig: DataTablePaginationConfig = {
    pageIndex,
    pageSize,
    totalCount: data.length,
    pageSizeOptions: [10, 20, 50],
    onPageChange: setPageIndex,
    onPageSizeChange: (s) => { setPageSize(s); setPageIndex(0); },
  };

  const table = useDataTable<CardLog>({
    data: processedData,
    columns,
    sorting,
    onSortingChange: setSorting,
    mode: 'pagination',
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
    paginationConfig,
  });

  const activeFilterCount = Object.values(filterConfig.state)
    .flat()
    .filter(v => v && v !== 'ALL').length;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={t.searchPlaceholder}
        showColumnToggle
        showFilter
        isFilterOpen={isFilterOpen}
        onFilterOpenChange={onFilterOpenChange}
        activeFilterCount={activeFilterCount}
      />

      <div className={cn('flex items-stretch gap-4', isFilterOpen ? 'flex-col lg:flex-row' : '')}>
        <div className="flex-1 min-w-0 w-full">
          <div className="relative w-full overflow-x-auto rounded-lg border border-border bg-background shadow-sm max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                emptyTitle="Belum ada data log"
                emptyDescription="Aktivitas Card akan tampil di sini setelah digunakan."
                noResultTitle="Tidak ada hasil"
                noResultDescription="Coba ubah kata kunci pencarian atau filter."
              />
            </table>
          </div>
        </div>

        {isFilterOpen && (
          <div className="w-full lg:w-[280px] shrink-0 self-stretch">
            <DataTableFilterPanel config={filterConfig} className="h-full" />
          </div>
        )}
      </div>

      <DataTablePagination paginationConfig={paginationConfig} />
    </div>
  );
}
