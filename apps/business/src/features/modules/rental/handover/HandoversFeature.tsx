'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Key } from 'lucide-react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { handoverService } from '@/data/modules/rental/services/handoverService';
import type { RentalHandover } from './types/handover';
import { HandoverList } from './components/HandoverList';
import { HandoverDetailDrawer } from './components/HandoverDetailDrawer';
import { cn } from '@adatrack/utils';

export function HandoversFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalHandoverFeature || {};

  const [handovers, setHandovers] = useState<RentalHandover[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Status filter state
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'DRAFT' | 'CANCELLED'>('ALL');

  // Drawer state
  const [selectedHandover, setSelectedHandover] = useState<RentalHandover | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await handoverService.getHandovers();
      // Sort by newest first
      const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHandovers(sorted);
    } catch (error) {
      console.error('Failed to load handovers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return handovers.filter((h) => {
      // 1. Filter by Status
      if (statusFilter !== 'ALL' && h.status !== statusFilter) return false;

      // 2. Filter by Search (ID Handover, Contract ID, Customer Name, Vehicle Plate/Name)
      if (search) {
        const s = search.toLowerCase();
        const matchSearch = 
          h.id.toLowerCase().includes(s) || 
          h.contractId.toLowerCase().includes(s) ||
          h.contract?.contractNumber.toLowerCase().includes(s) ||
          h.customer?.name.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.plateNumber.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.brand.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.vehicleName.toLowerCase().includes(s);
        
        if (!matchSearch) return false;
      }
      
      return true;
    });
  }, [handovers, search, statusFilter]);

  // Summary counts
  const summary = useMemo(() => {
    return {
      all: handovers.length,
      completed: handovers.filter(h => h.status === 'COMPLETED').length,
      draft: handovers.filter(h => h.status === 'DRAFT').length,
      cancelled: handovers.filter(h => h.status === 'CANCELLED').length,
    };
  }, [handovers]);

  const openDetail = (handover: RentalHandover) => {
    setSelectedHandover(handover);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    // Optional: delay nulling state to allow transition
    setTimeout(() => setSelectedHandover(null), 300);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50/50 dark:bg-background">
      {/* Header */}
      <div className="px-6 py-6 pb-4 shrink-0 border-b border-border bg-white dark:bg-background">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Key className="w-7 h-7 text-primary" />
              Serah Terima Kendaraan
            </h1>
            <p className="text-muted-foreground mt-1">
              Histori transaksi penyerahan armada kepada customer.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 min-h-0">
        <div className="h-full max-w-[1400px] mx-auto flex flex-col gap-4">
          
          {/* Summary / Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                statusFilter === 'ALL' 
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent" 
                  : "bg-white dark:bg-neutral-900 text-neutral-600 hover:bg-neutral-100 border-border"
              )}
            >
              Semua <span className="ml-2 text-xs opacity-70">{summary.all}</span>
            </button>
            <button
              onClick={() => setStatusFilter('COMPLETED')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                statusFilter === 'COMPLETED' 
                  ? "bg-success/15 text-success border-success/30" 
                  : "bg-white dark:bg-neutral-900 text-neutral-600 hover:bg-neutral-100 border-border"
              )}
            >
              Selesai <span className="ml-2 text-xs opacity-70">{summary.completed}</span>
            </button>
            <button
              onClick={() => setStatusFilter('DRAFT')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                statusFilter === 'DRAFT' 
                  ? "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-transparent" 
                  : "bg-white dark:bg-neutral-900 text-neutral-600 hover:bg-neutral-100 border-border"
              )}
            >
              Draft <span className="ml-2 text-xs opacity-70">{summary.draft}</span>
            </button>
            <button
              onClick={() => setStatusFilter('CANCELLED')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                statusFilter === 'CANCELLED' 
                  ? "bg-danger/10 text-danger border-danger/20" 
                  : "bg-white dark:bg-neutral-900 text-neutral-600 hover:bg-neutral-100 border-border"
              )}
            >
              Dibatalkan <span className="ml-2 text-xs opacity-70">{summary.cancelled}</span>
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-900 border border-border rounded-xl shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <HandoverList
              data={filteredData}
              searchValue={search}
              onSearchChange={setSearch}
              onViewDetail={openDetail}
            />
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
