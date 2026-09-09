'use client';

import React from 'react';
import { MoreVertical, IdCard, Edit2, Trash2, UserRound, MapPin, Truck, Users, Plus, Eye } from 'lucide-react';
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
      meta: { fixedWidth: true },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary focus:outline-none data-[state=open]:bg-neutral-200/50 dark:data-[state=open]:bg-neutral-800"
              aria-label="Aksi pengemudi"
              id={`driver-action-${row.original.id}`}
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
      id: 'name',
      header: labels.colDriver,
      accessorFn: (row) => row.name,
      cell: ({ row }) => (
        <span 
          onClick={() => onViewDetail(row.original)}
          className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors whitespace-nowrap"
        >
          {row.original.name}
        </span>
      ),
      enableSorting: true,
      size: 200,
    },
    {
      id: 'groupName',
      header: labels.colGroup,
      accessorFn: (row) => row.groupName || '-',
      cell: ({ getValue }) => <span className="text-info">{getValue() as string}</span>,
      enableSorting: true,
      size: 150,
    },
    {
      id: 'placement',
      header: labels.colPlacement,
      accessorFn: (row) => row.placement,
      enableSorting: true,
      size: 150,
    },
    {
      id: 'phone',
      header: labels.colPhone,
      accessorFn: (row) => row.phone,
      enableSorting: true,
      size: 140,
    },
    {
      id: 'email',
      header: labels.colEmail,
      accessorFn: (row) => row.email,
      enableSorting: true,
      size: 180,
    },
    {
      id: 'address',
      header: labels.colAddress,
      accessorFn: (row) => row.address,
      enableSorting: true,
      size: 250,
    },
    {
      id: 'ktpNumber',
      header: labels.colKtp,
      accessorFn: (row) => row.ktpNumber,
      enableSorting: true,
      size: 160,
    },
    {
      id: 'placeOfBirth',
      header: labels.colPob,
      accessorFn: (row) => row.placeOfBirth || '-',
      enableSorting: true,
      size: 150,
    },
    {
      id: 'dateOfBirth',
      header: labels.colDob,
      accessorFn: (row) => row.dateOfBirth || '-',
      enableSorting: true,
      size: 140,
    },
    {
      id: 'licenseNumber',
      header: labels.colLicenseNo,
      accessorFn: (row) => row.licenseNumber,
      enableSorting: true,
      size: 160,
    },
    {
      id: 'licenseExpiry',
      header: labels.colLicenseExpiry,
      accessorFn: (row) => row.licenseExpiry || '-',
      enableSorting: true,
      size: 150,
    },
    {
      id: 'joinDate',
      header: labels.colJoinDate,
      accessorFn: (row) => row.joinDate || '-',
      // Aksi sudah di bagian atas
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
          <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">Tambah</span>
          </Button>
        ) : undefined
      }
    />
  );
}
