'use client';

import React from 'react';
import { Star, Plus } from 'lucide-react';
import { cn, formatNumber } from '@adatrack/utils';
import { DataTable, Button } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';
import type { Vehicle } from '../types/vehicle';
import { getTranslation } from '../../../../i18n';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';

interface VehicleTableLabels {
  colAsset?: string;
  colPlateNumber: string;
  colVehicle: string;
  colStatus?: string;
  colGroup: string;
  colDriver: string;
  colEfficiency?: string;
  colCategory: string;
  colBrand: string;
  colYear: string;
  colFuel: string;
  colDeviceImei: string;
  colRegExpiry: string;
  colColor?: string;
  colDeviceSim?: string;
  colFuelCapacity?: string;
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
  fieldColor?: string;
  fieldFuelCap?: string;
  colCapacityCC?: string;
  fieldOdometer?: string;
  fieldLastService?: string;
  fieldNextService?: string;
  fieldStnkExpiry?: string;
  fieldStnkNo?: string;
  fieldKirNo?: string;
  fieldBpkbNo?: string;
  fieldEngineNo?: string;
  fieldChassisNo?: string;
  fieldSystemId?: string;
  fieldGpsBrand?: string;
  fieldGpsInstall?: string;
  fieldImei?: string;
  fieldSim?: string;
  fieldLastUpdate?: string;
  fieldNotes?: string;
  colAssetNumber?: string;
  detailNotes?: string;
  categoryTruck?: string;
  categoryMinibus?: string;
  categoryPickup?: string;
  categoryMotorcycle?: string;
  categoryOther?: string;
  fuelSolar?: string;
  fuelBensin?: string;
  fuelElectric?: string;
}

