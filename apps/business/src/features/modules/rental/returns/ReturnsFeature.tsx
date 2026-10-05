'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { RotateCcw, ArrowRight, MapPin, Search, Check, FileText } from 'lucide-react';
import { Button, PanelShell, DataTableSearch, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@adatrack/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { returnService } from '@/data/modules/rental/services/returnService';
import { buildRentalVehicleContext } from '@/data/modules/rental/services/vehicleContextBuilder';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import { cn } from '@adatrack/utils';
import type { RentalReturn } from './types/return';
import type { RentalContract } from '../contracts/types/contract';
import { ReturnList, type ReturnGroup } from './components/ReturnList';
import { ReturnView } from './components/ReturnView';
import { ReturnFeature as ReturnFormFeature } from './ReturnFeature';

export function ReturnsFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const [returns, setReturns] = useState<RentalReturn[]>([]);
  const [eligibleContracts, setEligibleContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eligibleSearch, setEligibleSearch] = useState('');
  
  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<{ condition: string }>({ condition: '' });

  // Drawer & Dialog state
  const [selectedReturnGroup, setSelectedReturnGroup] = useState<ReturnGroup | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Panel state
  const [panelSide, setPanelSide] = useState<'top' | 'right' | 'bottom' | 'left'>('left');
  const [showPanel, setShowPanel] = useState(true);

  // Create Return Drawer State
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

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
    // Filter first
    const filtered = returns.filter((r) => {
      if (filterState.condition) {
        if (r.vehicleConditionEnd !== filterState.condition) return false;
      }
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

    // Group by contractId
    const map = new Map<string, ReturnGroup>();
    for (const r of filtered) {
      if (!map.has(r.contractId)) {
        map.set(r.contractId, {
          id: r.contractId,
          contractId: r.contractId,
          contract: r.contract,
          customer: r.customer,
          returnedAt: r.returnedAt,
          returnAddress: r.returnAddress,
          returnLatitude: r.returnLatitude,
          returnLongitude: r.returnLongitude,
          status: 'PARTIAL',
          items: [],
        });
      }
      map.get(r.contractId)!.items.push(r);
    }
    
    // Convert to array and set status
    const groups = Array.from(map.values());
    for (const g of groups) {
      // Very basic logic: if all booking items in the contract are returned, it's COMPLETED.
      g.status = (g.contract?.status === 'COMPLETED') ? 'COMPLETED' : 'PARTIAL';
    }
    return groups;
  }, [returns, search, filterState]);

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

  const returnedItemIds = useMemo(() => {
    return new Set(returns.map(r => r.bookingItemId));
  }, [returns]);

  const openDetail = (group: ReturnGroup) => {
    setSelectedReturnGroup(group);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedReturnGroup(null), 300);
  };

  const renderPanel = () => {
    return (
      <PanelShell
        title="Siap Dikembalikan"
        side={panelSide}
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        onOpen={() => setShowPanel(true)}
        collapsedTitle="SIAP DIKEMBALIKAN"
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
                const isSelected = selectedContractId === contract.id;
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
                          const isReturned = returnedItemIds.has(item.id);
                          return (
                            <TooltipProvider key={item.id || idx}>
                              <Tooltip delayDuration={200}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      "flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold rounded border cursor-default transition-all",
                                      isReturned
                                        ? "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:border-success/30"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-muted-foreground border-transparent"
                                    )}
                                  >
                                    {isReturned && <Check className="w-3 h-3 shrink-0" />}
                                    {item.vehicle?.coreVehicle?.plateNumber}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-semibold">{item.vehicle?.coreVehicle?.brand} {item.vehicle?.coreVehicle?.vehicleName}</p>
                                  {isReturned && <p className="text-[10px] text-success font-medium mt-0.5">Sudah Dikembalikan</p>}
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
                          router.push(`/rental/returns/create?contractId=${contract.id}`);
                        }}
                      >
                        Proses Pengembalian
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
              <span>Tidak ada kendaraan yang<br />siap dikembalikan</span>
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <ReturnList
            className="border-0 rounded-none h-full"
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

      {/* Render panel last if right or bottom */}
      {(panelSide === 'right' || panelSide === 'bottom') && renderPanel()}

      <ReturnView
        open={isDetailOpen}
        onClose={closeDetail}
        returnGroup={selectedReturnGroup}
      />

    </div>
  );
}
