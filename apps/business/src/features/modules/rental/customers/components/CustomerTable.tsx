'use client';

import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Badge, Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import type { Customer, CompanyCustomer } from '../types/customer';

interface CustomerTableLabels {
  colCode: string;
  colCustomer: string;
  colType: string;
  colContact: string;
  colPic: string;
  colActiveVehicles: string;
  colActiveContracts: string;
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
}

function getStatusBadge(status: Customer['status'], labels: CustomerTableLabels) {
  const isActive = status === 'ACTIVE';
  return (
    <Badge variant={isActive ? 'success' : 'default'} dot>
      {isActive ? labels.statusActive : labels.statusInactive}
    </Badge>
  );
}

function buildColumns(
  labels: CustomerTableLabels,
  onViewDetail: (c: Customer) => void,
  onEdit: (c: Customer) => void,
  onDelete: (c: Customer) => void,
): DataTableColumnDef<Customer>[] {
  return [
    {
      id: 'customerName',
      accessorKey: 'name',
      header: labels.colCustomer,
      enableSorting: true,
      size: 260,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => onViewDetail(row.original)}
            title="Buka Detail"
          >
            <FileText className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-foreground">{row.original.name}</span>
            <span className="text-[12px] text-foreground-muted">{row.original.code}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: labels.colType,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <Badge variant={row.original.type === 'COMPANY' ? 'info' : 'default'}>
          {row.original.type === 'COMPANY' ? labels.typeCompany : labels.typeIndividual}
        </Badge>
      ),
    },
    {
      id: 'contact',
      header: labels.colContact,
      enableSorting: false,
      size: 180,
      cell: ({ row }) => (
        <div className="flex flex-col text-[13px]">
          <span className="text-foreground">{row.original.phone}</span>
          <span className="text-foreground-muted text-[12px]">{row.original.email}</span>
        </div>
      ),
    },
    {
      id: 'pic',
      header: labels.colPic,
      enableSorting: false,
      size: 180,
      cell: ({ row }) => {
        if (row.original.type === 'INDIVIDUAL') return <span className="text-foreground-muted">-</span>;
        const comp = row.original as CompanyCustomer;
        return (
          <div className="flex flex-col text-[13px]">
            <span className="text-foreground">{comp.picName}</span>
            <span className="text-foreground-muted text-[12px]">{comp.picPhone}</span>
          </div>
        );
      },
    },
    {
      id: 'activeVehicles',
      header: labels.colActiveVehicles,
      enableSorting: false,
      size: 130,
      cell: () => <span className="text-foreground-muted text-[13px] text-center">-</span>,
    },
    {
      id: 'activeContracts',
      header: labels.colActiveContracts,
      enableSorting: false,
      size: 130,
      cell: () => <span className="text-foreground-muted text-[13px] text-center">-</span>,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => getStatusBadge(row.original.status, labels),
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  activeVehicles: false,
  activeContracts: false,
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
      // UI Customizations
      emptyTitle={labels.emptyTitle}
      emptyDescription={labels.emptyDescription}
      toolbarActions={
        onAdd ? (
          <Button variant="destructive" onClick={onAdd} className="h-9">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline-block">Tambah</span>
          </Button>
        ) : undefined
      }
    />
  );
}
