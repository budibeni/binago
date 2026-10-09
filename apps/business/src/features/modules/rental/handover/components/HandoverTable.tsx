'use client';

import React from 'react';
import { Eye, Plus, Calendar, MapPin } from 'lucide-react';
import { cn, formatTime } from '@adatrack/utils';
import { useRouter } from 'next/navigation';
import { Button, DataTable, PhoneLink } from '@adatrack/ui';
import type { DataTableColumnDef } from '@adatrack/ui';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalHandover } from '../types/handover';

export interface HandoverGroup {
  id: string; // group ID (handoverNumber or contractId)
  handoverNumber?: string;
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

interface HandoverTableProps {
  data: HandoverGroup[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onViewDetail: (group: HandoverGroup) => void;
  className?: string;
  filterConfig?: any;
  isFilterOpen?: boolean;
  onFilterOpenChange?: (open: boolean) => void;
  labels?: Record<string, string>;
  onAdd?: () => void;
}

const getConditionLabel = (condition: string, labels: Record<string, string> = {}) => {
  switch (condition) {
    case 'GOOD': return labels.condGood || 'Baik';
    case 'MINOR_DAMAGE': return labels.condMinorDamage || 'Kerusakan Ringan';
    case 'NEEDS_REPAIR': return labels.condNeedsRepair || 'Perlu Perbaikan';
    default: return condition;
  }
};

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getMaxEndDate = (items: any[]) => {
  if (!items || items.length === 0) return null;
  const dates = items
    .filter(i => i.returnDate)
    .map(i => new Date(i.returnDate).getTime());
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates)).toISOString();
};


function buildColumns(
  onViewDetail: (group: HandoverGroup) => void,
  onViewMap: (h: RentalHandover) => void,
  labels: Record<string, string> = {}
): DataTableColumnDef<HandoverGroup>[] {
  return [
    {
      id: 'handoverInfo',
      accessorKey: 'handoverNumber',
      header: labels.colHandoverId || 'NO. SERAH TERIMA',
      size: 170,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <button
              onClick={(e) => { e.stopPropagation(); onViewDetail(row.original as any); }}
              className="text-[13px] font-normal text-foreground truncate hover:text-primary hover:underline transition-colors text-left"
              title={row.original.handoverNumber || row.original.id}
            >
              {row.original.handoverNumber || row.original.id}
            </button>
            <span className="font-medium text-[11px] text-muted-foreground truncate">{formatShortDate(row.original.handoverAt)} &bull; {formatTime(row.original.handoverAt)}</span>
          </div>
        );
      },
    },
    {
      id: 'contractInfo',
      accessorKey: 'contract.contractNumber',
      header: labels.colContractRef || 'REF KONTRAK',
      size: 160,
      cell: ({ row }) => {
        const contract = row.original.contract;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground truncate">{contract?.contractNumber || row.original.contractId}</span>
            <span className="text-[11px] text-muted-foreground truncate">
              {contract?.rentalType === 'SELF_DRIVE' ? (labels.valSelfDrive || 'Lepas Kunci') : (labels.valWithDriverFull || 'Dengan Pengemudi')}
            </span>
          </div>
        );
      },
    },
    {
      id: 'customer',
      accessorKey: 'customer.name',
      header: labels.colCustomer || 'PELANGGAN',
      size: 180,
      cell: ({ row }) => {
        const cust = row.original.customer;
        if (!cust) return <span className="text-muted-foreground text-[12px]">-</span>;
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground truncate">{cust.name}</span>
            <span className="text-[11px] text-muted-foreground truncate capitalize">{cust.type === 'COMPANY' ? (labels.typeCompany || 'Perusahaan') : (labels.typeIndividual || 'Individu')}</span>
          </div>
        );
      },
    },
    {
      id: 'contact',
      accessorKey: 'customer.phone',
      header: labels.colContact || 'KONTAK',
      size: 180,
      cell: ({ row }) => {
        const cust = row.original.customer;
        if (!cust) return <span className="text-muted-foreground text-[12px]">-</span>;
        const locationStr = cust.city ? `${cust.city}${cust.province ? ` - ${cust.province}` : ''}` : '-';
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <div className="-ml-1">
              <PhoneLink phone={cust.phone || ''} className="text-[13px] font-normal text-foreground ml-1 truncate" />
            </div>
            <span className="text-[11px] text-muted-foreground truncate">{locationStr}</span>
          </div>
        );
      },
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicleId',
      header: labels.colVehicle || 'KENDARAAN',
      size: 250,
      cell: ({ row }) => {
        const items = row.original.items || [];
        const plateNumbers = items.map((i: any) => i.vehicle?.coreVehicle?.plateNumber || i.vehicleSnapshot?.licensePlate || i.id).filter(Boolean).join(', ');
        
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground truncate">{items.length} {labels.textVehicles || 'Kendaraan'}</span>
            <span className="mt-0.5 text-[11px] text-muted-foreground truncate" title={plateNumbers}>
              {plateNumbers}
            </span>
          </div>
        );
      },
    },
    {
      id: 'notes',
      accessorKey: 'items[0].notes',
      header: labels.colNotes || 'CATATAN',
      size: 200,
      cell: ({ row }) => {
        const notes = row.original.items?.[0]?.notes || '-';
        return (
          <div className="flex flex-col py-1 pr-4">
            <span 
              className="text-[13px] font-normal text-foreground line-clamp-2 whitespace-pre-wrap" 
              title={notes !== '-' ? notes : undefined}
            >
              {notes}
            </span>
          </div>
        );
      },
    },
    {
      id: 'staff',
      accessorKey: 'items[0].staffName',
      header: labels.colStaff || 'PETUGAS',
      size: 140,
      cell: ({ row }) => {
        const staff = row.original.items?.[0]?.staffName || 'Admin';
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="text-[13px] font-normal text-foreground truncate">{staff}</span>
          </div>
        );
      },
    }
  ];
}

