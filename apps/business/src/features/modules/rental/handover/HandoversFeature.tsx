'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Key, FileText, ArrowRight, MapPin } from 'lucide-react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { useRouter } from 'next/navigation';
import { handoverService } from '@/data/modules/rental/services/handoverService';
import type { RentalHandover } from './types/handover';
import type { RentalContract } from '../contracts/types/contract';
import { HandoverList } from './components/HandoverList';
import { HandoverDetailDrawer } from './components/HandoverDetailDrawer';
import { Button } from '@adatrack/ui';
import Link from 'next/link';

export function HandoversFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const [handovers, setHandovers] = useState<RentalHandover[]>([]);
  const [eligibleContracts, setEligibleContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<{ condition: string }>({ condition: '' });
  
  // Drawer & Dialog state
  const [selectedHandover, setSelectedHandover] = useState<RentalHandover | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, eligible] = await Promise.all([
        handoverService.getHandovers(),
        handoverService.getEligibleContracts(),
      ]);
      // Sort by newest first
      const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHandovers(sorted);
      setEligibleContracts(eligible);
    } catch (error) {
      console.error('Failed to load data:', error);
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
    return handovers.filter((h) => {
      // Filter by Condition
      if (filterState.condition) {
        if (h.vehicleCondition !== filterState.condition) return false;
      }

      // Filter by Search (ID Handover, Contract ID, Customer Name, Vehicle Plate/Name)
      if (search) {
        const s = search.toLowerCase();
        const matchSearch = 
          h.id.toLowerCase().includes(s) || 
          h.contractId.toLowerCase().includes(s) ||
          h.contract?.contractNumber?.toLowerCase().includes(s) ||
          h.customer?.name?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.brand?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.vehicleName?.toLowerCase().includes(s);
        
        if (!matchSearch) return false;
      }
      return true;
    });
  }, [handovers, search, filterState]);

  const openDetail = (handover: RentalHandover) => {
    setSelectedHandover(handover);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedHandover(null), 300);
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-neutral-50/50 dark:bg-background">
      
      {/* SECTION B: RIWAYAT SERAH TERIMA (Left) */}
      <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto p-0 border-r border-border bg-background">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <HandoverList
            className="border-0 rounded-none"
            data={filteredData}
            searchValue={search}
            onSearchChange={setSearch}
            filterConfig={filterConfig}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={setIsFilterOpen}
            onViewDetail={openDetail}
          />
        )}
      </div>

      {/* SECTION A: SIAP SERAH TERIMA (Right) */}
      <div className="w-[320px] shrink-0 min-h-0 flex flex-col overflow-y-auto bg-neutral-50/30 dark:bg-neutral-900/20">
        <div className="p-4 space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            Siap Serah Terima
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
                        CONFIRMED
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
                  </div>
                  <Link href={`/rental/contracts/${contract.id}/handover`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full h-8 px-3 text-[12px] font-medium justify-between shadow-none transition-all group-hover:border-primary/40 group-hover:text-primary">
                      Proses Serah Terima
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-xl border-border text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 opacity-20" />
              <span>Tidak ada kendaraan yang<br/>siap diserahterimakan</span>
            </div>
          )}
        </div>
      </div>

      <HandoverDetailDrawer
        open={isDetailOpen}
        onClose={closeDetail}
        handover={selectedHandover}
      />

    </div>
  );
}
