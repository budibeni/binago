'use client';

import React from 'react';
import { MapPin, Plus, MessageCircle, MoreVertical, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { 
  Button, 
  Badge, 
  DataTable, 
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { Booking, BookingStatus } from '../types/booking';

interface BookingListProps {
  data: Booking[];
  labels: Record<string, any>;
  onView: (r: Booking) => void;
  onEdit: (r: Booking) => void;
  onDelete: (r: Booking) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  onOpenMap: (vehicleId: string) => void;
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
    case 'PENDING':   return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'CONFIRMED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'ACTIVE':    return 'bg-success/10 text-success';
    case 'COMPLETED': return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    case 'CANCELLED': return 'bg-danger/10 text-danger';
    default:          return 'bg-neutral-100 text-neutral-600';
  }
};

const getStatusLabel = (status: BookingStatus, labels: Record<string, any>) => {
  switch (status) {
    case 'PENDING':   return labels.statusPending;
    case 'CONFIRMED': return labels.statusConfirmed;
    case 'ACTIVE':    return labels.statusActive;
    case 'COMPLETED': return labels.statusCompleted;
    case 'CANCELLED': return labels.statusCancelled;
    default: return status;
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const formatShortDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

function buildColumns(
  labels: Record<string, any>,
  onView: (r: Booking) => void,
  onEdit: (r: Booking) => void,
  onDelete: (r: Booking) => void,
  onOpenMap: (vehicleId: string) => void
): DataTableColumnDef<Booking>[] {
  return [
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => {
        const p = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-full"
            onClick={() => onView(p)}
            title="Detail"
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
    // --- Nomor Booking ---
    {
      id: 'no',
      accessorFn: (row) => row.bookingNumber,
      header: labels.colNo,
      enableSorting: true,
      size: 160,
      meta: { fixedWidth: true },
      cell: ({ row }) => (
        <span 
          onClick={() => onView(row.original)}
          className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors block truncate"
          title={row.original.bookingNumber}
        >
          {row.original.bookingNumber}
        </span>
      ),
    },
    // --- Pelanggan ---
    {
      id: 'customer',
      accessorFn: (row) => row.customer?.name || '-',
      header: labels.colCustomer,
      enableSorting: true,
      size: 200,
      meta: { fixedWidth: true },
      cell: ({ row }) => (
        <span className="block truncate" title={row.original.customer?.name || '-'}>
          {row.original.customer?.name || '-'}
        </span>
      ),
    },
    // --- Kendaraan (diperluas) ---
    {
      id: 'vehicle',
      accessorFn: (row) => {
        const count = row.items?.length || 0;
        if (count === 0) return '-';
        if (count === 1) {
          const cv = row.items[0].vehicle?.coreVehicle;
          if (!cv) return '1 Kendaraan';
          return `${cv.plateNumber} - ${cv.brand} ${cv.vehicleName}`;
        }
        return `${count} Kendaraan`;
      },
      header: labels.colVehicle,
      enableSorting: true,
      size: 220,
    },
    // --- Periode Sewa ---
    {
      id: 'rentalDate',
      accessorFn: (row) => `${formatShortDate(row.startDate)} s/d ${formatShortDate(row.endDate)}`,
      header: labels.colRentalDate,
      enableSorting: true,
      size: 180,
    },
    // --- Total ---
    {
      id: 'total',
      accessorFn: (row) => formatCurrency(row.totalAmount),
      header: labels.colTotal,
      enableSorting: true,
      size: 140,
    },
    // --- Biaya Pengemudi ---
    {
      id: 'driverFee',
      accessorFn: (row) => formatCurrency(row.driverFee || 0),
      header: 'Biaya Pengemudi',
      enableSorting: true,
      size: 150,
    },
    // --- Deposit ---
    {
      id: 'deposit',
      accessorFn: (row) => formatCurrency(row.deposit || 0),
      header: 'Deposit / DP',
      enableSorting: true,
      size: 140,
    },
    // --- Sisa Tagihan ---
    {
      id: 'remainingAmount',
      accessorFn: (row) => formatCurrency(row.remainingAmount || 0),
      header: 'Sisa Tagihan',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const val = row.original.remainingAmount || 0;
        return (
          <span className={val > 0 ? "font-semibold text-danger" : "font-medium text-muted-foreground"}>
            {formatCurrency(val)}
          </span>
        );
      }
    },
    // --- Dasar Tarif ---
    {
      id: 'rateType',
      accessorKey: 'rateType',
      header: 'Dasar Tarif',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => {
        const r = row.original.rateType;
        return r === 'DAILY' ? 'Harian' : r === 'WEEKLY' ? 'Mingguan' : 'Bulanan';
      }
    },
    // --- Tipe Rental ---
    {
      id: 'rentalType',
      accessorKey: 'rentalType',
      header: labels.colRentalType || 'Tipe Rental',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => row.original.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Pengemudi',
    },
    // --- Pembayaran ---
    {
      id: 'paymentMethod',
      accessorKey: 'paymentMethod',
      header: labels.colPaymentMethod || 'Pembayaran',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const p = row.original.paymentMethod;
        return p === 'TRANSFER' ? 'Transfer Bank' : p === 'CASH' ? 'Tunai' : p === 'CARD' ? 'Kartu Kredit' : '-';
      }
    },
    // --- Lokasi Ambil ---
    {
      id: 'pickupLocation',
      accessorKey: 'pickupLocation',
      header: labels.colPickupLocation || 'Lokasi Ambil',
      enableSorting: true,
      size: 180,
      cell: ({ row }) => row.original.pickupLocation || '-',
    },
    // --- Catatan ---
    {
      id: 'notes',
      accessorKey: 'notes',
      header: labels.colNotes || 'Catatan',
      enableSorting: false,
      size: 200,
      cell: ({ row }) => (
        <span className="text-[12px] block truncate max-w-[180px]" title={row.original.notes || ''}>
          {row.original.notes || '-'}
        </span>
      ),
    },
    // --- Status Booking ---
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const s = row.original.status;
        const label = getStatusLabel(s, labels);
        const textClass = 
          s === 'ACTIVE' ? 'text-success' :
          s === 'PENDING' ? 'text-warning' :
          s === 'CONFIRMED' ? 'text-blue-500' :
          s === 'COMPLETED' ? 'text-neutral-500 dark:text-neutral-400' :
          s === 'CANCELLED' ? 'text-danger' :
          'text-neutral-500 dark:text-neutral-400';
          
        return (
          <div className="whitespace-nowrap">
            <span className={cn("text-[12px] font-medium", textClass)}>{label}</span>
          </div>
        );
      },
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  driverFee: false,
  deposit: false,
  rateType: false,
  rentalType: false,
  paymentMethod: false,
  pickupLocation: false,
  notes: false,
};

export function BookingList({
  data,
  labels,
  onView,
  onEdit,
  onDelete,
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
}: BookingListProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onView, onEdit, onDelete, onOpenMap),
    [labels, onView, onEdit, onDelete, onOpenMap],
  );

  return (
    <DataTable<Booking>
      data={data}
      columns={columns}
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