interface VehicleTableProps {
  labels?: VehicleTableLabels;
  data: Vehicle[];
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

function buildColumns(
  labels: VehicleTableLabels,
  locale: 'id' | 'en',
  onViewDetail: (v: Vehicle) => void,
  _onEdit: (v: Vehicle) => void,
  _onTrack: (v: Vehicle) => void,
  _onDelete: (v: Vehicle) => void,
): DataTableColumnDef<Vehicle>[] {
  return [
    {
      id: 'plateNumber',
      accessorKey: 'plateNumber',
      header: labels.colPlateNumber,
      enableSorting: true,
      size: 130,
      meta: { pin: 'left' },
      cell: ({ row }) => (
        <button
          type="button"
          id={row.index === 0 ? "vehicles-first-plate-btn" : undefined}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail(row.original);
          }}
          className="whitespace-nowrap uppercase tracking-wider text-inherit font-inherit hover:text-primary transition-colors hover:underline text-left focus:outline-none"
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
      size: 200,
      cell: ({ row }) => (
        <span
          className="block max-w-[180px] truncate text-foreground"
          title={row.original.vehicleName}
        >
          {row.original.vehicleName}
        </span>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus || 'Status',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => {
        const s = row.original.status;
        let label = labels.statusOffline || 'Offline';
        let dotClass = 'bg-neutral-400 dark:bg-neutral-600';

        if (s === 'driving') {
          label = labels.statusDriving || 'Berjalan';
          dotClass = 'bg-success';
        } else if (s === 'idle') {
          label = labels.statusIdle || 'Berhenti';
          dotClass = 'bg-warning';
        } else if (s === 'parking') {
          label = labels.statusParking || 'Parkir';
          dotClass = 'bg-blue-500';
        } else if (s === 'offline') {
          label = labels.statusOffline || 'Offline';
          dotClass = 'bg-neutral-400 dark:bg-neutral-600';
        }

        return (
          <div className="flex items-center gap-1.5 text-inherit whitespace-nowrap">
            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dotClass)} />
            <span className="truncate">{label}</span>
          </div>
        );
      },
    },
    {
      id: 'groupName',
      accessorKey: 'groupName',
      header: labels.colGroup,
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span
          className="block max-w-[130px] truncate"
          title={row.original.groupName}
        >
          {row.original.groupName}
        </span>
      ),
    },
    {
      id: 'driverName',
      accessorKey: 'driverName',
      header: labels.colDriver,
      enableSorting: true,
      size: 170,
      cell: ({ row }) => (
        <span
          className={cn(
            'block max-w-[150px] truncate',
            !row.original.driverName && 'text-foreground-muted italic',
          )}
          title={row.original.driverName ?? labels.noDriver}
        >
          {row.original.driverName ?? labels.noDriver}
        </span>
      ),
    },
    {
      id: 'efficiency',
      accessorFn: (row) => row.performanceMetrics?.score || 0,
      header: labels.colEfficiency,
      enableSorting: true,
      size: 130,
      meta: { align: 'center' },
      cell: ({ row }) => {
        const score = row.original.performanceMetrics?.score || 0;
        const rating = score >= 100 ? 5 : Math.floor(score / 20);

        return (
          <div className="flex items-center justify-center gap-0.5" title={`${score} / 100`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-3.5 h-3.5',
                  star <= rating
                    ? 'fill-warning text-warning'
                    : 'fill-neutral-200 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-800',
                )}
              />
            ))}
          </div>
        );
      },
    },
    {
      id: 'vehicleCategory',
      accessorKey: 'vehicleCategory',
      header: labels.colCategory,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => {
        const catMap: Record<Vehicle['vehicleCategory'], string> = {
          truck: labels.categoryTruck || 'Truk',
          minibus: labels.categoryMinibus || 'Minibus',
          pickup: labels.categoryPickup || 'Pickup',
          motorcycle: labels.categoryMotorcycle || 'Motor',
          other: labels.categoryOther || 'Lainnya',
        };
        return <span className="text-foreground-muted truncate">{catMap[row.original.vehicleCategory]}</span>;
      },
    },
    {
      id: 'brand',
      accessorKey: 'brand',
      header: labels.colBrand,
      enableSorting: true,
      size: 130,
      cell: ({ row }) => (
        <span className="text-foreground-muted truncate">{row.original.brand}</span>
      ),
    },
    {
      id: 'year',
      accessorKey: 'year',
      header: labels.colYear,
      enableSorting: true,
      size: 80,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted">{row.original.year}</span>
      ),
    },
    {
      id: 'color',
      accessorKey: 'color',
      header: labels.fieldColor || 'Warna',
      enableSorting: true,
      size: 110,
      cell: ({ row }) => (
        <span className="text-foreground-muted truncate">{row.original.color || '-'}</span>
      ),
    },
    {
      id: 'fuelType',
      accessorKey: 'fuelType',
      header: labels.colFuel,
      enableSorting: false,
      size: 90,
      cell: ({ row }) => {
        const fuelMap: Record<Vehicle['fuelType'], string> = {
          solar: labels.fuelSolar || 'Solar',
          bensin: labels.fuelBensin || 'Bensin',
          listrik: labels.fuelElectric || 'Listrik',
        };
        return <span className="text-foreground-muted truncate">{fuelMap[row.original.fuelType]}</span>;
      },
    },
    {
      id: 'fuelCapacity',
      accessorKey: 'fuelCapacity',
      header: labels.fieldFuelCap || 'Kap. BBM',
      enableSorting: true,
      size: 110,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted">
          {row.original.fuelCapacity ? `${row.original.fuelCapacity} L` : '-'}
        </span>
      ),
    },
    {
      id: 'engineCapacity',
      accessorKey: 'engineCapacity',
      header: labels.colCapacityCC || 'Kap. Mesin',
      enableSorting: true,
      size: 110,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted">
          {row.original.engineCapacity ? `${formatNumber(row.original.engineCapacity)} CC` : '-'}
        </span>
      ),
    },
    {
      id: 'odometer',
      accessorKey: 'odometer',
      header: labels.fieldOdometer || 'Odometer',
      enableSorting: true,
      size: 120,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="tabular-nums font-mono text-foreground-muted">
          {row.original.odometer ? formatNumber(row.original.odometer) : '-'}
        </span>
      ),
    },
    {
      id: 'lastServiceKm',
      accessorKey: 'lastServiceKm',
      header: labels.fieldLastService || 'Servis Terakhir',
      enableSorting: true,
      size: 130,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="tabular-nums font-mono text-foreground-muted">
          {row.original.lastServiceKm ? formatNumber(row.original.lastServiceKm) : '-'}
        </span>
      ),
    },
    {
      id: 'nextServiceKm',
      accessorKey: 'nextServiceKm',
      header: labels.fieldNextService || 'Servis Berikutnya',
      enableSorting: true,
      size: 130,
      meta: { align: 'right' },
      cell: ({ row }) => (
        <span className="tabular-nums font-mono text-foreground-muted">
          {row.original.nextServiceKm ? formatNumber(row.original.nextServiceKm) : '-'}
        </span>
      ),
    },
    {
      id: 'registrationExpiry',
      accessorKey: 'registrationExpiry',
      header: labels.fieldStnkExpiry || 'Masa Berlaku STNK',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        if (!row.original.registrationExpiry) return <span className="text-foreground-muted">-</span>;
        const diff = (new Date(row.original.registrationExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        const isExpired = diff < 0;
        const isExpiring = diff >= 0 && diff < 60;
        return (
          <span
            suppressHydrationWarning
            className={cn(
              'tabular-nums whitespace-nowrap',
              isExpired
                ? 'text-danger font-semibold'
                : isExpiring
                  ? 'text-warning font-semibold'
                  : 'text-foreground-muted',
            )}
          >
            {new Date(row.original.registrationExpiry).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      id: 'stnkNumber',
      accessorKey: 'stnkNumber',
      header: labels.fieldStnkNo || 'No. STNK',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">{row.original.stnkNumber || '-'}</span>
      ),
    },
    {
      id: 'kirNumber',
      accessorKey: 'kirNumber',
      header: labels.fieldKirNo || 'No. KIR',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">{row.original.kirNumber || '-'}</span>
      ),
    },
    {
      id: 'bpkbNumber',
      accessorKey: 'bpkbNumber',
      header: labels.fieldBpkbNo || 'No. BPKB',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">{row.original.bpkbNumber || '-'}</span>
      ),
    },
    {
      id: 'engineNumber',
      accessorKey: 'engineNumber',
      header: labels.fieldEngineNo || 'No. Mesin',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">{row.original.engineNumber || '-'}</span>
      ),
    },
    {
      id: 'chassisNumber',
      accessorKey: 'chassisNumber',
      header: labels.fieldChassisNo || 'No. Rangka',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">{row.original.chassisNumber || '-'}</span>
      ),
    },
    {
      id: 'id',
      accessorKey: 'id',
      header: labels.fieldSystemId || 'ID Kendaraan (GPS)',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">{row.original.id}</span>
      ),
    },
    {
      id: 'gpsDeviceBrand',
      accessorKey: 'gpsDeviceBrand',
      header: labels.fieldGpsBrand || 'Merek & Tipe GPS',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="text-foreground-muted truncate">
          {row.original.gpsDeviceBrand || '-'} {row.original.gpsDeviceType || ''}
        </span>
      ),
    },
    {
      id: 'gpsInstallDate',
      accessorKey: 'gpsInstallDate',
      header: labels.fieldGpsInstall || 'Tanggal Pasang GPS',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted whitespace-nowrap">
          {row.original.gpsInstallDate
            ? new Date(row.original.gpsInstallDate).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID')
            : '-'}
        </span>
      ),
    },
    {
      id: 'deviceImei',
      accessorKey: 'deviceImei',
      header: labels.fieldImei || 'IMEI',
      enableSorting: true,
      size: 160,
      cell: ({ row }) => (
        <span
          className={cn(
            'font-mono truncate',
            row.original.deviceImei ? 'text-foreground-muted' : 'text-foreground-muted/50 italic',
          )}
        >
          {row.original.deviceImei ?? labels.noDevice}
        </span>
      ),
    },
    {
      id: 'deviceSimNumber',
      accessorKey: 'deviceSimNumber',
      header: labels.fieldSim || 'Nomor SIM',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">{row.original.deviceSimNumber || '-'}</span>
      ),
    },
    {
      id: 'assetNumber',
      accessorKey: 'assetNumber',
      header: labels.colAssetNumber || labels.colAsset || 'No Asset',
      enableSorting: true,
      size: 130,
      cell: ({ row }) => (
        <span className="font-mono text-foreground-muted truncate">{row.original.assetNumber || '-'}</span>
      ),
    },
    {
      id: 'lastUpdate',
      accessorKey: 'lastUpdate',
      header: labels.fieldLastUpdate || 'Update Terakhir',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground-muted whitespace-nowrap">
          {row.original.lastUpdate
            ? new Date(row.original.lastUpdate).toLocaleString(locale === 'en' ? 'en-US' : 'id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'}
        </span>
      ),
    },
    {
      id: 'notes',
      accessorKey: 'notes',
      header: labels.fieldNotes || labels.detailNotes || 'Catatan',
      enableSorting: false,
      size: 200,
      cell: ({ row }) => (
        <span className="text-foreground-muted block truncate max-w-[180px]" title={row.original.notes}>
          {row.original.notes || '-'}
        </span>
      ),
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  id: false,
  gpsDeviceBrand: false,
  gpsInstallDate: false,
  assetNumber: false,
  color: false,
  fuelType: false,
  fuelCapacity: false,
  deviceImei: false,
  deviceSimNumber: false,
  stnkNumber: false,
  kirNumber: false,
  bpkbNumber: false,
  engineNumber: false,
  chassisNumber: false,
  engineCapacity: false,
  lastServiceKm: false,
  nextServiceKm: false,
  lastUpdate: false,
  notes: false,
};

export function VehicleTable({
  labels: propLabels,
  data,
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
  const locale = useBusinessLocale();
  const labels = React.useMemo(() => {
    return (propLabels || getTranslation(locale).vehicles) as unknown as VehicleTableLabels;
  }, [propLabels, locale]);

  const columns = React.useMemo(
    () => buildColumns(labels, locale, onViewDetail, onEdit, onTrack, onDelete),
    [labels, locale, onViewDetail, onEdit, onTrack, onDelete],
  );

  return (
    <div id="vehicles-table-container" className="h-full w-full">
      <DataTable<Vehicle>
        className={className}
        data={data}
        columns={columns}
        onRowActionClick={onViewDetail}
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
            <Button
              id="vehicles-btn-add"
              variant="destructive"
              onClick={onAdd}
              className="h-8 gap-1.5 text-[12px] font-medium shadow-none"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels.actionAdd || 'Tambah'}</span>
            </Button>
          ) : undefined
        }
        labels={dtLabels}
      />
    </div>
  );
}
