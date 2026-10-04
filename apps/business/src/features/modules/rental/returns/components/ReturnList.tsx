'use client';

import React from 'react';
import { Eye, Car, Check } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { useRouter } from 'next/navigation';
import { Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalReturn } from '../types/return';

export interface ReturnGroup {
  id: string; // group ID (contractId)
  contractId: string;
  contract?: any;
  customer?: any;
  returnedAt: string;
  returnAddress?: string;
  returnLatitude?: number;
  returnLongitude?: number;
  status: 'PARTIAL' | 'COMPLETED';
  items: RentalReturn[];
}

interface ReturnListProps {
  data: ReturnGroup[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (group: ReturnGroup) => void;
  className?: string;
  filterConfig?: any;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
}

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
  onViewDetail: (group: ReturnGroup) => void,
  onViewMap: (r: RentalReturn) => void
): DataTableColumnDef<ReturnGroup>[] {
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
          title="Detail Pengembalian" 
          className="h-7 w-7 p-0 flex items-center justify-center transition-colors text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-600 dark:hover:text-neutral-300 dark:hover:bg-neutral-800"
        >
          <Eye className="w-3.5 h-3.5" /> 
        </Button>
      ),
    },
    {
      id: 'returnInfo',
      accessorKey: 'id',
      header: 'ID RETURN',
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
      accessorKey: 'returnedAt',
      header: 'TGL PENGEMBALIAN',
      size: 150,
      cell: ({ row }) => (
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-[12px] text-foreground">{formatShortDate(row.original.returnedAt)}</span>
          <span className="text-[12px] text-muted-foreground">{formatTime(row.original.returnedAt)}</span>
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

  const handleViewMap = React.useCallback((r: RentalReturn) => {
    const coreVehicleId = r.vehicleId;
    if (!coreVehicleId || !r.returnedAt) return;
    const startDate = new Date(r.returnedAt).toISOString();
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
    <DataTable<ReturnGroup>
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
