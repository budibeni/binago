import React from 'react';
import { CheckCircle2, AlertCircle, Plus, FileText, MoreVertical, Eye, Edit2, MapPin, Trash2, EyeOff } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Checkbox, DataTable, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
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
  filterConfig?: DataTableFilterConfig;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  showStats?: boolean;
  onToggleStats?: () => void;
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
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => {
        const v = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary focus:outline-none data-[state=open]:bg-neutral-200/50 dark:data-[state=open]:bg-neutral-800"
              >
                <MoreVertical className="h-4 w-4 text-foreground-muted" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onView(v)}>
                <Eye className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>Detail</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(v)}>
                <Edit2 className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                // We use global navigation for single vehicle MapPin
                window.location.href = `/tracking/live?vehicleId=${v.vehicleId}`;
              }}>
                <MapPin className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>Buka Lokasi</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onClick={() => onDisable(v)}>
                <Trash2 className="mr-2 h-4 w-4 text-danger" />
                <span>Keluarkan</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      id: 'rate',
      accessorFn: (v) => {
        if (v.dailyRate > 0) return `${formatCurrency(v.dailyRate)} / hari`;
        return '-';
      },
      header: labels.colRate,
      enableSorting: true,
      size: 140,
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
  showStats,
  onToggleStats,
  className,
  dtLabels,
}: RentalVehicleTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onView, onEdit, onDisable, onComplete, selectedIds, onSelectionChange, data),
    [labels, onView, onEdit, onDisable, onComplete, selectedIds, onSelectionChange, data],
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
      searchPlaceholder={dtLabels?.searchPlaceholder || labels.searchPlaceholder || "Cari armada..."}
      // UI Customizations
      className={className}
      emptyTitle={dtLabels?.emptyTitle || labels.emptyTitle}
      emptyDescription={dtLabels?.emptyDescription || labels.emptyDescription}
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      exportFilename="Data_Armada_Rental"
      labels={dtLabels}
      toolbarActions={
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">Tambah</span>
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
