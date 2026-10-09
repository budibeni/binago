content = """'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import type { RentalContract } from '../contracts/types/contract';
import { ReturnCreateFeature } from './ReturnCreateFeature';
import { ReturnView } from './components/ReturnView';
import { AlertCircle, CheckCircle2, Car, Search } from 'lucide-react';
import { cn, formatDateTime } from '@adatrack/utils';

export function ReturnsFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [activeContracts, setActiveContracts] = useState<RentalContract[]>([]);
  const [completedContracts, setCompletedContracts] = useState<RentalContract[]>([]);
  
  // State
  const [activeTab, setActiveTab] = useState<'PENDING' | 'COMPLETED'>('PENDING');
  const [search, setSearch] = useState('');
  
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
      const completed = allContracts.filter(c => c.status === 'COMPLETED' || (c.status === 'ACTIVE' && c.items?.every(i => i.itemStatus !== 'IN_USE')));

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
      c.customer?.name?.toLowerCase().includes(s) ||
      c.items?.some(i => i.vehicleSnapshot?.licensePlate?.toLowerCase().includes(s))
    );
  }, [currentList, search]);

  const getContractStatus = (contract: RentalContract) => {
    let overdueCount = 0;
    let returnedCount = 0;
    const items = contract.items || [];
    const now = new Date().getTime();
    
    items.forEach(i => {
       if (i.itemStatus === 'RETURNED') returnedCount++;
       else if (i.endDate && new Date(i.endDate).getTime() < now) overdueCount++;
    });
    
    return { overdueCount, returnedCount, total: items.length };
  };

  const selectedContract = useMemo(() => {
     return currentList.find(c => c.id === selectedContractId) || null;
  }, [selectedContractId, currentList]);

  return (
    <div className="flex flex-col md:flex-row h-full bg-background overflow-hidden border-t border-border">
      
      {/* LEFT PANEL: Master List (30%) */}
      <div className="w-full md:w-[350px] lg:w-[420px] shrink-0 border-r border-border bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col h-full">
        {/* Header & Tabs */}
        <div className="p-4 border-b border-border flex flex-col gap-4 bg-background">
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg">
            <button 
              onClick={() => { setActiveTab('PENDING'); setSelectedContractId(null); }}
              className={cn("flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all", activeTab === 'PENDING' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Menunggu Pengembalian
            </button>
            <button 
              onClick={() => { setActiveTab('COMPLETED'); setSelectedContractId(null); }}
              className={cn("flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all", activeTab === 'COMPLETED' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Riwayat
            </button>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari kontrak, pelanggan, plat..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-900 border-none rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Car className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-medium">Tidak ada data kontrak</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
               {filteredList.map(contract => {
                 const isSelected = selectedContractId === contract.id;
                 const status = getContractStatus(contract);
                 
                 return (
                   <button 
                     key={contract.id}
                     onClick={() => setSelectedContractId(contract.id)}
                     className={cn(
                       "w-full flex flex-col p-4 transition-all text-left border rounded-xl shadow-sm",
                       isSelected 
                         ? "bg-primary/5 border-primary/30" 
                         : "bg-background border-border/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 hover:border-border"
                     )}
                   >
                      <div className="flex flex-col gap-1 mb-3">
                         <span className="font-bold text-[14px] text-foreground">{contract.customer?.name}</span>
                         <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5">
                            {contract.contractNumber}
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            {formatDateTime(contract.startDate)}
                         </span>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold tracking-wide">
                         <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div> {status.total} Unit</span>
                         {status.returnedCount > 0 && <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {status.returnedCount} Selesai</span>}
                         {status.overdueCount > 0 && <span className="flex items-center gap-1 text-danger bg-danger/10 px-1.5 py-0.5 rounded-md"><AlertCircle className="w-3 h-3" /> {status.overdueCount} Overdue</span>}
                         {activeTab === 'COMPLETED' && <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md"><CheckCircle2 className="w-3 h-3 inline mr-0.5" /> COMPLETED</span>}
                      </div>
                   </button>
                 );
               })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Detail View (70%) */}
      <div className="flex-1 bg-neutral-50/50 dark:bg-neutral-950/20 overflow-y-auto">
         {selectedContract ? (
            <div className="p-4 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-200 w-full max-w-6xl mx-auto">
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
                        customer: selectedContract.customer,
                        items: selectedContract.items || [],
                        status: 'COMPLETED',
                        handoverAt: selectedContract.startDate,
                     }}
                     open={true}
                     inline={true}
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
"""
with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
