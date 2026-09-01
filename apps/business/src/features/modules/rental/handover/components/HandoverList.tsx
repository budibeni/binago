'use client';

import React from 'react';
import { FileText, Eye, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@adatrack/utils';
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
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalHandover } from '../types/handover';

interface HandoverListProps {
  data: RentalHandover[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (handover: RentalHandover) => void;
}



const getConditionLabel = (condition: string) => {
  switch (condition) {
    case 'GOOD': return 'Baik';
    case 'MINOR_DAMAGE': return 'Kerusakan Ringan';
    case 'NEEDS_REPAIR': return 'Perlu Perbaikan';
    default: return condition;
  }
};

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

function buildColumns(
  onViewDetail: (h: RentalHandover) => void,
  onViewMap: (h: RentalHandover) => void
): DataTableColumnDef<RentalHandover>[] {
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
          title="Detail Serah Terima" 
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
          title="Lihat Histori Map" 
          className="text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <MapPin className="w-4 h-4" /> 
        </Button>
      ),
    },
    {
      id: 'handoverInfo',
      accessorKey: 'id',
      header: 'ID HANDOVER',
      size: 160,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm truncate">{row.original.id}</span>
          <span className="text-[11px] text-muted-foreground truncate">{row.original.contract?.contractNumber || row.original.contractId}</span>
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
            <span className="text-[11px] text-muted-foreground truncate capitalize">{cust.type.toLowerCase()}</span>
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
      id: 'date',
      accessorKey: 'handoverAt',
      header: 'TANGGAL & JAM',
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm text-foreground">{formatShortDate(row.original.handoverAt)}</span>
          <span className="text-[11px] text-muted-foreground">{formatTime(row.original.handoverAt)}</span>
        </div>
      ),
    },
    {
      id: 'location',
      accessorKey: 'handoverAddress',
      header: 'LOKASI',
      size: 200,
      cell: ({ row }) => {
        const addr = row.original.handoverAddress;
        const latLng = `${row.original.handoverLatitude}, ${row.original.handoverLongitude}`;
        if (addr) {
          return (
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-sm text-foreground truncate" title={addr}>{addr.split(',')[0] || addr}</span>
              <span className="text-[11px] text-muted-foreground truncate" title={addr}>{addr.includes(',') ? addr.substring(addr.indexOf(',') + 1).trim() : latLng}</span>
            </div>
          );
        }
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm text-foreground truncate">Koordinat Map</span>
            <span className="text-[11px] text-muted-foreground truncate">{latLng}</span>
          </div>
        );
      },
    },
    {
      id: 'odometer',
      accessorKey: 'odometerStart',
      header: 'ODOMETER AWAL',
      size: 140,
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {new Intl.NumberFormat('id-ID').format(row.original.odometerStart)} KM
        </div>
      )
    },
    {
      id: 'condition',
      accessorKey: 'vehicleCondition',
      header: 'KONDISI',
      size: 130,
      cell: ({ row }) => (
        <div className="text-sm">
          {getConditionLabel(row.original.vehicleCondition)}
        </div>
      )
    },

  ];
}

export function HandoverList({
  data,
  searchValue,
  onSearchChange,
  onViewDetail,
}: HandoverListProps) {
  const router = useRouter();
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize,  setPageSize]  = React.useState(10);

  const handleViewMap = React.useCallback((h: RentalHandover) => {
    const coreVehicleId = h.vehicleId;
    if (!coreVehicleId || !h.handoverAt) return;
    const startDate = new Date(h.handoverAt).toISOString();
    const endDate = new Date().toISOString();
    trackingNavigationService.navigateToTracking(router, {
      mode: 'playback',
      vehicleId: coreVehicleId,
      start: startDate,
      end: endDate
    });
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

  const table = useDataTable<RentalHandover>({
    data: processedData,
    columns,
    mode: 'pagination',
    paginationConfig,
    freezeConfig: { left: ['detail', 'map', 'handoverInfo'] },
  });

  return (
    <div className="flex flex-col gap-3 h-full">
      <DataTableToolbar
        table={table}
        searchPlaceholder="Cari handover, customer, nomor polisi..."
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
                emptyTitle="Tidak ada data serah terima"
                emptyDescription="Belum ada transaksi serah terima yang tercatat atau sesuai dengan pencarian Anda."
              />
            </table>
          </div>
        </div>
      </div>

      <DataTablePagination paginationConfig={paginationConfig} />
    </div>
  );
}
