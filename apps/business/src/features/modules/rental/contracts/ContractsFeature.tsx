'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileCheck, Activity, CheckCircle2, Clock, XCircle, FileText, List } from 'lucide-react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { contractService } from '@/data/modules/rental/services/contractService';
import type { RentalContract, ContractStatusFilter } from './types/contract';
import { ContractList } from './components/ContractList';
import { ContractView } from './components/ContractView';
import { ContractPrintModal } from './components/ContractPrintModal';
import { ContractCreateFeature } from './ContractCreateFeature';
import { ContractEditFeature } from './ContractEditFeature';
import { HandoverFeature } from '../handover/HandoverFeature';
import { ReturnFeature } from '../returns/ReturnFeature';
import { cn } from '@adatrack/utils';
import { PanelShell, type DataTableFilterConfig } from '@adatrack/ui';

function StatCard({ label, value, colorClass, icon: Icon }: { label: string, value: number, colorClass: string, icon?: React.ElementType }) {
  const textColorClass = colorClass.replace(/bg-/g, 'text-');
  
  return (
    <div className="flex items-center justify-between p-3 rounded-none border border-border/80 bg-background transition-colors hover:border-border">
      <div className="flex items-center gap-2.5">
        {Icon ? (
          <div className={cn("p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800", textColorClass)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        ) : (
          <div className={cn("w-2 h-2 rounded-full", colorClass)} />
        )}
        <span className="text-[11px] font-semibold text-foreground-muted tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

export function ContractsFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalContractFeature || {};

  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatusFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [panelSide, setPanelSide] = useState<'left' | 'right' | 'top' | 'bottom'>('top');
  
  const [selectedContract, setSelectedContract] = useState<RentalContract | null>(null);
  const [printContract, setPrintContract] = useState<RentalContract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [handoverId, setHandoverId] = React.useState<string | null>(null);
  const [returnId, setReturnId] = React.useState<string | null>(null);

  const [errorMsg, setErrorMsg] = React.useState<string>('');

  const fetchContracts = React.useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await contractService.getContracts();
      setContracts(data);
    } catch (error: any) {
      console.error('Failed to fetch contracts', error);
      setErrorMsg(error?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

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

  const filteredData = useMemo(() => {
    return contracts.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const noMatch = c.contractNumber?.toLowerCase()?.includes(q) || false;
        const nameMatch = c.customer?.name?.toLowerCase()?.includes(q) || false;
        const plateMatch = c.vehicle?.coreVehicle?.plateNumber?.toLowerCase()?.includes(q) || false;
        if (!noMatch && !nameMatch && !plateMatch) return false;
      }
      return true;
    });
  }, [contracts, statusFilter, search]);

  // Handlers
  const handleView = (c: RentalContract) => {
    setSelectedContract(c);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setIsCreateOpen(true);
  };

  const handleEdit = (c: RentalContract) => {
    setDrawerOpen(false);
    setEditId(c.id);
  };

  const handlePrint = (c: RentalContract) => {
    setPrintContract(c);
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
    setDrawerOpen(false);
    setHandoverId(c.id);
  };

  const handleReturn = (c: RentalContract) => {
    setDrawerOpen(false);
    setReturnId(c.id);
  };

  const dtLabels = useMemo(() => {
    const isEn = locale === 'en';
    return {
      paginationShowing: (from: number, to: number, total: number) => isEn ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items` : `Menampilkan ${from}-${to} dari ${total.toLocaleString('id-ID')} data`,
      paginationPerPage: isEn ? '/ page' : '/ halaman',
      toolbarRefresh: isEn ? 'Refresh' : 'Refresh',
      toolbarFilter: isEn ? 'Filter' : 'Filter',
      toolbarColumns: isEn ? 'Columns' : 'Kolom',
      toolbarExport: isEn ? 'Export' : 'Ekspor',
      activeFilterClear: isEn ? 'Clear Filters' : 'Reset Filter',
      columnPanelHideAll: isEn ? 'Hide all' : 'Sembunyikan semua',
      columnPanelShowAll: isEn ? 'Show all' : 'Tampilkan semua',
      errorLoadData: isEn ? 'Failed to load data.' : 'Gagal memuat data.',
      errorTryAgain: isEn ? 'Try Again' : 'Coba Lagi',
      errorTitle: isEn ? 'An error occurred' : 'Terjadi Kesalahan',
      noResultTitle: isEn ? 'No results found' : 'Hasil Tidak Ditemukan',
      noResultDesc: isEn ? 'No data matches your search or filters.' : 'Tidak ada data yang sesuai dengan pencarian atau filter Anda.',
    };
  }, [locale]);

  const filterConfig: DataTableFilterConfig = useMemo(() => ({
    state: { status: statusFilter === 'all' ? '' : statusFilter },
    onStateChange: (state) => setStatusFilter((state.status as ContractStatusFilter) || 'all'),
    onClearAll: () => setStatusFilter('all'),
    labels: {
      title: 'Filter',
      clearAll: 'Hapus Filter',
    },
    fields: [
      {
        id: 'status',
        label: labels.filterStatus || 'Status',
        type: 'pills-single',
        options: [
          { value: 'DRAFT', label: labels.statusDraft || 'Draft', colorClass: 'bg-neutral-500', activeClass: 'bg-neutral-500/15 border-neutral-500/40 text-neutral-500' },
          { value: 'CONFIRMED', label: labels.statusConfirmed || 'Dikonfirmasi', colorClass: 'bg-blue-500', activeClass: 'bg-blue-500/15 border-blue-500/40 text-blue-500' },
          { value: 'ACTIVE', label: labels.statusActive || 'Berjalan', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'COMPLETED', label: labels.statusCompleted || 'Selesai', colorClass: 'bg-neutral-500', activeClass: 'bg-neutral-500/15 border-neutral-500/40 text-neutral-500' },
          { value: 'CANCELLED', label: labels.statusCancelled || 'Batal', colorClass: 'bg-danger', activeClass: 'bg-danger/15 border-danger/40 text-danger' },
        ],
      },
    ],
  }), [statusFilter, labels]);

  const renderStatsPanel = () => {
    if (!showStats) return null;
    
    const panelLabels = (t as any).rentalVehicles || {};

    return (
      <PanelShell
        title="Ringkasan"
        side={panelSide}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        onOpen={() => setShowStats(true)}
        collapsedTitle="RINGKASAN"
        onSideChange={setPanelSide}
        labels={{
          top: panelLabels.panelTop || 'Atas',
          right: panelLabels.panelRight || 'Kanan',
          bottom: panelLabels.panelBottom || 'Bawah',
          left: panelLabels.panelLeft || 'Kiri',
          hide: panelLabels.hidePanel || 'Sembunyikan',
          layoutToggleTitle: panelLabels.layoutToggleTitle || 'Ubah Posisi Panel',
        }}
        className={cn(
          "shrink-0 bg-white dark:bg-background z-10",
          (panelSide === 'top' || panelSide === 'bottom') ? "w-full" : "w-80 min-w-80 h-full"
        )}
      >
        <div className={cn("gap-2.5 p-3", (panelSide === 'top' || panelSide === 'bottom') ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6" : "flex flex-col h-full")}>
          <StatCard label={labels.summaryTotal || 'Total'} value={stats.total} colorClass="bg-foreground" icon={List} />
          <StatCard label={labels.statusDraft || 'Draft'} value={stats.draft} colorClass="bg-neutral-500" icon={FileText} />
          <StatCard label={labels.statusConfirmed || 'Dikonfirmasi'} value={stats.confirmed} colorClass="bg-blue-500" icon={CheckCircle2} />
          <StatCard label={labels.statusActive || 'Berjalan'} value={stats.active} colorClass="bg-success" icon={Activity} />
          <StatCard label={labels.statusCompleted || 'Selesai'} value={stats.completed} colorClass="bg-neutral-500 dark:bg-neutral-400" icon={CheckCircle2} />
          <StatCard label={labels.statusCancelled || 'Batal'} value={stats.cancelled} colorClass="bg-danger" icon={XCircle} />
        </div>
      </PanelShell>
    );
  };

  return (
    <div className={cn("flex h-full w-full bg-background overflow-hidden relative", (panelSide === 'top' || panelSide === 'bottom') ? 'flex-col' : 'flex-row')}>
      
      {/* Render panel first if top or left */}
      {(panelSide === 'top' || panelSide === 'left') && renderStatsPanel()}

      <div className="flex-1 min-h-0 min-w-0 w-full relative flex flex-col">
        {errorMsg && (
          <div className="w-full bg-red-100 text-red-600 p-4 font-mono text-sm shrink-0">
            ERROR: {errorMsg}
          </div>
        )}
        
        <div className="flex-1 min-h-0 w-full relative">
          <ContractList
            data={filteredData}
            labels={labels}
            onView={handleView}
            onEdit={handleEdit}
            onPrint={handlePrint}
            onHandover={handleHandover}
            searchValue={search}
            onSearchChange={setSearch}
            onAdd={handleAdd}
            filterConfig={filterConfig}
            isFilterOpen={isFilterOpen}
            onFilterOpenChange={setIsFilterOpen}
            showStats={showStats}
            onToggleStats={() => setShowStats(!showStats)}
            dtLabels={dtLabels}
          />
        </div>
      </div>

      {/* Render panel last if bottom or right */}
      {(panelSide === 'bottom' || panelSide === 'right') && renderStatsPanel()}

      <ContractView
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

      <ContractPrintModal
        contract={printContract}
        open={!!printContract}
        onClose={() => setPrintContract(null)}
      />

      <ContractCreateFeature
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {
          setIsCreateOpen(false);
          fetchContracts();
        }}
      />

      <ContractEditFeature
        contractId={editId}
        open={!!editId}
        onOpenChange={(open) => {
          if (!open) setEditId(null);
        }}
        onSuccess={() => {
          setEditId(null);
          fetchContracts();
        }}
      />

      <HandoverFeature
        contractId={handoverId}
        open={!!handoverId}
        onOpenChange={(open) => {
          if (!open) setHandoverId(null);
        }}
        onSuccess={() => {
          setHandoverId(null);
          fetchContracts();
        }}
      />

      <ReturnFeature
        contractId={returnId}
        open={!!returnId}
        onOpenChange={(open) => {
          if (!open) setReturnId(null);
        }}
        onSuccess={() => {
          setReturnId(null);
          fetchContracts();
        }}
      />
    </div>
  );
}
