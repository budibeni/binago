'use client';

import React from 'react';
import { Eye, RotateCcw, AlertCircle, Clock, ChevronDown } from 'lucide-react';
import { cn, formatDateTime } from '@adatrack/utils';
import { Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import type { RentalContract } from '../../contracts/types/contract';
import type { BookingItem } from '../../bookings/types/booking';

export interface ReturnTableRowData extends BookingItem {
  contract: RentalContract;
}

interface ReturnTableProps {
  data: ReturnTableRowData[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onProcessReturn: (contractId: string) => void;
  className?: string;
  activeTab: 'PENDING' | 'COMPLETED';
}

function buildColumns(
  onProcessReturn: (contractId: string) => void,
  activeTab: 'PENDING' | 'COMPLETED'
): DataTableColumnDef<ReturnTableRowData>[] {
  return [
    {
      id: 'vehicleInfo',
      accessorKey: 'vehicleSnapshot.licensePlate',
      header: 'KENDARAAN',
      size: 200,
      cell: ({ row }) => {
        const item = row.original;
        const cv = item.vehicleSnapshot;
        return (
          <div className="flex flex-col gap-0.5 py-1 pl-4">
            <span className="text-[13px] font-bold text-foreground">
              {cv?.licensePlate}
            </span>
            <span className="text-xs text-muted-foreground">{cv?.brand} {cv?.model}</span>
          </div>
        );
      },
    },
    {
      id: 'dates',
      header: 'BATAS KEMBALI',
      size: 180,
      cell: ({ row }) => {
        const item = row.original;
        if (!item.endDate) return <span className="-">-</span>;
        
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium">{formatDateTime(item.endDate)}</span>
            {item.returnDate && (
               <span className="text-[11px] text-emerald-600">Dikembalikan: {formatDateTime(item.returnDate)}</span>
            )}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: 'STATUS',
      size: 150,
      cell: ({ row }) => {
        const item = row.original;
        
        if (item.itemStatus === 'RETURNED') {
           return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">SELESAI</span>;
        }

        let isOverdue = false;
        if (item.endDate && new Date(item.endDate).getTime() < new Date().getTime()) {
          isOverdue = true;
        }

        if (isOverdue) {
           return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-danger/10 text-danger border border-danger/20 flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> OVERDUE</span>;
        }

        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 w-fit">IN USE</span>;
      },
    },
    {
      id: 'actions',
      header: '',
      size: 80,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end">
            {/* We leave it empty per vehicle since action is usually per contract in the group header. 
                Or we can allow individual return clicks. */}
          </div>
        );
      },
    },
  ];
}

export function ReturnTable({
  data,
  searchValue,
  onSearchChange,
  onProcessReturn,
  className,
  activeTab
}: ReturnTableProps) {
  const columns = React.useMemo(() => buildColumns(onProcessReturn, activeTab), [onProcessReturn, activeTab]);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      className={cn("h-full border-0 shadow-none", className)}
      groupBy={(row) => row.contract.id}
      renderGroupHeader={(groupId, rows, isExpanded, toggleExpand) => {
        const firstRow = rows[0].original;
        const contract = firstRow.contract;
        const customerName = contract.customer?.name || 'Unknown';
        const contractNumber = contract.contractNumber;
        
        let overdueCount = 0;
        let returnedCount = 0;
        const now = new Date().getTime();
        
        rows.forEach(r => {
          const item = r.original;
          if (item.itemStatus === 'RETURNED') {
            returnedCount++;
          } else if (item.endDate && new Date(item.endDate).getTime() < now) {
            overdueCount++;
          }
        });

        return (
          <div 
            className="flex items-center justify-between py-1 px-4 cursor-pointer w-full hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
            onClick={toggleExpand}
          >
            <div className="flex items-center gap-4">
              <ChevronDown className={cn("w-4 h-4 transition-transform text-muted-foreground", !isExpanded && "-rotate-90")} />
              <div className="flex flex-col">
                <span className="font-bold text-[13px] text-foreground">{customerName}</span>
                <span className="text-[11px] text-muted-foreground">{contractNumber}</span>
              </div>
              <div className="flex items-center gap-3 ml-4 text-[11px] font-semibold tracking-wide">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div> {rows.length} Unit</span>
                {returnedCount > 0 && <span className="flex items-center gap-1.5 text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {returnedCount} Selesai</span>}
                {overdueCount > 0 && <span className="flex items-center gap-1.5 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> {overdueCount} Overdue</span>}
              </div>
            </div>
            
            <div className="flex items-center">
               {activeTab === 'PENDING' && (
                 <Button
                    variant="primary"
                    size="sm"
                    className="h-8 shadow-sm text-[12px]"
                    onClick={(e) => { e.stopPropagation(); onProcessReturn(contract.id); }}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Proses Pengembalian
                  </Button>
               )}
            </div>
          </div>
        );
      }}
    />
  );
}
