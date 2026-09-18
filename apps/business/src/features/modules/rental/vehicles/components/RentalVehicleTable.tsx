import React from 'react';
import { CheckCircle2, AlertCircle, Plus, FileText, MoreVertical, Eye, Edit2, MapPin, LogOut, EyeOff } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Checkbox, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { RentalVehicle } from '../types/rentalVehicle';
import type { RentalPricingCategory } from '../../pricing-category/types/pricing';

interface RentalVehicleTableProps {
  data: RentalVehicle[];
  pricingCategorys?: RentalPricingCategory[];
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
  filterConfig?: DataTableFilterConfig;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  className?: string;
  dtLabels?: any;
}

const DEFAULT_COLUMN_VISIBILITY = {};

function buildColumns(
  labels: Record<string, string>,
  onView: (v: RentalVehicle) => void,
  onEdit: (v: RentalVehicle) => void,
  onDisable: (v: RentalVehicle) => void,
  onComplete: (v: RentalVehicle) => void,
  selectedIds: string[],
  onSelectionChange: (ids: string[]) => void,
  dataList: RentalVehicle[],
  pricingCategorys: RentalPricingCategory[]
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
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => {
        const v = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-full"
            onClick={() => onView(v)}
            title="Detail"
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: 'plateNumber',
      accessorFn: (v) => v.coreVehicle.plateNumber,
      header: 'No. Polisi',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => (
        <span 
          onClick={() => onView(row.original)}
          className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors whitespace-nowrap"
        >
          {row.original.coreVehicle.plateNumber}
        </span>
      ),
    },
    {
      id: 'vehicle',
      accessorFn: (v) => `${v.coreVehicle.brand} ${v.coreVehicle.vehicleName}`,
      header: labels.colVehicle || 'Kendaraan',
      enableSorting: true,
      size: 180,
    },
    {
      id: 'year',
      accessorFn: (v) => v.coreVehicle.year,
      header: labels.colYear,
      enableSorting: true,
      size: 80,
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

        const textClass = 
          s === 'READY' ? 'text-success' :
          s === 'RESERVED' ? 'text-warning' :
          s === 'RENTED' ? 'text-primary' :
          s === 'MAINTENANCE' ? 'text-purple-500' :
          'text-neutral-500 dark:text-neutral-400';

        return (
          <div className="whitespace-nowrap">
            <span className={cn("text-[13px] font-medium", textClass)}>{label}</span>
          </div>
        );
      },
    },
    {
      id: 'customer',
      accessorFn: (v) => {
        if (v.status !== 'RENTED' && v.status !== 'RESERVED') return '-';
        return v.customerName || '-';
      },
      header: labels.colCustomer,
      enableSorting: true,
      size: 180,
    },
    {
      id: 'period',
      accessorFn: (v) => {
        if (v.status !== 'RENTED' && v.status !== 'RESERVED') return '-';
        return v.rentalPeriod || '-';
      },
      header: labels.colPeriod,
      enableSorting: true,
      size: 180,
    },
    {
      id: 'pricingType',
      accessorKey: 'pricingType',
      header: 'Kategori Tarif',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => {
        const isGroup = row.original.pricingType === 'CATEGORY';
        const group = isGroup ? pricingCategorys.find(g => g.id === row.original.pricingCategoryId) : null;
        return isGroup ? (
          <span className="w-fit text-[11px] font-semibold px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-border">
            {group?.name || 'Unknown'}
          </span>
        ) : (
          <span className="w-fit text-[11px] font-semibold px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">Mandiri</span>
        );
      },
    },
    {
      id: 'rate',
      accessorKey: 'dailyRate',
      header: labels.colRate,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const v = row.original;
        if (v.dailyRate === 0) return <span className="text-muted-foreground">-</span>;
        return <span className="text-[13px] font-medium">{formatCurrency(v.dailyRate)} / hari</span>;
      },
    },
    {
      id: 'condition',
      accessorFn: (v) => {
        const c = v.condition;
        if (c === 'MINOR_DAMAGE') return labels.conditionMinor || 'Rusak Ringan';
        if (c === 'NEEDS_REPAIR') return labels.conditionRepair || 'Perlu Perbaikan';
        return labels.conditionGood || 'Baik';
      },
      header: labels.colCondition,
      enableSorting: true,
      size: 140,
    },
    {
      id: 'completeness',
      accessorKey: 'completeness',
      header: labels.colCompleteness,
      enableSorting: true,
      size: 160,
      cell: ({ row }) => {
        const isComplete = row.original.isComplete;
        return (
          <div className="flex items-center gap-2">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', isComplete ? 'bg-success' : 'bg-warning')} />
            <span className="text-[13px] text-foreground-muted">
              {isComplete ? (labels.dataCompleteShort || 'Lengkap') : (labels.dataNotCompleteShort || 'Belum Lengkap')}
            </span>
            {!isComplete && (
              <button 
                 onClick={() => onComplete(row.original)}
                 className="text-[11px] font-semibold text-warning hover:underline"
              >
                (Lengkapi)
              </button>
            )}
          </div>
        );
      },
    },
  ];
}

export function RentalVehicleTable({
  data,
  pricingCategorys = [],
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
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  className,
  dtLabels,
}: RentalVehicleTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onView, onEdit, onDisable, onComplete, selectedIds, onSelectionChange, data, pricingCategorys),
    [labels, onView, onEdit, onDisable, onComplete, selectedIds, onSelectionChange, data, pricingCategorys],
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
      exportable
      // Initial State
      columnVisibilityState={DEFAULT_COLUMN_VISIBILITY}
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={dtLabels?.searchPlaceholder || labels.searchPlaceholder || "Cari kendaraan..."}
      // UI Customizations
      className={className}
      emptyTitle={dtLabels?.emptyTitle || labels.emptyTitle}
      emptyDescription={dtLabels?.emptyDescription || labels.emptyDescription}
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      exportFilename="Data_Kendaraan_Rental"
      labels={dtLabels}
      toolbarActions={
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels.addVehicle}</span>
            </Button>
          )}
        </div>
      }
    />
  );
}
