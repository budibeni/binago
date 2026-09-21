'use client';

import React from 'react';
import { MoreVertical, Eye, Edit2, MapPin, Trash2, Plus, Search, Map, MoreHorizontal, ShieldAlert, Edit, Star } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Badge, Button,
  DataTable,
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';
import type { Vehicle } from '../types/vehicle';
import { getTranslation } from '../../../../i18n';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';

interface VehicleTableLabels {
  colAsset?: string;
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
}

interface VehicleTableProps {
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
              meta: { fixedWidth: true, pin: 'left', className: 'w-[1%] px-1 whitespace-nowrap' },
              cell: ({ row }) => (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-full"
                  onClick={() => onViewDetail(row.original)}
                  title="Detail"
                  id={`vehicle-action-${row.original.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              ),
            },
    {
              id: 'plateNumber',
              accessorKey: 'plateNumber',
              header: labels.colPlateNumber,
              enableSorting: true,
              size: 140,
              meta: { pin: 'left' },
              cell: ({ row }) => (
                <button
                  type="button"
                  className="font-bold text-primary hover:underline underline-offset-2 text-[12px] tracking-wider uppercase focus:outline-none"
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
                <span className="text-[12px] text-foreground">{row.original.vehicleName}</span>
              ),
            },
    {
              id: 'groupName',
              accessorKey: 'groupName',
              header: labels.colGroup,
              enableSorting: true,
              size: 160,
              cell: ({ row }) => (
                <span className="text-[12px] text-info">{row.original.groupName}</span>
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
                  'text-[12px]',
                  row.original.driverName ? 'text-foreground' : 'text-foreground-muted italic',
                )}>
                  {row.original.driverName ?? labels.noDriver}
                </span>
              ),
            },
    {
              id: 'efficiency',
              accessorFn: (row) => row.performanceMetrics?.score || 0,
              header: 'Efisiensi',
              enableSorting: true,
              size: 140,
              cell: ({ row }) => {
                const score = row.original.performanceMetrics?.score || 0;
                const rating = score >= 100 ? 5 : Math.floor(score / 20);

                return (
                  <div className="flex items-center gap-0.5" title={`${score} / 100`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'w-3.5 h-3.5',
                          star <= rating
                            ? 'fill-warning text-warning'
                            : 'fill-neutral-200 text-neutral-200 dark:fill-neutral-800 dark:text-neutral-800'
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
              size: 110,
              cell: ({ row }) => {
                const catMap: Record<Vehicle['vehicleCategory'], string> = {
                  truck: (labels as any).categoryTruck || 'Truk',
                  minibus: (labels as any).categoryMinibus || 'Minibus',
                  pickup: (labels as any).categoryPickup || 'Pickup',
                  motorcycle: (labels as any).categoryMotorcycle || 'Motor',
                  other: (labels as any).categoryOther || 'Lainnya',
                };
                return <span className="text-[12px] text-foreground-muted">{catMap[row.original.vehicleCategory]}</span>;
              },
            },
    {
              id: 'brand',
              accessorKey: 'brand',
              header: labels.colBrand,
              enableSorting: true,
              size: 130,
              cell: ({ row }) => (
                <span className="text-[12px] text-foreground-muted">{row.original.brand}</span>
              ),
            },
    {
              id: 'year',
              accessorKey: 'year',
              header: labels.colYear,
              enableSorting: true,
              size: 90,
              cell: ({ row }) => (
                <span className="text-[12px] tabular-nums text-foreground-muted">{row.original.year}</span>
              ),
            },
    {
              id: 'color',
              accessorKey: 'color',
              header: labels.fieldColor || 'Warna',
              enableSorting: true,
              size: 110,
              cell: ({ row }) => (
                <span className="text-[12px] text-foreground-muted">{row.original.color || '-'}</span>
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
                  solar: (labels as any).fuelSolar || 'Solar',
                  bensin: (labels as any).fuelBensin || 'Bensin',
                  listrik: (labels as any).fuelElectric || 'Listrik',
                };
                return <span className="text-[12px] text-foreground-muted">{fuelMap[row.original.fuelType]}</span>;
              },
            },
    {
              id: 'fuelCapacity',
              accessorKey: 'fuelCapacity',
              header: labels.fieldFuelCap || 'Kap. BBM',
              enableSorting: true,
              size: 110,
              cell: ({ row }) => (
                <span className="text-[12px] tabular-nums text-foreground-muted">
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
              cell: ({ row }) => <span className="text-[12px] tabular-nums text-foreground-muted">{row.original.engineCapacity ? `${row.original.engineCapacity} CC` : '-'}</span>,
            },
    {
              id: 'odometer',
              accessorKey: 'odometer',
              header: labels.fieldOdometer || 'Odometer',
              enableSorting: true,
              size: 130,
              cell: ({ row }) => <span className="text-[12px] tabular-nums text-foreground-muted">{row.original.odometer?.toLocaleString('id-ID') || '-'}</span>,
            },
    {
              id: 'lastServiceKm',
              accessorKey: 'lastServiceKm',
              header: labels.fieldLastService || 'Servis Terakhir',
              enableSorting: true,
              size: 130,
              cell: ({ row }) => <span className="text-[12px] tabular-nums text-foreground-muted">{row.original.lastServiceKm?.toLocaleString('id-ID') || '-'}</span>,
            },
    {
              id: 'nextServiceKm',
              accessorKey: 'nextServiceKm',
              header: labels.fieldNextService || 'Servis Berikutnya',
              enableSorting: true,
              size: 130,
              cell: ({ row }) => <span className="text-[12px] tabular-nums text-foreground-muted">{row.original.nextServiceKm?.toLocaleString('id-ID') || '-'}</span>,
            },
    {
              id: 'registrationExpiry',
              accessorKey: 'registrationExpiry',
              header: labels.fieldStnkExpiry || 'Berlaku STNK',
              enableSorting: true,
              size: 140,
              sortFn: 'datetime' as any,
              cell: ({ row }) => {
                if (!row.original.registrationExpiry) return <span className="text-[12px] text-foreground-muted">-</span>;
                const diff = (new Date(row.original.registrationExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
                const isExpired = diff < 0;
                const isExpiring = diff >= 0 && diff < 60;
                return (
                  <span suppressHydrationWarning className={cn(
                    'text-[12px]',
                    isExpired ? 'text-red-600 dark:text-red-400 font-bold' : 
                    isExpiring ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-foreground-muted',
                  )}>
                    {new Date(row.original.registrationExpiry).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric',
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
              cell: ({ row }) => <span className="text-[12px] text-foreground-muted">{row.original.stnkNumber || '-'}</span>,
            },
    {
              id: 'kirNumber',
              accessorKey: 'kirNumber',
              header: labels.fieldKirNo || 'No. KIR',
              enableSorting: true,
              size: 140,
              cell: ({ row }) => <span className="text-[12px] text-foreground-muted">{row.original.kirNumber || '-'}</span>,
            },
    {
              id: 'bpkbNumber',
              accessorKey: 'bpkbNumber',
              header: labels.fieldBpkbNo || 'No. BPKB',
              enableSorting: true,
              size: 140,
              cell: ({ row }) => <span className="text-[12px] text-foreground-muted">{row.original.bpkbNumber || '-'}</span>,
            },
    {
              id: 'engineNumber',
              accessorKey: 'engineNumber',
              header: labels.fieldEngineNo || 'No. Mesin',
              enableSorting: true,
              size: 140,
              cell: ({ row }) => <span className="text-[12px] text-foreground-muted">{row.original.engineNumber || '-'}</span>,
            },
    {
              id: 'chassisNumber',
              accessorKey: 'chassisNumber',
              header: labels.fieldChassisNo || 'No. Rangka',
              enableSorting: true,
              size: 140,
              cell: ({ row }) => <span className="text-[12px] text-foreground-muted">{row.original.chassisNumber || '-'}</span>,
            },
    {
              id: 'id',
              accessorKey: 'id',
              header: labels.fieldSystemId || 'ID Kendaraan (GPS)',
              enableSorting: true,
              size: 150,
              cell: ({ row }) => <span className="text-[12px] text-foreground-muted">{row.original.id}</span>,
            },
    {
              id: 'gpsDeviceBrand',
              accessorKey: 'gpsDeviceBrand',
              header: labels.fieldGpsBrand || 'Merek & Tipe GPS',
              enableSorting: true,
              size: 140,
              cell: ({ row }) => <span className="text-[12px] text-foreground-muted">{row.original.gpsDeviceBrand || '-'} {row.original.gpsDeviceType || ''}</span>,
            },
    {
              id: 'gpsInstallDate',
              accessorKey: 'gpsInstallDate',
              header: labels.fieldGpsInstall || 'Tanggal Pasang GPS',
              enableSorting: true,
              size: 140,
              cell: ({ row }) => <span className="text-[12px] text-foreground-muted">{row.original.gpsInstallDate ? new Date(row.original.gpsInstallDate).toLocaleDateString('id-ID') : '-'}</span>,
            },
    {
              id: 'deviceImei',
              accessorKey: 'deviceImei',
              header: labels.fieldImei || 'IMEI',
              enableSorting: true,
              size: 160,
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
              header: labels.fieldSim || 'Nomor SIM',
              enableSorting: true,
              size: 140,
              cell: ({ row }) => (
                <span className="text-[12px] text-foreground-muted font-mono">{row.original.deviceSimNumber || '-'}</span>
              ),
            },
    {
              id: 'assetNumber',
              accessorKey: 'assetNumber',
              header: labels.colAssetNumber || labels.colAsset || 'No Asset',
              enableSorting: true,
              size: 130,
              cell: ({ row }) => (
                <span className="text-[12px] font-mono text-foreground-muted">{row.original.assetNumber || '-'}</span>
              ),
            },
    {
              id: 'lastUpdate',
              accessorKey: 'lastUpdate',
              header: labels.fieldLastUpdate || 'Update Terakhir',
              enableSorting: true,
              size: 150,
              cell: ({ row }) => (
                <span className="text-[12px] text-foreground-muted tabular-nums">{row.original.lastUpdate ? new Date(row.original.lastUpdate).toLocaleString('id-ID', {
                  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : '-'}</span>
              ),
            },
    {
              id: 'notes',
              accessorKey: 'notes',
              header: labels.fieldNotes || labels.detailNotes || 'Catatan',
              enableSorting: false,
              size: 200,
              cell: ({ row }) => (
                <span className="text-[12px] text-foreground-muted block truncate max-w-[180px]" title={row.original.notes}>
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
  const labels = getTranslation(locale).vehicles as unknown as VehicleTableLabels;

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
          <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">{labels.actionAdd || 'Tambah'}</span>
          </Button>
        ) : undefined
      }
      labels={dtLabels}
    />
  );
}
