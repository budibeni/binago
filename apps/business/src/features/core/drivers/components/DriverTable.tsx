'use client';

import React from 'react';
import { MoreVertical, IdCard, Edit2, Trash2, UserRound, MapPin, Truck, Users, Plus, Eye, Star } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Badge, Button,
  DataTable,
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { Driver } from '../types/driver';

interface DriverTableLabels {
  colDriver: string;
  colGroup: string;
  colPlacement: string;
  colPhone: string;
  colEmail: string;
  colAddress: string;
  colKtp: string;
  colPob: string;
  colDob: string;
  colLicenseNo: string;
  colLicenseExpiry: string;
  colJoinDate: string;
  colStatus: string;
  colVehicle: string;
  colPerformance: string;
  colActions: string;
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
}

interface DriverTableProps {
  data: Driver[];
  labels: DriverTableLabels;
  onViewDetail: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  onAdd: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  className?: string;
  dtLabels?: any;
}

function buildColumns(
  labels: DriverTableLabels,
  onViewDetail: (d: Driver) => void,
  onEdit: (d: Driver) => void,
  onDelete: (d: Driver) => void,
): DataTableColumnDef<Driver>[] {
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
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
    {
      id: 'name',
      header: labels.colDriver,
      accessorFn: (row) => row.name,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onViewDetail(row.original)}
          className="font-bold text-primary hover:underline underline-offset-2 text-[12px] tracking-wider uppercase focus:outline-none"
        >
          {row.original.name}
        </button>
      ),
      enableSorting: true,
      size: 200,
      meta: { pin: 'left' },
    },
    {
      id: 'status',
      header: labels.colStatus,
      accessorFn: (row) => row.status,
      cell: ({ row }) => {
        const s = row.original.status;
        let variant: 'default' | 'destructive' | 'warning' | 'success' | 'outline' | 'secondary' = 'secondary';
        let label = s;
        if (s === 'active') {
          variant = 'success';
          label = 'Aktif';
        } else if (s === 'on_leave') {
          variant = 'warning';
          label = 'Cuti';
        } else if (s === 'inactive') {
          variant = 'danger';
          label = 'Nonaktif';
        }
        return <Badge variant={variant} dot className="capitalize border-transparent">{label}</Badge>;
      },
      enableSorting: true,
      size: 130,
    },
    {
      id: 'assignedVehiclePlate',
      header: labels.colVehicle,
      accessorFn: (row) => row.assignedVehiclePlate || '-',
      cell: ({ getValue }) => <span className="font-semibold text-[12px] text-foreground tracking-wider uppercase">{getValue() as string}</span>,
      enableSorting: true,
      size: 140,
    },
    {
      id: 'performanceScore',
      header: labels.colPerformance,
      accessorFn: (row) => row.performanceScore || 0,
      cell: ({ getValue }) => {
        const val = getValue() as number;
        const rating = val >= 100 ? 5 : Math.floor(val / 20); // 100 -> 5, 80-99 -> 4, 60-79 -> 3, 40-59 -> 2, <40 -> 1
        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-0.5" title={`${val} / 100`}>
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
            <span className="font-bold text-[11px] tabular-nums text-foreground">{val} Poin</span>
          </div>
        );
      },
      enableSorting: true,
      size: 130,
    },
    {
      id: 'groupName',
      header: labels.colGroup,
      accessorFn: (row) => row.groupName || '-',
      cell: ({ getValue }) => <span className="text-[12px] text-info">{getValue() as string}</span>,
      enableSorting: true,
      size: 150,
    },
    {
      id: 'placement',
      header: labels.colPlacement,
      accessorFn: (row) => row.placement,
      cell: ({ getValue }) => <span className="text-[12px] text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 150,
    },
    {
      id: 'licenseNumber',
      header: labels.colLicenseNo,
      accessorFn: (row) => row.licenseNumber,
      cell: ({ getValue }) => <span className="text-[12px] text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 160,
    },
    {
      id: 'licenseExpiry',
      header: labels.colLicenseExpiry,
      accessorFn: (row) => row.licenseExpiry || '-',
      cell: ({ getValue }) => <span className="text-[12px] tabular-nums text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 150,
    },
    {
      id: 'phone',
      header: labels.colPhone,
      accessorFn: (row) => row.phone,
      cell: ({ getValue }) => <span className="text-[12px] tabular-nums text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 140,
    },
    {
      id: 'email',
      header: labels.colEmail,
      accessorFn: (row) => row.email,
      cell: ({ getValue }) => <span className="text-[12px] text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 180,
    },
    {
      id: 'address',
      header: labels.colAddress,
      accessorFn: (row) => row.address,
      cell: ({ getValue }) => <span className="text-[12px] text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 250,
    },
    {
      id: 'ktpNumber',
      header: labels.colKtp,
      accessorFn: (row) => row.ktpNumber,
      cell: ({ getValue }) => <span className="text-[12px] tabular-nums text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 160,
    },
    {
      id: 'placeOfBirth',
      header: labels.colPob,
      accessorFn: (row) => row.placeOfBirth || '-',
      cell: ({ getValue }) => <span className="text-[12px] text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 150,
    },
    {
      id: 'dateOfBirth',
      header: labels.colDob,
      accessorFn: (row) => row.dateOfBirth || '-',
      cell: ({ getValue }) => <span className="text-[12px] tabular-nums text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 140,
    },
    {
      id: 'joinDate',
      header: labels.colJoinDate,
      accessorFn: (row) => row.joinDate || '-',
      cell: ({ getValue }) => <span className="text-[12px] tabular-nums text-foreground-muted">{getValue() as string}</span>,
      enableSorting: true,
      size: 140,
    }
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  groupName: false,
  email: false,
  address: false,
  ktpNumber: false,
  placeOfBirth: false,
  dateOfBirth: false,
  joinDate: false,
  licenseExpiry: false,
};

export function DriverTable({
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
  dtLabels,
}: DriverTableProps) {
  const columns = React.useMemo(() => buildColumns(labels, onViewDetail, onEdit, onDelete), [labels, onViewDetail, onEdit, onDelete]);

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
      labels={dtLabels}
      // UI Slots
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDescription}
      toolbarActions={
        onAdd ? (
          <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">{labels.addDriver}</span>
          </Button>
        ) : undefined
      }
    />
  );
}
