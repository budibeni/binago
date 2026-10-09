
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
import { PanelShell, type DataTableFilterConfig } from '@adatrack/ui';
import { Car, BarChart2, Calendar, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { DataTableColumnDef } from '@adatrack/ui/src/DataTable/types';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';
import { contractService } from '@/data/modules/rental/services/contractService';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import type { RentalContract } from '@/features/modules/rental/contracts/types/contract';

interface VehicleProductivityRow {
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  category: string;
  totalRentals: number;
  totalHours: number;
  productivityScore: number; // percentage 0-100 based on month
}

function StatCard({ label, value, colorClass, icon: Icon, desc }: { label: string, value: string | number, colorClass: string, icon?: React.ElementType, desc?: string }) {
  const textColorClass = colorClass.replace(/bg-/g, 'text-');
  
  return (
    <div className="flex items-center justify-between p-3 rounded-none border border-border/80 bg-background transition-colors hover:border-border">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <div className={cn("p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800", textColorClass)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className={cn("w-2 h-2 rounded-full", colorClass)} />
          )}
          <span className="text-[11px] font-semibold text-muted-foreground tracking-tight uppercase">{label}</span>
        </div>
        {desc && <span className="text-[9px] font-medium text-muted-foreground/80 pl-8 leading-none">{desc}</span>}
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

export function ReportsFeature() {
  const router = useRouter();
  const months = useMemo(() => ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'], []);
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Date filters (Month and Year)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedMonths, setSelectedMonths] = useState<number[]>([currentMonth]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // General Filters
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Layout states
  const [showStats, setShowStats] = useState(true);
  const [panelSide, setPanelSide] = useState<'left' | 'right' | 'top' | 'bottom'>('top');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vData, cData] = await Promise.all([
          rentalVehicleService.getRentalVehicles(),
          contractService.getContracts() // Fetch all to calculate based on month
        ]);
        setVehicles(vData);
        setContracts(cData);
      } catch (error) {
        console.error('Error fetching productivity data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Instead of a single month, we calculate for all selected months
  const startOfPeriod = new Date(selectedYear, Math.min(...(selectedMonths.length ? selectedMonths : [0])), 1);
  const endOfPeriod = new Date(selectedYear, Math.max(...(selectedMonths.length ? selectedMonths : [11])) + 1, 0, 23, 59, 59, 999);
  
  // Total hours in the selected months
  const totalHoursInPeriod = selectedMonths.reduce((acc, month) => {
    return acc + new Date(selectedYear, month + 1, 0).getDate() * 24;
  }, 0) || (new Date(selectedYear, 1, 0).getDate() * 24); // Fallback to avoid div by zero

  const productivityData = useMemo(() => {
    const data: VehicleProductivityRow[] = vehicles.map(v => {
      let totalRentals = 0;
      let totalHours = 0;

      contracts.forEach(contract => {
        // Skip if cancelled
        if (contract.status === 'CANCELLED') return;
        
        // Find if this vehicle was rented in this contract
        const item = contract.items?.find((i: any) => i.vehicleId === v.id);
        if (!item) return;

        const start = new Date(item.startDate || contract.startDate);
        const end = new Date(getMaxEndDate(contract.items || []));

        // Check if the rental overlaps with our selected period
        // But more specifically, we should only count hours that fall within the selected months!
        // To simplify, we check overlap with the entire period, then exact hours per month.
        if (start <= endOfPeriod && end >= startOfPeriod) {
          totalRentals += 1;
          
          selectedMonths.forEach(m => {
            const mStart = new Date(selectedYear, m, 1);
            const mEnd = new Date(selectedYear, m + 1, 0, 23, 59, 59, 999);
            
            const overlapStart = start < mStart ? mStart : start;
            const overlapEnd = end > mEnd ? mEnd : end;
            
            const msDiff = overlapEnd.getTime() - overlapStart.getTime();
            if (msDiff > 0) {
              totalHours += (msDiff / (1000 * 60 * 60));
            }
          });
        }
      });

      const productivityScore = Math.min(100, Math.round((totalHours / totalHoursInPeriod) * 100)) || 0;

      return {
        vehicleId: v.id,
        vehicleName: v.coreVehicle?.vehicleName || 'Unknown Vehicle',
        licensePlate: v.coreVehicle?.plateNumber || '-',
        category: v.coreVehicle?.vehicleCategory || '-',
        totalRentals,
        totalHours: Math.round(totalHours),
        productivityScore
      };
    });

    return data.sort((a, b) => b.productivityScore - a.productivityScore); // Highest productivity first
  }, [vehicles, contracts, startOfPeriod, endOfPeriod, totalHoursInPeriod, selectedMonths, selectedYear]);

  const filteredData = useMemo(() => {
    return productivityData.filter(v => {
      if (search) {
        const s = search.toLowerCase();
        return (
          v.vehicleName.toLowerCase().includes(s) ||
          v.licensePlate.toLowerCase().includes(s) ||
          v.category.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [productivityData, search]);

  const columns: DataTableColumnDef<VehicleProductivityRow>[] = [
    {
      id: 'vehicle',
      header: 'Kendaraan',
      size: 250,
      accessorFn: (row) => row.vehicleName,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.original.vehicleName}</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{row.original.licensePlate}</span>
        </div>
      )
    },
    {
      id: 'category',
      header: 'Kategori',
      size: 120,
      accessorFn: (row) => row.category,
      cell: ({ row }) => (
        <span className="capitalize">{row.original.category}</span>
      )
    },
    {
      id: 'totalRentals',
      header: 'Frekuensi Sewa',
      size: 150,
      accessorFn: (row) => row.totalRentals,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.totalRentals} Kali</span>
      )
    },
    {
      id: 'totalHours',
      header: 'Total Durasi',
      size: 150,
      accessorFn: (row) => row.totalHours,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.totalHours} Jam</span>
      )
    },
    {
      id: 'productivity',
      header: 'Produktivitas',
      size: 200,
      accessorFn: (row) => row.productivityScore,
      cell: ({ row }) => {
        const score = row.original.productivityScore;
        let colorClass = 'bg-danger text-white';
        let Icon = TrendingDown;
        
        if (score >= 70) {
          colorClass = 'bg-success text-white';
          Icon = TrendingUp;
        } else if (score >= 40) {
          colorClass = 'bg-amber-500 text-white';
          Icon = Minus;
        } else if (score === 0) {
          colorClass = 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
          Icon = Minus;
        }

        return (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className={cn("h-full", colorClass.split(' ')[0])} 
                style={{ width: `${score}%` }}
              />
            </div>
            <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold w-14 justify-center", colorClass)}>
              <span>{score}%</span>
            </div>
          </div>
        );
      }
    }
  ];

  const totalArmada = vehicles.length;
  const avgProduktivitas = Math.round(productivityData.reduce((acc, curr) => acc + curr.productivityScore, 0) / (totalArmada || 1));
  const totalSewaBulanan = productivityData.reduce((acc, curr) => acc + curr.totalRentals, 0);
  const totalJamBulanan = productivityData.reduce((acc, curr) => acc + curr.totalHours, 0);

  const filterConfig: DataTableFilterConfig = {
    state: { 
      month: selectedMonths.map(m => m.toString()),
      year: selectedYear.toString()
    },
    onStateChange: (state) => {
      if (state.month && Array.isArray(state.month)) {
        setSelectedMonths(state.month.map(Number));
      }
      if (state.year && typeof state.year === 'string') {
        setSelectedYear(Number(state.year));
      }
    },
    onClearAll: () => {
      setSelectedMonths([currentMonth]);
      setSelectedYear(currentYear);
    },
    labels: { title: 'Filter Periode', clearAll: 'Reset ke Bulan Ini' },
    fields: [
      {
        id: 'year',
        label: 'Tahun',
        type: 'select',
        options: [2024, 2025, 2026, 2027].map(y => ({ 
          value: y.toString(), 
          label: y.toString()
        }))
      },
      {
        id: 'month',
        label: 'Bulan',
        type: 'pills-multi',
        options: months.map((m, i) => ({ 
          value: i.toString(), 
          label: m,
          activeClass: 'bg-primary/15 border-primary/40 text-primary',
          colorClass: 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200'
        }))
      }
    ]
  };

  const renderStatsPanel = () => {
    return (
      <PanelShell
        title="Ringkasan Produktivitas"
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
          (panelSide === 'top' || panelSide === 'bottom') ? "w-full border-b" : "w-80 min-w-80 h-full border-x"
        )}
      >
        <div className={cn("gap-2.5 p-3 bg-neutral-50/50 dark:bg-neutral-900/20", (panelSide === 'top' || panelSide === 'bottom') ? "grid grid-cols-2 md:grid-cols-4" : "flex flex-col h-full")}>
          <StatCard label="Total Kendaraan" value={`${totalArmada} Unit`} colorClass="bg-blue-500" icon={Car} desc="Terdaftar di sistem" />
          <StatCard label="Rata-rata Produktivitas" value={`${avgProduktivitas}%`} colorClass="bg-primary" icon={BarChart2} desc={`Periode ini (${totalHoursInPeriod} Jam)`} />
          <StatCard label="Total Transaksi" value={`${totalSewaBulanan} Sewa`} colorClass="bg-amber-500" icon={Calendar} desc="Dalam periode ini" />
          <StatCard label="Total Jam Tersewa" value={`${totalJamBulanan} Jam`} colorClass="bg-success" icon={TrendingUp} desc="Seluruh kendaraan" />
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
          data={filteredData}
          columns={columns}
          isLoading={loading}
          pagination
          sortable
          columnVisibility
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari kendaraan atau plat nomor..."
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          filterConfig={filterConfig}
          exportable
          exportFilename={`Laporan_Produktivitas_Armada_${selectedYear}.csv`}
          className="border-none shadow-none h-full"
        />
      </div>

      {/* Render panel last if bottom or right */}
      {(panelSide === 'bottom' || panelSide === 'right') && renderStatsPanel()}
    </div>
  );
}
