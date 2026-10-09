'use client';

import { getReturnTranslation } from './i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import React, { useEffect, useState, useMemo } from 'react';
import { getTranslation } from '@/i18n';
import type { RentalContract } from '../contracts/types/contract';
import { ReturnCreateFeature } from './ReturnCreateFeature';
import { ReturnView } from './components/ReturnView';
import { AlertCircle, CheckCircle2, Car, Search, CalendarRange, User, Building2, Star } from 'lucide-react';
import { cn, formatDateTime } from '@adatrack/utils';
import { DataList, DataListHeader, DataListContent, DataListItem, DataListPagination, DataTableSearch } from '@adatrack/ui';

export function ReturnsFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const tReturn = getReturnTranslation(locale);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [activeContracts, setActiveContracts] = useState<RentalContract[]>([]);
  const [completedContracts, setCompletedContracts] = useState<RentalContract[]>([]);
  
  // State
  const [activeTab, setActiveTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 15;

  // Reset pagination on search or tab change
  useEffect(() => {
    setPageIndex(0);
  }, [search, activeTab]);
  
  // Selection
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { contractService } = await import('@/data/modules/rental/services/contractService');
      const allContracts = await contractService.getContracts();
      
      const pending = allContracts.filter(c => c.status === 'ACTIVE' && c.items?.some(i => i.itemStatus === 'IN_USE'));
      const completed = allContracts.filter(c => c.status === 'COMPLETED' || (c.status === 'ACTIVE' && c.items && c.items.length > 0 && c.items.every(i => i.itemStatus === 'RETURNED')));

      // Sort pending by overdue first
      const sortContracts = (list: RentalContract[]) => {
        return list.sort((a, b) => {
          let aEnd = Infinity;
          a.items?.forEach(i => { if (i.endDate && i.itemStatus === 'IN_USE') { const d = new Date(i.endDate).getTime(); if (d < aEnd) aEnd = d; } });
          
          let bEnd = Infinity;
          b.items?.forEach(i => { if (i.endDate && i.itemStatus === 'IN_USE') { const d = new Date(i.endDate).getTime(); if (d < bEnd) bEnd = d; } });
          
          return aEnd - bEnd;
        });
      };

      setActiveContracts(sortContracts(pending));
      setCompletedContracts(completed);
    } catch (err) {
      console.error('Failed to load returns data:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'PENDING' ? activeContracts : completedContracts;

  // Search filter
  const filteredList = useMemo(() => {
    if (!search) return currentList;
    const s = search.toLowerCase();
    return currentList.filter(c => 
      c.contractNumber?.toLowerCase().includes(s) ||
      c.customerSnapshot?.name?.toLowerCase().includes(s) ||
      c.items?.some(i => i.vehicleSnapshot?.licensePlate?.toLowerCase().includes(s))
    );
  }, [currentList, search]);

  const totalRows = filteredList.length;
  const pageCount = Math.ceil(totalRows / pageSize);
  const canPrevPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;
  const currentListPaginated = filteredList.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  const getContractStatus = (contract: RentalContract) => {
    let safeCount = 0;
    let warningCount = 0;
    let overdueCount = 0;
    let returnedCount = 0;
    
    const items = contract.items || [];
    const now = new Date().getTime();
    
    items.forEach(i => {
       if (i.itemStatus === 'RETURNED') {
         returnedCount++;
         return;
       }
       if (!i.endDate) {
         safeCount++;
         return;
       }
       const diffHours = (new Date(i.endDate).getTime() - now) / (1000 * 60 * 60);
       if (diffHours < 0) overdueCount++;
       else if (diffHours < 24) warningCount++;
       else safeCount++;
    });
    
    // Find latest end date among items for the period display
    let latestEnd = 0;
    items.forEach(i => {
       if (i.endDate) {
          const t = new Date(i.endDate).getTime();
          if (t > latestEnd) latestEnd = t;
       }
    });
    
    return { 
      safeCount, warningCount, overdueCount, returnedCount, total: items.length,
      latestEnd: latestEnd > 0 ? new Date(latestEnd).toISOString() : null
    };
  };

  // Hitung skor bintang rata-rata booking berdasarkan ketepatan pengembalian
  const calculateReturnScore = (contract: RentalContract): number => {
    const returnedItems = (contract.items || []).filter(
      i => i.itemStatus === 'RETURNED' && i.returnDate && i.handoverDate && i.endDate && i.startDate
    );
    if (returnedItems.length === 0) return 0;

    const scores = returnedItems.map(i => {
      const plannedMinutes = (new Date(i.endDate!).getTime() - new Date(i.startDate!).getTime()) / (1000 * 60);
      const actualMinutes  = (new Date(i.returnDate!).getTime() - new Date(i.handoverDate!).getTime()) / (1000 * 60);
      const excessMinutes  = actualMinutes - plannedMinutes;

      if (excessMinutes <= 0)   return 5;   // Tepat waktu / lebih awal
      if (excessMinutes <= 120) return 4;   // Terlambat ≤ 2 jam
      if (excessMinutes <= 360) return 3;   // Terlambat 3–6 jam
      if (excessMinutes <= 720) return 2;   // Terlambat 7–12 jam
      return 1;                             // Terlambat > 12 jam
    });

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(avg * 10) / 10;
  };

    const selectedContract = useMemo(() => {
     const found = currentList.find(c => c.id === selectedContractId) || null;
     return found;
  }, [selectedContractId, currentList]);

  return (
    <div className="flex flex-col md:flex-row h-full bg-background overflow-hidden border-t border-border">
      
            {/* LEFT PANEL: Master List (30%) */}
      <DataList className={cn(selectedContractId ? "hidden md:flex" : "flex")}>
        <DataListHeader>
          <div className="flex w-full border-b border-border/60">
            <button 
              onClick={() => { setActiveTab('PENDING'); setSelectedContractId(null); }}
              className={cn(
                "flex-1 text-[12px] font-medium pt-0.5 pb-2 transition-all border-b-2 -mb-[1px]", 
                activeTab === 'PENDING' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {t.rentalContractFeature.statusActive}
            </button>
            <button 
              onClick={() => { setActiveTab('COMPLETED'); setSelectedContractId(null); }}
              className={cn(
                "flex-1 text-[12px] font-medium pt-0.5 pb-2 transition-all border-b-2 -mb-[1px]", 
                activeTab === 'COMPLETED' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tReturn.summaryCompleted}
            </button>
          </div>
          <DataTableSearch 
            value={search}
            onChange={setSearch}
            placeholder={tReturn.searchPlaceholder}
            className="max-w-full"
          />
        </DataListHeader>

        <DataListContent>
          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
          ) : currentListPaginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Car className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada data kontrak</p>
            </div>
          ) : (
            currentListPaginated.map(contract => {
              const isSelected = selectedContractId === contract.id;
              const status = getContractStatus(contract);

              return (
                <DataListItem 
                  key={contract.id}
                  isSelected={isSelected}
                  onClick={() => setSelectedContractId(contract.id)}
                >
                  <div className="flex flex-col w-full text-left">
                    {/* Baris 1: Kiri :#no kontrak, Kanan : status */}
                    <div className="flex justify-between items-center w-full mb-0.5">
                      <div className="text-[11px] font-normal text-muted-foreground truncate max-w-[50%]">
                        {contract.contractNumber}
                      </div>
                      <div className="flex items-center flex-wrap gap-1 justify-end text-[11px] font-medium tracking-wide shrink-0 max-w-[50%]">
                         {activeTab === 'PENDING' ? (
                           <>
                             {status.safeCount > 0 && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Aman ({status.safeCount})</span>}
                             {status.warningCount > 0 && <span className="flex items-center gap-1 text-warning"><div className="w-1.5 h-1.5 rounded-full bg-warning"></div> Segera Habis ({status.warningCount})</span>}
                             {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger"><div className="w-1.5 h-1.5 rounded-full bg-danger"></div> Overdue ({status.overdueCount})</span>}
                           </>
                         ) : (() => {
                           const score = calculateReturnScore(contract);
                           if (score === 0) return null;
                           const percentage = (score / 5) * 100;
                           return (
                             <div className="flex items-center gap-1">
                               <span className="text-[11px] font-semibold text-foreground">
                                 {score.toFixed(1)}
                               </span>
                               <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                                 <Star className="absolute top-0 left-0 w-3.5 h-3.5 text-slate-300 dark:text-slate-600 fill-transparent" />
                                 <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percentage}%` }}>
                                   <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                 </div>
                               </div>
                             </div>
                           );
                         })()}
                      </div>
                    </div>
                    
                    {/* Baris 2: Periode */}
                    <div className="flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
                      <CalendarRange className="w-3 h-3 text-neutral-400" />
                      <span className="truncate">{formatDateTime(contract.startDate)} s/d {status.latestEnd ? formatDateTime(status.latestEnd) : '-'}</span>
                    </div>

                    {/* Baris 3: Customer */}
                    <div className="flex items-center gap-1 text-[13px] font-medium text-foreground w-full mt-1.5">
                      {contract.customerSnapshot?.type?.toLowerCase().includes('perusahaan') || contract.customerSnapshot?.type?.toLowerCase().includes('b2b') || contract.customerSnapshot?.type?.toLowerCase().includes('company') ? (
                         <Building2 className="w-3 h-3 text-neutral-400 shrink-0" />
                      ) : (
                         <User className="w-3 h-3 text-neutral-400 shrink-0" />
                      )}
                      <span className="truncate w-full">{contract.customerSnapshot?.name || 'Pelanggan'}</span>
                    </div>
                  </div>
                </DataListItem>
              );
            })
          )}
        </DataListContent>

        <DataListPagination 
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalRows={totalRows}
          onNextPage={() => setPageIndex(p => p + 1)}
          onPrevPage={() => setPageIndex(p => p - 1)}
          canNextPage={canNextPage}
          canPrevPage={canPrevPage}
        />
      </DataList>

      {/* RIGHT PANEL: Detail View (70%) */}
      <div className={cn("flex-1 bg-neutral-50/50 dark:bg-neutral-950/20 overflow-y-auto relative", !selectedContractId ? "hidden md:block" : "block")}>
         {selectedContract ? (
            <div className="p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200 w-full max-w-6xl mx-auto">
               <button 
                  onClick={() => setSelectedContractId(null)}
                  className="md:hidden flex items-center gap-2 text-sm font-semibold text-primary mb-4"
               >
                  &larr; Kembali ke Daftar
               </button>
               {activeTab === 'PENDING' ? (
                  <ReturnCreateFeature
                     contractId={selectedContract.id}
                     open={true}
                     inline={true}
                     onOpenChange={() => setSelectedContractId(null)}
                     onSuccess={() => {
                        setSelectedContractId(null);
                        loadData();
                     }}
                  />
               ) : (
                  <ReturnView
                     returnGroup={{
                        id: selectedContract.id,
                        contractId: selectedContract.id,
                        contract: selectedContract,
                        customer: selectedContract.customerSnapshot,
                        items: selectedContract.items || [],
                        status: 'COMPLETED',
                        handoverAt: selectedContract.startDate,
                     }}
                     open={true}
                     inline={true}
                     layout="default"
                     onClose={() => setSelectedContractId(null)}
                  />
               )}
            </div>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground opacity-50">
               <Car className="w-16 h-16 mb-4" />
               <p className="text-lg font-bold">Pilih Kontrak</p>
               <p className="text-sm">Silakan pilih salah satu kontrak di panel kiri untuk memproses pengembalian.</p>
            </div>
         )}
      </div>

    </div>
  );
}
