import React from 'react';
import { DataTable } from '@adatrack/ui';
import type { DataTableColumnDef, DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';
import { MoreVertical, Edit2, Info, Users, Tag, Eye, Car } from 'lucide-react';
import { Button, Badge } from '@adatrack/ui';
import type { RentalPricingCategory, RentalRate } from '../types/pricing';
import { formatCurrency } from '@adatrack/utils';

export interface EnrichedPricingCategory extends RentalPricingCategory {
  vehicleCount: number;
  rates: RentalRate[];
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
          className="text-left font-bold text-foreground hover:text-primary hover:underline focus:outline-none transition-colors text-[13px]"
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
      cell: ({ row }) => row.original.description || '-',
    },
    {
      id: 'hourlyRate',
      header: 'Per Jam',
      enableSorting: false,
      size: 130,
      accessorFn: (row) => {
        const rate = (row.rates || []).find(r => r.rateType === 'HOURLY');
        return rate ? formatCurrency(rate.amount) : '-';
      },
    },
    {
      id: 'dailyRate',
      header: labels.headerDaily || 'Harian',
      enableSorting: false,
      size: 130,
      accessorFn: (row) => {
        const rate = (row.rates || []).find(r => r.rateType === 'DAILY');
        return rate ? formatCurrency(rate.amount) : '-';
      },
    },
    {
      id: 'packages',
      header: 'Jml Paket',
      enableSorting: false,
      size: 100,
      accessorFn: (row) => {
        return row.packages?.length ? `${row.packages.length} Paket` : '-';
      },
    },

    {
      accessorKey: 'vehicleCount',
      header: labels.headerVehicles || 'Kendaraan',
      enableSorting: true,
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center space-x-1.5">
          <Car className="h-3.5 w-3.5" />
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
