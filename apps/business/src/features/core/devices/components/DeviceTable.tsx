'use client';

import React from 'react';
import { Smartphone, Radio, Eye, Edit2, Trash2, Plus, Truck, Cpu, Phone } from 'lucide-react';
import { Badge, Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { Device } from '../types/device';

interface DeviceTableLabels {
  colActions: string;
  colImei: string;
  colProtocol: string;
  colBrandModel: string;
  colSim: string;
  colVehicle: string;
  colStatus: string;
  colLastSeen: string;
  emptyTitle: string;
  emptyDescription: string;
  noResultTitle: string;
  noResultDescription: string;
  searchPlaceholder: string;
  addDevice: string;
  exportFilename: string;
  statusLabels: Record<string, string>;
  protocolLabels: Record<string, string>;
}

interface DeviceTableProps {
  data: Device[];
  labels: DeviceTableLabels;
  onViewDetail: (device: Device) => void;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
  onAdd: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  className?: string;
  isLoading?: boolean;
}

function buildColumns(
  labels: DeviceTableLabels,
  onViewDetail: (d: Device) => void,
  onEdit: (d: Device) => void,
  onDelete: (d: Device) => void,
): DataTableColumnDef<Device>[] {
  return [
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-full"
          onClick={() => onViewDetail(row.original)}
          title="Detail"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
    {
      id: 'imei',
      header: labels.colImei,
      accessorFn: (row) => row.imei,
      enableSorting: true,
      size: 220,
      cell: ({ row }) => {
        const d = row.original;
        const isMobile = d.protocol?.toUpperCase() === 'SMARTPHONE' || d.protocol?.toUpperCase() === 'HTTP_MOBILE';
        return (
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md shrink-0 ${isMobile ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800'}`}>
              {isMobile ? <Smartphone className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
            </div>
            <div className="min-w-0">
              <span
                onClick={() => onViewDetail(d)}
                className="font-mono text-[13px] font-semibold text-foreground hover:text-primary hover:underline cursor-pointer transition-colors block truncate"
              >
                {d.imei}
              </span>
              <span className="text-[11px] text-foreground-muted block truncate">
                {d.deviceBrand} {d.deviceModel}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'protocol',
      header: labels.colProtocol,
      accessorFn: (row) => row.protocol,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const proto = (row.original.protocol || '').toUpperCase();
        const isMobile = proto === 'SMARTPHONE' || proto === 'HTTP_MOBILE';
        const label = labels.protocolLabels[proto] || proto;
        return (
          <Badge
            variant={isMobile ? 'info' : 'default'}
            className="text-[11px] px-2 py-0.5 font-medium"
          >
            {label}
          </Badge>
        );
      },
    },
    {
      id: 'simNumber',
      header: labels.colSim,
      accessorFn: (row) => row.simNumber || '-',
      enableSorting: true,
      size: 150,
      cell: ({ getValue }) => {
        const val = getValue() as string;
        if (!val || val === '-') return <span className="text-foreground-muted">-</span>;
        return (
          <span className="text-[12px] font-mono text-foreground flex items-center gap-1">
            <Phone className="h-3 w-3 text-foreground-muted" />
            {val}
          </span>
        );
      },
    },
    {
      id: 'vehicle',
      header: labels.colVehicle,
      accessorFn: (row) => row.plateNumber || '-',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const d = row.original;
        if (d.vehicleId && d.plateNumber) {
          return (
            <div className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
              <div>
                <span className="font-semibold text-[13px] text-foreground">{d.plateNumber}</span>
                {d.vehicleName && <span className="text-[11px] text-foreground-muted ml-1.5">({d.vehicleName})</span>}
              </div>
            </div>
          );
        }
        return (
          <Badge variant="default" className="text-[11px] text-foreground-muted font-normal">
            Belum Dipasang (Idle)
          </Badge>
        );
      },
    },
    {
      id: 'status',
      header: labels.colStatus,
      accessorFn: (row) => row.status,
      enableSorting: true,
      size: 130,
      cell: ({ row }) => {
        const s = row.original.status;
        const isAssigned = row.original.vehicleId != null;
        let variant: 'success' | 'warning' | 'default' = 'default';
        let label = labels.statusLabels[s] || s;

        if (isAssigned) {
          variant = 'success';
          label = labels.statusLabels.assigned || 'Terpasang';
        } else {
          variant = 'default';
          label = labels.statusLabels.idle || 'Siap Pakai';
        }

        return (
          <Badge variant={variant} dot className="text-[11px] px-2 py-0.5">
            {label}
          </Badge>
        );
      },
    },
    {
      id: 'rowActions',
      header: '',
      enableSorting: false,
      size: 90,
      meta: { fixedWidth: true },
      cell: ({ row }) => {
        const d = row.original;
        const proto = (d.protocol || '').toUpperCase();
        const isSmartphone = proto === 'SMARTPHONE' || proto === 'HTTP_MOBILE';

        if (!isSmartphone) {
          return (
            <div className="flex items-center gap-1 justify-end">
              <span className="text-[10px] font-medium text-foreground-muted px-2 py-0.5 rounded border border-border/80 bg-neutral-50 dark:bg-neutral-800/60 whitespace-nowrap">
                Hanya Lihat
              </span>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-foreground-muted hover:text-primary hover:bg-neutral-100 rounded-md"
              onClick={() => onEdit(row.original)}
              title="Edit"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-foreground-muted hover:text-destructive hover:bg-destructive/10 rounded-md"
              onClick={() => onDelete(row.original)}
              title="Hapus"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}

export function DeviceTable({
  data,
  labels,
  onViewDetail,
  onEdit,
  onDelete,
  onAdd,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  className,
  isLoading,
}: DeviceTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onViewDetail, onEdit, onDelete),
    [labels, onViewDetail, onEdit, onDelete],
  );

  return (
    <DataTable<Device>
      className={className}
      data={data}
      columns={columns}
      isLoading={isLoading}
      searchable
      sortable
      pagination
      columnVisibility
      exportable
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={labels.searchPlaceholder}
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      exportFilename={labels.exportFilename}
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDescription}
      toolbarActions={
        onAdd ? (
          <Button
            variant="destructive"
            onClick={onAdd}
            className="h-8 gap-1.5 text-[13px] font-medium shadow-none"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">{labels.addDevice}</span>
          </Button>
        ) : undefined
      }
    />
  );
}