export function HandoverTable({
  data,
  searchValue,
  onSearchChange,
  onViewDetail,
  className,
  filterConfig,
  isFilterOpen,
  onFilterOpenChange,
  labels = {},
  onAdd,
}: HandoverTableProps) {
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
    () => buildColumns(onViewDetail, handleViewMap, labels),
    [onViewDetail, handleViewMap, labels],
  );

  return (
    <DataTable<HandoverGroup>
      className={className}
      data={data}
      columns={columns}
      onRowActionClick={onViewDetail}
      // Capabilities
      searchable
      sortable
      pagination
      columnVisibility
      exportable
      // Search
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      searchPlaceholder={labels.dtSearchPlaceholder || "Cari..."}
      exportFilename={labels.dtExportFilename || "Data_Serah_Terima"}
      // Filter
      filterConfig={filterConfig}
      isFilterOpen={isFilterOpen}
      onFilterOpenChange={onFilterOpenChange}
      // UI Slots
      emptyTitle={labels.emptyTitle || "Tidak ada data serah terima"}
      emptyDescription={labels.emptyDescription || "Belum ada transaksi serah terima yang tercatat atau sesuai dengan pencarian Anda."}
      labels={{
        paginationShowing: (from, to, total) => labels.dtPaginationShowing ? labels.dtPaginationShowing.replace('{0}', from.toString()).replace('{1}', to.toString()).replace('{2}', total.toLocaleString(labels.locale || 'id-ID')) : `Menampilkan ${from}-${to} dari ${total.toLocaleString(labels.locale || 'id-ID')} data`,
        paginationPerPage: labels.dtPaginationPerPage || ' / halaman',
        toolbarFilter: labels.dtFilter || 'Filter',
        toolbarColumns: labels.dtColumns || 'Kolom',
        toolbarExport: labels.dtExport || 'Ekspor',
      }}
      toolbarActions={
        <div className="flex items-center gap-2">
          {onAdd && (
            <Button variant="destructive" onClick={onAdd} className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline-block">{labels.add || 'Tambah'}</span>
            </Button>
          )}
        </div>
      }
    />
  );
}
