'use client';

import React from 'react';
import { Eye, Edit2, MapPin, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Button,
  Checkbox,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem,
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
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
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
  onEdit: (r: Reservation) => void,
  onOpenMap: (vehicleId: string) => void,
  selectedIds: string[],
  onSelectionChange: (ids: string[]) => void,
  dataList: Reservation[],
): DataTableColumnDef<Reservation>[] {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(dataList.map(r => r.vehicleId).filter(Boolean));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (checked: boolean, vehicleId: string) => {
    if (checked) {
      onSelectionChange([...selectedIds, vehicleId]);
    } else {
      onSelectionChange(selectedIds.filter(id => id !== vehicleId));
    }
  };

  return [
    // --- Checkbox ---
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={dataList.length > 0 && selectedIds.length === dataList.length}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
          className="ml-2"
        />
      ),
      cell: ({ row }) => {
        const vid = row.original.vehicleId;
        return (
          <Checkbox
            checked={selectedIds.includes(vid)}
            onCheckedChange={(checked) => handleSelectRow(!!checked, vid)}
            aria-label={`Select ${row.original.reservationNumber}`}
            className="ml-2 data-[state=checked]:bg-danger data-[state=checked]:border-danger"
          />
        );
      },
      enableSorting: false,
      size: 40,
    },
    // --- Nomor Reservasi ---
    {
      id: 'no',
      accessorKey: 'reservationNumber',
      header: labels.colNo,
      size: 160,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm">{row.original.reservationNumber}</span>
          <span className="text-[11px] text-muted-foreground">{formatDate(row.original.createdAt)}</span>
        </div>
      ),
    },
    // --- Pelanggan ---
    {
      id: 'customer',
      accessorKey: 'customer.name',
      header: labels.colCustomer,
      size: 190,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground">{row.original.customer?.name || '-'}</span>
          <span className="text-[11px] text-muted-foreground">{row.original.customer?.phone || '-'}</span>
        </div>
      ),
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
        if (!cv) return <span className="text-muted-foreground text-sm">-</span>;
        return (
          <div className="flex items-start gap-2.5">
            {/* Icon */}
            <div className="mt-0.5 w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M3 12h18M4 16l1 3h14l1-3M5 12V9l2-4h10l2 4v3" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-none">{cv.plateNumber}</p>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">{cv.brand} · {cv.vehicleName} · {cv.year}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge className={cn('text-[10px] px-1.5 py-0 border-0 rounded-full', getRentalStatusColor(v?.status ?? ''))}>
                  {v?.status ?? '-'}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{cv.odometer?.toLocaleString('id-ID') ?? '-'} km</span>
              </div>
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
      size: 170,
      cell: ({ row }) => (
        <div className="flex flex-col text-[12px]">
          <span className="font-medium">{formatShortDate(row.original.startDate)}</span>
          <span className="text-muted-foreground text-[10px] leading-none my-0.5">s/d</span>
          <span className="font-medium">{formatShortDate(row.original.endDate)}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{row.original.duration} hari</span>
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
    // --- Actions ---
    {
      id: 'actions',
      header: '',
      size: 96,
      cell: ({ row }) => {
        const r  = row.original;
        const vid = r.vehicle?.vehicleId ?? '';
        return (
          <div className="flex items-center gap-1">
            {/* Map button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
              title="Buka di Pemantauan"
              onClick={() => vid && onOpenMap(vid)}
              disabled={!vid}
            >
              <MapPin className="w-4 h-4" />
            </Button>
            {/* Detail */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Detail"
              onClick={() => onView(r)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            {/* More */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView(r)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Detail
                </DropdownMenuItem>
                {r.status === 'PENDING' && (
                  <DropdownMenuItem onClick={() => onEdit(r)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-primary focus:text-primary"
                  onClick={() => vid && onOpenMap(vid)}
                  disabled={!vid}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Buka Pemantauan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
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
  selectedIds,
  onSelectionChange,
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
    () => buildColumns(labels, onView, onEdit, onOpenMap, selectedIds, onSelectionChange, data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, onView, onEdit, onOpenMap, selectedIds, onSelectionChange, data],
  );

  const table = useDataTable<Reservation>({
    data: processedData,
    columns,
    mode: 'pagination',
    paginationConfig,
    freezeConfig: { left: ['select', 'no'], right: ['actions'] },
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
