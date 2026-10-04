'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Key, FileText, ArrowRight, MapPin, Search, Check } from 'lucide-react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { useRouter } from 'next/navigation';
import { handoverService } from '@/data/modules/rental/services/handoverService';
import { buildRentalVehicleContext } from '@/data/modules/rental/services/vehicleContextBuilder';
import type { RentalHandover } from './types/handover';
import type { RentalContract } from '../contracts/types/contract';
import { HandoverList } from './components/HandoverList';
import { HandoverView } from './components/HandoverView';
import { HandoverFeature } from './HandoverFeature';
import { Button, PanelShell, DataTableSearch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@adatrack/ui';
import { cn } from '@adatrack/utils';

export function HandoversFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const [handovers, setHandovers] = useState<RentalHandover[]>([]);
  const [eligibleContracts, setEligibleContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eligibleSearch, setEligibleSearch] = useState('');

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<{ condition: string }>({ condition: '' });

  // Drawer & Dialog state
  const [selectedHandover, setSelectedHandover] = useState<import('./components/HandoverList').HandoverGroup | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Panel state
  const [panelSide, setPanelSide] = useState<'top' | 'right' | 'bottom' | 'left'>('left');
  const [showPanel, setShowPanel] = useState(true);

  // Create Handover Drawer State
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isHandoverOpen, setIsHandoverOpen] = useState(false);

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

  const groupedHandovers = useMemo(() => {
    const groups: Record<string, any> = {};
    filteredData.forEach(h => {
      if (!groups[h.contractId]) {
        groups[h.contractId] = {
          id: h.contractId,
          contractId: h.contractId,
          contract: h.contract,
          customer: h.customer,
          handoverAt: h.handoverAt,
          handoverLatitude: h.handoverLatitude,
          handoverLongitude: h.handoverLongitude,
          handoverAddress: h.handoverAddress,
          items: []
        };
      }
      groups[h.contractId].items.push(h);
    });

    return Object.values(groups).map(g => {
      const totalBooked = g.contract?.booking?.items?.length || 0;
      const totalHandedOver = g.items.length;
      g.status = totalHandedOver >= totalBooked && totalBooked > 0 ? 'COMPLETED' : 'PARTIAL';
      return g;
    });
  }, [filteredData]);

  const filteredEligibleContracts = useMemo(() => {
    if (!eligibleSearch) return eligibleContracts;
    const s = eligibleSearch.toLowerCase();
    return eligibleContracts.filter(c => {
      if (c.contractNumber?.toLowerCase().includes(s)) return true;
      if (c.customer?.name?.toLowerCase().includes(s)) return true;
      if (c.booking?.items?.some(i =>
        i.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s) ||
        i.vehicle?.coreVehicle?.brand?.toLowerCase().includes(s) ||
        i.vehicle?.coreVehicle?.vehicleName?.toLowerCase().includes(s)
      )) return true;
      return false;
    });
  }, [eligibleContracts, eligibleSearch]);

  const handedOverItemIds = useMemo(() => {
    return new Set(handovers.map(h => h.bookingItemId));
  }, [handovers]);

  const openDetail = (group: any) => {
    setSelectedHandover(group);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedHandover(null), 300);
  };

  const renderPanel = () => {
    return (
      <PanelShell
        title="Siap Serah Terima"
        side={panelSide}
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        onOpen={() => setShowPanel(true)}
        collapsedTitle="SIAP SERAH TERIMA"
        onSideChange={setPanelSide}
        labels={{
          top: 'Atas',
          right: 'Kanan',
          bottom: 'Bawah',
          left: 'Kiri',
          hide: 'Sembunyikan',
          layoutToggleTitle: 'Ubah Posisi Panel',
        }}
        headerClassName="bg-transparent"
        className={cn(
          "shrink-0 bg-neutral-50 dark:bg-neutral-950 z-10",
          (panelSide === 'top' || panelSide === 'bottom') ? "w-full" : "w-80 min-w-80 h-full"
        )}
      >
        <div className={cn(
          "p-4",
          (panelSide === 'top' || panelSide === 'bottom') ? "flex flex-row overflow-x-auto gap-2 items-start" : "flex flex-col gap-2 overflow-y-auto h-full"
        )}>

          <div className={cn("shrink-0", (panelSide === 'top' || panelSide === 'bottom') ? "w-64" : "w-full")}>
            <DataTableSearch
              value={eligibleSearch}
              onChange={setEligibleSearch}
              placeholder="Cari..."
              className="w-full max-w-none [&>input]:bg-white dark:[&>input]:bg-neutral-900"
            />
          </div>

          {filteredEligibleContracts.length > 0 ? (
            <>
              {filteredEligibleContracts.map(contract => {
                const isSelected = selectedContractId === contract.id && isHandoverOpen;
                return (
                  <div key={contract.id} className={cn(
                    "group relative border rounded-xl p-2.5 transition-all duration-200 flex flex-col justify-between shrink-0",
                    "border-border bg-white dark:bg-neutral-900 hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-gray-400 dark:hover:border-gray-600",
                    (panelSide === 'top' || panelSide === 'bottom') ? "w-[280px]" : ""
                  )}>
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-[12px] text-foreground truncate" title={contract.contractNumber}>{contract.contractNumber}</span>
                          <span className="text-[11px] text-muted-foreground truncate" title={contract.customer?.name}>{contract.customer?.name}</span>
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground shrink-0 mt-0.5">
                          {new Date(contract.contractDate).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-1.5 w-full">
                        {(contract.booking?.items || []).map((item, idx) => {
                          const isHandedOver = handedOverItemIds.has(item.id);
                          return (
                            <TooltipProvider key={item.id || idx}>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      "flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold rounded border cursor-default transition-all",
                                      isHandedOver
                                        ? "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:border-success/30"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-muted-foreground border-transparent"
                                    )}
                                  >
                                    {isHandedOver && <Check className="w-3 h-3 shrink-0" />}
                                    {item.vehicle?.coreVehicle?.plateNumber}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-semibold">{item.vehicle?.coreVehicle?.brand} {item.vehicle?.coreVehicle?.vehicleName}</p>
                                  {isHandedOver && <p className="text-[10px] text-success font-medium mt-0.5">Sudah Diserahterimakan</p>}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0 shadow-none transition-all hover:border-primary/40 hover:text-primary"
                        title="Lihat Lokasi Kendaraan"
                        onClick={async () => {
                          const vehicleIds = (contract.booking?.items || [])
                            .map(i => i.vehicle?.coreVehicle?.id)
                            .filter(Boolean) as string[];

                          if (vehicleIds.length > 0) {
                            if (vehicleIds.length === 1) {
                              const vehicleId = vehicleIds[0];
                              try {
                                const ctx = await buildRentalVehicleContext(vehicleId, locale);
                                if (ctx) {
                                  sessionStorage.setItem(`adatrack_vehicle_context_${locale}_${vehicleId}`, JSON.stringify(ctx));
                                }
                              } catch (e) {
                                console.error('Failed to build context', e);
                              }
                              trackingNavigationService.navigateToTracking(router, {
                                mode: 'live',
                                vehicleId
                              });
                            } else {
                              trackingNavigationService.navigateToTracking(router, {
                                mode: 'live',
                                vehicleIds
                              });
                            }
                          }
                        }}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant={isSelected ? "primary" : "outline"}
                        size="sm"
                        className={cn(
                          "flex-1 h-7 px-2.5 text-[11px] font-semibold justify-between shadow-none transition-all",
                          !isSelected && "group-hover:border-primary/40 group-hover:text-primary hover:bg-primary/5"
                        )}
                        onClick={() => {
                          setSelectedContractId(contract.id);
                          setIsHandoverOpen(true);
                        }}
                      >
                        Proses Serah Terima
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div className="text-center w-full p-8 border border-dashed rounded-xl border-border text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 opacity-20" />
              <span>Tidak ada kendaraan yang<br />siap diserahterimakan</span>
            </div>
          )}
        </div>
      </PanelShell>
    );
  };

  return (
    <div className={cn("flex h-full w-full bg-background overflow-hidden relative", (panelSide === 'top' || panelSide === 'bottom') ? 'flex-col' : 'flex-row')}>

      {/* Render panel first if top or left */}
      {(panelSide === 'top' || panelSide === 'left') && renderPanel()}

      <div className="flex-1 min-w-0 flex flex-col min-h-0 overflow-y-auto p-0 bg-background relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <HandoverList
            className="border-0 rounded-none"
            data={groupedHandovers}
            searchValue={search}
            onSearchChange={setSearch}
            filterConfig={filterConfig}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={setIsFilterOpen}
            onViewDetail={openDetail}
          />
        )}
      </div>

      {/* Render panel last if right or bottom */}
      {(panelSide === 'right' || panelSide === 'bottom') && renderPanel()}

      <HandoverView
        open={isDetailOpen}
        onClose={closeDetail}
        handover={selectedHandover}
      />

      <HandoverFeature
        contractId={selectedContractId}
        open={isHandoverOpen}
        onOpenChange={setIsHandoverOpen}
        onSuccess={() => {
          setIsHandoverOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
