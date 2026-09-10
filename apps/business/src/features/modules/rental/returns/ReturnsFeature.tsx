'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { RotateCcw, FileText, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@adatrack/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { returnService } from '@/data/modules/rental/services/returnService';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalReturn } from './types/return';
import type { RentalContract } from '../contracts/types/contract';
import { ReturnList } from './components/ReturnList';
import { ReturnDetailDrawer } from './components/ReturnDetailDrawer';

export function ReturnsFeature() {
  const router = useRouter();
  const [returns, setReturns] = useState<RentalReturn[]>([]);
  const [eligibleContracts, setEligibleContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<{ condition: string }>({ condition: '' });

  const [selectedReturn, setSelectedReturn] = useState<RentalReturn | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, eligible] = await Promise.all([
        returnService.getReturns(),
        returnService.getEligibleContracts(),
      ]);
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReturns(sorted);
      setEligibleContracts(eligible);
    } catch (err) {
      console.error('Failed to load returns data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterConfig = useMemo(() => {
    return {
      state: filterState,
      onStateChange: setFilterState,
      onClearAll: () => setFilterState({ condition: '' }),
      labels: {
        title: 'Filter',
        clearAll: 'Hapus Semua',
      },
      fields: [
        {
          id: 'condition',
          label: 'Kondisi Kendaraan',
          type: 'pills-single',
          options: [
            { value: 'GOOD', label: 'Baik', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
            { value: 'MINOR_DAMAGE', label: 'Kerusakan Ringan', colorClass: 'bg-warning', activeClass: 'bg-warning/15 border-warning/40 text-warning' },
            { value: 'NEEDS_REPAIR', label: 'Perlu Perbaikan', colorClass: 'bg-danger', activeClass: 'bg-danger/15 border-danger/40 text-danger' },
          ],
        },
      ],
    };
  }, [filterState]);

  const filteredData = useMemo(() => {
    return returns.filter((r) => {
      // Filter by Condition
      if (filterState.condition) {
        if (r.vehicleConditionEnd !== filterState.condition) return false;
      }

      // Filter by Search
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(s) ||
        r.contractId.toLowerCase().includes(s) ||
        r.contract?.contractNumber?.toLowerCase().includes(s) ||
        r.customer?.name?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.brand?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.vehicleName?.toLowerCase().includes(s)
      );
    });
  }, [returns, search, filterState]);

  const openDetail = (ret: RentalReturn) => {
    setSelectedReturn(ret);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedReturn(null), 300);
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-neutral-50/50 dark:bg-background">
      
      {/* SECTION B: RIWAYAT PENGEMBALIAN (Left) */}
      <div className="flex-1 min-w-0 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <ReturnList
            className="h-full border-0 rounded-none"
            data={filteredData}
            searchValue={search}
            onSearchChange={setSearch}
            onViewDetail={openDetail}
            filterConfig={filterConfig}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={setIsFilterOpen}
          />
        )}
      </div>

      {/* SECTION A: SIAP DIKEMBALIKAN (Right) */}
      <div className="w-[320px] shrink-0 min-h-0 flex flex-col overflow-y-auto bg-neutral-50/30 dark:bg-neutral-900/20 border-l border-border">
        <div className="p-4 space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            Siap Dikembalikan
          </h2>
          
          {eligibleContracts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {eligibleContracts.map(contract => (
                <div key={contract.id} className="group relative bg-white dark:bg-neutral-900 border border-border rounded-xl p-3.5 hover:border-primary/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2.5">
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-[13px] text-foreground truncate" title={contract.contractNumber}>{contract.contractNumber}</span>
                        <span className="text-[12px] text-muted-foreground truncate" title={contract.customer?.name}>{contract.customer?.name}</span>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shrink-0 border border-blue-100 dark:border-blue-800/30">
                        ACTIVE
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (contract.vehicle?.coreVehicle?.id) {
                          trackingNavigationService.navigateToTracking(router, {
                            mode: 'live',
                            vehicleId: contract.vehicle.coreVehicle.id
                          });
                        }
                      }}
                      className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors mb-3 w-full text-left"
                      title="Lihat Lokasi Terkini di Pemantauan"
                    >
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate hover:underline">
                        {contract.vehicle?.coreVehicle?.brand} {contract.vehicle?.coreVehicle?.vehicleName} &bull; <span className="font-medium text-foreground/80">{contract.vehicle?.coreVehicle?.plateNumber}</span>
                      </span>
                    </button>
                    <div className="mb-4 space-y-1">
                      <p className="text-[11px] text-muted-foreground">
                        Odometer: {contract.vehicle?.currentOdometer?.toLocaleString('id-ID') || '-'} KM
                      </p>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">
                        Jatuh Tempo: {contract.endDate ? new Date(contract.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </p>
                    </div>
                  </div>
                  <Link href={`/rental/contracts/${contract.id}/return`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full h-8 px-3 text-[12px] font-medium justify-between shadow-none transition-all group-hover:border-primary/40 group-hover:text-primary">
                      Proses Pengembalian
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-border rounded-xl">
              <RotateCcw className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-[13px] font-medium text-muted-foreground">Tidak ada armada</p>
              <p className="text-[12px] text-muted-foreground/70">Belum ada armada yang siap untuk dikembalikan.</p>
            </div>
          )}
        </div>
      </div>

      <ReturnDetailDrawer
        open={isDetailOpen}
        onClose={closeDetail}
        ret={selectedReturn}
      />
    </div>
  );
}
