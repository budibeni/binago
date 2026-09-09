'use client';

import React from 'react';
import { 
  Button, 
  DataTable, 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import { Mail, Phone, UserCircle, CreditCard, UserRound, MoreVertical, Plus } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { Personel } from '../types/personel';

interface PersonelTableLabels {
  colPersonel: string;
  colType: string;
  colNik: string;
  colStatus: string;
  colPhone: string;
  colEmail: string;
  colAddress: string;
  colNotes: string;
  colActions: string;
  emptyTitle: string;
  emptyDescription: string;
  noResultTitle: string;
  noResultDescription: string;
  searchPlaceholder: string;
  addPersonel: string;
  exportFilename: string;
  actionDetail: string;
  actionEdit: string;
  actionDelete: string;
  statusActive: string;
  statusInactive: string;
}

interface PersonelTableProps {
  data: Personel[];
  labels: PersonelTableLabels;
  onViewDetail: (personel: Personel) => void;
  onEdit: (personel: Personel) => void;
  onDelete: (personel: Personel) => void;
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
  labels: PersonelTableLabels,
  onViewDetail: (personel: Personel) => void,
  onEdit: (personel: Personel) => void,
  onDelete: (personel: Personel) => void
): DataTableColumnDef<Personel>[] {
  return [
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => {
        const p = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary focus:outline-none data-[state=open]:bg-neutral-200/50 dark:data-[state=open]:bg-neutral-800"
                aria-label="Aksi personel"
              >
                <MoreVertical className="h-4 w-4 text-foreground-muted" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetail(p)}>
                {labels.actionDetail}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(p)}>
                {labels.actionEdit}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onClick={() => onDelete(p)}>
                <span className="text-danger">{labels.actionDelete}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: 'name',
      header: labels.colPersonel,
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <span 
            onClick={() => onViewDetail(p)}
            className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors whitespace-nowrap"
          >
            {p.name}
          </span>
        );
      },
      enableSorting: true,
      size: 200,
    },
    {
      id: 'personelType',
      header: labels.colType,
      accessorFn: (row) => row.personelType,
      cell: ({ getValue }) => <span className="text-info">{getValue() as string}</span>,
      enableSorting: true,
      size: 140,
    },
    {
      id: 'nik',
      header: labels.colNik,
      accessorFn: (row) => row.nik,
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
      id: 'status',
      header: labels.colStatus,
      accessorFn: (row) => row.status,
      cell: ({ row }) => {
        const status = row.original.status as string;
        const isActive = status === 'ACTIVE';
        return (
          <div className="flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-success' : 'bg-danger')} />
            <span className="text-[13px] text-foreground-muted">{isActive ? labels.statusActive : labels.statusInactive}</span>
          </div>
        );
      },
      enableSorting: true,
      size: 130,
    },
    {
      id: 'notes',
      header: labels.colNotes,
      accessorFn: (row) => row.notes,
      enableSorting: false,
      size: 200,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground-muted block truncate max-w-[180px]" title={row.original.notes || ''}>
          {row.original.notes || '-'}
        </span>
      ),
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  email: false,
  address: false,
  notes: false,
};

export function PersonelTable({
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
}: PersonelTableProps) {
  const columns = React.useMemo(
    () => buildColumns(labels, onViewDetail, onEdit, onDelete),
    [labels, onViewDetail, onEdit, onDelete]
  );

  return (
    <DataTable<Personel>
      className={className}
      data={data}
      columns={columns}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      exportable
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
