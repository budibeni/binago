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
import { Mail, Phone, UserCircle, CreditCard, UserRound, MoreVertical } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { Personel } from '../types/personel';

interface PersonelTableLabels {
  colPersonel: string;
  colContact: string;
  colIdentity: string;
  colStatus: string;
  colType: string;
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
  phone: string;
  nik: string;
  noCard: string;
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
      header: labels.colActions,
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
      enableSorting: false,
      size: 60,
    },
    {
      id: 'personel',
      header: labels.colPersonel,
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span 
                onClick={() => onViewDetail(p)}
                className="font-medium text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors w-fit"
              >
                {p.name}
              </span>
              <span className="text-xs text-muted-foreground">{p.personelType}</span>
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
        const p = row.original;
        return (
          <div className="flex flex-col gap-1 text-sm">
            {p.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>{p.phone}</span>
              </div>
            )}
            {p.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{p.email}</span>
              </div>
            )}
          </div>
        );
      },
      size: 200,
    },
    {
      id: 'identity',
      header: labels.colIdentity,
      accessorFn: (row) => row.nik,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex flex-col gap-1 text-sm">
            <div className="text-muted-foreground">
              {labels.nik}: {p.nik || '-'}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CreditCard className="w-3.5 h-3.5" />
              <span>{p.cardId || labels.noCard}</span>
            </div>
          </div>
        );
      },
      size: 200,
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
      size: 150,
    },
  ];
}

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
          <span className="hidden sm:inline-block">{labels.addPersonel}</span>
        </Button>
      }
    />
  );
}
