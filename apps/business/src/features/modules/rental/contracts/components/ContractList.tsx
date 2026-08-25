'use client';

import React from 'react';
import { FileText, Plus, Car, Edit, Printer } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Badge } from '@adatrack/ui';
import {
  useDataTable,
  DataTableHeader,
  DataTableBody,
  DataTableToolbar,
  DataTablePagination,
  type DataTableColumnDef,
  type DataTablePaginationConfig,
} from '@adatrack/ui';
import type { RentalContract, ContractStatus } from '../types/contract';

interface ContractListProps {
  data: RentalContract[];
  labels: Record<string, string>;
  onView: (c: RentalContract) => void;
  onEdit?: (c: RentalContract) => void;
  onPrint?: (c: RentalContract) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case 'DRAFT':     return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
    case 'CONFIRMED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'ACTIVE':    return 'bg-success/10 text-success';
    case 'COMPLETED': return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300';
    case 'CANCELLED': return 'bg-danger/10 text-danger';
    default:          return 'bg-neutral-100 text-neutral-600';
  }
};

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
  dataList: RentalContract[],
): DataTableColumnDef<RentalContract>[] {
  return [
    {
      id: 'no',
      accessorKey: 'contractNumber',
      header: labels.colContractNo || 'NO. KONTRAK',
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
            <span className="font-bold text-sm truncate">{row.original.contractNumber}</span>
            <span className="text-[11px] text-muted-foreground truncate">{row.original.reservationId}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'customer',
      accessorKey: 'customer.name',
      header: labels.colCustomer || 'PELANGGAN',
      size: 190,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground">{row.original.customer?.name || '-'}</span>
          <span className="text-[11px] text-muted-foreground mt-0.5">{row.original.customer?.phone || '-'}</span>
        </div>
      ),
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicle.coreVehicle.plateNumber',
      header: labels.colVehicle || 'KENDARAAN',
      size: 200,
      cell: ({ row }) => {
        const cv = row.original.vehicle?.coreVehicle;
        if (!cv) return <span className="text-muted-foreground text-sm">-</span>;
        return (
          <div className="flex flex-col min-w-0 justify-center">
            <p className="text-[11px] text-muted-foreground truncate mb-1">
              {cv.brand} · {cv.vehicleName}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center shrink-0">
                <Car className="w-3 h-3 text-neutral-500" />
              </div>
              <p className="font-bold text-sm leading-none">{cv.plateNumber}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: 'period',
      accessorKey: 'startDate',
      header: labels.colPeriod || 'PERIODE SEWA',
      size: 180,
      cell: ({ row }) => (
        <div className="flex flex-col text-[12px]">
          <span className="font-medium">
            {formatShortDate(row.original.startDate)} <span className="text-muted-foreground font-normal mx-1">-</span> {formatShortDate(row.original.endDate)}
          </span>
          <span className="text-[11px] text-muted-foreground mt-0.5">{row.original.duration} hari</span>
        </div>
      ),
    },
    {
      id: 'total',
      accessorKey: 'totalAmount',
      header: labels.colTotal || 'NILAI KONTRAK',
      size: 160,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground">{formatCurrency(row.original.totalAmount)}</span>
          <span className="text-[11px] text-muted-foreground">DP: {formatCurrency(row.original.deposit)}</span>
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus || 'STATUS',
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
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'AKSI',
      size: 100,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center gap-1 justify-end">
            {c.status === 'DRAFT' && onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(c)} title="Edit Kontrak" className="text-muted-foreground hover:text-foreground">
                <Edit className="w-4 h-4" /> 
              </Button>
            )}
            {onPrint && (
              <Button variant="ghost" size="sm" onClick={() => onPrint(c)} title="Print Kontrak" className="text-muted-foreground hover:text-foreground">
                <Printer className="w-4 h-4" /> 
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}

export function ContractList({
  data,
  labels,
  onView,
  onEdit,
  onPrint,
  searchValue,
  onSearchChange,
  onAdd,
}: ContractListProps) {

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
    () => buildColumns(labels, onView, onEdit, onPrint, data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, onView, onEdit, onPrint, data],
  );

  const table = useDataTable<RentalContract>({
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
            <span className="hidden sm:inline-block">{labels.addContract}</span>
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
                emptyTitle="Kontrak Kosong"
                emptyDescription="Belum ada kontrak rental yang dibuat."
              />
            </table>
          </div>
        </div>
      </div>

      <DataTablePagination paginationConfig={paginationConfig} />
    </div>
  );
}
