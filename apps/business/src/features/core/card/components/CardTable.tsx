'use client';

import React from 'react';
import { MoreHorizontal, Edit2, CreditCard } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Badge, Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem,
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
import type { AccessCredential } from '../types/credential';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardTableProps {
  data: AccessCredential[];
  onEdit: (card: AccessCredential) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterConfig: DataTableFilterConfig;
  isFilterOpen: boolean;
  onFilterOpenChange: (open: boolean) => void;
  className?: string;
}

// ─── Purpose label map ────────────────────────────────────────────────────────

const PURPOSE_LABEL: Record<string, string> = {
  ATTENDANCE:  'Absensi',
  CHECKER:     'Checker',
  ENGINE_AUTH: 'Menghidupkan Mesin',
};

// ─── Column Factory ────────────────────────────────────────────────────────────

function buildColumns(
  onEdit: (v: AccessCredential) => void,
): DataTableColumnDef<AccessCredential>[] {
  return [
    {
      id: 'name',
      header: 'Card',
      accessorKey: 'name',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
            <CreditCard className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-medium text-foreground text-sm">{row.original.name}</span>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'type',
      enableSorting: true,
      size: 90,
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge variant={type === 'RFID' ? 'primary' : 'info'} className="text-xs">
            {type}
          </Badge>
        );
      },
    },
    {
      id: 'uid',
      header: 'UID / Card Number',
      accessorKey: 'uid',
      enableSorting: true,
      size: 200,
      cell: ({ row }) => (
        <span className="text-[12px] font-mono text-foreground-muted">
          {row.original.uid}
        </span>
      ),
    },
    // -- tidak ada kolom holderType / holderId
    {
      id: 'purposes',
      header: 'Purpose',
      accessorKey: 'purposes',
      enableSorting: false,
      size: 240,
      cell: ({ row }) => {
        const purposes = row.original.purposes;
        if (!purposes || purposes.length === 0) return <span className="text-sm text-foreground-muted/50">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {purposes.map(p => (
              <Badge key={p} variant="outline" className="text-[10px] py-0">
                {PURPOSE_LABEL[p] ?? p}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      enableSorting: true,
      size: 110,
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === 'ACTIVE' ? 'success' : 'default'} dot>
            {status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}
          </Badge>
        );
      },
    },
    {
      id: 'updatedAt',
      header: 'Diperbarui',
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
    {
      id: 'actions',
      header: 'Aksi',
      enableSorting: false,
      size: 60,
      cell: ({ row }) => {
        const card = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Aksi</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(card)}>
                <Edit2 className="mr-2 h-4 w-4 text-slate-500" /> Edit Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CardTable({
  data,
  onEdit,
  searchValue,
  onSearchChange,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  className,
}: CardTableProps) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});

  React.useEffect(() => { setPageIndex(0); }, [data]);

  const columns = React.useMemo(
    () => buildColumns(onEdit),
    [onEdit],
  );

  const processedData = React.useMemo(() => {
    const result = [...data];
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a, b) => {
        const valA = (a[id as keyof AccessCredential] ?? '') as string;
        const valB = (b[id as keyof AccessCredential] ?? '') as string;
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

  const table = useDataTable<AccessCredential>({
    data: processedData,
    columns,
    sorting,
    onSortingChange: setSorting,
    mode: 'pagination',
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
    paginationConfig,
  });

  const activeFilterCount = Object.values(filterConfig.state)
    .flat()
    .filter(v => v && v !== 'ALL').length;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Toolbar — no Add button (edit-only) */}
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cari card..."
        showColumnToggle
        showFilter
        isFilterOpen={isFilterOpen}
        onFilterOpenChange={onFilterOpenChange}
        activeFilterCount={activeFilterCount}
      />

      <div className={cn('flex items-stretch gap-4', isFilterOpen ? 'flex-col lg:flex-row' : '')}>
        {/* Table */}
        <div className="flex-1 min-w-0 w-full">
          <div className="relative w-full overflow-x-auto rounded-lg border border-border bg-background shadow-sm max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                emptyTitle="Belum ada card"
                emptyDescription="Belum ada card yang terdaftar. Registrasi card dilakukan melalui aplikasi Admin."
                noResultTitle="Tidak ada hasil"
                noResultDescription="Coba ubah kata kunci atau filter."
              />
            </table>
          </div>
        </div>

        {/* Filter panel */}
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
