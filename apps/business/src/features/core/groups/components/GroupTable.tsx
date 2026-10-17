'use client';

import React from 'react';
import type { Group } from '../types';
import { DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableLabels } from '@adatrack/ui';
import { formatNumber } from '@adatrack/utils';

export interface GroupTableLabels {
  searchPlaceholder: string;
  nameCol: string;
  descCol: string;
  memberCountCol: string;
  actionCol: string;
  addBtn: string;
  editBtn: string;
  deleteBtn: string;
  detailBtn?: string;
  unit?: string;
}

export interface GroupTableProps {
  groups: Group[];
  labels: GroupTableLabels;
  toolbarActions?: React.ReactNode;
  onViewDetail?: (group: Group) => void;
  dtLabels?: DataTableLabels;
}

export function GroupTable({
  groups,
  labels,
  toolbarActions,
  onViewDetail,
  dtLabels,
}: GroupTableProps) {
  const [searchValue, setSearchValue] = React.useState('');

  const columns = React.useMemo<DataTableColumnDef<Group>[]>(
    () => [
      {
        accessorKey: 'name',
        header: labels.nameCol,
        enableSorting: true,
        size: 260,
        cell: ({ row }) => {
          const isFirst = row.index === 0;
          return (
            <button
              type="button"
              id={isFirst ? 'group-first-item-btn' : undefined}
              className="font-bold text-foreground hover:text-primary hover:underline underline-offset-2 focus:outline-none text-[13px] text-left transition-colors"
              onClick={() => onViewDetail?.(row.original)}
            >
              {row.original.name}
            </button>
          );
        },
      },
      {
        accessorKey: 'description',
        header: labels.descCol,
        enableSorting: true,
        size: 420,
        cell: ({ row }) => (
          <span
            className="block text-[13px] text-foreground-subtle max-w-[400px] truncate"
            title={row.original.description}
          >
            {row.original.description || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'memberCount',
        header: labels.memberCountCol,
        enableSorting: true,
        size: 160,
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-foreground-muted border border-border">
            {formatNumber(row.original.memberCount)} {labels.unit || 'unit'}
          </span>
        ),
      },
    ],
    [labels, onViewDetail],
  );

  return (
    <div id="group-table-container" className="h-full w-full bg-background relative flex flex-col">
      <DataTable<Group>
        columns={columns}
        data={groups}
        onRowActionClick={onViewDetail}
        searchable
        sortable
        pagination
        exportable
        exportFilename="data-grup"
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={labels.searchPlaceholder}
        toolbarActions={toolbarActions}
        emptyTitle="Grup Tidak Ditemukan"
        emptyDescription="Tidak ada data grup yang cocok dengan pencarian Anda."
        labels={dtLabels}
      />
    </div>
  );
}
