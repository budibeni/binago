import React from 'react';
import { GroupData } from '../data/mockGroupsData';
import { DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@adatrack/ui';

export interface GroupTableProps {
  groups: GroupData[];
  labels: {
    searchPlaceholder: string;
    nameCol: string;
    descCol: string;
    memberCountCol: string;
    actionCol: string;
    addBtn: string;
    editBtn: string;
    deleteBtn: string;
  };
  toolbarActions?: React.ReactNode;
  onViewDetail?: (group: GroupData) => void;
  onEdit?: (group: GroupData) => void;
  onDelete?: (group: GroupData) => void;
}

export function GroupTable({ groups, labels, toolbarActions, onViewDetail, onEdit, onDelete }: GroupTableProps) {
  const [searchValue, setSearchValue] = React.useState('');

  const columns = React.useMemo<DataTableColumnDef<GroupData>[]>(() => [
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 40,
      meta: { fixedWidth: true },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 flex items-center justify-center text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-full"
          onClick={() => onViewDetail?.(row.original)}
          title="Detail"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'name',
      header: labels.nameCol,
      enableSorting: true,
      size: 250,
      cell: ({ row }) => (
        <button
          type="button"
          className="font-bold text-primary hover:underline underline-offset-2 focus:outline-none text-[13px]"
          onClick={() => onViewDetail?.(row.original)}
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: 'description',
      header: labels.descCol,
      enableSorting: true,
      size: 350,
      cell: ({ row }) => <span className="text-sm text-foreground-subtle">{row.original.description}</span>,
    },
    {
      accessorKey: 'memberCount',
      header: labels.memberCountCol,
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-foreground-muted border border-border">
          {row.original.memberCount} unit
        </span>
      ),
    },
  ], [labels]);

  return (
    <div className="h-full w-full bg-background relative flex flex-col">
      <DataTable<GroupData>
        columns={columns}
        data={groups}
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
      />
    </div>
  );
}
