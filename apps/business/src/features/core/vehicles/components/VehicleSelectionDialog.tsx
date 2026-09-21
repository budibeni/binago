import React from 'react';
import {
  Dialog,
  Button,
  Checkbox,
  DataTable,
  type DataTableColumnDef,
  type DataTableFilterConfig
} from '@adatrack/ui';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';

export interface VehicleSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
  onSubmit: (vehicleIds: string[]) => void;
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  submitLabel?: string;
  searchPlaceholder?: string;
  filterConfig?: DataTableFilterConfig;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function VehicleSelectionDialog({
  open,
  onOpenChange,
  vehicles,
  onSubmit,
  title = "Pilih Kendaraan",
  description,
  emptyTitle = "Tidak ada kendaraan",
  emptyDescription = "Tidak ada kendaraan yang dapat dipilih saat ini.",
  submitLabel = "Pilih",
  searchPlaceholder = "Cari plat nomor, merk, atau model...",
  filterConfig,
  onRefresh,
  isLoading,
}: VehicleSelectionDialogProps) {
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({
    fuelType: false,
    driverName: false,
    status: false,
    deviceImei: false,
  });

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIds([]);
    }
  }, [open]);

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    onSubmit(selectedIds);
  };

  const columns = React.useMemo<DataTableColumnDef<Vehicle>[]>(() => [
    {
      id: 'select',
      size: 40,
      meta: { pin: 'left' },
      header: ({ table }) => {
        const rows = table.getRowModel().rows;
        const visibleIds = rows.map((r) => r.original.id);
        const isAllSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

        return (
          <div className="px-1 flex items-center justify-center">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
                } else {
                  setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
                }
              }}
              aria-label="Select all"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const isSelected = selectedIds.includes(row.original.id);
        return (
          <div className="px-1 flex items-center justify-center">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedIds((prev) => [...prev, row.original.id]);
                } else {
                  setSelectedIds((prev) => prev.filter((id) => id !== row.original.id));
                }
              }}
              aria-label={`Select ${row.original.plateNumber}`}
              className="data-[state=checked]:bg-danger data-[state=checked]:border-danger"
            />
          </div>
        );
      }
    },
    {
      id: 'plateNumber',
      accessorKey: 'plateNumber',
      header: 'Plat Nomor',
      size: 140,
      cell: ({ row }) => (
        <span className="font-bold text-foreground text-[12px] tracking-wider uppercase">
          {row.original.plateNumber}
        </span>
      ),
    },
    {
      id: 'vehicleName',
      accessorKey: 'vehicleName',
      header: 'Kendaraan',
      size: 160,
      cell: ({ row }) => (
        <span className="text-[12px] text-foreground">
          {row.original.vehicleName}
        </span>
      ),
    },
    {
      id: 'groupName',
      accessorKey: 'groupName',
      header: 'Group',
      size: 150,
      cell: ({ row }) => (
        <span className="text-[12px] text-foreground-muted">{row.original.groupName}</span>
      ),
    },
    {
      id: 'brand',
      accessorKey: 'brand',
      header: 'Merek',
      size: 120,
      cell: ({ row }) => (
        <span className="text-[12px] text-foreground-muted">{row.original.brand}</span>
      ),
    },
    {
      id: 'year',
      accessorKey: 'year',
      header: 'Tahun',
      size: 90,
      cell: ({ row }) => (
        <span className="text-[12px] tabular-nums text-foreground">{row.original.year}</span>
      ),
    },
    {
      id: 'color',
      accessorKey: 'color',
      header: 'Warna',
      size: 100,
      cell: ({ row }) => (
        <span className="text-[12px] text-foreground-muted">{row.original.color || '-'}</span>
      ),
    },
    {
      id: 'vehicleCategory',
      accessorKey: 'vehicleCategory',
      header: 'Kategori',
      size: 120,
      cell: ({ row }) => {
        const catMap: Record<string, string> = {
          truck: 'Truk',
          minibus: 'Minibus',
          pickup: 'Pickup',
          motorcycle: 'Motor',
          other: 'Lainnya',
        };
        return <span className="text-[12px] text-foreground-muted">{catMap[row.original.vehicleCategory] || row.original.vehicleCategory}</span>;
      },
    },
    {
      id: 'fuelType',
      accessorKey: 'fuelType',
      header: 'Bahan Bakar',
      size: 100,
      cell: ({ row }) => {
        const fuelMap: Record<string, string> = {
          solar: 'Solar',
          bensin: 'Bensin',
          listrik: 'Listrik',
        };
        return <span className="text-[12px] text-foreground-muted">{fuelMap[row.original.fuelType] || row.original.fuelType}</span>;
      },
    },
    {
      id: 'driverName',
      accessorKey: 'driverName',
      header: 'Pengemudi',
      size: 150,
      cell: ({ row }) => (
        <span className={`text-[12px] ${row.original.driverName ? 'text-foreground' : 'text-foreground-muted italic'}`}>
          {row.original.driverName || 'Tidak ada driver'}
        </span>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      size: 100,
      cell: ({ row }) => (
        <span className="text-[12px] uppercase text-foreground-muted">{row.original.status}</span>
      ),
    },
    {
      id: 'deviceImei',
      accessorKey: 'deviceImei',
      header: 'IMEI',
      size: 140,
      cell: ({ row }) => (
        <span className="text-[12px] tabular-nums text-foreground-muted">{row.original.deviceImei || '-'}</span>
      ),
    },
  ], [selectedIds]);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      className="max-w-[850px] p-5 w-[95vw] bg-neutral-50 dark:bg-neutral-900"
    >
      <div className="flex flex-col gap-4 w-full h-[80vh] relative">
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="flex flex-col flex-1 min-h-0 border border-border rounded-xl overflow-hidden">
          <DataTable
            data={vehicles}
            columns={columns}
            searchable
            columnVisibility
            hideToolbarLabels
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder={searchPlaceholder}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            pagination
            filterConfig={filterConfig}
            onRefresh={onRefresh}
            isLoading={isLoading}
            columnVisibilityState={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-[13px] font-semibold">
            {selectedIds.length > 0 ? (
              <span className="text-danger">{selectedIds.length} kendaraan dipilih</span>
            ) : (
              <span className="text-muted-foreground">Tidak ada kendaraan dipilih</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={selectedIds.length === 0}
              onClick={handleSubmit}
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
