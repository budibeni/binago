'use client';

import React from 'react';
import { Eye, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalHandover } from '../types/handover';

interface HandoverListProps {
  data: RentalHandover[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (handover: RentalHandover) => void;
  className?: string;
  filterConfig?: any;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
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
      header: '',
      size: 40,
      enableHiding: false,
      meta: { exportable: false, fixedWidth: true },
      cell: ({ row }) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewDetail(row.original)} 
          title="Detail Serah Terima" 
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
          title="Lihat Histori Map" 
          className="h-7 w-7 p-0 flex items-center justify-center transition-colors text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-600 dark:hover:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <MapPin className="w-3.5 h-3.5" /> 
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
          <span className="font-medium text-[13px] truncate">{row.original.id}</span>
          <span className="text-[12px] text-muted-foreground truncate">{row.original.contract?.contractNumber || row.original.contractId}</span>
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
            <span className="text-[12px] text-muted-foreground truncate capitalize">{cust.type.toLowerCase()}</span>
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
      id: 'date',
      accessorKey: 'handoverAt',
      header: 'TANGGAL & JAM',
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-[13px] text-foreground">{formatShortDate(row.original.handoverAt)}</span>
          <span className="text-[12px] text-muted-foreground">{formatTime(row.original.handoverAt)}</span>
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
              <span className="text-[13px] text-foreground truncate" title={addr}>{addr.split(',')[0] || addr}</span>
              <span className="text-[12px] text-muted-foreground truncate" title={addr}>{addr.includes(',') ? addr.substring(addr.indexOf(',') + 1).trim() : latLng}</span>
            </div>
          );
        }
        return (
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] text-foreground truncate">Koordinat Map</span>
            <span className="text-[12px] text-muted-foreground truncate">{latLng}</span>
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
        <div className="text-[13px] font-medium">
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
        <div className="text-[13px]">
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
  className,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
}: HandoverListProps) {
  const router = useRouter();

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

  const columns = React.useMemo(
    () => buildColumns(onViewDetail, handleViewMap),
    [onViewDetail, handleViewMap],
  );

  return (
    <DataTable<RentalHandover>
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
      searchPlaceholder="Cari handover, customer, nomor polisi..."
      exportFilename="Data_Serah_Terima"
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // UI Slots
      emptyTitle="Tidak ada data serah terima"
      emptyDescription="Belum ada transaksi serah terima yang tercatat atau sesuai dengan pencarian Anda."
    />
  );
}
