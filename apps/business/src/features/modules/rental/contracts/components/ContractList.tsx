'use client';

import React from 'react';
import { FileText, Plus, Car, Edit, Printer, MoreVertical, Eye, Trash2, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { 
  Button, 
  DataTable, 
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { RentalContract, ContractStatus } from '../types/contract';
import { cn, formatCurrency } from '@adatrack/utils';

interface ContractListProps {
  data: RentalContract[];
  labels: Record<string, string>;
  onView: (c: RentalContract) => void;
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
    case 'CONTRACTED': return labels.statusIssued || 'Diterbitkan';
    case 'ACTIVE':    return labels.statusActive || 'Berjalan';
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
  labels: Record<string, string>,
  onView: (c: RentalContract) => void,
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
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-full"
            onClick={() => onView(c)}
            title="Detail"
          >
            <Eye className="h-4 w-4" />
          </Button>
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
      accessorFn: (row) => row.customerSnapshot?.name || '-',
      header: labels.colCustomer || 'Pelanggan',
      enableSorting: true,
      size: 180,
    },
    {
      id: 'vehicle',
      accessorFn: (row) => {
        const items = row.items || [];
        if (items.length === 0) return '-';
        if (items.length === 1) {
          const cv = items[0].vehicleSnapshot;
          if (!cv) return '-';
          return `${cv.licensePlate} - ${cv.brand} ${cv.model}`;
        }
        return `${items.length} Kendaraan`;
      },
      header: labels.colVehicle || 'Kendaraan',
      enableSorting: true,
      size: 220,
    },
    {
      id: 'period',
      accessorFn: (row) => `${formatShortDate(row.startDate)} s/d ${formatShortDate(getMaxEndDate(row.items || []))}`,
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
          s === 'CONTRACTED' ? 'text-blue-500' :
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

const DEFAULT_COLUMN_VISIBILITY = {};


const getMaxEndDate = (items: any[]) => {
  if (!items || items.length === 0) return "";
  let max = new Date(items[0].startDate || "");
  for (const item of items) {
    if (!item.startDate) continue;
    const d = new Date(item.startDate);
    if (item.rateType === "HOURLY") d.setHours(d.getHours() + (item.duration || 1));
    else d.setDate(d.getDate() + (item.duration || 1));
    if (d > max) max = d;
  }
  return max.toISOString();
};

export function ContractList({
  data,
  labels,
  onView,
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
    () => buildColumns(labels, onView, onPrint, onHandover),
    [labels, onView, onPrint, onHandover],
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
      extraMiddleActions={
        <Link href="/rental/templates/contracts">
          <Button variant="outline" className="h-8 px-3 gap-2 text-[12px] font-medium border-border/80 text-foreground-muted hover:text-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block">Template</span>
          </Button>
        </Link>
      }
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
          <Button onClick={onAdd} variant="destructive" className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline-block">{labels.addContract || 'Tambah'}</span>
          </Button>
        </div>
      }
    />
  );
}
