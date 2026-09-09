'use client';

import React from 'react';
import { MoreVertical, Eye, Edit2, MapPin, Trash2, Plus } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Badge, Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DataTable,
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';
import type { Vehicle } from '../types/vehicle';

interface VehicleTableLabels {
  colPlateNumber: string;
  colVehicle: string;
  colGroup: string;
  colDriver: string;
  colCategory: string;
  colBrand: string;
  colYear: string;
  colFuel: string;
  colDeviceImei: string;
  colRegExpiry: string;
  colColor?: string;
  colDeviceSim?: string;
  colFuelCapacity?: string;
  colKirExpiry?: string;
  colNotes?: string;
  colActions: string;
  noDriver: string;
  noDevice: string;
  statusDriving: string;
  statusIdle: string;
  statusParking: string;
  statusOffline: string;
  emptyTitle: string;
  emptyDescription: string;
  noResultTitle: string;
  noResultDescription: string;
  searchPlaceholder: string;
  exportFilename: string;
  actionDetail: string;
  actionEdit: string;
  actionTrack: string;
  actionDelete: string;
  actionAdd?: string;
}

interface VehicleTableProps {
  data: Vehicle[];
  labels: VehicleTableLabels;
  onViewDetail: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onTrack: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  onAdd?: () => void;
  className?: string;
  dtLabels?: DataTableLabels;
}

