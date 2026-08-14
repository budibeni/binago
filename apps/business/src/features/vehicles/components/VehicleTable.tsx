'use client';

import React from 'react';
import { MoreHorizontal, Eye, Edit2, MapPin, Trash2 } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Badge, Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@adatrack/ui';
import {
  useDataTable,
  DataTableHeader,
  DataTableBody,
  DataTableToolbar,
  DataTablePagination,
  DataTableFilterPanel,
  type DataTableColumnDef,
  type DataTablePaginationConfig,
  type DataTableFilterConfig,
  type ColumnVisibilityState,
  type SortingState,
} from '@adatrack/ui';
import type { Vehicle } from '../types/vehicle';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface VehicleTableLabels {
  colPlateNumber: string;
  colVehicle: string;
  colGroup: string;
  colDriver: string;
  colStatus: string;
  colOdometer: string;
  colLastUpdate: string;
  colCategory: string;
  colBrand: string;
  colYear: string;
  colFuel: string;
  colDeviceImei: string;
  colNextService: string;
  colRegExpiry: string;
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
  className?: string;
}

// â”€â”€â”€ Status Badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getStatusBadge(status: Vehicle['status'], labels: VehicleTableLabels) {
  const map = {
    driving: { label: labels.statusDriving, variant: 'success' as const },
    idle:    { label: labels.statusIdle,    variant: 'warning' as const },
    parking: { label: labels.statusParking, variant: 'default' as const },
    offline: { label: labels.statusOffline, variant: 'danger'  as const },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
}

// â”€â”€â”€ Column Factory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function buildColumns(
  labels: VehicleTableLabels,
  onViewDetail: (v: Vehicle) => void,
  onEdit: (v: Vehicle) => void,
  onTrack: (v: Vehicle) => void,
  onDelete: (v: Vehicle) => void,
): DataTableColumnDef<Vehicle>[] {
  return [
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
      cell: ({ row }) => <Badge variant="info">{row.original.groupName}</Badge>,
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
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => getStatusBadge(row.original.status, labels),
    },
    {
      id: 'odometer',
      accessorKey: 'odometer',
      header: labels.colOdometer,
      enableSorting: true,
      size: 130,
      cell: ({ row }) => (
        <span className="text-[13px] tabular-nums text-foreground-muted">
          {row.original.odometer.toLocaleString('id-ID')} km
        </span>
      ),
    },
    {
      id: 'lastUpdate',
      accessorKey: 'lastUpdate',
      header: labels.colLastUpdate,
      enableSorting: true,
      size: 160,
      cell: ({ row }) => (
        <span className="text-[12px] text-foreground-muted tabular-nums">
          {new Date(row.original.lastUpdate).toLocaleString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
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
      id: 'nextServiceKm',
      accessorKey: 'nextServiceKm',
      header: labels.colNextService,
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span className="text-[13px] tabular-nums text-foreground-muted">
          {row.original.nextServiceKm.toLocaleString('id-ID')} km
        </span>
      ),
    },
    {
      id: 'registrationExpiry',
      accessorKey: 'registrationExpiry',
      header: labels.colRegExpiry,
      enableSorting: true,
      size: 160,
      cell: ({ row }) => {
        const diff = (new Date(row.original.registrationExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        const isExpiring = diff < 60;
        return (
          <span className={cn(
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
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 52,
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
              <MoreHorizontal className="h-4 w-4 text-foreground-muted" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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
  ];
}

// â”€â”€â”€ Default Column Visibility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DEFAULT_COLUMN_VISIBILITY = {
  vehicleCategory: false,
  brand: false,
  year: false,
  fuelType: false,
  deviceImei: false,
  nextServiceKm: false,
  registrationExpiry: false,
};

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  className,
}: VehicleTableProps) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>(DEFAULT_COLUMN_VISIBILITY);

  // Reset page when data changes
  React.useEffect(() => { setPageIndex(0); }, [data]);

  const columns = React.useMemo(
    () => buildColumns(labels, onViewDetail, onEdit, onTrack, onDelete),
    [labels, onViewDetail, onEdit, onTrack, onDelete],
  );

  const processedData = React.useMemo(() => {
    const result = [...data];
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a, b) => {
        let valA = a[id as keyof Vehicle];
        let valB = b[id as keyof Vehicle];
        
        // Handle dates
        if (id === 'lastUpdate' || id === 'registrationExpiry') {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           valA = new Date(valA as string).getTime() as any;
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           valB = new Date(valB as string).getTime() as any;
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return desc ? valB - valA : valA - valB;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        return 0;
      });
    }
    return result.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [data, sorting, pageIndex, pageSize]);

  const paginationConfig: DataTablePaginationConfig = {
    pageIndex,
    pageSize,
    totalCount: data.length,
    pageSizeOptions: [10, 20, 50],
    onPageChange: setPageIndex,
    onPageSizeChange: (s) => { setPageSize(s); setPageIndex(0); },
  };

  // Create the table instance directly â€” no injection tricks needed
  const table = useDataTable<Vehicle>({
    data: processedData,
    columns,
    sorting,
    onSortingChange: setSorting,
    mode: 'pagination',
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
    freezeConfig: { left: ['plateNumber'], right: ['actions'] },
    paginationConfig,
  });

  const activeFilterCount = Object.values(filterConfig.state).flat().filter(Boolean).length;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Toolbar â€” directly uses table instance, no injection needed */}
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={labels.searchPlaceholder}
        showColumnToggle
        showExport
        showFilter
        isFilterOpen={isFilterOpen}
        onFilterOpenChange={onFilterOpenChange}
        activeFilterCount={activeFilterCount}
        exportConfig={{ filename: labels.exportFilename, enabled: true }}
      />

      {/* Table + Filter panel */}
      <div className={cn('flex items-stretch gap-4', isFilterOpen ? 'flex-col lg:flex-row' : '')}>
        {/* Table */}
        <div className="flex-1 min-w-0 w-full">
          <div className="relative w-full overflow-x-auto rounded-lg border border-border bg-background shadow-sm max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                emptyTitle={labels.emptyTitle}
                emptyDescription={labels.emptyDescription}
                noResultTitle={labels.noResultTitle}
                noResultDescription={labels.noResultDescription}
              />
            </table>
          </div>
        </div>

        {/* Filter panel â€” full height */}
        {isFilterOpen && (
          <div className="w-full lg:w-[280px] shrink-0 self-stretch">
            <DataTableFilterPanel config={filterConfig} className="h-full" />
          </div>
        )}
      </div>

      {/* Pagination */}
      <DataTablePagination paginationConfig={paginationConfig} />
    </div>
  );
}
