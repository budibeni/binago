content = """'use client';

import React from 'react';
import { Eye, RotateCcw, AlertCircle, Clock } from 'lucide-react';
import { cn, formatDateTime } from '@adatrack/utils';
import { Button, DataTable } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import type { RentalContract } from '../../contracts/types/contract';

interface ReturnTableProps {
  data: RentalContract[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (contract: RentalContract) => void;
  onProcessReturn: (contract: RentalContract) => void;
  className?: string;
  activeTab: 'PENDING' | 'COMPLETED';
}

function buildColumns(
  onViewDetail: (contract: RentalContract) => void,
  onProcessReturn: (contract: RentalContract) => void,
  activeTab: 'PENDING' | 'COMPLETED'
): DataTableColumnDef<RentalContract>[] {
  return [
    {
      id: 'contractInfo',
      accessorKey: 'contractNumber',
      header: 'KONTRAK & PELANGGAN',
      size: 250,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex flex-col gap-1 py-1">
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetail(c); }}
              className="text-[13px] font-bold text-foreground hover:text-primary transition-colors text-left"
            >
              {c.contractNumber}
            </button>
            <span className="text-xs text-muted-foreground">{c.customer?.name}</span>
          </div>
        );
      },
    },
    {
      id: 'vehicles',
      header: 'KENDARAAN',
      size: 150,
      cell: ({ row }) => {
        const c = row.original;
        const total = c.items?.length || 0;
        const returned = c.items?.filter(i => i.itemStatus === 'RETURNED').length || 0;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium">{total} Unit</span>
            <span className="text-[11px] text-muted-foreground">{returned} Selesai</span>
          </div>
        );
      },
    },
    {
      id: 'date',
      header: 'MULAI SEWA',
      size: 150,
      cell: ({ row }) => (
        <span className="text-[13px]">{formatDateTime(row.original.startDate)}</span>
      ),
    },
    {
      id: 'status',
      header: 'STATUS',
      size: 150,
      cell: ({ row }) => {
        const c = row.original;
        const items = c.items || [];
        const inUse = items.filter(i => i.itemStatus === 'IN_USE');
        
        let isOverdue = false;
        const now = new Date().getTime();
        for (const item of inUse) {
          if (item.endDate && new Date(item.endDate).getTime() < now) {
            isOverdue = true;
            break;
          }
        }
        
        if (activeTab === 'COMPLETED') {
           return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">SELESAI</span>;
        }

        if (isOverdue) {
           return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-danger/10 text-danger border border-danger/20 flex items-center gap-1 w-fit"><AlertCircle className="w-3 h-3" /> OVERDUE</span>;
        }

        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 w-fit">MENUNGGU KEMBALI</span>;
      },
    },
    {
      id: 'actions',
      header: '',
      size: 120,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => { e.stopPropagation(); onViewDetail(c); }}
            >
              <Eye className="w-4 h-4 text-muted-foreground" />
            </Button>
            {activeTab === 'PENDING' && (
              <Button
                variant="primary"
                size="sm"
                className="h-8 shadow-sm"
                onClick={(e) => { e.stopPropagation(); onProcessReturn(c); }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Return
              </Button>
            )}
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
  onViewDetail,
  onProcessReturn,
  className,
  activeTab
}: ReturnTableProps) {
  const columns = React.useMemo(() => buildColumns(onViewDetail, onProcessReturn, activeTab), [onViewDetail, onProcessReturn, activeTab]);

  return (
    <DataTable
      columns={columns}
      data={data}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      className={cn("h-full border-0 shadow-none", className)}
      onRowClick={onViewDetail}
    />
  );
}
"""
with open('apps/business/src/features/modules/rental/returns/components/ReturnTable.tsx', 'w') as f:
    f.write(content)
