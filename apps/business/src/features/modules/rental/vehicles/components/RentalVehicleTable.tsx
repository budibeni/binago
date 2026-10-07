import React from 'react';
import { CheckCircle2, AlertCircle, Plus, FileText, MoreVertical, Eye, Edit2, MapPin, LogOut, EyeOff, Tag, SlidersHorizontal, Activity, Wrench } from 'lucide-react';
import { Button, Checkbox, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { RentalVehicle } from '../types/rentalVehicle';
import type { RentalPricingCategory } from '../../pricing-category/types/pricing';
import { cn, formatCurrency } from '@adatrack/utils';

interface RentalVehicleTableProps {
  data: RentalVehicle[];
  pricingCategorys?: RentalPricingCategory[];
  labels: Record<string, any>;
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
  dtLabels?: import('@adatrack/ui').DataTableLabels;
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

  return [
    {
      id: 'plateNumber',
      accessorFn: (v) => v.coreVehicle.plateNumber,
      header: labels.colLicensePlate || 'Plat Nomor',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => (
        <button
          onClick={() => onView(row.original)}
          className="whitespace-nowrap uppercase tracking-wider text-inherit font-inherit hover:text-primary transition-colors hover:underline text-left"
        >
          {row.original.coreVehicle.plateNumber}
        </button>
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

        const dotClass =
          s === 'READY' ? 'bg-success' :
            s === 'RESERVED' ? 'bg-warning' :
              s === 'RENTED' ? 'bg-blue-500' :
                s === 'MAINTENANCE' ? 'bg-purple-500' :
                  'bg-neutral-400 dark:bg-neutral-600';

        return (
          <div className="flex items-center gap-1.5 text-inherit whitespace-nowrap">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotClass)} />
            <span className="truncate text-[13px]">{label}</span>
          </div>
        );
      },
    },

    {
      id: 'pricingCategory',
      accessorKey: 'categoryId',
      header: labels.colPricingCategory || 'Kategori Tarif',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => {
        const group = pricingCategorys.find(g => g.id === row.original.categoryId);
        return (
          <span className="truncate">
            {group?.name || '-'}
          </span>
        );
      },
    },
    {
      id: 'dailyRate',
      accessorKey: 'dailyRate',
      header: labels.colDailyRate || 'Tarif Harian',
      enableSorting: true,
      size: 110,
      cell: ({ row }) => (
        <span>{row.original.dailyRate ? formatCurrency(row.original.dailyRate) : '-'}</span>
      ),
      meta: { align: 'right' }
    },
    {
      id: 'hourlyRate',
      accessorKey: 'hourlyRate',
      header: 'Tarif Per Jam',
      enableSorting: true,
      size: 110,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.hourlyRate ? formatCurrency(row.original.hourlyRate) : '-'}</span>
      ),
      meta: { align: 'right' }
    },
    {
      id: 'packages',
      accessorKey: 'categoryId',
      header: 'Jml Paket',
      enableSorting: false,
      size: 100,
      cell: ({ row }) => {
        const group = pricingCategorys.find(g => g.id === row.original.categoryId);
        const count = group?.packages?.length || 0;
        return count ? `${count} Paket` : '-';
      },
      meta: { align: 'center' }
    },
    {
      id: 'condition',
      accessorKey: 'condition',
      header: labels.colCondition,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const c = row.original.condition;
        
        let label = labels.conditionGood;
        let iconColor = 'text-muted-foreground'; // Abu-abu
        const Icon = Wrench;
        const isGood = !c || c === 'GOOD';
        
        if (c === 'MINOR_DAMAGE') {
          label = labels.conditionMinor;
          iconColor = 'text-warning'; // Kuning
        } else if (c === 'NEEDS_REPAIR') {
          label = labels.conditionRepair;
          iconColor = 'text-danger'; // Merah
        }

        return (
          <div className="flex items-center gap-1.5 text-inherit">
            {isGood ? (
              <div className="w-3.5 h-3.5 shrink-0" /> // Placeholder to keep text aligned
            ) : (
              <Icon className={cn("w-3.5 h-3.5 shrink-0", iconColor)} />
            )}
            <span className="text-[11.5px] truncate">{label}</span>
          </div>
        );
      },
    },
    {
      id: 'completeness',
      accessorKey: 'completeness',
      header: labels.colCompleteness,
      enableSorting: false,
      size: 240,
      cell: ({ row }) => {
        const isProfileComplete = row.original.isComplete;
        const checklist = row.original.completenessChecklist || {};
        
        const items = [
          { label: labels.equipStnk || 'STNK', val: checklist.stnkOriginal },
          { label: labels.equipSpareKey || 'Kunci Serep', val: checklist.spareKey },
          { label: labels.equipJackAndTools || 'Dongkrak', val: checklist.jackAndTools },
          { label: labels.equipSpareTire || 'Ban Serep', val: checklist.spareTire },
          { label: labels.equipFirstAid || 'P3K', val: checklist.firstAidKit },
        ];
        
        const presentItems = items.filter(i => i.val).map(i => i.label);
        const isChecklistComplete = presentItems.length === 5;

        return (
          <div className="flex flex-col gap-0.5 py-1 text-inherit">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium">
                {isChecklistComplete ? labels.dataCompleteShort : `${presentItems.length}/5 ${labels.statusReady}`}
              </span>
            </div>
            
            {presentItems.length > 0 ? (
              <span className="text-[10px] text-muted-foreground leading-snug truncate w-full" title={`${labels.statusReady}: ${presentItems.join(', ')}`}>
                {presentItems.join(', ')}
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground/50 italic leading-snug truncate w-full">
                {labels.emptyDescription ? '-' : '-'}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'notes',
      accessorKey: 'conditionNotes',
      header: labels.colNotes || 'Catatan',
      enableSorting: false,
      size: 200,
      cell: ({ row }) => {
        const notes = row.original.conditionNotes;
        return (
          <div className="text-[11px] text-muted-foreground whitespace-normal line-clamp-2" title={notes || ''}>
            {notes ? notes : <span className="italic opacity-50">-</span>}
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
      onRowActionClick={onView}
      selectable={true}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      getRowId={(row) => row.vehicleId}
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
      searchPlaceholder={labels.searchPlaceholder || "Cari kendaraan..."}
      // UI Customizations
      className={className}
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDescription}
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      exportFilename="Data_Kendaraan_Rental"
      labels={dtLabels}
      toolbarActions={
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels.addVehicle}</span>
            </Button>
          )}
        </div>
      }
    />
  );
}
