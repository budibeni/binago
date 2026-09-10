'use client';

import React from 'react';
import { Eye, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalReturn } from '../types/return';

interface ReturnListProps {
  data: RentalReturn[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (ret: RentalReturn) => void;
  className?: string;
  filterConfig?: any;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
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
      header: '',
      size: 40,
      enableHiding: false,
      meta: { exportable: false, fixedWidth: true },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetail(row.original)}
          title="Detail Pengembalian"
          className="h-7 w-7 p-0 flex items-center justify-center transition-colors text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-600 dark:hover:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Eye className="w-3.5 h-3.5" />
        </Button>
      ),
    },
    {
      id: 'map',
      header: '',
      size: 40,
      enableHiding: false,
      meta: { exportable: false, fixedWidth: true },
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewMap(row.original)}
          title="Lihat Histori Perjalanan"
          className="h-7 w-7 p-0 flex items-center justify-center transition-colors text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-600 dark:hover:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <MapPin className="w-3.5 h-3.5" />
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
          <span className="font-medium text-[13px] truncate">{row.original.id}</span>
          <span className="text-[12px] text-muted-foreground truncate">
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
        if (!cust) return <span className="text-muted-foreground text-[13px]">-</span>;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-[13px] text-foreground truncate">{cust.name}</span>
            <span className="text-[12px] text-muted-foreground truncate capitalize">{cust.type?.toLowerCase()}</span>
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
        if (!cv) return <span className="text-muted-foreground text-[13px]">-</span>;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-[13px] text-foreground truncate">{cv.brand} {cv.vehicleName}</span>
            <span className="text-[12px] text-muted-foreground truncate">{cv.plateNumber}</span>
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
          <span className="font-medium text-[13px] text-foreground">{formatShortDate(row.original.returnedAt)}</span>
          <span className="text-[12px] text-muted-foreground">{formatTime(row.original.returnedAt)}</span>
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
            <span className="font-medium text-[13px] text-foreground">
              {new Intl.NumberFormat('id-ID').format(ret.odometerEnd)} KM
            </span>
            {distanceUsed !== null && (
              <span className="text-[12px] text-muted-foreground">
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
          <span className={`text-[13px] font-medium ${charges > 0 ? 'text-danger' : 'text-muted-foreground'}`}>
            {charges > 0 ? formatCurrency(charges) : '-'}
          </span>
        );
      },
    },
  ];
}

export function ReturnList({ 
  data, 
  searchValue, 
  onSearchChange, 
  onViewDetail,
  className,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
}: ReturnListProps) {
  const router = useRouter();

  const handleViewMap = React.useCallback((ret: RentalReturn) => {
    const handover = ret.handover;
    if (!handover || !ret.vehicleId) return;
    const startDate = new Date(handover.handoverAt).toISOString();
    const endDate = new Date(ret.returnedAt).toISOString();
    trackingNavigationService.navigateToTracking(router, {
      mode: 'playback',
      vehicleId: ret.vehicleId,
      start: startDate,
      end: endDate
    });
  }, [router]);

  const columns = React.useMemo(
    () => buildColumns(onViewDetail, handleViewMap),
    [onViewDetail, handleViewMap],
  );

  return (
    <DataTable<RentalReturn>
      className={className}
      data={data}
      columns={columns}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      exportable
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder="Cari pengembalian, customer, nomor polisi..."
      exportFilename="Data_Pengembalian"
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // UI Slots
      emptyTitle="Tidak ada data pengembalian"
      emptyDescription="Belum ada transaksi pengembalian yang tercatat atau sesuai dengan pencarian Anda."
    />
  );
}
