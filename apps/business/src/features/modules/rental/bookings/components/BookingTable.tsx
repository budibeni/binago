'use client';

import React from 'react';
import { MapPin, Plus, MessageCircle, MoreVertical, Eye, EyeOff, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import {
  Button,
  Badge,
  DataTable,
  PhoneLink,
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { Booking, BookingStatus } from '../types/booking';
import { cn, formatCurrency } from '@adatrack/utils';

interface BookingTableProps {
  data: Booking[];
  labels: Record<string, any>;
  onView: (r: Booking) => void;
  onEdit: (r: Booking) => void;
  onDelete: (r: Booking) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  onOpenMap: (vehicleIds: string[]) => void;
  filterConfig?: DataTableFilterConfig;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  showStats?: boolean;
  onToggleStats?: () => void;
  className?: string;
  dtLabels?: any;
}

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case 'BOOKED': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'CONTRACTED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'ACTIVE': return 'bg-success/10 text-success';
    case 'COMPLETED': return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    case 'CANCELLED': return 'bg-danger/10 text-danger';
    default: return 'bg-neutral-100 text-neutral-600';
  }
};

const getStatusLabel = (status: BookingStatus, labels: Record<string, any>) => {
  switch (status) {
    case 'BOOKED': return labels.statusBooked || 'Dipesan';
    case 'CONTRACTED': return labels.statusContracted || 'Dikontrak';
    case 'ACTIVE': return labels.statusActive || 'Berjalan';
    case 'COMPLETED': return labels.statusCompleted || 'Selesai';
    case 'CANCELLED': return labels.statusCancelled || 'Dibatalkan';
    default: return status;
  }
};


const formatShortDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

