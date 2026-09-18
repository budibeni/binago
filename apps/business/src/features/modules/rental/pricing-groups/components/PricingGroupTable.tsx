import React from 'react';
import { DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { MoreVertical, Edit2, Info, Users, Tag, Eye } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Badge } from '@adatrack/ui';
import type { RentalPricingGroup } from '../types/pricing';

export interface EnrichedPricingGroup extends RentalPricingGroup {
  vehicleCount: number;
}

export interface PricingGroupTableProps {
  data: EnrichedPricingGroup[];
  labels: Record<string, string>;
  toolbarActions?: React.ReactNode;
  onEdit: (group: EnrichedPricingGroup) => void;
  onDetail: (group: EnrichedPricingGroup) => void;
  isLoading?: boolean;
  className?: string;
}

export function PricingGroupTable({ 
  data, 
  labels, 
  toolbarActions, 
  onEdit, 
  onDetail, 
  isLoading,
  className
}: PricingGroupTableProps) {
  const [searchValue, setSearchValue] = React.useState('');

  const columns = React.useMemo<DataTableColumnDef<EnrichedPricingGroup>[]>(() => [
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
          onClick={() => onDetail?.(row.original)}
          title={labels.actionDetail}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nama Grup Tarif',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => (
        <button 
          onClick={() => onDetail?.(row.original)}
          className="font-semibold text-sm hover:underline hover:text-primary transition-colors text-left focus:outline-none focus-visible:underline"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      enableSorting: true,
      size: 300,
      cell: ({ row }) => <span className="text-sm text-foreground-subtle">{row.original.description || '-'}</span>,
    },
    {
      accessorKey: 'vehicleCount',
      header: 'Kendaraan',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center space-x-1.5 text-foreground-muted">
          <Users className="h-3.5 w-3.5" />
          <span className="text-sm">{row.original.vehicleCount} unit</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'ACTIVE' ? 'success' : 'default'}>
          {row.original.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
        </Badge>
      ),
    },
  ], [labels]);

  return (
    <DataTable<EnrichedPricingGroup>
      className={className}
      columns={columns}
      data={data}
      searchable
      sortable
      pagination
      exportable
      exportFilename="grup-tarif-rental"
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchPlaceholder={labels.searchPlaceholder}
      toolbarActions={toolbarActions}
      isLoading={isLoading}
    />
  );
}
