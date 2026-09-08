'use client';

import React from 'react';
import { MoreHorizontal, IdCard, Edit2, Trash2, UserRound, MapPin, Truck, Users } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Badge, Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DataTable,
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { Driver } from '../types/driver';

interface DriverTableLabels {
  colDriver: string;
  colContact: string;
  colIdentity: string;
  colStatus: string;
  colAssignment: string;
  colActions: string;
  statusActive: string;
  statusInactive: string;
  statusOnLeave: string;
  emptyTitle: string;
  emptyDescription: string;
  noResultTitle: string;
  noResultDescription: string;
  searchPlaceholder: string;
  addDriver: string;
  exportFilename: string;
  actionDetail: string;
  actionEdit: string;
  actionDelete: string;
  phone: string;
  ktp: string;
  licenseNo: string;
}

interface DriverTableProps {
  data: Driver[];
  labels: DriverTableLabels;
  onViewDetail: (driver: Driver) => void;
  onAdd: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  className?: string;
}

function getStatusBadge(status: Driver['status'], labels: DriverTableLabels) {
  const map = {
    active:   { label: labels.statusActive,   variant: 'success' as const },
    inactive: { label: labels.statusInactive, variant: 'danger' as const },
    on_leave: { label: labels.statusOnLeave,  variant: 'warning' as const },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>;
}

function buildColumns(
  labels: DriverTableLabels,
  onViewDetail: (d: Driver) => void,
): DataTableColumnDef<Driver>[] {
  return [
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex items-center justify-start px-1">
            <Button variant="ghost" size="sm" onClick={() => onViewDetail(d)} className="h-8 w-8 p-0 text-foreground-muted hover:text-foreground" title={labels.actionDetail}>
              <IdCard className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      size: 60,
    },
    {
      id: 'driver',
      header: labels.colDriver,
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span 
              onClick={() => onViewDetail(d)}
              className="font-medium text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors w-fit"
            >
              {d.name}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground-subtle flex items-center gap-1" title="Grup">
                <Users className="w-3 h-3" />
                {d.groupName || '-'}
              </span>
              <span className="text-xs text-foreground-subtle flex items-center gap-1" title="Penempatan">
                <MapPin className="w-3 h-3" />
                {d.placement}
              </span>
            </div>
          </div>
        );
      },
      enableSorting: true,
      size: 250,
      minSize: 200,
    },
    {
      id: 'contact',
      header: labels.colContact,
      accessorFn: (row) => row.phone,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm text-foreground font-medium">{d.phone}</span>
            <span className="text-xs text-foreground-subtle">{d.email}</span>
            <span className="text-xs text-foreground-muted mt-1 leading-tight line-clamp-2" title={d.address}>
              {d.address}
            </span>
          </div>
        );
      },
      enableSorting: true,
      size: 200,
    },
    {
      id: 'identity',
      header: labels.colIdentity,
      accessorFn: (row) => row.ktpNumber,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted">{labels.ktp}:</span>
              <span className="font-medium text-foreground-subtle">{d.ktpNumber}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground-muted">{labels.licenseNo}:</span>
              <span className="font-medium text-foreground-subtle">{d.licenseNumber}</span>
            </div>
          </div>
        );
      },
      enableSorting: false,
      size: 220,
    },
    {
      id: 'status',
      header: labels.colStatus,
      accessorFn: (row) => row.status,
      cell: ({ row }) => getStatusBadge(row.original.status, labels),
      enableSorting: true,
      size: 130,
    },
    {
      id: 'assignment',
      header: labels.colAssignment,
      accessorFn: (row) => row.assignedVehiclePlate || row.assignedVehicleId,
      cell: ({ row }) => {
        const d = row.original;
        if (!d.assignedVehicleId) {
          return <span className="text-sm text-foreground-muted italic">Tidak ada penugasan</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">
              <Truck className="w-4 h-4 text-foreground-subtle" />
            </div>
            <span className="text-sm font-medium text-foreground">{d.assignedVehiclePlate || d.assignedVehicleId}</span>
          </div>
        );
      },
      enableSorting: true,
      size: 180,
    }
  ];
}

export function DriverTable({
  data,
  labels,
  onViewDetail,
  onAdd,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  className,
}: DriverTableProps) {
  const columns = React.useMemo(() => buildColumns(labels, onViewDetail), [labels, onViewDetail]);

  return (
    <DataTable<Driver>
      className={className}
      data={data}
      columns={columns}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      exportable
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
      // UI Slots
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDescription}
      toolbarActions={
        <Button onClick={onAdd} variant="primary" className="bg-danger hover:bg-danger/90 text-white gap-2 h-9">
          <UserRound className="w-4 h-4" />
          <span className="hidden sm:inline-block">{labels.addDriver}</span>
        </Button>
      }
    />
  );
}