function getStatusBadge(status: Vehicle['status'], labels: VehicleTableLabels) {
  const map = {
    driving: { label: labels.statusDriving, variant: 'success' as const },
    idle: { label: labels.statusIdle, variant: 'warning' as const },
    parking: { label: labels.statusParking, variant: 'default' as const },
    offline: { label: labels.statusOffline, variant: 'danger' as const },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
}

function buildColumns(
  labels: VehicleTableLabels,
  onViewDetail: (v: Vehicle) => void,
  onEdit: (v: Vehicle) => void,
  onTrack: (v: Vehicle) => void,
  onDelete: (v: Vehicle) => void,
): DataTableColumnDef<Vehicle>[] {
  return [
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary focus:outline-none data-[state=open]:bg-neutral-200/50 dark:data-[state=open]:bg-neutral-800"
              aria-label="Aksi kendaraan"
              id={`vehicle-action-${row.original.id}`}
            >
              <MoreVertical className="h-4 w-4 text-foreground-muted" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => onViewDetail(row.original)}>
              <Eye className="mr-2 h-4 w-4 text-foreground-muted" />
              <span>{labels.actionDetail}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit2 className="mr-2 h-4 w-4 text-foreground-muted" />
              <span>{labels.actionEdit}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTrack(row.original)}>
              <MapPin className="mr-2 h-4 w-4 text-foreground-muted" />
              <span>{labels.actionTrack}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={() => onDelete(row.original)}>
              <Trash2 className="mr-2 h-4 w-4 text-danger" />
              <span>{labels.actionDelete}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: 'plateNumber',
      accessorKey: 'plateNumber',
      header: labels.colPlateNumber,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <button
          type="button"
          className="font-bold text-primary hover:underline underline-offset-2 text-[13px] tracking-wider uppercase focus:outline-none"
          onClick={() => onViewDetail(row.original)}
        >
          {row.original.plateNumber}
        </button>
      ),
    },
    {
      id: 'vehicleName',
      accessorKey: 'vehicleName',
      header: labels.colVehicle,
      enableSorting: true,
      size: 220,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground">{row.original.vehicleName}</span>
      ),
    },
    {
      id: 'groupName',
      accessorKey: 'groupName',
      header: labels.colGroup,
      enableSorting: true,
      size: 160,
      cell: ({ row }) => (
        <span className="text-[13px] text-info">{row.original.groupName}</span>
      ),
    },
    {
      id: 'driverName',
      accessorKey: 'driverName',
      header: labels.colDriver,
      enableSorting: true,
      size: 180,
      cell: ({ row }) => (
        <span className={cn(
          'text-[13px]',
          row.original.driverName ? 'text-foreground' : 'text-foreground-muted italic',
        )}>
          {row.original.driverName ?? labels.noDriver}
        </span>
      ),
    },
    {
      id: 'vehicleCategory',
      accessorKey: 'vehicleCategory',
      header: labels.colCategory,
      enableSorting: true,
      size: 110,
      cell: ({ row }) => {
        const catMap: Record<Vehicle['vehicleCategory'], string> = {
          truck: 'Truk', minibus: 'Minibus', pickup: 'Pickup',
          motorcycle: 'Motor', other: 'Lainnya',
        };
        return <span className="text-[13px] text-foreground-muted">{catMap[row.original.vehicleCategory]}</span>;
      },
    },
    {
      id: 'brand',
      accessorKey: 'brand',
      header: labels.colBrand,
      enableSorting: true,
      size: 130,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground-muted">{row.original.brand}</span>
      ),
    },
    {
      id: 'year',
      accessorKey: 'year',
      header: labels.colYear,
      enableSorting: true,
      size: 90,
      cell: ({ row }) => (
        <span className="text-[13px] tabular-nums text-foreground-muted">{row.original.year}</span>
      ),
    },
    {
      id: 'color',
      accessorKey: 'color',
      header: labels.colColor || 'Warna',
      enableSorting: true,
      size: 110,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground-muted">{row.original.color || '-'}</span>
      ),
    },
    {
      id: 'fuelType',
      accessorKey: 'fuelType',
      header: labels.colFuel,
      enableSorting: false,
      size: 100,
      cell: ({ row }) => {
        const fuelMap: Record<Vehicle['fuelType'], string> = {
          solar: 'Solar', bensin: 'Bensin', listrik: 'Listrik',
        };
        return <span className="text-[13px] text-foreground-muted">{fuelMap[row.original.fuelType]}</span>;
      },
    },
    {
      id: 'fuelCapacity',
      accessorKey: 'fuelCapacity',
      header: labels.colFuelCapacity || 'Kap. BBM',
      enableSorting: true,
      size: 110,
      cell: ({ row }) => (
        <span className="text-[13px] tabular-nums text-foreground-muted">
          {row.original.fuelCapacity ? `${row.original.fuelCapacity} L` : '-'}
        </span>
      ),
    },
    {
      id: 'deviceImei',
      accessorKey: 'deviceImei',
      header: labels.colDeviceImei,
      enableSorting: false,
      size: 180,
      cell: ({ row }) => (
        <span className={cn(
          'text-[12px] font-mono',
          row.original.deviceImei ? 'text-foreground-muted' : 'text-foreground-muted/50 italic',
        )}>
          {row.original.deviceImei ?? labels.noDevice}
        </span>
      ),
    },
    {
      id: 'deviceSimNumber',
      accessorKey: 'deviceSimNumber',
      header: labels.colDeviceSim || 'Nomor SIM',
      enableSorting: false,
      size: 140,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground-muted font-mono">{row.original.deviceSimNumber || '-'}</span>
      ),
    },
    {
      id: 'registrationExpiry',
      accessorKey: 'registrationExpiry',
      header: labels.colRegExpiry,
      enableSorting: true,
      size: 160,
      sortFn: 'datetime' as any,
      cell: ({ row }) => {
        const diff = (new Date(row.original.registrationExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        const isExpiring = diff < 60;
        return (
          <span suppressHydrationWarning className={cn(
            'text-[13px]',
            isExpiring ? 'text-warning-600 dark:text-warning-400 font-semibold' : 'text-foreground-muted',
          )}>
            {new Date(row.original.registrationExpiry).toLocaleDateString('id-ID', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      id: 'kirExpiry',
      accessorKey: 'kirExpiry',
      header: labels.colKirExpiry || 'Masa Berlaku KIR',
      enableSorting: true,
      size: 160,
      sortFn: 'datetime' as any,
      cell: ({ row }) => {
        if (!row.original.kirExpiry) return <span className="text-[13px] text-foreground-muted">-</span>;
        const diff = (new Date(row.original.kirExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        const isExpiring = diff < 60;
        return (
          <span suppressHydrationWarning className={cn(
            'text-[13px]',
            isExpiring ? 'text-warning-600 dark:text-warning-400 font-semibold' : 'text-foreground-muted',
          )}>
            {new Date(row.original.kirExpiry).toLocaleDateString('id-ID', {
              day: '2-digit', month: 'short', year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      id: 'notes',
      accessorKey: 'notes',
      header: labels.colNotes || 'Catatan',
      enableSorting: false,
      size: 200,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground-muted block truncate max-w-[180px]" title={row.original.notes}>
          {row.original.notes || '-'}
        </span>
      ),
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  notes: false,
  deviceSimNumber: false,
  deviceImei: false,
};

export function VehicleTable({
  data,
  labels,
  onViewDetail,
  onEdit,
  onTrack,
  onDelete,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  onAdd,
  className,
  dtLabels,
}: VehicleTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onViewDetail, onEdit, onTrack, onDelete),
    [labels, onViewDetail, onEdit, onTrack, onDelete],
  );

  return (
    <DataTable<Vehicle>
      className={className}
      data={data}
      columns={columns}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      exportable
      // Initial state
      columnVisibilityState={DEFAULT_COLUMN_VISIBILITY}
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={labels.searchPlaceholder}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // Export
      exportFilename={labels.exportFilename}
      // UI Customizations
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDescription}
      toolbarActions={
        onAdd ? (
          <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">Tambah</span>
          </Button>
        ) : undefined
      }
      labels={dtLabels}
    />
  );
}
