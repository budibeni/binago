content = """'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { PanelShell } from '@adatrack/ui';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import type { RentalContract } from '../contracts/types/contract';
import { ReturnCreateFeature } from './ReturnCreateFeature';
import { ReturnView } from './components/ReturnView';
import { ChevronDown, AlertCircle, CheckCircle2, Car } from 'lucide-react';
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
  
  // Accordion State
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-background">
      <PanelShell
        title="Pengembalian Kendaraan"
        toolbar={
          <div className="flex gap-6 border-b border-border/50">
            <button
              onClick={() => { setActiveTab('PENDING'); setExpandedId(null); }}
              className={`pb-2.5 text-sm font-semibold transition-colors ${activeTab === 'PENDING' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Menunggu Pengembalian
            </button>
            <button
              onClick={() => { setActiveTab('COMPLETED'); setExpandedId(null); }}
              className={`pb-2.5 text-sm font-semibold transition-colors ${activeTab === 'COMPLETED' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Riwayat
            </button>
          </div>
        }
      >
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 opacity-50">
               <Car className="w-12 h-12 mb-4" />
               <p className="font-semibold">Tidak ada data kontrak.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-w-5xl mx-auto">
               {filteredList.map(contract => {
                 const isExpanded = expandedId === contract.id;
                 const status = getContractStatus(contract);
                 
                 return (
                   <div key={contract.id} className="bg-background border border-border/60 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
                      {/* HEADER */}
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : contract.id)}
                        className={cn("w-full flex items-center justify-between p-4 md:p-5 transition-colors text-left", isExpanded ? "bg-primary/5 border-b border-border/50" : "hover:bg-neutral-50 dark:hover:bg-neutral-900/50")}
                      >
                         <div className="flex items-center gap-4">
                            <div className={cn("p-2 rounded-full transition-transform duration-200", isExpanded && "rotate-180 bg-primary/10 text-primary")}>
                               <ChevronDown className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                               <span className="font-bold text-base">{contract.customer?.name}</span>
                               <span className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                                  {contract.contractNumber}
                                  <span className="w-1 h-1 rounded-full bg-border"></span>
                                  {formatDateTime(contract.startDate)}
                               </span>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-3 text-xs font-bold tracking-wide">
                            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div> {status.total} Unit</span>
                            {status.returnedCount > 0 && <span className="flex items-center gap-1.5 text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {status.returnedCount} Selesai</span>}
                            {status.overdueCount > 0 && <span className="flex items-center gap-1.5 text-danger bg-danger/10 px-2 py-0.5 rounded-md border border-danger/20"><AlertCircle className="w-3.5 h-3.5" /> {status.overdueCount} Overdue</span>}
                            {activeTab === 'COMPLETED' && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> COMPLETED</span>}
                         </div>
                      </button>
                      
                      {/* BODY (EXPANDED CONTENT) */}
                      {isExpanded && (
                         <div className="bg-neutral-50/50 dark:bg-neutral-900/20 p-2 md:p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                            {activeTab === 'PENDING' ? (
                               <ReturnCreateFeature
                                  contractId={contract.id}
                                  open={true}
                                  inline={true}
                                  onOpenChange={() => setExpandedId(null)}
                                  onSuccess={() => {
                                     setExpandedId(null);
                                     loadData();
                                  }}
                               />
                            ) : (
                               <ReturnView
                                  returnGroup={{
                                     id: contract.id,
                                     contractId: contract.id,
                                     contract: contract,
                                     customer: contract.customer,
                                     items: contract.items || [],
                                     status: 'COMPLETED',
                                     handoverAt: contract.startDate,
                                  }}
                                  open={true}
                                  inline={true}
                                  onClose={() => setExpandedId(null)}
                               />
                            )}
                         </div>
                      )}
                   </div>
                 );
               })}
            </div>
          )}
        </div>
      </PanelShell>
    </div>
  );
}
"""
with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(content)
