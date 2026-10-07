
const getMaxEndDate = (items: any[]) => {
  if (!items || items.length === 0) return "";
  let max = new Date(items[0].startDate || "");
  for (const item of items) {
    if (!item.startDate) continue;
    const d = new Date(item.startDate);
    if (item.rateType === "HOURLY") d.setHours(d.getHours() + (item.duration || 1));
    else d.setDate(d.getDate() + (item.duration || 1));
    if (d > max) max = d;
  }
  return max.toISOString();
};

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@adatrack/ui/src/DataTable';
import { Badge } from '@adatrack/ui/src/Badge';
import { PanelShell, type DataTableFilterConfig } from '@adatrack/ui';
import { Clock, AlertTriangle, CheckCircle2, MapPin, List } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { DataTableColumnDef } from '@adatrack/ui/src/DataTable/types';
import { contractService } from '@/data/modules/rental/services/contractService';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalContract } from '../contracts/types/contract';

interface RentedVehicleRow {
  id: string;
  contractId: string;
  contractNumber: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  startDate: string;
  endDate: string;
  isOverdue: boolean;
  remainingHours: number;
  remainingDays: number;
}

function StatCard({ label, value, colorClass, icon: Icon }: { label: string, value: number, colorClass: string, icon?: React.ElementType }) {
  const textColorClass = colorClass.replace(/bg-/g, 'text-');
  
  return (
    <div className="flex items-center justify-between p-3 rounded-none border border-border/80 bg-background transition-colors hover:border-border">
      <div className="flex items-center gap-2.5">
        {Icon ? (
          <div className={cn("p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800", textColorClass)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className={cn("w-2 h-2 rounded-full", colorClass)} />
        )}
        <span className="text-[11px] font-semibold text-foreground-muted tracking-tight uppercase">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

export function MonitoringFeature() {
  const router = useRouter();
  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ON_TIME' | 'OVERDUE'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Layout states
  const [showStats, setShowStats] = useState(true);
  const [panelSide, setPanelSide] = useState<'left' | 'right' | 'top' | 'bottom'>('top');

  const fetchActiveContracts = async () => {
    setLoading(true);
    try {
      const data = await contractService.getContracts({ search: '', status: 'ACTIVE' });
      setContracts(data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveContracts();
  }, []);

  const rentedVehicles = useMemo(() => {
    const rows: RentedVehicleRow[] = [];
    const now = new Date();

    contracts.forEach(contract => {
      const items = contract.items || [];
      items.forEach(item => {
        // Use item endDate if different, otherwise fallback to contract
        const endDateObj = new Date(getMaxEndDate(contract.items || []));
        const overdue = now > endDateObj;
        
        const msDiff = Math.abs(now.getTime() - endDateObj.getTime());
        const totalHours = Math.floor(msDiff / (1000 * 60 * 60));
        const remainingDays = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;

        rows.push({
          id: `${contract.id}-${item.id}`,
          contractId: contract.id,
          contractNumber: contract.contractNumber || '-',
          bookingNumber: contract.bookingNumber || '-',
          customerName: contract.customer?.name || '-',
          customerPhone: contract.customer?.phone || '',
          vehicleId: item.vehicleId,
          vehicleName: item.vehicleSnapshot?.model || 'Unknown Vehicle',
          licensePlate: item.vehicleSnapshot?.licensePlate || '-',
          startDate: item.startDate || contract.startDate,
          endDate: getMaxEndDate(contract.items || []),
          isOverdue: overdue,
          remainingHours,
          remainingDays,
        });
      });
    });
    
    // Sort by most urgent
    return rows.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      
      const totalHoursA = a.remainingDays * 24 + a.remainingHours;
      const totalHoursB = b.remainingDays * 24 + b.remainingHours;
      
      if (a.isOverdue && b.isOverdue) return totalHoursB - totalHoursA; // most overdue first
      return totalHoursA - totalHoursB; // least remaining first
    });
  }, [contracts]);

  const filteredVehicles = useMemo(() => {
    return rentedVehicles.filter(v => {
      if (statusFilter === 'ON_TIME' && v.isOverdue) return false;
      if (statusFilter === 'OVERDUE' && !v.isOverdue) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          v.customerName.toLowerCase().includes(s) ||
          v.vehicleName.toLowerCase().includes(s) ||
          v.licensePlate.toLowerCase().includes(s) ||
          v.contractNumber.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [rentedVehicles, search, statusFilter]);

  const columns: DataTableColumnDef<RentedVehicleRow>[] = [
    {
      id: 'vehicle',
      header: 'Kendaraan',
      size: 200,
      accessorFn: (row) => row.vehicleName,
      cell: ({ row }) => {
        const handleTrack = () => {
          trackingNavigationService.navigateToTracking(router, {
            mode: 'live',
            vehicleIds: [row.original.vehicleId],
            vehicleId: row.original.vehicleId
          });
        };

        return (
          <div className="flex flex-col items-start gap-1">
            <button 
              type="button"
              onClick={handleTrack}
              className="text-left group flex flex-col focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
              title="Klik untuk melacak lokasi armada"
            >
              <span className="font-semibold group-hover:text-primary transition-colors">
                {row.original.vehicleName}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1 group-hover:text-primary transition-colors">
                <MapPin className="w-3 h-3 text-primary" />
                {row.original.licensePlate}
              </span>
            </button>
          </div>
        );
      }
    },
    {
      id: 'customer',
      header: 'Penyewa',
      size: 190,
      accessorFn: (row) => row.customerName,
      cell: ({ row }) => {
        const phone = row.original.customerPhone;
        const waNumber = phone ? phone.replace(/^0/, '62').replace(/\D/g, '') : '';
        const waLink = waNumber ? `https://wa.me/${waNumber}` : '#';

        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium truncate">{row.original.customerName}</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-muted-foreground">{row.original.contractNumber}</span>
              {phone && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <a 
                    href={waLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors hover:underline"
                    title="Hubungi via WhatsApp"
                  >
                    {phone}
                  </a>
                </>
              )}
            </div>
          </div>
        );
      }
    },
    {
      id: 'timeRange',
      header: 'Periode Sewa',
      size: 160,
      cell: ({ row }) => {
        const start = new Date(row.original.startDate);
        const end = new Date(row.original.endDate);
        const fmt = (d: Date) => d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('pukul ', '');
        return (
          <div className="flex flex-col text-[11px]">
            <span>{fmt(start)}</span>
            <span className="text-muted-foreground text-[9px] uppercase font-bold my-0.5">s/d</span>
            <span className="font-medium">{fmt(end)}</span>
          </div>
        );
      }
    },
    {
      id: 'status',
      header: 'Status Waktu',
      size: 200,
      accessorFn: (row) => row.isOverdue,
      cell: ({ row }) => {
        const { isOverdue, remainingDays, remainingHours } = row.original;
        
        let timeText = '';
        if (remainingDays > 0) {
          timeText = `${remainingDays} Hari ${remainingHours} Jam`;
        } else {
          timeText = `${remainingHours} Jam`;
        }

        if (isOverdue) {
          return (
            <div className="flex items-center gap-2">
              <Badge variant="danger" className="text-[10px] uppercase font-bold gap-1 px-1.5 py-0 shrink-0">
                <AlertTriangle className="w-3 h-3" />
                Terlambat
              </Badge>
              <span className="text-xs font-bold text-danger">({timeText})</span>
            </div>
          );
        }

        const isEndingSoon = remainingDays === 0;
        return (
          <div className="flex items-center gap-2">
            <Badge className={`text-[10px] uppercase font-bold gap-1 px-1.5 py-0 shrink-0 ${isEndingSoon ? 'bg-amber-500/15 text-amber-600 border-amber-500/40' : 'bg-success/15 text-success border-success/40'}`}>
              {isEndingSoon ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
              {isEndingSoon ? 'Segera Berakhir' : 'Aman'}
            </Badge>
            <span className={`text-xs font-semibold ${isEndingSoon ? 'text-amber-600' : 'text-success'}`}>
              (Sisa {timeText})
            </span>
          </div>
        );
      }
    }
  ];

  const filterConfig: DataTableFilterConfig = {
    state: { status: statusFilter === 'all' ? '' : statusFilter },
    onStateChange: (state) => setStatusFilter((state.status as any) || 'all'),
    onClearAll: () => setStatusFilter('all'),
    labels: { title: 'Filter Monitoring', clearAll: 'Reset' },
    fields: [
      {
        id: 'status',
        label: 'Status',
        type: 'pills-single',
        options: [
          { value: 'ON_TIME', label: 'Tepat Waktu', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'OVERDUE', label: 'Terlambat', colorClass: 'bg-danger', activeClass: 'bg-danger/15 border-danger/40 text-danger' },
        ]
      }
    ]
  };

  const totalActive = rentedVehicles.length;
  const totalOverdue = rentedVehicles.filter(v => v.isOverdue).length;
  const totalEndingSoon = rentedVehicles.filter(v => !v.isOverdue && v.remainingDays === 0).length;

  const renderStatsPanel = () => {
    return (
      <PanelShell
        title="Ringkasan Monitoring"
        side={panelSide}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        onOpen={() => setShowStats(true)}
        collapsedTitle="RINGKASAN"
        onSideChange={setPanelSide}
        labels={{
          top: 'Atas',
          right: 'Kanan',
          bottom: 'Bawah',
          left: 'Kiri',
          hide: 'Sembunyikan',
          layoutToggleTitle: 'Ubah Posisi Panel',
        }}
        className={cn(
          "shrink-0 bg-white dark:bg-background z-10",
          (panelSide === 'top' || panelSide === 'bottom') ? "w-full" : "w-80 min-w-80 h-full"
        )}
      >
        <div className={cn("gap-2.5 p-3", (panelSide === 'top' || panelSide === 'bottom') ? "grid grid-cols-1 sm:grid-cols-3" : "flex flex-col h-full")}>
          <StatCard label="Total Armada Disewa" value={totalActive} colorClass="bg-primary" icon={List} />
          <StatCard label="Segera Berakhir (< 24 Jam)" value={totalEndingSoon} colorClass="bg-amber-500" icon={Clock} />
          <StatCard label="Terlambat Kembali" value={totalOverdue} colorClass="bg-danger" icon={AlertTriangle} />
        </div>
      </PanelShell>
    );
  };

  return (
    <div className={cn("flex h-full w-full bg-background overflow-hidden relative", (panelSide === 'top' || panelSide === 'bottom') ? 'flex-col' : 'flex-row')}>
      {/* Render panel first if top or left */}
      {(panelSide === 'top' || panelSide === 'left') && renderStatsPanel()}

      {/* Main Table */}
      <div className="flex-1 min-h-0 min-w-0 w-full relative border-none">
        <DataTable
          data={filteredVehicles}
          columns={columns}
          isLoading={loading}
          pagination
          sortable
          columnVisibility
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari kendaraan, penyewa, no kontrak..."
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          filterConfig={filterConfig}
          exportable
          exportFilename="Monitoring_Sisa_Waktu_Armada.csv"
          className="border-none shadow-none h-full"
        />
      </div>

      {/* Render panel last if bottom or right */}
      {(panelSide === 'bottom' || panelSide === 'right') && renderStatsPanel()}
    </div>
  );
}