function buildColumns(
  labels: Record<string, any>,
  onView: (r: Booking) => void,
  onEdit: (r: Booking) => void,
  onDelete: (r: Booking) => void,
  onOpenMap: (vehicleIds: string[]) => void
): DataTableColumnDef<Booking>[] {
  return [
    // --- Booking Info ---
    {
      id: 'bookingGroup',
      accessorFn: (row) => row.bookingNumber,
      header: labels.colBooking || 'Booking',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <button
              onClick={(e) => { e.stopPropagation(); onView(b); }}
              className="text-[13px] font-normal text-foreground truncate hover:text-primary hover:underline transition-colors text-left"
              title={b.bookingNumber}
            >
              {b.bookingNumber}
            </button>
            <span className="text-[11px] text-foreground truncate">
              {formatShortDate(b.createdAt)}
            </span>
          </div>
        );
      },
    },
    // --- Tipe & Periode ---
    {
      id: 'typeAndPeriodGroup',
      accessorKey: 'rateType',
      header: labels.colTypeAndPeriod || 'Tipe & Periode',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const b = row.original;
        const rateTypeLabel = `${b.items?.length || 0} Unit Kendaraan`;
        const rentalTypeLabel = b.rentalType === 'SELF_DRIVE' ? (labels.selfDrive || 'Lepas Kunci') : (labels.withDriver || 'Dengan Pengemudi');

        let periodColorClass = 'text-muted-foreground';
        if (b.status === 'BOOKED') periodColorClass = 'text-amber-600 dark:text-amber-500 font-medium';
        else if (b.status === 'CONTRACTED') periodColorClass = 'text-blue-600 dark:text-blue-500 font-medium';

        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground">
              {rateTypeLabel} • {rentalTypeLabel}
            </span>
            <div className={`flex items-center gap-1.5 mt-0.5 text-[11px] ${periodColorClass}`} title={`${formatShortDate(b.startDate)} - ${formatShortDate(b.endDate)}`}>
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">{formatShortDate(b.startDate)} - {formatShortDate(b.endDate)}</span>
            </div>
          </div>
        );
      }
    },
    // --- Pelanggan ---
    {
      id: 'customerGroup',
      accessorFn: (row) => row.customer?.name || '-',
      header: labels.colCustomer || 'Pelanggan',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const c = row.original.customer;
        if (!c) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground truncate" title={c.name}>{c.name}</span>
            <span className="text-[11px] text-muted-foreground truncate">
              {c.code || '-'} • {c.type === 'COMPANY' ? (labels.typeCompany || 'Perusahaan') : (labels.typeIndividual || 'Individu')}
            </span>
          </div>
        );
      }
    },
    // --- Kontak ---
    {
      id: 'contact',
      accessorFn: (row) => row.customer?.phone || '-',
      header: labels.colContact || 'Kontak',
      enableSorting: false,
      size: 160,
      cell: ({ row }) => {
        const c = row.original.customer;
        if (!c) return <span className="text-muted-foreground">-</span>;

        const location = [c.city, c.province].filter(Boolean).join(' - ');

        return (
          <div className="flex flex-col gap-0.5 py-1">
            <div className="-ml-1">
              <PhoneLink phone={c.phone || ''} className="text-[13px] font-normal text-foreground ml-1 truncate" />
            </div>
            <span className="text-[11px] text-muted-foreground truncate" title={location}>
              {location || '-'}
            </span>
          </div>
        );
      }
    },
    // --- Kendaraan ---
    {
      id: 'vehicleGroup',
      accessorFn: (row) => {
        const items = row.items || [];
        return items.map(i => i.vehicle?.coreVehicle?.plateNumber).filter(Boolean).join(', ');
      },
      header: labels.colVehicle || 'Kendaraan',
      enableSorting: true,
      size: 220,
      cell: ({ row }) => {
        const b = row.original;
        const items = b.items;
        if (!items || items.length === 0) return <span className="text-muted-foreground">-</span>;

        const plates = items.map(i => i.vehicle?.coreVehicle?.plateNumber).filter(Boolean);
        if (plates.length === 0) return <span className="text-muted-foreground">-</span>;

        const isTrackable = b.status !== 'COMPLETED' && b.status !== 'CANCELLED';

        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground">
              {items.length} {labels.vehicles || 'Kendaraan'}
            </span>
            {isTrackable ? (
              <div 
                className="flex items-center gap-1 mt-0.5 text-[11px] text-muted-foreground hover:text-danger cursor-pointer transition-colors"
                title={plates.join(', ')}
                onClick={(e) => {
                  e.stopPropagation(); // prevent row click
                  const ids = items.map(i => i.vehicleId).filter(Boolean);
                  if (ids.length > 0) onOpenMap(ids as string[]);
                }}
              >
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate hover:underline">
                  {plates.join(', ')}
                </span>
              </div>
            ) : (
              <div className="mt-0.5 text-[11px] text-muted-foreground truncate" title={plates.join(', ')}>
                {plates.join(', ')}
              </div>
            )}
          </div>
        );
      }
    },
    // --- Total Biaya & Sisa ---
    {
      id: 'total',
      accessorFn: (row) => formatCurrency(row.totalAmount),
      header: labels.colTotalCost || 'Total Biaya',
      enableSorting: true,
      size: 140,
      meta: { align: 'right' },
      cell: ({ row }) => {
        const b = row.original;
        const total = formatCurrency(b.totalAmount);
        const remaining = b.remainingAmount || 0;

        return (
          <div className="flex flex-col gap-0.5 py-1 items-end">
            <span className="text-[13px] font-normal text-foreground">{total}</span>
            {remaining > 0 ? (
              <span className="text-[11px] text-danger">{labels.remaining || 'Sisa'}: {formatCurrency(remaining)}</span>
            ) : (
              <span className="text-[11px] text-muted-foreground">{labels.paid || 'Lunas'}</span>
            )}
          </div>
        );
      }
    },
    // --- Status Booking ---
    {
      id: 'status',
      accessorFn: (row) => getStatusLabel(row.status, labels),
      header: labels.colStatus || 'Status',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const s = row.original.status;
        const label = getStatusLabel(s, labels);

        let dotClass = 'bg-neutral-400 dark:bg-neutral-600';
        if (s === 'BOOKED') dotClass = 'bg-warning';
        else if (s === 'CONTRACTED') dotClass = 'bg-blue-500';
        else if (s === 'ACTIVE') dotClass = 'bg-success';
        else if (s === 'COMPLETED') dotClass = 'bg-neutral-500';
        else if (s === 'CANCELLED') dotClass = 'bg-danger';

        return (
          <div className="flex items-center gap-1.5 text-inherit whitespace-nowrap">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotClass)} />
            <span className="truncate text-[13px] font-normal">{label}</span>
          </div>
        );
      },
    },

    // --- Catatan ---
    {
      id: 'notes',
      accessorFn: (row) => row.notes,
      header: labels.colNotes || 'Catatan',
      enableSorting: false,
      size: 200,
      cell: ({ row }) => {
        const notes = row.original.notes;
        if (!notes) return <span className="text-muted-foreground text-[13px]">-</span>;
        
        return (
          <div className="flex flex-col py-1">
            <span className="text-[13px] font-normal text-foreground line-clamp-2" title={notes}>
              {notes}
            </span>
          </div>
        );
      }
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {};

export function BookingTable({
  data,
  labels,
  onView,
  onEdit,
  onDelete,
  selectedIds = [],
  onSelectionChange,
  searchValue,
  onSearchChange,
  onAdd,
  onOpenMap,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  showStats,
  onToggleStats,
  className,
  dtLabels
}: BookingTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onView, onEdit, onDelete, onOpenMap),
    [labels, onView, onEdit, onDelete, onOpenMap],
  );

  return (
    <DataTable<Booking>
      data={data}
      columns={columns}
      onRowActionClick={onView}
      getRowId={(row) => row.id}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      exportable
      columnVisibilityState={DEFAULT_COLUMN_VISIBILITY}
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={labels.searchPlaceholder || "Cari booking..."}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // UI Slots
      className={className}
      exportFilename="Data_Booking_Rental"
      labels={dtLabels}
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDesc}
      toolbarActions={
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels.addBooking || 'Tambah'}</span>
            </Button>
          )}
        </div>
      }
    />
  );
}
