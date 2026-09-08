'use client';

import React from 'react';
import { MoreVertical, Edit2, CreditCard } from 'lucide-react';
import {
  Badge, Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem,
  DataTable,
} from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig } from '@adatrack/ui';
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
}

function buildColumns(
  onEdit: (v: CardModel) => void,
  t: CardTranslation,
): DataTableColumnDef<CardModel>[] {
  return [
    {
      id: 'actions',
      header: t.table.colActions,
      enableSorting: false,
      size: 60,
      cell: ({ row }) => {
        const card = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">{t.table.colActions}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(card)}>
                <Edit2 className="mr-2 h-4 w-4 text-slate-500" /> {t.actions.editCard}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: 'name',
      header: t.table.colCard,
      accessorKey: 'name',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
              <CreditCard className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-foreground text-sm">{d.name}</span>
              <span className="text-xs text-neutral-500">{d.notes || '-'}</span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'holder',
      header: t.table.colHolder,
      size: 200,
      cell: ({ row }) => {
        const d = row.original;
        const holderName = d.holderName ?? '-';
        const subtitle = d.holderSubtitle;

        return (
          <div className="flex flex-col">
            <span className={subtitle ? "font-medium text-foreground" : "text-neutral-500 italic"}>
              {holderName}
            </span>
            {subtitle && (
              <span className="text-xs text-neutral-500 uppercase">{subtitle}</span>
            )}
          </div>
        );
      },
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
          <Badge variant={type === 'RFID' ? 'default' : 'info'} className="text-xs">
            {type}
          </Badge>
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
        <span className="text-[12px] font-mono text-foreground-muted">
          {row.original.uid}
        </span>
      ),
    },
    {
      id: 'purposes',
      header: t.table.colPurpose,
      accessorKey: 'purposes',
      enableSorting: false,
      size: 240,
      cell: ({ row }) => {
        const purposes = row.original.purposes;
        if (!purposes || purposes.length === 0) return <span className="text-sm text-foreground-muted/50">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {purposes.map(p => (
              <Badge key={p} variant="default" className="text-[10px] py-0">
                {t.purpose[p as keyof typeof t.purpose] ?? p}
              </Badge>
            ))}
          </div>
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
        return (
          <Badge variant={status === 'ACTIVE' ? 'success' : 'default'} dot>
            {t.status[status as keyof typeof t.status] ?? status}
          </Badge>
        );
      },
    },
    {
      id: 'updatedAt',
      header: t.table.colUpdatedAt,
      accessorKey: 'updatedAt',
      enableSorting: true,
      size: 160,
      cell: ({ row }) => (
        <span suppressHydrationWarning className="text-sm text-foreground-muted">
          {new Date(row.original.updatedAt).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
      ),
    },
  ];
}

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
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={t.searchPlaceholder}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // UI Slots
      emptyTitle={t.table.emptyTitle}
      emptyDescription={t.table.emptyDescription}
    />
  );
}
