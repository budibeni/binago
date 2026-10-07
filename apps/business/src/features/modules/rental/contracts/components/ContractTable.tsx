import type { RentalContract, ContractStatusFilter } from '../types/contract';
export type ContractStatus = RentalContract['status'];
'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, MapPin, Plus, MessageCircle, MoreVertical, Eye, EyeOff, Edit2, Trash2, Calendar, Clock , FileText } from 'lucide-react';
import {
  Button,
  Badge,
  DataTable,
  PhoneLink,
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';

import { cn, formatCurrency } from '@adatrack/utils';

interface ContractTableProps {
  data: RentalContract[];
  labels: Record<string, any>;
  onView: (r: RentalContract) => void;
  onEdit: (r: RentalContract) => void;
  onDelete: (r: RentalContract) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  onPrint?: (c: RentalContract) => void;
  onOpenMap: (vehicleIds: string[]) => void;
  filterConfig?: DataTableFilterConfig;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  showStats?: boolean;
  onToggleStats?: () => void;
  className?: string;
  dtLabels?: any;
}

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case 'DRAFT': return 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-300';
    case 'BOOKED': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'CONTRACTED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'ACTIVE': return 'bg-success/10 text-success';
    case 'COMPLETED': return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    case 'CANCELLED': return 'bg-danger/10 text-danger';
    default: return 'bg-neutral-100 text-neutral-600';
  }
};

const getStatusLabel = (status: ContractStatus, labels: Record<string, any>) => {
  switch (status) {
    case 'DRAFT': return labels.statusDraft || 'Draft';
    case 'BOOKED': return labels.statusBooked || 'Dipesan';
    case 'CONTRACTED': return labels.statusIssued || 'Diterbitkan';
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
  onView: (r: RentalContract) => void,
  onEdit: (r: RentalContract) => void,
  onDelete: (r: RentalContract) => void,
  onOpenMap: (vehicleIds: string[]) => void
): DataTableColumnDef<RentalContract>[] {
  return [
    // --- RentalContract Info ---
    {
      id: 'bookingGroup',
      accessorFn: (row) => row.contractNumber,
      header: labels.colRentalContract || 'No. Kontrak',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <button
              onClick={(e) => { e.stopPropagation(); onView(b); }}
              className="text-[13px] font-normal text-foreground truncate hover:text-primary hover:underline transition-colors text-left"
              title={b.contractNumber}
            >
              {b.contractNumber}
            </button>
            <span className="text-[11px] text-foreground truncate">
              {formatShortDate(b.contractDate || '')}
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
        
        let rateTypeLabel = labels.multiRate || "Multi Tarif";
        if (b.items && b.items.length > 0) {
          const firstRateType = b.items[0].rateType;
          const allSame = b.items.every((i: any) => i.rateType === firstRateType);
          if (allSame) {
            rateTypeLabel = firstRateType === "DAILY" ? labels.rateDaily || "Harian" : firstRateType === "HOURLY" ? labels.rateHourly || "Per Jam" : labels.ratePackage || "Paket";
          }
        }

        const rentalTypeLabel = b.rentalType === 'SELF_DRIVE' ? (labels.selfDrive || 'Lepas Kunci') : (labels.withDriver || 'Dengan Pengemudi');

        let periodColorClass = 'text-muted-foreground';
        if (b.status === 'BOOKED') periodColorClass = 'text-amber-600 dark:text-amber-500 font-medium';
        else if (b.status === 'CONTRACTED') periodColorClass = 'text-blue-600 dark:text-blue-500 font-medium';

        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground truncate w-full max-w-[200px]" title={`${rateTypeLabel} • ${rentalTypeLabel}`}>
              {rateTypeLabel} • {rentalTypeLabel}
            </span>
            <div className={`flex items-center gap-1.5 mt-0.5 text-[11px] ${periodColorClass}`} title={`${formatShortDate(b.startDate)} - ${formatShortDate(getMaxEndDate(b.items))}`}>
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">{formatShortDate(b.startDate)} - {formatShortDate(getMaxEndDate(b.items))}</span>
            </div>
          </div>
        );
      }
    },
    // --- Pelanggan ---
    {
      id: 'customerGroup',
      accessorFn: (row) => row.customerSnapshot?.name || '-',
      header: labels.colCustomer || 'Pelanggan',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const c = row.original.customerSnapshot;
        if (!c) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground truncate" title={c.name}>{c.name}</span>
            <span className="text-[11px] text-muted-foreground truncate">
              {c.type}
            </span>
          </div>
        );
      }
    },
    // --- Kontak ---
    {
      id: 'contact',
      accessorFn: (row) => row.customerSnapshot?.phone || '-',
      header: labels.colContact || 'Kontak',
      enableSorting: false,
      size: 160,
      cell: ({ row }) => {
        const c = row.original.customerSnapshot;
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
        return items.map((i: any) => i.vehicleSnapshot?.licensePlate).filter(Boolean).join(', ');
      },
      header: labels.colVehicle || 'Kendaraan',
      enableSorting: true,
      size: 220,
      cell: ({ row }) => {
        const b = row.original;
        const items = b.items;
        if (!items || items.length === 0) return <span className="text-muted-foreground">-</span>;

        const plates = items.map((i: any) => i.vehicleSnapshot?.licensePlate).filter(Boolean);
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
                  const ids = items.map((i: any) => i.vehicleId).filter(Boolean);
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
    // --- Status RentalContract ---
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
    // --- Booking Ref ---
    {
      id: 'bookingReference',
      accessorFn: (row) => row.bookingNumber,
      header: labels.colBookingRef || 'Booking Ref.',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const b = row.original;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground truncate" title={b.bookingNumber}>
              {b.bookingNumber}
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              {formatShortDate(b.createdAt || '')}
            </span>
          </div>
        );
      }
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {};


  const getMaxEndDate = (items: any[]) => {
    if (!items || items.length === 0) return "";
    let max = new Date(items[0].startDate || "");
    for (const item of items) {
      if (!item.startDate) continue;
      const d = new Date(item.startDate);
      if (item.rateType === "HOURLY") d.setHours(d.getHours() + (item.duration || 1));
      else d.setDate(d.getDate() + (item.duration || 1)); // simplifying package/daily
      if (d > max) max = d;
    }
    return max.toISOString();
  };

export function ContractTable({
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
  onPrint,
  onOpenMap,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  showStats,
  onToggleStats,
  className,
  dtLabels
}: ContractTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onView, onEdit, onDelete, onOpenMap),
    [labels, onView, onEdit, onDelete, onOpenMap],
  );

  return (
    <DataTable<RentalContract>
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
      searchPlaceholder={labels.searchPlaceholder || "Cari kontrak..."}
      extraMiddleActions={
        <Link href="/rental/templates/contracts">
          <Button variant="outline" className="h-8 px-3 gap-2 text-[12px] font-medium border-border/80 text-foreground-muted hover:text-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block">{labels.btnTemplate || 'Template'}</span>
          </Button>
        </Link>
      }
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // UI Slots
      className={className}
      exportFilename="Data_RentalContract_Rental"
      labels={dtLabels}
      emptyTitle={labels.emptyTitle || "Kontrak Kosong"}
      emptyDescription={labels.emptyDesc || "Belum ada kontrak rental yang diterbitkan."}
      toolbarActions={
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels.add || 'Tambah'}</span>
            </Button>
          )}
        </div>
      }
    />
  );
}
