import re

content = """'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { RotateCcw, Search, Clock, CheckCircle2, AlertCircle, Car, MapPin, Receipt, ArrowRight, X } from 'lucide-react';
import { Button, InputText } from '@adatrack/ui';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { returnService } from '@/data/modules/rental/services/returnService';
import { cn, formatDateTime, formatIDR } from '@adatrack/utils';
import type { RentalContract } from '../contracts/types/contract';
import type { BookingItem } from '../bookings/types/booking';
import { ReturnCreateFeature } from './ReturnCreateFeature';

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
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  
  // Drawer
  const [isProcessOpen, setIsProcessOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // We need all contracts that have IN_USE or RETURNED items
      const eligible = await returnService.getEligibleContracts();
      // For completed, we'd ideally fetch from contractService where status is COMPLETED, 
      // but let's just use what we have or a mock for now.
      // Assuming returnService.getEligibleContracts() returns ACTIVE contracts (PENDING).
      // Let's also fetch COMPLETED contracts for the history tab.
      const { contractService } = await import('@/data/modules/rental/services/contractService');
      const allContracts = await contractService.getContracts();
      
      const pending = allContracts.filter(c => c.status === 'ACTIVE' && c.items?.some(i => i.itemStatus === 'IN_USE'));
      const completed = allContracts.filter(c => c.status === 'COMPLETED' || (c.status === 'ACTIVE' && c.items?.every(i => i.itemStatus !== 'IN_USE')));

      setActiveContracts(pending);
      setCompletedContracts(completed);
      
      // Auto-select first item if none selected
      if (!selectedContractId && pending.length > 0) {
        setSelectedContractId(pending[0].id);
      }
    } catch (err) {
      console.error('Failed to load returns data:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'PENDING' ? activeContracts : completedContracts;
  
  const filteredList = useMemo(() => {
    if (!search) return currentList;
    const s = search.toLowerCase();
    return currentList.filter(c => 
      c.contractNumber?.toLowerCase().includes(s) ||
      c.customer?.name?.toLowerCase().includes(s) ||
      c.items?.some(i => i.vehicleSnapshot?.licensePlate?.toLowerCase().includes(s))
    );
  }, [currentList, search]);

  const selectedContract = useMemo(() => {
    return currentList.find(c => c.id === selectedContractId) || null;
  }, [currentList, selectedContractId]);

  const getContractStatus = (contract: RentalContract) => {
    const items = contract.items || [];
    const inUse = items.filter(i => i.itemStatus === 'IN_USE');
    const returned = items.filter(i => i.itemStatus === 'RETURNED');
    
    if (inUse.length === 0 && returned.length > 0) return { label: 'Selesai', color: 'text-emerald-600 bg-emerald-100', overdue: false };
    if (inUse.length > 0 && returned.length > 0) return { label: 'Kembali Sebagian', color: 'text-amber-600 bg-amber-100', overdue: false };
    
    // Check overdue
    let isOverdue = false;
    const now = new Date().getTime();
    for (const item of inUse) {
      if (item.endDate && new Date(item.endDate).getTime() < now) {
        isOverdue = true;
        break;
      }
    }
    
    if (isOverdue) return { label: 'Terlambat (Overdue)', color: 'text-danger bg-danger/10', overdue: true };
    return { label: 'Menunggu', color: 'text-blue-600 bg-blue-100', overdue: false };
  };

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative border-t border-border">
      
      {/* LEFT PANEL: Master List */}
      <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 border-r border-border bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col h-full">
        {/* Header & Tabs */}
        <div className="p-4 border-b border-border flex flex-col gap-4 bg-background">
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg">
            <button 
              onClick={() => { setActiveTab('PENDING'); setSelectedContractId(null); }}
              className={cn("flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all", activeTab === 'PENDING' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Perlu Diproses
            </button>
            <button 
              onClick={() => { setActiveTab('COMPLETED'); setSelectedContractId(null); }}
              className={cn("flex-1 text-[13px] font-semibold py-1.5 rounded-md transition-all", activeTab === 'COMPLETED' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Selesai
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
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          {loading ? (
            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <RotateCcw className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm">Tidak ada data kontrak</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {filteredList.map(contract => {
                const isSelected = selectedContractId === contract.id;
                const status = getContractStatus(contract);
                
                return (
                  <button
                    key={contract.id}
                    onClick={() => setSelectedContractId(contract.id)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl transition-all border",
                      isSelected 
                        ? "bg-primary/5 border-primary/30 shadow-sm" 
                        : "bg-background border-transparent hover:border-border hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[13px] text-foreground">{contract.contractNumber}</span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", status.color)}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-1 truncate">{contract.customer?.name}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><Car className="w-3 h-3" /> {contract.items?.length || 0} Kendaraan</span>
                      {status.overdue && <span className="flex items-center gap-1 text-danger"><AlertCircle className="w-3 h-3" /> Overdue</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Detail View */}
      <div className="flex-1 bg-background flex flex-col h-full min-w-0">
        {selectedContract ? (
          <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-200">
            {/* Detail Header */}
            <div className="p-6 md:p-8 border-b border-border flex flex-col md:flex-row md:items-start justify-between gap-4 shrink-0 bg-neutral-50/50 dark:bg-neutral-900/20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-black text-foreground">{selectedContract.contractNumber}</h2>
                  <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md", getContractStatus(selectedContract).color)}>
                    {getContractStatus(selectedContract).label}
                  </span>
                </div>
                <p className="text-base font-semibold text-muted-foreground">{selectedContract.customer?.name}</p>
                <div className="flex items-center gap-4 mt-2 text-[13px] text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Mulai: {formatDateTime(selectedContract.startDate)}</span>
                  {selectedContract.rentalType === 'SELF_DRIVE' ? (
                    <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[11px] font-bold">Lepas Kunci</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[11px] font-bold">Dengan Supir</span>
                  )}
                </div>
              </div>
              
              <div className="flex shrink-0">
                {activeTab === 'PENDING' && (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="shadow-md shadow-primary/20"
                    onClick={() => setIsProcessOpen(true)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Proses Pengembalian
                  </Button>
                )}
                {activeTab === 'COMPLETED' && (
                  <Button variant="outline" size="lg">
                    <Receipt className="w-4 h-4 mr-2" />
                    Cetak Tanda Terima
                  </Button>
                )}
              </div>
            </div>

            {/* Detail Body (Vehicles) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Daftar Kendaraan</h3>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {(selectedContract.items || []).map(item => {
                  const isReturned = item.itemStatus === 'RETURNED';
                  const cv = item.vehicleSnapshot;
                  
                  return (
                    <div key={item.id} className={cn(
                      "rounded-xl border p-5 flex flex-col gap-4 transition-all",
                      isReturned ? "bg-neutral-50 dark:bg-neutral-900/50 border-border" : "bg-background border-primary/20 shadow-sm"
                    )}>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                            isReturned ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-500" : "bg-primary/10 text-primary"
                          )}>
                            {isReturned ? <CheckCircle2 className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[15px]">{cv?.brand} {cv?.model}</span>
                            <span className="text-xs font-semibold text-primary">{cv?.licensePlate}</span>
                          </div>
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold uppercase px-2 py-1 rounded-md",
                          isReturned ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {isReturned ? 'Selesai' : 'IN USE'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-2 border-t border-border/50 pt-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Tgl Berakhir</span>
                          <span className="text-xs font-medium">{formatDateTime(item.endDate)}</span>
                        </div>
                        {isReturned ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Dikembalikan</span>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{formatDateTime(item.returnDate || '')}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Odometer Awal</span>
                            <span className="text-xs font-medium">{item.handoverOdometer?.toLocaleString('id-ID')} km</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-50/30 dark:bg-neutral-950/30">
            <RotateCcw className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-6" />
            <h3 className="text-xl font-bold text-foreground mb-2">Pilih Kontrak</h3>
            <p className="text-muted-foreground max-w-sm">
              Silakan pilih salah satu kontrak dari daftar di sebelah kiri untuk melihat detail atau memproses pengembalian kendaraan.
            </p>
          </div>
        )}
      </div>

      {/* CREATE RETURN DRAWER */}
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
    f.write(content)
