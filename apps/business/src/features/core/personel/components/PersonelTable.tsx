'use client';

import React from 'react';
import { 
  useDataTable, 
  DataTableToolbar, 
  DataTableHeader, 
  DataTableBody, 
  DataTablePagination, 
  DataTableFilterPanel,
  Button
} from '@adatrack/ui';
import type { ColumnDef, SortingState } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { Mail, Phone, MapPin, UserCircle, CreditCard, UserRound } from 'lucide-react';
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
  filterConfig: any;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  className?: string;
}

function buildColumns(
  labels: PersonelTableLabels,
  onViewDetail: (personel: Personel) => void,
  onEdit: (personel: Personel) => void,
  onDelete: (personel: Personel) => void
): ColumnDef<Personel>[] {
  return [
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
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isActive ? labels.statusActive : labels.statusInactive}
          </div>
        );
      },
      size: 150,
    },
    {
      id: 'actions',
      header: labels.colActions,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onViewDetail(p)} className="h-8 px-2 text-xs">
              {labels.actionDetail}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(p)} className="h-8 px-2 text-xs">
              {labels.actionEdit}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(p)} className="h-8 px-2 text-xs text-red-600 hover:text-red-700">
              {labels.actionDelete}
            </Button>
          </div>
        );
      },
      enableSorting: false,
      size: 180,
    }
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
  
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});

  const columns = React.useMemo(
    () => buildColumns(labels, onViewDetail, onEdit, onDelete),
    [labels, onViewDetail, onEdit, onDelete]
  );

  const processedData = React.useMemo(() => {
    let result = [...data];
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a, b) => {
        const valA = (a as any)[id];
        const valB = (b as any)[id];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return desc ? valB - valA : valA - valB;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          return desc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        return 0;
      });
    }
    return result.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [data, sorting, pageIndex, pageSize]);

  const paginationConfig = {
    pageIndex,
    pageSize,
    totalCount: data.length,
    pageSizeOptions: [10, 20, 50],
    onPageChange: setPageIndex,
    onPageSizeChange: (s: number) => { setPageSize(s); setPageIndex(0); },
  };

  const table = useDataTable({
    data: processedData,
    columns,
    sorting,
    onSortingChange: setSorting,
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
    paginationConfig,
  });

  const activeFilterCount = Object.values(filterConfig.state).flat().filter(Boolean).length;

  return (
    <div className={cn('flex flex-col gap-3 h-full', className)}>
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
        rightSlot={
          <Button onClick={onAdd} variant="primary" className="bg-danger hover:bg-danger/90 text-white gap-2 h-9">
            <UserRound className="w-4 h-4" />
            <span className="hidden sm:inline-block">{labels.addPersonel}</span>
          </Button>
        }
      />

      <div className={cn('flex items-stretch gap-4 min-h-0 flex-1', isFilterOpen ? 'flex-col lg:flex-row' : '')}>
        <div className="flex-1 min-w-0 w-full flex flex-col">
          <div className="relative w-full flex-1 overflow-auto rounded-lg border border-border bg-background shadow-sm">
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
          <div className="w-full lg:w-[280px] shrink-0 self-stretch overflow-y-auto">
            <DataTableFilterPanel config={filterConfig} className="h-full" />
          </div>
        )}
      </div>

      <DataTablePagination paginationConfig={paginationConfig} />
    </div>
  );
}
