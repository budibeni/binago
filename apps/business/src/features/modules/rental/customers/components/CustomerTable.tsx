'use client';

import React from 'react';
import { MoreHorizontal, Edit2, Trash2, FileText, Plus } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Badge, Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@adatrack/ui';
import {
  useDataTable,
  DataTableHeader,
  DataTableBody,
  DataTableToolbar,
  DataTablePagination,
  DataTableFilterPanel,
  type DataTableColumnDef,
  type DataTablePaginationConfig,
  type DataTableFilterConfig,
  type ColumnVisibilityState,
  type SortingState,
} from '@adatrack/ui';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

interface CustomerTableLabels {
  colCode: string;
  colCustomer: string;
  colType: string;
  colContact: string;
  colPic: string;
  colActiveVehicles: string;
  colActiveContracts: string;
  colStatus: string;
  colActions: string;
  
  typeIndividual: string;
  typeCompany: string;
  statusActive: string;
  statusInactive: string;
  
  emptyTitle: string;
  emptyDescription: string;
  noResultTitle: string;
  noResultDescription: string;
  searchPlaceholder: string;
  exportFilename: string;
  actionDetail: string;
  actionEdit: string;
  actionDelete: string;
}

interface CustomerTableProps {
  data: Customer[];
  labels: CustomerTableLabels;
  onViewDetail: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  onAdd?: () => void;
  className?: string;
}

function getStatusBadge(status: Customer['status'], labels: CustomerTableLabels) {
  const isActive = status === 'ACTIVE';
  return (
    <Badge variant={isActive ? 'success' : 'default'} dot>
      {isActive ? labels.statusActive : labels.statusInactive}
    </Badge>
  );
}

function buildColumns(
  labels: CustomerTableLabels,
  onViewDetail: (c: Customer) => void,
  onEdit: (c: Customer) => void,
  onDelete: (c: Customer) => void,
): DataTableColumnDef<Customer>[] {
  return [
    {
      id: 'customerName',
      accessorKey: 'name',
      header: labels.colCustomer,
      enableSorting: true,
      size: 260,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => onViewDetail(row.original)}
            title="Buka Detail"
          >
            <FileText className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-foreground">{row.original.name}</span>
            <span className="text-[12px] text-foreground-muted">{row.original.code}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: labels.colType,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => (
        <Badge variant={row.original.type === 'COMPANY' ? 'info' : 'default'}>
          {row.original.type === 'COMPANY' ? labels.typeCompany : labels.typeIndividual}
        </Badge>
      ),
    },
    {
      id: 'contact',
      header: labels.colContact,
      enableSorting: false,
      size: 180,
      cell: ({ row }) => (
        <div className="flex flex-col text-[13px]">
          <span className="text-foreground">{row.original.phone}</span>
          <span className="text-foreground-muted text-[12px]">{row.original.email}</span>
        </div>
      ),
    },
    {
      id: 'pic',
      header: labels.colPic,
      enableSorting: false,
      size: 180,
      cell: ({ row }) => {
        if (row.original.type === 'INDIVIDUAL') return <span className="text-foreground-muted">-</span>;
        const comp = row.original as CompanyCustomer;
        return (
          <div className="flex flex-col text-[13px]">
            <span className="text-foreground">{comp.picName}</span>
            <span className="text-foreground-muted text-[12px]">{comp.picPhone}</span>
          </div>
        );
      },
    },
    {
      id: 'activeVehicles',
      header: labels.colActiveVehicles,
      enableSorting: false,
      size: 130,
      cell: () => <span className="text-foreground-muted text-[13px] text-center">-</span>,
    },
    {
      id: 'activeContracts',
      header: labels.colActiveContracts,
      enableSorting: false,
      size: 130,
      cell: () => <span className="text-foreground-muted text-[13px] text-center">-</span>,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus,
      enableSorting: true,
      size: 120,
      cell: ({ row }) => getStatusBadge(row.original.status, labels),
    },
  ];
}

const DEFAULT_COLUMN_VISIBILITY = {
  activeVehicles: false,
  activeContracts: false,
};

export function CustomerTable({
  data,
  labels,
  onViewDetail,
  onEdit,
  onDelete,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  onAdd,
  className,
}: CustomerTableProps) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>(DEFAULT_COLUMN_VISIBILITY);

  React.useEffect(() => { setPageIndex(0); }, [data]);

  const columns = React.useMemo(
    () => buildColumns(labels, onViewDetail, onEdit, onDelete),
    [labels, onViewDetail, onEdit, onDelete],
  );

  const processedData = React.useMemo(() => {
    const result = [...data];
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a, b) => {
        let valA = a[id as keyof Customer];
        let valB = b[id as keyof Customer];
        
        if (id === 'customerName') {
           valA = a.name;
           valB = b.name;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        return 0;
      });
    }
    return result.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [data, sorting, pageIndex, pageSize]);

  const paginationConfig: DataTablePaginationConfig = {
    pageIndex,
    pageSize,
    totalCount: data.length,
    pageSizeOptions: [10, 20, 50],
    onPageChange: setPageIndex,
    onPageSizeChange: (s) => { setPageSize(s); setPageIndex(0); },
  };

  const table = useDataTable<Customer>({
    data: processedData,
    columns,
    sorting,
    onSortingChange: setSorting,
    mode: 'pagination',
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
    freezeConfig: { left: ['customerName'] },
    paginationConfig,
  });

  const activeFilterCount = Object.values(filterConfig.state).flat().filter(Boolean).length;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={labels.searchPlaceholder}
        showColumnToggle
        showExport
        showFilter
        isFilterOpen={isFilterOpen}
        onFilterOpenChange={onFilterOpenChange}
        activeFilterCount={activeFilterCount}
        exportConfig={{ filename: labels.exportFilename, enabled: true }}
        rightSlot={onAdd && (
          <Button variant="destructive" onClick={onAdd} className="h-9">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline-block">Tambah</span>
          </Button>
        )}
      />

      <div className={cn('flex items-stretch gap-4', isFilterOpen ? 'flex-col lg:flex-row' : '')}>
        <div className="flex-1 min-w-0 w-full">
          <div className="relative w-full overflow-x-auto rounded-lg border border-border bg-background shadow-sm max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                emptyTitle={labels.emptyTitle}
                emptyDescription={labels.emptyDescription}
                noResultTitle={labels.noResultTitle}
                noResultDescription={labels.noResultDescription}
              />
            </table>
          </div>
        </div>

        {isFilterOpen && (
          <div className="w-full lg:w-[280px] shrink-0 self-stretch">
            <DataTableFilterPanel config={filterConfig} className="h-full" />
          </div>
        )}
      </div>

      <DataTablePagination paginationConfig={paginationConfig} />
    </div>
  );
}
