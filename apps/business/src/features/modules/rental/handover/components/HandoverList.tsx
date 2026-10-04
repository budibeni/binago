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
  status: 'PARTIAL' | 'COMPLETED';
  items: RentalHandover[];
}

interface HandoverListProps {
  data: HandoverGroup[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (group: HandoverGroup) => void;
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
  onViewDetail: (group: HandoverGroup) => void,
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
          onClick={() => onViewDetail(row.original as any)}
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
            <span className="text-[12px] text-muted-foreground truncate capitalize">{cust.type?.toLowerCase() || '-'}</span>
          </div>
        );
      },
    },
    {
      id: 'date',
      accessorKey: 'handoverAt',
      header: 'TGL SERAH TERIMA',
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-[12px] text-foreground">{formatShortDate(row.original.handoverAt)}</span>
          <span className="text-[12px] text-muted-foreground">{formatTime(row.original.handoverAt)}</span>
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'STATUS',
      size: 110,
      cell: ({ row }) => {
        const isCompleted = row.original.status === 'COMPLETED';
        return (
          <div className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold",
            isCompleted 
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" 
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
          )}>
            {isCompleted ? 'Selesai' : 'Sebagian'}
          </div>
        );
      }
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicleId',
      header: 'KENDARAAN',
      size: 550,
      minSize: 350,
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1.5 py-1 min-w-[300px]">
            {row.original.items.map((item, idx) => {
              const cv = item.vehicle?.coreVehicle;
              if (!cv) return null;
              return (
                <div 
                  key={idx}
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide",
                    "bg-slate-100 text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  )}
                  onClick={() => onViewMap(item)}
                  title="Klik untuk melihat histori tracking map"
                >
                  {cv.plateNumber}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      id: 'contractDate',
      accessorKey: 'contract.contractDate',
      header: 'TANGGAL KONTRAK',
      size: 150,
      cell: ({ row }) => {
        const cDate = row.original.contract?.contractDate;
        return (
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-[12px] text-foreground">{formatShortDate(cDate)}</span>
          </div>
        );
      }
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
