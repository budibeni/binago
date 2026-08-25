'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileCheck, Activity, CheckCircle2, Clock, XCircle, FileText, List } from 'lucide-react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { contractService } from '@/data/modules/rental/services/contractService';
import type { RentalContract, ContractStatusFilter } from './types/contract';
import { ContractList } from './components/ContractList';
import { ContractDetailDrawer } from './components/ContractDetailDrawer';
import { cn } from '@adatrack/utils';

export function ContractsFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalContractFeature || {};

  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatusFilter>('all');
  
  const [selectedContract, setSelectedContract] = useState<RentalContract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchContracts = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await contractService.getContracts({
        search,
        status: statusFilter,
      });
      setContracts(data);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Statistics
  const stats = useMemo(() => {
    const total = contracts.length;
    const draft = contracts.filter((c) => c.status === 'DRAFT').length;
    const confirmed = contracts.filter((c) => c.status === 'CONFIRMED').length;
    const active = contracts.filter((c) => c.status === 'ACTIVE').length;
    const completed = contracts.filter((c) => c.status === 'COMPLETED').length;
    const cancelled = contracts.filter((c) => c.status === 'CANCELLED').length;
    return { total, draft, confirmed, active, completed, cancelled };
  }, [contracts]);

  // Handlers
  const handleView = (c: RentalContract) => {
    setSelectedContract(c);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    router.push('/rental/contracts/create');
  };

  const handleEdit = (c: RentalContract) => {
    router.push(`/rental/contracts/${c.id}/edit`);
  };

  const handlePrint = (c: RentalContract) => {
    window.open(`/rental/contracts/${c.id}/print`, '_blank');
  };
  
  const handleConfirm = async (c: RentalContract) => {
    try {
      await contractService.updateContractStatus(c.id, 'CONFIRMED');
      alert('Kontrak berhasil dikonfirmasi.');
      fetchContracts();
      setDrawerOpen(false);
    } catch (error: any) {
      alert(error.message || 'Gagal mengonfirmasi kontrak');
    }
  };

  const handleCancel = async (c: RentalContract) => {
    try {
      await contractService.updateContractStatus(c.id, 'CANCELLED');
      alert('Kontrak berhasil dibatalkan.');
      fetchContracts();
      setDrawerOpen(false);
    } catch (error: any) {
      alert(error.message || 'Gagal membatalkan kontrak');
    }
  };

  const handleHandover = (c: RentalContract) => {
    router.push(`/rental/contracts/${c.id}/handover`);
  };

  const handleReturn = (c: RentalContract) => {
    router.push(`/rental/contracts/${c.id}/return`);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6 items-center overflow-hidden relative">
      <div className="w-full h-full flex flex-col min-h-0 space-y-4">
        
        <div className="mb-2">
          <h1 className="text-2xl font-bold">{labels.title || 'Kontrak Rental'}</h1>
          <p className="text-muted-foreground">{labels.pageSubtitle || 'Kelola data kontrak dan serah terima kendaraan rental.'}</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'all'
                ? "border-b-4 border-b-neutral-800 dark:border-b-neutral-200 border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 shrink-0">
              <List className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.summaryTotal || 'Semua'}</p>
              <p className="text-lg font-bold leading-none my-0.5">{stats.total}</p>
            </div>
          </button>
          
          <button
            onClick={() => setStatusFilter('DRAFT')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'DRAFT'
                ? "border-b-4 border-b-neutral-500 border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusDraft || 'Draft'}</p>
              <p className="text-lg font-bold text-neutral-700 dark:text-neutral-300 leading-none my-0.5">{stats.draft}</p>
            </div>
          </button>
          
          <button
            onClick={() => setStatusFilter('CONFIRMED')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'CONFIRMED'
                ? "border-b-4 border-b-blue-500 border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusConfirmed || 'Dikonfirmasi'}</p>
              <p className="text-lg font-bold text-blue-600 leading-none my-0.5">{stats.confirmed}</p>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'ACTIVE'
                ? "border-b-4 border-b-success border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusActive || 'Berjalan'}</p>
              <p className="text-lg font-bold text-success leading-none my-0.5">{stats.active}</p>
            </div>
          </button>
          
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'COMPLETED'
                ? "border-b-4 border-b-neutral-500 border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusCompleted || 'Selesai'}</p>
              <p className="text-lg font-bold text-neutral-700 dark:text-neutral-300 leading-none my-0.5">{stats.completed}</p>
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('CANCELLED')}
            className={cn(
              "p-3 flex gap-2.5 items-center text-left bg-card rounded-lg border transition-all hover:shadow-md",
              statusFilter === 'CANCELLED'
                ? "border-b-4 border-b-danger border-x-border border-t-border"
                : "border-border shadow-sm",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">{labels.statusCancelled || 'Dibatalkan'}</p>
              <p className="text-lg font-bold text-danger leading-none my-0.5">{stats.cancelled}</p>
            </div>
          </button>
        </div>

      <div className="flex-1 min-h-0 bg-card rounded-lg border border-border shadow-sm p-4 mt-2">
        <ContractList
          data={contracts}
          labels={labels}
          onView={handleView}
          onEdit={handleEdit}
          onPrint={handlePrint}
          searchValue={search}
          onSearchChange={setSearch}
          onAdd={handleAdd}
        />
      </div>

      <ContractDetailDrawer
        contract={selectedContract}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        labels={labels}
        onEdit={(c) => { setDrawerOpen(false); handleEdit(c); }}
        onPrint={handlePrint}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onHandover={handleHandover}
        onReturn={handleReturn}
      />
    </div>
    </div>
  );
}
