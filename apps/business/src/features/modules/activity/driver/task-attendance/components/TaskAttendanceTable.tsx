'use client';

import React, { useMemo } from 'react';
import {
  DataTable,
  Badge,
  Button,
} from '@adatrack/ui';
import type {
  DataTableColumnDef,
  DataTableFilterConfig,
} from '@adatrack/ui';
import {
  Clock,
  MapPin,
  Truck,
  Phone,
  Eye,
  CheckCircle2,
  Hourglass,
  Maximize2,
  Calendar,
} from 'lucide-react';
import type { TaskAttendanceRecord } from '../types/taskAttendance';
import { getTaskAttendanceTranslation } from '../i18n';
import type { Locale } from '@adatrack/types';

interface TaskAttendanceTableProps {
  data: TaskAttendanceRecord[];
  onViewDetail: (record: TaskAttendanceRecord) => void;
  onPreviewPhoto?: (src: string, title: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  locale?: Locale;
}

export function TaskAttendanceTable({
  data,
  onViewDetail,
  onPreviewPhoto,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  locale = 'id',
}: TaskAttendanceTableProps) {
  const t = getTaskAttendanceTranslation(locale);

  // Helper formatters
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return (
      d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    );
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
  };

  // Build columns
  const columns = useMemo<DataTableColumnDef<TaskAttendanceRecord>[]>(() => {
    return [
      {
        id: 'driver',
        header: t.table.colDriver,
        accessorFn: (row) => row.driverName,
        enableSorting: true,
        size: 190,
        meta: { pin: 'left' },
        cell: ({ row }) => {
          const r = row.original;
          const initials = r.driverName
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('');

          return (
            <div className="flex items-center gap-2.5 py-1">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-none">
                {initials}
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-xs text-foreground block truncate hover:text-primary transition-colors">
                  {r.driverName}
                </span>
                <span className="text-[11px] text-muted-foreground block truncate flex items-center gap-1">
                  <Phone className="w-2.5 h-2.5 flex-none" />
                  {r.driverPhone}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: 'vehicle',
        header: t.table.colVehicle,
        accessorFn: (row) => row.vehiclePlate,
        enableSorting: true,
        size: 170,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1">
              <span className="font-mono font-bold text-[11px] text-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border inline-block">
                {r.vehiclePlate}
              </span>
              <span className="text-[11px] text-muted-foreground block truncate mt-0.5">
                {r.vehicleModel}
              </span>
            </div>
          );
        },
      },
      {
        id: 'date',
        header: t.table.colDate,
        accessorFn: (row) => row.date,
        enableSorting: true,
        size: 110,
        cell: ({ getValue }) => (
          <span className="text-xs text-foreground font-medium">
            {formatDate(getValue() as string)}
          </span>
        ),
      },
      {
        id: 'startTime',
        header: t.table.colStart,
        accessorFn: (row) => row.startTime,
        enableSorting: true,
        size: 210,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-none" />
                <span>{formatTime(r.startTime)}</span>
                <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.2 rounded">
                  {r.startLocation.distanceMeters}m
                </span>
              </div>
              <span
                className="text-[11px] text-muted-foreground block truncate mt-0.5"
                title={r.startLocation.address}
              >
                {r.startLocation.address}
              </span>
            </div>
          );
        },
      },
      {
        id: 'endTime',
        header: t.table.colEnd,
        accessorFn: (row) => row.endTime || '',
        enableSorting: true,
        size: 210,
        cell: ({ row }) => {
          const r = row.original;
          if (r.status === 'completed' && r.endTime && r.endLocation) {
            return (
              <div className="py-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-none" />
                  <span>{formatTime(r.endTime)}</span>
                  <span className="text-[10px] font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.2 rounded">
                    {r.endLocation.distanceMeters}m
                  </span>
                </div>
                <span
                  className="text-[11px] text-muted-foreground block truncate mt-0.5"
                  title={r.endLocation.address}
                >
                  {r.endLocation.address}
                </span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full w-fit">
              <Hourglass className="w-3 h-3 animate-spin flex-none" />
              <span>Sedang Berjalan</span>
            </div>
          );
        },
      },
      {
        id: 'duration',
        header: t.table.colDuration,
        accessorFn: (row) => row.durationMinutes || 0,
        enableSorting: true,
        size: 110,
        cell: ({ row }) => {
          const r = row.original;
          if (r.status === 'completed' && r.durationMinutes) {
            return (
              <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground flex-none" />
                {formatDuration(r.durationMinutes)}
              </span>
            );
          }
          return (
            <span className="text-[11px] text-blue-600 font-medium">Aktif</span>
          );
        },
      },
      {
        id: 'photos',
        header: t.table.colPhoto,
        size: 120,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex items-center gap-1.5 py-1">
              {/* Mulai Photo */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewPhoto?.(r.startPhoto, `Mulai Tugas - ${r.driverName}`);
                }}
                className="group relative w-7 h-7 rounded border border-border overflow-hidden bg-black/60 flex items-center justify-center hover:scale-105 transition-transform"
                title="Lihat Foto Mulai Tugas"
              >
                <img
                  src={r.startPhoto}
                  alt="Mulai"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-tl bg-blue-500" />
              </button>

              {/* Selesai Photo */}
              {r.status === 'completed' && r.endPhoto ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewPhoto?.(r.endPhoto!, `Selesai Tugas - ${r.driverName}`);
                  }}
                  className="group relative w-7 h-7 rounded border border-border overflow-hidden bg-black/60 flex items-center justify-center hover:scale-105 transition-transform"
                  title="Lihat Foto Selesai Tugas"
                >
                  <img
                    src={r.endPhoto}
                    alt="Selesai"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-tl bg-green-500" />
                </button>
              ) : (
                <div
                  className="w-7 h-7 rounded border border-dashed border-border bg-muted/30 flex items-center justify-center text-[9px] text-muted-foreground"
                  title="Belum ada foto selesai"
                >
                  -
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: 'status',
        header: t.table.colStatus,
        accessorFn: (row) => row.status,
        enableSorting: true,
        size: 130,
        cell: ({ getValue }) => {
          const s = getValue() as string;
          if (s === 'completed') {
            return (
              <Badge variant="success" dot className="text-[11px] font-medium">
                {t.status.completed}
              </Badge>
            );
          }
          return (
            <Badge variant="info" dot className="text-[11px] font-medium animate-pulse">
              {t.status.inProgress}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: t.table.colActions,
        size: 110,
        meta: { pin: 'right' },
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(row.original);
            }}
            className="h-7 px-2.5 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Detail</span>
          </Button>
        ),
      },
    ];
  }, [t, onViewDetail, onPreviewPhoto]);

  // Filter config
  const filterConfig: DataTableFilterConfig = useMemo(() => {
    return {
      fields: [
        {
          id: 'status',
          label: t.filters.statusLabel,
          type: 'select',
          options: [
            { label: t.filters.allStatus, value: 'all' },
            { label: t.status.completed, value: 'completed' },
            { label: t.status.inProgress, value: 'in_progress' },
          ],
        },
      ],
      state: { status: statusFilter },
      onStateChange: (newState) => {
        if (typeof newState.status === 'string') {
          onStatusFilterChange(newState.status);
        }
      },
      onClearAll: () => onStatusFilterChange('all'),
    };
  }, [t, statusFilter, onStatusFilterChange]);

  return (
    <DataTable<TaskAttendanceRecord>
      data={data}
      columns={columns}
      onRowActionClick={onViewDetail}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      exportable
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={t.table.searchPlaceholder}
      // Filters
      filterConfig={filterConfig}
      // Export
      exportFilename={t.table.exportFilename}
      // Empty slot
      emptyTitle={t.table.emptyTitle}
      emptyDescription={t.table.emptyDescription}
    />
  );
}
