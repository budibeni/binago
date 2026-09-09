'use client';

import React from 'react';
import { MoreVertical, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';
import type { Customer, CompanyCustomer } from '../types/customer';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@adatrack/ui';
import { cn } from '@adatrack/utils';

interface CustomerTableLabels {
  colCode: string;
  colCustomer: string;
  colType: string;
  colContact: string;
  colPic: string;
  colAddress: string;
  colCity: string;
  colStatus: string;
  colActions: string;

  typeIndividual: string;
  typeCompany: string;
  statusActive: string;
  statusInactive: string;

  emptyTitle: string;
  emptyDescription: string;
  noResultTitle: string;
  noResultDescription: string;
  searchPlaceholder: string;
  exportFilename: string;
  actionDetail: string;
  actionEdit: string;
  actionDelete: string;
}

interface CustomerTableProps {
  data: Customer[];
  labels: CustomerTableLabels;
  onViewDetail: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
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
  labels: CustomerTableLabels,
  onViewDetail: (c: Customer) => void,
  onEdit: (c: Customer) => void,
  onDelete: (c: Customer) => void,
): DataTableColumnDef<Customer>[] {
  return [
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => {
        const c = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary focus:outline-none data-[state=open]:bg-neutral-200/50 dark:data-[state=open]:bg-neutral-800"
                aria-label="Aksi pelanggan"
              >
                <MoreVertical className="h-4 w-4 text-foreground-muted" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetail(c)}>
                <Eye className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>{labels.actionDetail}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(c)}>
                <Edit2 className="mr-2 h-4 w-4 text-foreground-muted" />
                <span>{labels.actionEdit}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onClick={() => onDelete(c)}>
                <Trash2 className="mr-2 h-4 w-4 text-danger" />
                <span>{labels.actionDelete}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: 'customerName',
      accessorKey: 'name',
      header: labels.colCustomer,
      enableSorting: true,
      size: 240,
      cell: ({ row }) => (
        <span
          onClick={() => onViewDetail(row.original)}
          className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors whitespace-nowrap"
        >
          {row.original.name}
        </span>
      ),
    },
    {
      id: 'code',
      accessorKey: 'code',
      header: labels.colCode,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <span className="text-[13px] font-mono text-foreground-muted">{row.original.code}</span>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: labels.colType,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <span className={cn('text-[13px]', row.original.type === 'COMPANY' ? 'text-info' : 'text-foreground-muted')}>
          {row.original.type === 'COMPANY' ? labels.typeCompany : labels.typeIndividual}
        </span>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => {
        const isActive = row.original.status === 'ACTIVE';
        return (
          <div className="flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-success' : 'bg-danger')} />
            <span className="text-[13px] text-foreground-muted">
              {isActive ? labels.statusActive : labels.statusInactive}
            </span>
          </div>
        );
      },
    },
    {
      id: 'contact',
      header: labels.colContact,
      accessorFn: (row) => row.phone,
      enableSorting: false,
      size: 160,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground">{row.original.phone}</span>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      accessorFn: (row) => row.email,
      enableSorting: false,
      size: 200,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground-muted">{row.original.email || '-'}</span>
      ),
    },
    {
      id: 'pic',
      header: labels.colPic,
      enableSorting: false,
      size: 180,
      cell: ({ row }) => {
        if (row.original.type === 'INDIVIDUAL') return <span className="text-[13px] text-foreground-muted/50">-</span>;
        const comp = row.original as CompanyCustomer;
        return <span className="text-[13px] text-foreground">{comp.picName || '-'}</span>;
      },
    },
    {
      id: 'city',
      header: labels.colCity,
      accessorFn: (row) => row.city,
      enableSorting: true,
      size: 130,
      cell: ({ row }) => <span className="text-[13px] text-foreground">{row.original.city || '-'}</span>,
    },
    {
      id: 'address',
      header: labels.colAddress,
      accessorFn: (row) => row.address,
      enableSorting: false,
      size: 200,
      cell: ({ row }) => <span className="text-[13px] text-foreground-muted truncate block max-w-full" title={row.original.address}>{row.original.address || '-'}</span>,
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  code: false,
  email: false,
  pic: false,
  address: false,
};

export function CustomerTable({
  data,
  labels,
  onViewDetail,
  onEdit,
  onDelete,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  onAdd,
  className,
  dtLabels,
}: CustomerTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onViewDetail, onEdit, onDelete),
    [labels, onViewDetail, onEdit, onDelete],
  );

  return (
    <DataTable<Customer>
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
