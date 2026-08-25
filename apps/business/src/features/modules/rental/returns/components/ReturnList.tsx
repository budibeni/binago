'use client';

import React from 'react';
import { Eye, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@adatrack/ui';
import {
  useDataTable,
  DataTableHeader,
  DataTableBody,
  DataTableToolbar,
  DataTablePagination,
  type DataTableColumnDef,
  type DataTablePaginationConfig,
} from '@adatrack/ui';
import type { RentalReturn } from '../types/return';

interface ReturnListProps {
  data: RentalReturn[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (ret: RentalReturn) => void;
}

const getConditionLabel = (c: string) => {
  if (c === 'GOOD') return 'Baik';
  if (c === 'MINOR_DAMAGE') return 'Kerusakan Ringan';
  return 'Perlu Perbaikan';
};

const formatShortDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const formatTime = (d: string) =>
  d ? new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);

function buildColumns(
  onViewDetail: (r: RentalReturn) => void,
  onViewMap: (r: RentalReturn) => void,
): DataTableColumnDef<RentalReturn>[] {
  return [
    {
      id: 'detail',
      header: 'DETAIL',
      size: 70,
      enableHiding: false,
      meta: { exportable: false },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetail(row.original)}
          title="Detail Pengembalian"
          className="text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
    {
      id: 'map',
      header: 'MAP',
      size: 70,
      enableHiding: false,
      meta: { exportable: false },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewMap(row.original)}
          title="Lihat Histori Perjalanan"
          className="text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <MapPin className="w-4 h-4" />
        </Button>
      ),
    },
    {
      id: 'returnInfo',
      accessorKey: 'id',
      header: 'ID PENGEMBALIAN',
      size: 170,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm truncate">{row.original.id}</span>
          <span className="text-[11px] text-muted-foreground truncate">
            {row.original.contract?.contractNumber || row.original.contractId}
          </span>
        </div>
      ),
    },
    {
      id: 'customer',
      accessorKey: 'customer.name',
      header: 'CUSTOMER',
      size: 190,
      cell: ({ row }) => {
        const cust = row.original.customer;
        if (!cust) return <span className="text-muted-foreground text-sm">-</span>;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-foreground truncate">{cust.name}</span>
            <span className="text-[11px] text-muted-foreground truncate capitalize">{cust.type?.toLowerCase()}</span>
          </div>
        );
      },
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicle.coreVehicle.plateNumber',
      header: 'KENDARAAN',
      size: 200,
      cell: ({ row }) => {
        const cv = row.original.vehicle?.coreVehicle;
        if (!cv) return <span className="text-muted-foreground text-sm">-</span>;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-foreground truncate">{cv.brand} {cv.vehicleName}</span>
            <span className="text-[11px] text-muted-foreground truncate">{cv.plateNumber}</span>
          </div>
        );
      },
    },
    {
      id: 'returnedAt',
      accessorKey: 'returnedAt',
      header: 'TGL PENGEMBALIAN',
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm text-foreground">{formatShortDate(row.original.returnedAt)}</span>
          <span className="text-[11px] text-muted-foreground">{formatTime(row.original.returnedAt)}</span>
        </div>
      ),
    },
    {
      id: 'odometer',
      accessorKey: 'odometerEnd',
      header: 'ODOMETER',
      size: 150,
      cell: ({ row }) => {
        const ret = row.original;
        const distanceUsed = ret.handover
          ? ret.odometerEnd - ret.handover.odometerStart
          : null;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm text-foreground">
              {new Intl.NumberFormat('id-ID').format(ret.odometerEnd)} KM
            </span>
            {distanceUsed !== null && (
              <span className="text-[11px] text-muted-foreground">
                +{new Intl.NumberFormat('id-ID').format(distanceUsed)} KM
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'condition',
      accessorKey: 'vehicleConditionEnd',
      header: 'KONDISI',
      size: 140,
      cell: ({ row }) => {
        const cond = row.original.vehicleConditionEnd;
        const colorClass = cond === 'GOOD'
          ? 'bg-success/10 text-success'
          : cond === 'MINOR_DAMAGE'
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          : 'bg-danger/10 text-danger';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colorClass}`}>
            {getConditionLabel(cond)}
          </span>
        );
      },
    },
    {
      id: 'charges',
      accessorKey: 'additionalCharges',
      header: 'BIAYA TAMBAHAN',
      size: 140,
      cell: ({ row }) => {
        const charges = row.original.additionalCharges || 0;
        return (
          <span className={`text-sm font-medium ${charges > 0 ? 'text-danger' : 'text-muted-foreground'}`}>
            {charges > 0 ? formatCurrency(charges) : '-'}
          </span>
        );
      },
    },
  ];
}

export function ReturnList({ data, searchValue, onSearchChange, onViewDetail }: ReturnListProps) {
  const router = useRouter();
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);

  const handleViewMap = React.useCallback((ret: RentalReturn) => {
    const handover = ret.handover;
    if (!handover || !ret.vehicleId) return;
    const startDate = new Date(handover.handoverAt).toISOString();
    const endDate = new Date(ret.returnedAt).toISOString();
    router.push(
      `/tracking?vehicleId=${encodeURIComponent(ret.vehicleId)}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`
    );
  }, [router]);

  React.useEffect(() => { setPageIndex(0); }, [data]);

  const processedData = React.useMemo(
    () => data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    [data, pageIndex, pageSize],
  );

  const paginationConfig: DataTablePaginationConfig = {
    pageIndex,
    pageSize,
    totalCount: data.length,
    pageSizeOptions: [10, 20, 50],
    onPageChange: setPageIndex,
    onPageSizeChange: (s) => { setPageSize(s); setPageIndex(0); },
  };

  const columns = React.useMemo(
    () => buildColumns(onViewDetail, handleViewMap),
    [onViewDetail, handleViewMap],
  );

  const table = useDataTable<RentalReturn>({
    data: processedData,
    columns,
    mode: 'pagination',
    paginationConfig,
    freezeConfig: { left: ['detail', 'map', 'returnInfo'] },
  });

  return (
    <div className="flex flex-col gap-3 h-full">
      <DataTableToolbar
        table={table}
        searchPlaceholder="Cari pengembalian, customer, nomor polisi..."
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        showColumnToggle={true}
        showExport={true}
        showFilter={false}
      />

      <div className="flex items-stretch gap-4 min-h-0 flex-1">
        <div className="flex-1 min-w-0 w-full flex flex-col">
          <div className="relative w-full flex-1 overflow-auto rounded-lg border border-border bg-background shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <DataTableHeader table={table} />
              <DataTableBody
                table={table}
                emptyTitle="Tidak ada data pengembalian"
                emptyDescription="Belum ada transaksi pengembalian yang tercatat atau sesuai dengan pencarian Anda."
              />
            </table>
          </div>
        </div>
      </div>

      <DataTablePagination paginationConfig={paginationConfig} />
    </div>
  );
}
