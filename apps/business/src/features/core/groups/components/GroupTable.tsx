import React from 'react';
import { GroupData } from '../data/mockGroupsData';
import { DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@adatrack/ui';

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
  onEdit?: (group: GroupData) => void;
  onDelete?: (group: GroupData) => void;
}

export function GroupTable({ groups, labels, toolbarActions, onEdit, onDelete }: GroupTableProps) {
  const [searchValue, setSearchValue] = React.useState('');

  const columns = React.useMemo<DataTableColumnDef<GroupData>[]>(() => [
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
              className="h-7 w-7 p-0 flex items-center justify-center focus:outline-none focus-visible:outline-none focus-visible:ring-0 data-[state=open]:bg-neutral-200/50 dark:data-[state=open]:bg-neutral-800"
            >
              <MoreVertical className="h-4 w-4 text-foreground-muted" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
              <Edit2 className="mr-2 h-4 w-4 text-foreground-muted" />
              <span>{labels.editBtn}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={() => onDelete?.(row.original)}>
              <Trash2 className="mr-2 h-4 w-4 text-danger" />
              <span>{labels.deleteBtn}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: 'name',
      header: labels.nameCol,
      enableSorting: true,
      size: 250,
      cell: ({ row }) => <span className="font-semibold text-sm">{row.original.name}</span>,
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
