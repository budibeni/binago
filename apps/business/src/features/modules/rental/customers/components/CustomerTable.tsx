'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { Button, DataTable, PhoneLink, EmailLink } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';
import type { Customer, CompanyCustomer } from '../types/customer';

import { cn, formatCurrency } from '@adatrack/utils';

interface CustomerTableLabels {
  colCode: string;
  colCustomer: string;
  colType: string;
  colContact: string;
  colPic: string;
  colAddress: string;
  colCity: string;
  colStatus: string;
  colBilling: string;
  colPaid: string;
  colLastRental: string;
  colLastPayment: string;
  colOutstanding: string;
  colRentals: string;
  colEmail?: string;
  locale?: string;
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
  addCustomer: string;
}

interface CustomerTableProps {
  data: Customer[];
  labels: CustomerTableLabels;
  onViewDetail: (customer: Customer) => void;
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
): DataTableColumnDef<Customer>[] {
  return [

    {
      id: 'customerName',
      accessorKey: 'name',
      header: labels.colCustomer,
      enableSorting: true,
      minSize: 200,
      cell: ({ row }) => (
        <button
          onClick={() => onViewDetail(row.original)}
          className="whitespace-nowrap text-inherit font-inherit hover:text-primary transition-colors hover:underline text-left"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      id: 'code',
      accessorKey: 'code',
      header: labels.colCode,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <span >{row.original.code}</span>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: labels.colType,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <span>
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
            <span >
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
        <PhoneLink phone={row.original.phone} />
      ),
    },
    {
      id: 'email',
      header: labels.colEmail || 'Email',
      accessorFn: (row) => row.email,
      enableSorting: false,
      minSize: 250,
      cell: ({ row }) => (
        <EmailLink email={row.original.email} />
      ),
    },
    {
      id: 'pic',
      header: labels.colPic,
      enableSorting: false,
      size: 180,
      cell: ({ row }) => {
        if (row.original.type === 'INDIVIDUAL') return '-';
        const comp = row.original as CompanyCustomer;
        return <span >{comp.picName || '-'}</span>;
      },
    },
    {
      id: 'city',
      header: labels.colCity,
      accessorFn: (row) => row.city,
      enableSorting: true,
      size: 130,
      cell: ({ row }) => <span >{row.original.city || '-'}</span>,
    },
    {
      id: 'address',
      header: labels.colAddress,
      accessorFn: (row) => row.address,
      enableSorting: false,
      cell: ({ row }) => <span className="truncate block max-w-full" title={row.original.address}>{row.original.address || '-'}</span>,
    },
    {
      id: 'rentals',
      header: labels.colRentals,
      accessorFn: (row) => row.balance?.totalRentals || 0,
      enableSorting: true,
      size: 110,
      cell: ({ row }) => {
        const val = row.original.balance?.totalRentals || 0;
        return (
          <div className="text-right w-full">
            <span className="inline-flex items-center justify-center min-w-[2rem] px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-foreground-muted font-medium text-[11px]">
              {val}x
            </span>
          </div>
        );
      },
    },
    {
      id: 'billing',
      header: labels.colBilling,
      accessorFn: (row) => row.balance?.totalBilling || 0,
      enableSorting: true,
      cell: ({ row }) => {
        const val = row.original.balance?.totalBilling || 0;
        return (
          <div className="text-right w-full">
            <span >
              {formatCurrency(val)}
            </span>
          </div>
        );
      },
    },
    {
      id: 'paid',
      header: labels.colPaid,
      accessorFn: (row) => row.balance?.totalPaid || 0,
      enableSorting: true,
      cell: ({ row }) => {
        const val = row.original.balance?.totalPaid || 0;
        return (
          <div className="text-right w-full">
            <span >
              {formatCurrency(val)}
            </span>
          </div>
        );
      },
    },
    {
      id: 'outstanding',
      header: labels.colOutstanding,
      accessorFn: (row) => row.balance?.totalOutstanding || 0,
      enableSorting: true,
      cell: ({ row }) => {
        const val = row.original.balance?.totalOutstanding || 0;
        return (
          <div className="text-right w-full">
            <span>
              {formatCurrency(val)}
            </span>
          </div>
        );
      },
    },
    {
      id: 'lastRental',
      header: labels.colLastRental,
      accessorFn: (row) => row.balance?.lastRentalDate || '',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const val = row.original.balance?.lastRentalDate;
        if (!val) return '-';
        const d = new Date(val);
        return <span >{d.toLocaleDateString(labels.locale || 'id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>;
      },
    },
    {
      id: 'lastPayment',
      header: labels.colLastPayment,
      accessorFn: (row) => row.balance?.lastPaymentDate || '',
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const val = row.original.balance?.lastPaymentDate;
        if (!val) return '-';
        const d = new Date(val);
        return <span >{d.toLocaleDateString(labels.locale || 'id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>;
      },
    },

  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  code: false,
  email: false,
  pic: false,
  address: false,
  lastPayment: false,
};

export function CustomerTable({
  data,
  labels,
  onViewDetail,
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
    () => buildColumns(labels, onViewDetail),
    [labels, onViewDetail],
  );

  return (
    <DataTable<Customer>
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
      labels={dtLabels}
      // UI Slots
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDescription}
      toolbarActions={
        onAdd ? (
          <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 font-medium shadow-none">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">{labels.addCustomer}</span>
          </Button>
        ) : undefined
      }
    />
  );
}
