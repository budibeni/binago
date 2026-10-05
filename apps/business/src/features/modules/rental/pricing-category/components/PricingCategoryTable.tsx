import React from 'react';
import { DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';
import { MoreVertical, Edit2, Info, Users, Tag, Eye } from 'lucide-react';
import { Button, Badge } from '@adatrack/ui';
import type { RentalPricingCategory } from '../types/pricing';

export interface EnrichedPricingCategory extends RentalPricingCategory {
  vehicleCount: number;
}

export interface PricingCategoryTableProps {
  data: EnrichedPricingCategory[];
  labels: Record<string, string>;
  toolbarActions?: React.ReactNode;
  onEdit: (group: EnrichedPricingCategory) => void;
  onDetail: (group: EnrichedPricingCategory) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  dtLabels?: DataTableLabels;
  isLoading?: boolean;
  className?: string;
}

export function PricingCategoryTable({ 
  data, 
  labels, 
  toolbarActions, 
  onEdit, 
  onDetail, 
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  dtLabels,
  isLoading,
  className
}: PricingCategoryTableProps) {
  const [searchValue, setSearchValue] = React.useState('');

  const columns = React.useMemo<DataTableColumnDef<EnrichedPricingCategory>[]>(() => [

    {
      accessorKey: 'name',
      header: labels.headerName || 'Nama Kategori Tarif',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => (
        <button
          onClick={() => onDetail(row.original)}
          className="text-left font-medium text-foreground hover:text-danger hover:underline focus:outline-none transition-colors"
        >
          {row.original.name}
        </button>
      ),
    },
    {
      accessorKey: 'description',
      header: labels.headerDesc || 'Deskripsi',
      enableSorting: true,
      size: 300,
      cell: ({ row }) => <span>{row.original.description || '-'}</span>,
    },
    {
      accessorKey: 'vehicleCount',
      header: labels.headerVehicles || 'Kendaraan',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center space-x-1.5">
          <Users className="h-3.5 w-3.5" />
          <span>{row.original.vehicleCount} {labels.unit || 'unit'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: labels.headerStatus || 'Status',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'ACTIVE' ? 'success' : 'default'}>
          {row.original.status === 'ACTIVE' ? (labels.statusActive || 'Aktif') : (labels.statusInactive || 'Nonaktif')}
        </Badge>
      ),
    },
  ], [labels]);

  return (
    <DataTable<EnrichedPricingCategory>
      className={className}
      columns={columns}
      data={data}
      onRowActionClick={onDetail}
      searchable
      sortable
      pagination
      exportable
      exportFilename="kategori-tarif-rental"
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      searchPlaceholder={labels.searchPlaceholder}
      toolbarActions={toolbarActions}
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      columnVisibility={true}
      labels={dtLabels}
      isLoading={isLoading}
    />
  );
}
