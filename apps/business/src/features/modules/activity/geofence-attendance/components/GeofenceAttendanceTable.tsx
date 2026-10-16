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
  MapPinned,
  Phone,
  Eye,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import type { GeofenceAttendanceRecord } from '../types/geofenceAttendance';
import { getGeofenceAttendanceTranslation } from '../i18n';
import type { Locale } from '@adatrack/types';

interface GeofenceAttendanceTableProps {
  data: GeofenceAttendanceRecord[];
  onViewDetail: (record: GeofenceAttendanceRecord) => void;
  onPreviewPhoto?: (src: string, title: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  geofenceFilter: string;
  onGeofenceFilterChange: (geofence: string) => void;
  availableGeofences: string[];
  locale?: Locale;
}

export function GeofenceAttendanceTable({
  data,
  onViewDetail,
  onPreviewPhoto,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  geofenceFilter,
  onGeofenceFilterChange,
  availableGeofences,
  locale = 'id',
}: GeofenceAttendanceTableProps) {
  const t = getGeofenceAttendanceTranslation(locale);

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${timeStr} WIB • ${dateStr}`;
  };

  const columns = useMemo<DataTableColumnDef<GeofenceAttendanceRecord>[]>(() => {
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
        id: 'geofence',
        header: t.table.colGeofence,
        accessorFn: (row) => row.geofenceName,
        enableSorting: true,
        size: 200,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                <MapPinned className="w-3.5 h-3.5 text-amber-500 flex-none" />
                <span className="truncate">{r.geofenceName}</span>
              </div>
              <span className="text-[11px] text-muted-foreground block truncate mt-0.5">
                {r.geofenceCategory}
              </span>
            </div>
          );
        },
      },
      {
        id: 'vehicle',
        header: t.table.colVehicle,
        accessorFn: (row) => row.vehiclePlate,
        enableSorting: true,
        size: 160,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1">
              <span className="font-mono font-bold text-[11px] text-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border inline-block">
                {r.vehiclePlate}
              </span>
              <span className="text-[11px] text-muted-foreground block truncate mt-0.5">
                {r.vehicleModel || '-'}
              </span>
            </div>
          );
        },
      },
      {
        id: 'time',
        header: t.table.colTime,
        accessorFn: (row) => row.timestamp,
        enableSorting: true,
        size: 180,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-foreground py-1">
            <Clock className="w-3 h-3 text-muted-foreground flex-none" />
            <span>{formatDateTime(row.original.timestamp)}</span>
          </div>
        ),
      },
      {
        id: 'location',
        header: t.table.colLocation,
        accessorFn: (row) => row.locationAddress,
        size: 210,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1 min-w-0" title={r.locationAddress}>
              <span className="text-xs text-foreground block truncate">
                {r.locationAddress}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate mt-0.5">
                {r.coordinates.lat.toFixed(4)}, {r.coordinates.lng.toFixed(4)}
              </span>
            </div>
          );
        },
      },
      {
        id: 'distance',
        header: t.table.colDistance,
        accessorFn: (row) => row.distanceMeters,
        enableSorting: true,
        size: 130,
        cell: ({ row }) => {
          const isInside = row.original.isWithinGeofence;
          return (
            <div className="flex items-center gap-1 text-xs font-semibold py-1">
              {isInside ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-none" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-none" />
              )}
              <span className={isInside ? 'text-emerald-600' : 'text-amber-600'}>
                {row.original.distanceMeters} m
              </span>
            </div>
          );
        },
      },
      {
        id: 'photo',
        header: t.table.colPhoto,
        size: 110,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewPhoto?.(r.photo, `${r.geofenceName} - ${r.driverName}`);
                }}
                className="group relative w-7 h-7 rounded border border-border overflow-hidden bg-black/60 flex items-center justify-center hover:scale-105 transition-transform"
                title="Lihat Foto Selfie Absen Geofence"
              >
                <img
                  src={r.photo}
                  alt="Selfie"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-tl bg-amber-500" />
              </button>
            </div>
          );
        },
      },
      {
        id: 'status',
        header: t.table.colStatus,
        accessorFn: (row) => (row.isWithinGeofence ? 'inside' : 'warning'),
        enableSorting: true,
        size: 170,
        cell: ({ row }) => {
          const isInside = row.original.isWithinGeofence;
          return (
            <Badge
              variant={isInside ? 'success' : 'warning'}
              dot
              className="text-[11px] font-medium"
            >
              {isInside ? t.status.inside : t.status.warning}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: t.table.colActions,
        size: 100,
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
            { label: t.status.inside, value: 'inside' },
            { label: t.status.warning, value: 'warning' },
          ],
        },
        {
          id: 'geofence',
          label: t.filters.geofenceLabel,
          type: 'select',
          options: [
            { label: t.filters.allGeofences, value: 'all' },
            ...availableGeofences.map((name) => ({ label: name, value: name })),
          ],
        },
      ],
      state: {
        status: statusFilter,
        geofence: geofenceFilter,
      },
      onStateChange: (newState) => {
        if (typeof newState.status === 'string') {
          onStatusFilterChange(newState.status);
        }
        if (typeof newState.geofence === 'string') {
          onGeofenceFilterChange(newState.geofence);
        }
      },
      onClearAll: () => {
        onStatusFilterChange('all');
        onGeofenceFilterChange('all');
      },
    };
  }, [
    t,
    statusFilter,
    geofenceFilter,
    availableGeofences,
    onStatusFilterChange,
    onGeofenceFilterChange,
  ]);

  return (
    <DataTable<GeofenceAttendanceRecord>
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
      // Empty
      emptyTitle={t.table.emptyTitle}
      emptyDescription={t.table.emptyDescription}
    />
  );
}
