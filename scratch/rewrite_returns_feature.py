content = """'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { PanelShell } from '@adatrack/ui';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { returnService } from '@/data/modules/rental/services/returnService';
import type { RentalContract } from '../contracts/types/contract';
import { ReturnTable } from './components/ReturnTable';
import { ReturnView } from './components/ReturnView';
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
  
  // Modals / Drawers
  const [selectedContractForView, setSelectedContractForView] = useState<RentalContract | null>(null);
  const [selectedContractIdForProcess, setSelectedContractIdForProcess] = useState<string | null>(null);
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

  const handleProcessReturn = (contract: RentalContract) => {
    setSelectedContractForView(null); // Close view if open
    setSelectedContractIdForProcess(contract.id);
    setIsProcessOpen(true);
  };

  // Convert RentalContract to ReturnGroup for ReturnView
  const returnGroupForView = useMemo(() => {
    if (!selectedContractForView) return null;
    return {
      id: selectedContractForView.id,
      contractId: selectedContractForView.id,
      contract: selectedContractForView,
      customer: selectedContractForView.customer,
      items: selectedContractForView.items || [],
      status: 'PARTIAL' as 'PARTIAL' | 'COMPLETED',
      handoverAt: selectedContractForView.startDate,
      handoverLatitude: 0,
      handoverLongitude: 0,
    };
  }, [selectedContractForView]);

  return (
    <div className="flex flex-col h-full bg-background">
      <PanelShell
        title="Pengembalian Kendaraan"
        description="Kelola antrean pengembalian dan riwayat kendaraan"
        tabs={[
          {
            id: 'PENDING',
            label: `Menunggu Kembali (${activeContracts.length})`,
            onClick: () => setActiveTab('PENDING')
          },
          {
            id: 'COMPLETED',
            label: `Selesai (${completedContracts.length})`,
            onClick: () => setActiveTab('COMPLETED')
          }
        ]}
        activeTab={activeTab}
        hideLayoutToggle={true}
      >
        <div className="flex-1 overflow-hidden relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : null}
          
          <ReturnTable
            data={currentList}
            searchValue={search}
            onSearchChange={setSearch}
            onViewDetail={setSelectedContractForView}
            onProcessReturn={handleProcessReturn}
            activeTab={activeTab}
          />
        </div>
      </PanelShell>

      {/* VIEW DRAWER (Read-Only) */}
      <ReturnView
        open={!!selectedContractForView}
        onClose={() => setSelectedContractForView(null)}
        returnGroup={returnGroupForView}
        onProcessReturn={() => {
          if (selectedContractForView) handleProcessReturn(selectedContractForView);
        }}
      />

      {/* CREATE RETURN DRAWER (Form) */}
      <ReturnCreateFeature
        contractId={isProcessOpen ? selectedContractIdForProcess : null}
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
