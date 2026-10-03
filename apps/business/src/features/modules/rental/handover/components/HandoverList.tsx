'use client';

import React from 'react';
import { Eye, Car, Check } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { useRouter } from 'next/navigation';
import { Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalHandover } from '../types/handover';

export interface HandoverGroup {
  id: string; // group ID (contractId)
  contractId: string;
  contract?: any;
  customer?: any;
  handoverAt: string;
  handoverAddress?: string;
  handoverLatitude: number;
  handoverLongitude: number;
  items: RentalHandover[];
}

interface HandoverListProps {
  data: HandoverGroup[];
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
): DataTableColumnDef<HandoverGroup>[] {
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
          onClick={() => onViewDetail(row.original.items[0])} // just pass the first one for now, or change onViewDetail to handle group
          title="Detail Serah Terima" 
          className="h-7 w-7 p-0 flex items-center justify-center transition-colors text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-600 dark:hover:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Eye className="w-3.5 h-3.5" /> 
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
          <span className="font-medium text-[12px] truncate">{row.original.id}</span>
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
        if (!cust) return <span className="text-muted-foreground text-[12px]">-</span>;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-[12px] text-foreground truncate">{cust.name}</span>
            <span className="text-[12px] text-muted-foreground truncate capitalize">{cust.type.toLowerCase()}</span>
          </div>
        );
      },
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicleId',
      header: 'KENDARAAN',
      size: 200,
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1.5 min-w-0 py-1">
            {row.original.items.map((item, idx) => {
              const cv = item.vehicle?.coreVehicle;
              if (!cv) return null;
              return (
                <div 
                  key={idx}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium shadow-sm",
                    "bg-muted/50 border-border text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                  )}
                  onClick={() => onViewMap(item)}
                  title="Klik untuk melihat histori tracking map"
                >
                  <Car className="w-3 h-3" />
                  <span className="font-semibold">{cv.plateNumber}</span>
                </div>
              );
            })}
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
          <span className="font-medium text-[12px] text-foreground">{formatShortDate(row.original.handoverAt)}</span>
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
              <span className="text-[12px] text-foreground truncate" title={addr}>{addr.split(',')[0] || addr}</span>
              <span className="text-[12px] text-muted-foreground truncate" title={addr}>{addr.includes(',') ? addr.substring(addr.indexOf(',') + 1).trim() : latLng}</span>
            </div>
          );
        }
        return (
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] text-foreground truncate">Koordinat Map</span>
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
        <div className="flex flex-col gap-1 py-1">
          {row.original.items.map((item, idx) => (
             <span key={idx} className="text-[12px] font-medium whitespace-nowrap">
               {row.original.items.length > 1 && <span className="text-muted-foreground mr-1">{item.vehicle?.coreVehicle?.plateNumber}:</span>}
               {new Intl.NumberFormat('id-ID').format(item.odometerStart)} KM
             </span>
          ))}
        </div>
      )
    },
    {
      id: 'condition',
      accessorKey: 'vehicleCondition',
      header: 'KONDISI',
      size: 130,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 py-1">
          {row.original.items.map((item, idx) => (
            <span key={idx} className="text-[12px] whitespace-nowrap">
              {row.original.items.length > 1 && <span className="text-muted-foreground mr-1">{item.vehicle?.coreVehicle?.plateNumber}:</span>}
              {getConditionLabel(item.vehicleCondition)}
            </span>
          ))}
        </div>
      )
    },
    {
      id: 'fuelLevel',
      accessorKey: 'fuelLevel',
      header: 'BBM AWAL',
      size: 130,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 py-1">
          {row.original.items.map((item, idx) => {
            const fuel = item.fuelLevel;
            const fuelLabel = fuel === 'EMPTY' ? 'Kosong' :
                             fuel === 'QUARTER' ? '1/4' :
                             fuel === 'HALF' ? '1/2' :
                             fuel === 'THREE_QUARTER' ? '3/4' :
                             fuel === 'FULL' ? 'Penuh' : '-';
            return (
              <span key={idx} className="text-[12px] whitespace-nowrap">
                {row.original.items.length > 1 && <span className="text-muted-foreground mr-1">{item.vehicle?.coreVehicle?.plateNumber}:</span>}
                {fuelLabel}
              </span>
            );
          })}
        </div>
      )
    },
    {
      id: 'notes',
      accessorKey: 'notes',
      header: 'CATATAN',
      size: 200,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 py-1 min-w-0">
          {row.original.items.map((item, idx) => (
            <div key={idx} className="text-[12px] truncate text-muted-foreground" title={item.notes || '-'}>
              {row.original.items.length > 1 && <span className="mr-1">{item.vehicle?.coreVehicle?.plateNumber}:</span>}
              <span>{item.notes || '-'}</span>
            </div>
          ))}
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
    <DataTable<HandoverGroup>
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
      searchPlaceholder="Cari..."
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
