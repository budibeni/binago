import React from 'react';
import { CheckCircle2, AlertCircle, Plus, FileText } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Checkbox, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import type { RentalVehicle } from '../types/rentalVehicle';

interface RentalVehicleTableProps {
  data: RentalVehicle[];
  labels: Record<string, string>;
  onView: (v: RentalVehicle) => void;
  onEdit: (v: RentalVehicle) => void;
  onComplete: (v: RentalVehicle) => void;
  onDisable: (v: RentalVehicle) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

const DEFAULT_COLUMN_VISIBILITY = {};

function buildColumns(
  labels: Record<string, string>,
  onView: (v: RentalVehicle) => void,
  onComplete: (v: RentalVehicle) => void,
  selectedIds: string[],
  onSelectionChange: (ids: string[]) => void,
  dataList: RentalVehicle[]
): DataTableColumnDef<RentalVehicle>[] {
  const formatCurrency = (value: number) => {
    if (value === 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(dataList.map(v => v.vehicleId));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(vId => vId !== id));
    }
  };

  return [
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
        const vId = row.original.vehicleId;
        return (
          <Checkbox
            checked={selectedIds.includes(vId)}
            onCheckedChange={(checked) => handleSelectRow(!!checked, vId)}
            aria-label={`Select ${row.original.coreVehicle.plateNumber}`}
            className="ml-2 data-[state=checked]:bg-danger data-[state=checked]:border-danger"
          />
        );
      },
      enableSorting: false,
      size: 40,
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicle',
      header: labels.colVehicle,
      enableSorting: true,
      size: 240,
      cell: ({ row }) => {
        const v = row.original.coreVehicle;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => onView(row.original)}
              title="Detail Armada"
            >
              <FileText className="w-4 h-4" />
            </Button>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[13px] text-foreground truncate">{v.brand} {v.vehicleName}</span>
              <span className="text-[11px] font-medium text-muted-foreground mt-0.5 truncate">{v.plateNumber}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'year',
      accessorKey: 'year',
      header: labels.colYear,
      enableSorting: true,
      size: 80,
      cell: ({ row }) => row.original.coreVehicle.year,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const s = row.original.status;
        let label = '';
        if (s === 'READY') label = labels.statusReady;
        else if (s === 'RESERVED') label = labels.statusReserved;
        else if (s === 'RENTED') label = labels.statusRented;
        else if (s === 'MAINTENANCE') label = labels.statusMaintenance;
        else if (s === 'UNAVAILABLE') label = labels.statusUnavailable;

        const badgeClass = 
          s === 'READY' ? 'bg-success/10 text-success border border-success/20' :
          s === 'RESERVED' ? 'bg-warning/10 text-warning border border-warning/20' :
          s === 'RENTED' ? 'bg-primary/10 text-primary border border-primary/20' :
          s === 'MAINTENANCE' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
          'bg-neutral-100 text-neutral-500 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700';

        return <div className={cn("px-3 py-1 rounded-full text-[11px] font-semibold w-fit", badgeClass)}>{label}</div>;
      },
    },
    {
      id: 'customer',
      accessorKey: 'customer',
      header: labels.colCustomer,
      enableSorting: true,
      size: 180,
      cell: ({ row }) => {
        if (row.original.status !== 'RENTED' && row.original.status !== 'RESERVED') {
          return <span className="text-muted-foreground">-</span>;
        }
        return row.original.customerName || <span className="text-muted-foreground">-</span>;
      },
    },
    {
      id: 'period',
      accessorKey: 'period',
      header: labels.colPeriod,
      enableSorting: true,
      size: 180,
      cell: ({ row }) => {
        if (row.original.status !== 'RENTED' && row.original.status !== 'RESERVED') {
          return <span className="text-muted-foreground">-</span>;
        }
        return row.original.rentalPeriod || <span className="text-muted-foreground">-</span>;
      },
    },
    {
      id: 'rate',
      accessorKey: 'rate',
      header: labels.colRate,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        if (row.original.dailyRate > 0) {
          return (
            <div className="flex flex-col">
              <span className="font-bold text-[13px] text-foreground">{formatCurrency(row.original.dailyRate)}</span>
              <span className="text-[11px] font-medium text-muted-foreground mt-0.5">/ hari</span>
            </div>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      id: 'condition',
      accessorKey: 'condition',
      header: labels.colCondition,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const c = row.original.condition;
        let lbl = labels.conditionGood;
        if (c === 'MINOR_DAMAGE') lbl = labels.conditionMinor;
        if (c === 'NEEDS_REPAIR') lbl = labels.conditionRepair;
        return <span className="text-sm">{lbl}</span>;
      },
    },
    {
      id: 'completeness',
      accessorKey: 'completeness',
      header: labels.colCompleteness,
      enableSorting: true,
      size: 160,
      cell: ({ row }) => {
        if (row.original.isComplete) {
          return (
            <div className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[13px] font-semibold">{labels.dataCompleteShort || 'Lengkap'}</span>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-1.5 text-danger">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[13px] font-semibold">{labels.dataNotCompleteShort || 'Belum Lengkap'}</span>
            </div>
            <button 
               onClick={() => onComplete(row.original)}
               className="text-[11px] font-semibold text-danger hover:underline ml-5"
            >
              Lengkapi Data Rental
            </button>
          </div>
        );
      },
    },
  ];
}

export function RentalVehicleTable({
  data,
  labels,
  onView,
  onEdit,
  onComplete,
  onDisable,
  selectedIds,
  onSelectionChange,
  searchValue,
  onSearchChange,
  onAdd,
}: RentalVehicleTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onView, onComplete, selectedIds, onSelectionChange, data),
    [labels, onView, onComplete, selectedIds, onSelectionChange, data],
  );

  return (
    <DataTable<RentalVehicle>
      data={data}
      columns={columns}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      // Initial State
      columnVisibilityState={DEFAULT_COLUMN_VISIBILITY}
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={labels.searchPlaceholder || "Cari nomor polisi, merk, atau model..."}
      // UI Customizations
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDescription}
      toolbarActions={
        <Button onClick={onAdd} variant="destructive" className="h-9">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline-block">Tambah</span>
        </Button>
      }
    />
  );
}
