'use client';

import React from 'react';
import { MapPin, Plus, MessageCircle, FileText } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Button,
  Badge,
} from '@adatrack/ui';
import {
  useDataTable,
  DataTableHeader,
  DataTableBody,
  DataTableToolbar,
  DataTablePagination,
  type DataTableColumnDef,
  type DataTablePaginationConfig,
} from '@adatrack/ui';
import type { Reservation, ReservationStatus } from '../types/reservation';

interface ReservationListProps {
  data: Reservation[];
  labels: Record<string, string>;
  onView: (r: Reservation) => void;
  onEdit: (r: Reservation) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  onOpenMap: (vehicleId: string) => void;
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

const getRentalStatusColor = (status: string) => {
  switch (status) {
    case 'READY':       return 'bg-success/10 text-success';
    case 'RESERVED':    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'RENTED':      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'MAINTENANCE': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'UNAVAILABLE': return 'bg-neutral-100 text-neutral-500';
    default:            return 'bg-neutral-100 text-neutral-600';
  }
};

const getStatusLabel = (status: ReservationStatus, labels: Record<string, string>) => {
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
  labels: Record<string, string>,
  onView: (r: Reservation) => void,
  onOpenMap: (vehicleId: string) => void,
  dataList: Reservation[],
): DataTableColumnDef<Reservation>[] {
  return [
    // --- Nomor Reservasi ---
    {
      id: 'no',
      accessorKey: 'reservationNumber',
      header: labels.colNo,
      size: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => onView(row.original)}
            title="Buka Detail"
          >
            <FileText className="w-4 h-4" />
          </Button>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm truncate">{row.original.reservationNumber}</span>
            <span className="text-[11px] text-muted-foreground truncate">{formatDate(row.original.createdAt)}</span>
          </div>
        </div>
      ),
    },
    // --- Pelanggan ---
    {
      id: 'customer',
      accessorKey: 'customer.name',
      header: labels.colCustomer,
      size: 190,
      cell: ({ row }) => {
        const phone = row.original.customer?.phone;
        let waLink = '#';
        if (phone) {
          let cleanPhone = phone.replace(/\D/g, '');
          if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
          waLink = `https://wa.me/${cleanPhone}`;
        }
        
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">{row.original.customer?.name || '-'}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {phone && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors shrink-0"
                  title="Hubungi via WhatsApp"
                >
                  <MessageCircle className="w-3 h-3" />
                </a>
              )}
              <span className="text-[11px] text-muted-foreground">{phone || '-'}</span>
            </div>
          </div>
        );
      },
    },
    // --- Kendaraan (diperluas) ---
    {
      id: 'vehicle',
      accessorKey: 'vehicle.coreVehicle.plateNumber',
      header: labels.colVehicle,
      size: 230,
      cell: ({ row }) => {
        const v  = row.original.vehicle;
        const cv = v?.coreVehicle;
        const vid = v?.vehicleId ?? '';
        if (!cv) return <span className="text-muted-foreground text-sm">-</span>;
        return (
          <div className="flex flex-col min-w-0 justify-center">
            <p className="text-[11px] text-muted-foreground truncate mb-1">
              {cv.brand} · {cv.vehicleName} · {cv.year}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                title="Buka Pemantauan"
                onClick={() => vid && onOpenMap(vid)}
                disabled={!vid}
                className="w-6 h-6 rounded-md bg-primary/10 hover:bg-primary/20 text-primary shrink-0"
              >
                <MapPin className="w-3 h-3" />
              </Button>
              <p className="font-bold text-sm leading-none">{cv.plateNumber}</p>
            </div>
          </div>
        );
      },
    },
    // --- Periode Sewa ---
    {
      id: 'rentalDate',
      accessorKey: 'startDate',
      header: labels.colRentalDate,
      size: 180,
      cell: ({ row }) => (
        <div className="flex flex-col text-[12px]">
          <span className="font-medium">
            {formatShortDate(row.original.startDate)} <span className="text-muted-foreground font-normal mx-1">s/d</span> {formatShortDate(row.original.endDate)}
          </span>
          <span className="text-[11px] text-muted-foreground mt-0.5">{row.original.duration} hari</span>
        </div>
      ),
    },
    // --- Total & Deposit ---
    {
      id: 'total',
      accessorKey: 'totalAmount',
      header: labels.colTotal,
      size: 160,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">{formatCurrency(row.original.totalAmount)}</span>
          <span className="text-[11px] text-muted-foreground">{labels.dp}: {formatCurrency(row.original.deposit)}</span>
        </div>
      ),
    },
    // --- Status Reservasi ---
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus,
      size: 140,
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <Badge className={cn('px-2.5 py-0.5 rounded-full font-semibold border-0', getStatusColor(s))}>
            {getStatusLabel(s, labels)}
          </Badge>
        );
      },
    },
    // Column removed
  ];
}

export function ReservationList({
  data,
  labels,
  onView,
  onEdit,
  searchValue,
  onSearchChange,
  onAdd,
  onOpenMap,
}: ReservationListProps) {

  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize,  setPageSize]  = React.useState(10);

  React.useEffect(() => { setPageIndex(0); }, [data]);

  const processedData = React.useMemo(
    () => data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [data, pageIndex, pageSize],
  );

  const paginationConfig: DataTablePaginationConfig = {
    pageIndex,
    pageSize,
    totalCount: data.length,
    pageSizeOptions: [10, 20, 50],
    onPageChange: setPageIndex,
    onPageSizeChange: (s) => { setPageSize(s); setPageIndex(0); },
  };

  const columns = React.useMemo(
    () => buildColumns(labels, onView, onOpenMap, data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, onView, onOpenMap, data],
  );

  const table = useDataTable<Reservation>({
    data: processedData,
    columns,
    mode: 'pagination',
    paginationConfig,
    freezeConfig: { left: ['no'] },
  });

  return (
    <div className="flex flex-col gap-3 h-full">
      <DataTableToolbar
        table={table}
        searchPlaceholder={labels.searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        showColumnToggle={false}
        showExport={false}
        showFilter={false}
        rightSlot={
          <Button onClick={onAdd} variant="destructive" className="h-9">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline-block">{labels.addReservation}</span>
          </Button>
        }
      />

      <div className="flex items-stretch gap-4 min-h-0 flex-1">
        <div className="flex-1 min-w-0 w-full flex flex-col">
          <div className="relative w-full flex-1 overflow-auto rounded-lg border border-border bg-background shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                emptyTitle={labels.emptyTitle}
                emptyDescription={labels.emptyDesc}
              />
            </table>
          </div>
        </div>
      </div>

      <DataTablePagination paginationConfig={paginationConfig} />
    </div>
  );
}
