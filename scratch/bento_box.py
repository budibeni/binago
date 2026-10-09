import re

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'r') as f:
    content = f.read()

# Change drawer style to centered modal style
# Old: className="h-full max-h-[100vh] w-full max-w-[1200px] ml-auto p-0 flex flex-col rounded-none sm:rounded-l-2xl after:hidden border-l border-border/50 bg-background/95 backdrop-blur-sm"
# New centered: className="w-full max-w-[1200px] h-[90vh] mx-auto mt-[5vh] p-0 flex flex-col rounded-[2rem] shadow-2xl border border-border/50 bg-background/90 backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-300"
content = re.sub(r'className="h-full max-h-\[100vh\].*?"', 'className="w-full max-w-[1200px] h-[95vh] m-auto md:my-[2.5vh] p-0 flex flex-col rounded-t-3xl md:rounded-[2.5rem] shadow-2xl border border-border/50 bg-background/95 backdrop-blur-3xl overflow-hidden animate-in zoom-in-95 duration-300"', content)

with open('apps/business/src/features/modules/rental/returns/ReturnCreateFeature.tsx', 'w') as f:
    f.write(content)

# Rewrite ReturnsFeature.tsx completely
new_feature = """'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { RotateCcw, AlertTriangle, Calendar, CheckCircle2, Car, MapPin, ArrowRight, Clock, FileText } from 'lucide-react';
import { Button } from '@adatrack/ui';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { returnService } from '@/data/modules/rental/services/returnService';
import { cn, formatDateTime, formatIDR } from '@adatrack/utils';
import type { RentalContract } from '../contracts/types/contract';
import { ReturnCreateFeature } from './ReturnCreateFeature';

export function ReturnsFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [activeContracts, setActiveContracts] = useState<RentalContract[]>([]);
  const [completedContracts, setCompletedContracts] = useState<RentalContract[]>([]);
  
  // State
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [isProcessOpen, setIsProcessOpen] = useState(false);

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

      setActiveContracts(pending);
      setCompletedContracts(completed);
    } catch (err) {
      console.error('Failed to load returns data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getContractStatus = (contract: RentalContract) => {
    const items = contract.items || [];
    const inUse = items.filter(i => i.itemStatus === 'IN_USE');
    
    let isOverdue = false;
    let nearestEnd = Infinity;
    const now = new Date().getTime();
    
    for (const item of inUse) {
      if (!item.endDate) continue;
      const end = new Date(item.endDate).getTime();
      if (end < nearestEnd) nearestEnd = end;
      if (end < now) {
        isOverdue = true;
      }
    }
    
    return { isOverdue, nearestEnd };
  };

  const overdueList = useMemo(() => {
    return activeContracts.filter(c => getContractStatus(c).isOverdue).sort((a, b) => getContractStatus(a).nearestEnd - getContractStatus(b).nearestEnd);
  }, [activeContracts]);

  const todayList = useMemo(() => {
    return activeContracts.filter(c => !getContractStatus(c).isOverdue).sort((a, b) => getContractStatus(a).nearestEnd - getContractStatus(b).nearestEnd);
  }, [activeContracts]);

  const openReturnModal = (id: string) => {
    setSelectedContractId(id);
    setIsProcessOpen(true);
  };

  return (
    <div className="relative h-full w-full bg-neutral-100 dark:bg-neutral-950 overflow-y-auto">
      {/* Subtle Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden pointer-events-none">
        <div className="absolute -top-[100px] -left-[100px] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-70" />
        <div className="absolute top-[100px] right-[10%] w-[400px] h-[400px] bg-danger/20 rounded-full blur-[100px] opacity-50" />
        <div className="absolute top-[300px] left-[30%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] opacity-40" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8 pb-32">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">Pengembalian Kendaraan</h1>
          <p className="text-muted-foreground text-lg font-medium">Pantau dan proses pengembalian armada secara real-time.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* BLOCK 1: OVERDUE (Bento Col 5) */}
            <div className="lg:col-span-5 flex flex-col bg-background/60 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-danger/30 transition-colors">
                <div className="absolute top-0 right-0 p-8 bg-danger/10 blur-3xl rounded-full w-48 h-48 pointer-events-none" />
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="text-danger w-5 h-5" />
                      </div>
                      Urgent: Terlambat
                  </h2>
                  <span className="bg-danger text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-danger/30">{overdueList.length} Kontrak</span>
                </div>
                
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-hide">
                  {overdueList.length === 0 ? (
                    <div className="py-10 text-center opacity-50 flex flex-col items-center">
                      <CheckCircle2 className="w-10 h-10 mb-3" />
                      <p className="font-semibold">Bagus! Tidak ada yang terlambat.</p>
                    </div>
                  ) : (
                    overdueList.map(contract => (
                      <button 
                        key={contract.id}
                        onClick={() => openReturnModal(contract.id)}
                        className="group/card text-left bg-background/80 hover:bg-danger/5 border border-danger/20 hover:border-danger/50 p-4 rounded-2xl transition-all hover:scale-[1.02] shadow-sm hover:shadow-xl hover:shadow-danger/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-[15px]">{contract.contractNumber}</span>
                          <span className="text-xs font-bold text-danger flex items-center gap-1"><Clock className="w-3 h-3" /> Overdue</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium mb-3">{contract.customer?.name}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {(contract.items || []).filter(i => i.itemStatus === 'IN_USE').map((item, idx) => {
                            const cv = item.vehicleSnapshot;
                            return (
                              <div key={idx} className="bg-background border border-border/50 px-2.5 py-1.5 rounded-lg flex items-center gap-2">
                                <Car className="w-3.5 h-3.5 text-danger" />
                                <span className="text-[11px] font-bold">{cv?.licensePlate}</span>
                              </div>
                            );
                          })}
                        </div>
                      </button>
                    ))
                  )}
                </div>
            </div>

            {/* BLOCK 2: TODAY/UPCOMING (Bento Col 7) */}
            <div className="lg:col-span-7 flex flex-col bg-background/60 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-8 bg-amber-500/10 blur-3xl rounded-full w-48 h-48 pointer-events-none" />
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Calendar className="text-amber-500 w-5 h-5" />
                      </div>
                      Jadwal Hari Ini
                  </h2>
                  <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full">{todayList.length} Kontrak</span>
                </div>
                
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2 scrollbar-hide">
                  {todayList.length === 0 ? (
                    <div className="py-10 text-center opacity-50 flex flex-col items-center">
                      <Car className="w-10 h-10 mb-3" />
                      <p className="font-semibold">Tidak ada jadwal pengembalian hari ini.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {todayList.map(contract => (
                        <button 
                          key={contract.id}
                          onClick={() => openReturnModal(contract.id)}
                          className="group/card text-left bg-background/80 hover:bg-primary/5 border border-border/50 hover:border-primary/50 p-5 rounded-2xl transition-all hover:scale-[1.03] shadow-sm hover:shadow-xl hover:shadow-primary/10 flex flex-col h-full"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-[15px]">{contract.contractNumber}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-1 transition-all" />
                          </div>
                          <p className="text-sm text-muted-foreground font-medium mb-4 flex-1">{contract.customer?.name}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-border/50">
                            {(contract.items || []).filter(i => i.itemStatus === 'IN_USE').map((item, idx) => {
                              const cv = item.vehicleSnapshot;
                              return (
                                <div key={idx} className="bg-background border border-border/50 px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                                  <span className="text-[10px] font-bold text-foreground">{cv?.licensePlate}</span>
                                </div>
                              );
                            })}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
            </div>

            {/* BLOCK 3: COMPLETED (Bento Col 12) */}
            <div className="lg:col-span-12 flex flex-col bg-background/60 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-8 bg-emerald-500/5 blur-3xl rounded-full w-96 h-96 pointer-events-none" />
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                      </div>
                      Riwayat Selesai
                  </h2>
                </div>
                
                <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
                  {completedContracts.length === 0 ? (
                    <div className="py-8 text-center opacity-50 w-full">
                      <p className="font-semibold">Belum ada riwayat pengembalian.</p>
                    </div>
                  ) : (
                    completedContracts.slice(0, 10).map(contract => (
                      <div key={contract.id} className="snap-start shrink-0 w-[280px] bg-background/80 border border-border/50 p-4 rounded-[1.5rem] shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-sm">{contract.contractNumber}</span>
                          <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">Selesai</span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mb-3 truncate">{contract.customer?.name}</p>
                        <div className="mt-auto pt-3 border-t border-border/50 flex items-center text-xs font-semibold text-foreground">
                          <FileText className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> {(contract.items || []).length} Kendaraan
                        </div>
                      </div>
                    ))
                  )}
                </div>
            </div>
            
          </div>
        )}
      </div>

      {/* CREATE RETURN MODAL/DRAWER */}
      <ReturnCreateFeature
        contractId={isProcessOpen ? selectedContractId : null}
        open={isProcessOpen}
        onOpenChange={setIsProcessOpen}
        onSuccess={() => {
          setIsProcessOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
"""

with open('apps/business/src/features/modules/rental/returns/ReturnsFeature.tsx', 'w') as f:
    f.write(new_feature)

