import React from 'react';
import { MoreHorizontal, Eye, Edit2, Ban, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { cn } from '@adatrack/utils';
import {
  Button,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  Checkbox,
} from '@adatrack/ui';
import {
  useDataTable,
  DataTableHeader,
  DataTableBody,
  DataTableToolbar,
  DataTablePagination,
  type DataTableColumnDef,
  type DataTablePaginationConfig,
  type ColumnVisibilityState,
  type SortingState,
} from '@adatrack/ui';
import type { RentalVehicle } from '../types/rentalVehicle';

interface RentalVehicleTableProps {
  data: RentalVehicle[];
  labels: Record<string, string>;
  onView: (v: RentalVehicle) => void;
  onEdit: (v: RentalVehicle) => void;
  onComplete: (v: RentalVehicle) => void;
  onDisable: (v: RentalVehicle) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
}

const DEFAULT_COLUMN_VISIBILITY = {};

function buildColumns(
  labels: Record<string, string>,
  onView: (v: RentalVehicle) => void,
  onEdit: (v: RentalVehicle) => void,
  onComplete: (v: RentalVehicle) => void,
  onDisable: (v: RentalVehicle) => void,
  selectedIds: string[],
  onSelectionChange: (ids: string[]) => void,
  dataList: RentalVehicle[]
): DataTableColumnDef<RentalVehicle>[] {
  const formatCurrency = (value: number) => {
    if (value === 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(dataList.map(v => v.vehicleId));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(vId => vId !== id));
    }
  };

  return [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={dataList.length > 0 && selectedIds.length === dataList.length}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
          className="ml-2"
        />
      ),
      cell: ({ row }) => {
        const vId = row.original.vehicleId;
        return (
          <Checkbox
            checked={selectedIds.includes(vId)}
            onCheckedChange={(checked) => handleSelectRow(!!checked, vId)}
            aria-label={`Select ${row.original.coreVehicle.plateNumber}`}
            className="ml-2 data-[state=checked]:bg-danger data-[state=checked]:border-danger"
          />
        );
      },
      enableSorting: false,
      size: 40,
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicle',
      header: labels.colVehicle,
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const v = row.original.coreVehicle;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-[13px] text-foreground">{v.brand} {v.vehicleName}</span>
            <span className="text-[11px] font-medium text-muted-foreground mt-0.5">{v.plateNumber}</span>
          </div>
        );
      },
    },
    {
      id: 'year',
      accessorKey: 'year',
      header: labels.colYear,
      enableSorting: true,
      size: 80,
      cell: ({ row }) => row.original.coreVehicle.year,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: labels.colStatus,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const s = row.original.status;
        let label = '';
        if (s === 'READY') label = labels.statusReady;
        else if (s === 'RESERVED') label = labels.statusReserved;
        else if (s === 'RENTED') label = labels.statusRented;
        else if (s === 'MAINTENANCE') label = labels.statusMaintenance;
        else if (s === 'UNAVAILABLE') label = labels.statusUnavailable;

        const badgeClass = 
          s === 'READY' ? 'bg-success/10 text-success border border-success/20' :
          s === 'RESERVED' ? 'bg-warning/10 text-warning border border-warning/20' :
          s === 'RENTED' ? 'bg-primary/10 text-primary border border-primary/20' :
          s === 'MAINTENANCE' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
          'bg-neutral-100 text-neutral-500 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700';

        return <div className={cn("px-3 py-1 rounded-full text-[11px] font-semibold w-fit", badgeClass)}>{label}</div>;
      },
    },
    {
      id: 'customer',
      accessorKey: 'customer',
      header: labels.colCustomer,
      enableSorting: true,
      size: 180,
      cell: ({ row }) => {
        if (row.original.status !== 'RENTED' && row.original.status !== 'RESERVED') {
          return <span className="text-muted-foreground">-</span>;
        }
        return row.original.customerName || <span className="text-muted-foreground">-</span>;
      },
    },
    {
      id: 'period',
      accessorKey: 'period',
      header: labels.colPeriod,
      enableSorting: true,
      size: 180,
      cell: ({ row }) => {
        if (row.original.status !== 'RENTED' && row.original.status !== 'RESERVED') {
          return <span className="text-muted-foreground">-</span>;
        }
        return row.original.rentalPeriod || <span className="text-muted-foreground">-</span>;
      },
    },
    {
      id: 'rate',
      accessorKey: 'rate',
      header: labels.colRate,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        if (row.original.dailyRate > 0) {
          return (
            <div className="flex flex-col">
              <span className="font-bold text-[13px] text-foreground">{formatCurrency(row.original.dailyRate)}</span>
              <span className="text-[11px] font-medium text-muted-foreground mt-0.5">/ hari</span>
            </div>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      id: 'condition',
      accessorKey: 'condition',
      header: labels.colCondition,
      enableSorting: true,
      size: 140,
      cell: ({ row }) => {
        const c = row.original.condition;
        let lbl = labels.conditionGood;
        if (c === 'MINOR_DAMAGE') lbl = labels.conditionMinor;
        if (c === 'NEEDS_REPAIR') lbl = labels.conditionRepair;
        return <span className="text-sm">{lbl}</span>;
      },
    },
    {
      id: 'completeness',
      accessorKey: 'completeness',
      header: labels.colCompleteness,
      enableSorting: true,
      size: 160,
      cell: ({ row }) => {
        if (row.original.isComplete) {
          return (
            <div className="flex items-center gap-1.5 text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[13px] font-semibold">{labels.dataCompleteShort || 'Lengkap'}</span>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-1.5 text-danger">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[13px] font-semibold">{labels.dataNotCompleteShort || 'Belum Lengkap'}</span>
            </div>
            <button 
               onClick={() => onComplete(row.original)}
               className="text-[11px] font-semibold text-danger hover:underline ml-5"
            >
              Lengkapi Data Rental
            </button>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      size: 52,
      cell: ({ row }) => {
        const v = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-primary focus:outline-none"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(v)}>
                <Eye className="mr-2 h-4 w-4" />
                {labels.actionDetail}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(v)}>
                <Edit2 className="mr-2 h-4 w-4" />
                {labels.actionEdit}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDisable(v)} className="text-red-600">
                <Ban className="mr-2 h-4 w-4" />
                {labels.actionDisable}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export function RentalVehicleTable({
  data,
  labels,
  onView,
  onEdit,
  onComplete,
  onDisable,
  selectedIds,
  onSelectionChange,
  searchValue,
  onSearchChange,
  onAdd,
}: RentalVehicleTableProps) {
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>(DEFAULT_COLUMN_VISIBILITY);

  React.useEffect(() => { setPageIndex(0); }, [data]);

  const columns = React.useMemo(
    () => buildColumns(labels, onView, onEdit, onComplete, onDisable, selectedIds, onSelectionChange, data),
    [labels, onView, onEdit, onComplete, onDisable, selectedIds, onSelectionChange, data],
  );

  const processedData = React.useMemo(() => {
    const result = [...data];
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      result.sort((a, b) => {
        // basic sorting
        let valA: any = a.coreVehicle.brand;
        let valB: any = b.coreVehicle.brand;
        if (id === 'year') {
          valA = a.coreVehicle.year;
          valB = b.coreVehicle.year;
        } else if (id === 'status') {
          valA = a.status;
          valB = b.status;
        } else if (id === 'rate') {
          valA = a.dailyRate;
          valB = b.dailyRate;
        }

        if (valA < valB) return desc ? 1 : -1;
        if (valA > valB) return desc ? -1 : 1;
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

  const table = useDataTable<RentalVehicle>({
    data: processedData,
    columns,
    sorting,
    onSortingChange: setSorting,
    mode: 'pagination',
    columnVisibility,
    onColumnVisibilityChange: setColumnVisibility,
    freezeConfig: { left: ['select', 'vehicle'], right: ['actions'] },
    paginationConfig,
  });

  return (
    <div className="flex flex-col gap-3 h-full">
      <DataTableToolbar
        table={table}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={labels.searchPlaceholder || "Cari nomor polisi, merk, atau model..."}
        showColumnToggle
        showExport={false}
        showFilter={false}
        rightSlot={
          <Button onClick={onAdd} variant="destructive" className="h-9">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline-block">Tambah</span>
          </Button>
        }
      />

      <div className="flex items-stretch gap-4 min-h-0 flex-1">
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
      </div>

      <DataTablePagination 
        paginationConfig={paginationConfig} 
      />
    </div>
  );
}
