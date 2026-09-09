'use client';

import React from 'react';
import { MoreVertical, Edit2 } from 'lucide-react';
import {
  Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem,
  DataTable,
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import type { CardModel } from '../types/card';
import type { getCardTranslation } from '../i18n';

type CardTranslation = ReturnType<typeof getCardTranslation>;

interface CardTableProps {
  data: CardModel[];
  onEdit: (card: CardModel) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  t: CardTranslation;
  className?: string;
  dtLabels?: any;
  exportFilename?: string;
}

function buildColumns(
  onEdit: (v: CardModel) => void,
  t: CardTranslation,
): DataTableColumnDef<CardModel>[] {
  return [
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => {
        const card = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary focus:outline-none data-[state=open]:bg-neutral-200/50 dark:data-[state=open]:bg-neutral-800"
                aria-label="Aksi kartu"
              >
                <MoreVertical className="h-4 w-4 text-foreground-muted" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(card)}>
                <Edit2 className="mr-2 h-4 w-4 text-foreground-muted" /> {t.actions.editCard}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    // Kolom: Nama, Tipe, Status, Pemegang, Penggunaan, UID, Catatan, Diperbarui
    {
      id: 'name',
      header: t.table.colCard,
      accessorKey: 'name',
      enableSorting: true,
      size: 180,
      cell: ({ row }) => (
        <span className="font-medium text-foreground whitespace-nowrap">{row.original.name}</span>
      ),
    },
    {
      id: 'type',
      header: t.table.colType,
      accessorKey: 'type',
      enableSorting: true,
      size: 90,
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <span className="text-[13px] text-info">{type}</span>
        );
      },
    },
    {
      id: 'status',
      header: t.table.colStatus,
      accessorKey: 'status',
      enableSorting: true,
      size: 110,
      cell: ({ row }) => {
        const status = row.original.status;
        const isActive = status === 'ACTIVE';
        return (
          <div className="flex items-center gap-1.5">
            <span className={cn('h-1.5 w-1.5 rounded-full', isActive ? 'bg-success' : 'bg-danger')} />
            <span className="text-[13px] text-foreground-muted">
              {t.status[status as keyof typeof t.status] ?? status}
            </span>
          </div>
        );
      },
    },
    {
      id: 'holder',
      header: t.table.colHolder,
      size: 200,
      accessorFn: (row) => row.holderName ?? '-',
      cell: ({ row }) => {
        const d = row.original;
        const holderName = d.holderName ?? '-';
        const hasHolder = !!d.holderId;
        return (
          <span className={hasHolder ? 'text-foreground' : 'text-foreground-muted italic'}>
            {holderName}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      id: 'purposes',
      header: t.table.colPurpose,
      accessorKey: 'purposes',
      enableSorting: false,
      size: 200,
      cell: ({ row }) => {
        const purposes = row.original.purposes;
        if (!purposes || purposes.length === 0) return <span className="text-[13px] text-foreground-muted/50">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {purposes.map(p => (
              <span
                key={p}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-neutral-100 dark:bg-neutral-800 text-foreground-muted border border-border/60"
              >
                {t.purpose[p as keyof typeof t.purpose] ?? p}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: 'uid',
      header: t.table.colUid,
      accessorKey: 'uid',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => (
        <span className="text-[13px] font-mono text-foreground-muted">
          {row.original.uid}
        </span>
      ),
    },
    {
      id: 'notes',
      header: t.form.labelNotes,
      accessorKey: 'notes',
      enableSorting: false,
      size: 200,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground-muted block truncate max-w-[180px]" title={row.original.notes || ''}>
          {row.original.notes || '-'}
        </span>
      ),
    },
    {
      id: 'updatedAt',
      header: t.table.colUpdatedAt,
      accessorKey: 'updatedAt',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span suppressHydrationWarning className="text-[13px] text-foreground-muted">
          {new Date(row.original.updatedAt).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
      ),
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  notes: false,
  updatedAt: false,
};

export function CardTable({
  data,
  onEdit,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  t,
  className,
  dtLabels,
  exportFilename,
}: CardTableProps) {
  const columns = React.useMemo(() => buildColumns(onEdit, t), [onEdit, t]);

  return (
    <DataTable<CardModel>
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
      searchPlaceholder={t.searchPlaceholder}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // Export
      exportFilename={exportFilename}
      labels={dtLabels}
      // UI Slots
      emptyTitle={t.table.emptyTitle}
      emptyDescription={t.table.emptyDescription}
    />
  );
}
