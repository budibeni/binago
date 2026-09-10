'use client';

import React from 'react';
import { FileText, Plus, Car, Edit, Printer, MoreVertical, Eye, Trash2, EyeOff } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { 
  Button, 
  DataTable, 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { RentalContract, ContractStatus } from '../types/contract';

interface ContractListProps {
  data: RentalContract[];
  labels: Record<string, string>;
  onView: (c: RentalContract) => void;
  onEdit?: (c: RentalContract) => void;
  onPrint?: (c: RentalContract) => void;
  onHandover?: (c: RentalContract) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  filterConfig?: DataTableFilterConfig;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  showStats?: boolean;
  onToggleStats?: () => void;
  className?: string;
  dtLabels?: any;
}

const getStatusLabel = (status: ContractStatus, labels: Record<string, string>) => {
  switch (status) {
    case 'DRAFT':     return labels.statusDraft || 'Draft';
    case 'CONFIRMED': return labels.statusConfirmed || 'Dikonfirmasi';
    case 'ACTIVE':    return labels.statusActive || 'Berjalan';
    case 'COMPLETED': return labels.statusCompleted || 'Selesai';
    case 'CANCELLED': return labels.statusCancelled || 'Dibatalkan';
    default: return status;
  }
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

function buildColumns(
  labels: Record<string, string>,
  onView: (c: RentalContract) => void,
  onEdit: ((c: RentalContract) => void) | undefined,
  onPrint: ((c: RentalContract) => void) | undefined,
  onHandover: ((c: RentalContract) => void) | undefined,
): DataTableColumnDef<RentalContract>[] {
  return [
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => {
        const c = row.original;
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
              <DropdownMenuItem onClick={() => onView(c)}>
                <Eye className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>Detail</span>
              </DropdownMenuItem>
              {c.status === 'DRAFT' && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(c)}>
                  <Edit className="mr-2 h-4 w-4 text-foreground-muted" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
              {c.status === 'CONFIRMED' && onHandover && (
                <DropdownMenuItem onClick={() => onHandover(c)}>
                  <Car className="mr-2 h-4 w-4 text-success" />
                  <span className="text-success">Serah Terima</span>
                </DropdownMenuItem>
              )}
              {onPrint && (
                <DropdownMenuItem onClick={() => onPrint(c)}>
                  <Printer className="mr-2 h-4 w-4 text-foreground-muted" />
                  <span>Cetak</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: 'no',
      accessorFn: (row) => row.contractNumber,
      header: labels.colContractNo || 'No. Kontrak',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span 
          onClick={() => onView(row.original)}
          className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors whitespace-nowrap"
        >
          {row.original.contractNumber}
        </span>
      ),
    },
    {
      id: 'customer',
      accessorFn: (row) => row.customer?.name || '-',
      header: labels.colCustomer || 'Pelanggan',
      enableSorting: true,
      size: 180,
    },
    {
      id: 'vehicle',
      accessorFn: (row) => {
        const cv = row.vehicle?.coreVehicle;
        if (!cv) return '-';
        return `${cv.plateNumber} - ${cv.brand} ${cv.vehicleName}`;
      },
      header: labels.colVehicle || 'Kendaraan',
      enableSorting: true,
      size: 220,
    },
    {
      id: 'period',
      accessorFn: (row) => `${formatShortDate(row.startDate)} s/d ${formatShortDate(row.endDate)}`,
      header: labels.colPeriod || 'Periode Sewa',
      enableSorting: true,
      size: 180,
    },
    {
      id: 'total',
      accessorFn: (row) => formatCurrency(row.totalAmount),
      header: labels.colTotal || 'Nilai Kontrak',
      enableSorting: true,
      size: 140,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus || 'Status',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const s = row.original.status;
        const label = getStatusLabel(s, labels);
        const textClass = 
          s === 'ACTIVE' ? 'text-success' :
          s === 'DRAFT' ? 'text-neutral-500' :
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

const DEFAULT_COLUMN_VISIBILITY = {};

export function ContractList({
  data,
  labels,
  onView,
  onEdit,
  onPrint,
  onHandover,
  searchValue,
  onSearchChange,
  onAdd,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  showStats,
  onToggleStats,
  className,
  dtLabels
}: ContractListProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onView, onEdit, onPrint, onHandover),
    [labels, onView, onEdit, onPrint, onHandover],
  );

  return (
    <DataTable<RentalContract>
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
      searchPlaceholder={labels.searchPlaceholder || "Cari kontrak..."}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // UI Slots
      className={cn("h-full flex flex-col w-full min-h-0", className)}
      exportFilename="Data_Kontrak_Rental"
      labels={dtLabels}
      emptyTitle="Kontrak Kosong"
      emptyDescription="Belum ada kontrak rental yang dibuat."
      toolbarActions={
        <div className="flex items-center gap-2">
          <Button onClick={onAdd} variant="destructive" className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block">{labels.addContract || 'Tambah'}</span>
          </Button>
          {onToggleStats && (
            <Button variant="outline" onClick={onToggleStats} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
              {showStats ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline-block">Ringkasan</span>
            </Button>
          )}
        </div>
      }
    />
  );
}
