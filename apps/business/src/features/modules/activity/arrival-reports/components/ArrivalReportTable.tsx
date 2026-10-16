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
  Building,
  Phone,
  Eye,
  User,
  ShieldCheck,
} from 'lucide-react';
import type {
  ArrivalReportRecord,
  DestinationType,
  ArrivalStatus,
} from '../types/arrivalReport';
import { getArrivalReportTranslation } from '../i18n';
import type { Locale } from '@adatrack/types';

interface ArrivalReportTableProps {
  data: ArrivalReportRecord[];
  onViewDetail: (record: ArrivalReportRecord) => void;
  onPreviewPhoto?: (src: string, title: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  destinationTypeFilter: string;
  onDestinationTypeFilterChange: (type: string) => void;
  availableTypes: string[];
  locale?: Locale;
}

export function ArrivalReportTable({
  data,
  onViewDetail,
  onPreviewPhoto,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  destinationTypeFilter,
  onDestinationTypeFilterChange,
  availableTypes,
  locale = 'id',
}: ArrivalReportTableProps) {
  const t = getArrivalReportTranslation(locale);

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

  const columns = useMemo<DataTableColumnDef<ArrivalReportRecord>[]>(() => {
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
        id: 'destination',
        header: t.table.colDestination,
        accessorFn: (row) => row.destinationName,
        enableSorting: true,
        size: 210,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                <Building className="w-3.5 h-3.5 text-emerald-600 flex-none" />
                <span className="truncate">{r.destinationName}</span>
              </div>
              <span className="text-[11px] text-muted-foreground block truncate mt-0.5">
                {r.destinationType}
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
        accessorFn: (row) => row.address,
        size: 210,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1 min-w-0" title={r.address}>
              <span className="text-xs text-foreground block truncate">
                {r.address}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate mt-0.5">
                {r.coordinates.lat.toFixed(4)}, {r.coordinates.lng.toFixed(4)}
              </span>
            </div>
          );
        },
      },
      {
        id: 'recipient',
        header: t.table.colRecipient,
        accessorFn: (row) => row.recipientName || '',
        size: 170,
        cell: ({ row }) => {
          const r = row.original;
          if (!r.recipientName) return <span className="text-muted-foreground text-xs">-</span>;
          return (
            <div className="py-1">
              <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                <User className="w-3 h-3 text-muted-foreground flex-none" />
                <span className="truncate">{r.recipientName}</span>
              </div>
              {r.recipientPhone && (
                <span className="text-[10px] text-muted-foreground block truncate mt-0.5">
                  {r.recipientPhone}
                </span>
              )}
            </div>
          );
        },
      },
      {
        id: 'photo',
        header: t.table.colPhoto,
        size: 100,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewPhoto?.(r.photo, `${r.destinationName} - ${r.driverName}`);
                }}
                className="group relative w-7 h-7 rounded border border-border overflow-hidden bg-black/60 flex items-center justify-center hover:scale-105 transition-transform"
                title="Lihat Foto Selfie Kedatangan"
              >
                <img
                  src={r.photo}
                  alt="Selfie"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-tl bg-emerald-500" />
              </button>
            </div>
          );
        },
      },
      {
        id: 'status',
        header: t.table.colStatus,
        accessorFn: (row) => row.status,
        enableSorting: true,
        size: 150,
        cell: ({ getValue }) => {
          const s = getValue() as ArrivalStatus;
          if (s === 'verified') {
            return (
              <Badge variant="success" dot className="text-[11px] font-medium">
                {t.status.verified}
              </Badge>
            );
          }
          if (s === 'pending_review') {
            return (
              <Badge variant="info" dot className="text-[11px] font-medium">
                {t.status.pendingReview}
              </Badge>
            );
          }
          return (
            <Badge variant="warning" dot className="text-[11px] font-medium">
              {t.status.flagged}
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
            { label: t.status.verified, value: 'verified' },
            { label: t.status.pendingReview, value: 'pending_review' },
          ],
        },
        {
          id: 'destinationType',
          label: t.filters.destinationTypeLabel,
          type: 'select',
          options: [
            { label: t.filters.allTypes, value: 'all' },
            ...availableTypes.map((type) => ({ label: type, value: type })),
          ],
        },
      ],
      state: {
        status: statusFilter,
        destinationType: destinationTypeFilter,
      },
      onStateChange: (newState) => {
        if (typeof newState.status === 'string') {
          onStatusFilterChange(newState.status);
        }
        if (typeof newState.destinationType === 'string') {
          onDestinationTypeFilterChange(newState.destinationType);
        }
      },
      onClearAll: () => {
        onStatusFilterChange('all');
        onDestinationTypeFilterChange('all');
      },
    };
  }, [
    t,
    statusFilter,
    destinationTypeFilter,
    availableTypes,
    onStatusFilterChange,
    onDestinationTypeFilterChange,
  ]);

  return (
    <DataTable<ArrivalReportRecord>
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
