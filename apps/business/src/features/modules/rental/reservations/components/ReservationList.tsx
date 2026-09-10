'use client';

import React from 'react';
import { MapPin, Plus, MessageCircle, MoreVertical, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { 
  Button, 
  Badge, 
  DataTable, 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { Reservation, ReservationStatus } from '../types/reservation';

interface ReservationListProps {
  data: Reservation[];
  labels: Record<string, any>;
  onView: (r: Reservation) => void;
  onEdit: (r: Reservation) => void;
  onDelete: (r: Reservation) => void;
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

const getStatusColor = (status: ReservationStatus) => {
  switch (status) {
    case 'PENDING':   return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'CONFIRMED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'ACTIVE':    return 'bg-success/10 text-success';
    case 'COMPLETED': return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    case 'CANCELLED': return 'bg-danger/10 text-danger';
    default:          return 'bg-neutral-100 text-neutral-600';
  }
};

const getStatusLabel = (status: ReservationStatus, labels: Record<string, any>) => {
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
  onView: (r: Reservation) => void,
  onEdit: (r: Reservation) => void,
  onDelete: (r: Reservation) => void,
  onOpenMap: (vehicleId: string) => void
): DataTableColumnDef<Reservation>[] {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary focus:outline-none data-[state=open]:bg-neutral-200/50 dark:data-[state=open]:bg-neutral-800"
                aria-label="Aksi"
              >
                <MoreVertical className="h-4 w-4 text-foreground-muted" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onView(p)}>
                <Eye className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>Detail</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(p)}>
                <Edit2 className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  const vid = p.vehicle?.vehicleId;
                  if (vid) onOpenMap(vid);
                }}
                disabled={!p.vehicle?.vehicleId}
              >
                <MapPin className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>Buka Lokasi</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onClick={() => onDelete(p)}>
                <Trash2 className="mr-2 h-4 w-4 text-danger" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    // --- Nomor Reservasi ---
    {
      id: 'no',
      accessorFn: (row) => row.reservationNumber,
      header: labels.colNo,
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span 
          onClick={() => onView(row.original)}
          className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors whitespace-nowrap"
        >
          {row.original.reservationNumber}
        </span>
      ),
    },
    // --- Pelanggan ---
    {
      id: 'customer',
      accessorFn: (row) => row.customer?.name || '-',
      header: labels.colCustomer,
      enableSorting: true,
      size: 180,
    },
    // --- Kendaraan (diperluas) ---
    {
      id: 'vehicle',
      accessorFn: (row) => {
        const cv = row.vehicle?.coreVehicle;
        if (!cv) return '-';
        return `${cv.plateNumber} - ${cv.brand} ${cv.vehicleName}`;
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
    // --- Tipe Rental ---
    {
      id: 'rentalType',
      accessorKey: 'rentalType',
      header: labels.colRentalType || 'Tipe Rental',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => row.original.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Supir',
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
        <span className="text-[13px] block truncate max-w-[180px]" title={row.original.notes || ''}>
          {row.original.notes || '-'}
        </span>
      ),
    },
    // --- Status Reservasi ---
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
            <span className={cn("text-[13px] font-medium", textClass)}>{label}</span>
          </div>
        );
      },
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  rentalType: false,
  paymentMethod: false,
  pickupLocation: false,
  notes: false,
};

export function ReservationList({
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
}: ReservationListProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onView, onEdit, onDelete, onOpenMap),
    [labels, onView, onEdit, onDelete, onOpenMap],
  );

  return (
    <DataTable<Reservation>
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
      searchPlaceholder={labels.searchPlaceholder || "Cari reservasi..."}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // UI Slots
      className={className}
      exportFilename="Data_Reservasi_Rental"
      labels={dtLabels}
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDesc}
      toolbarActions={
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels.addReservation || 'Tambah'}</span>
            </Button>
          )}
          {onToggleStats && (
            <Button variant="outline" onClick={onToggleStats} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
              {showStats ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline-block">Ringkasan</span>
            </Button>
          )}
        </div>
      }
    />
  );
}
