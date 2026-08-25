'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Key, FileText, ArrowRight, MapPin } from 'lucide-react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { handoverService } from '@/data/modules/rental/services/handoverService';
import type { RentalHandover } from './types/handover';
import type { RentalContract } from '../contracts/types/contract';
import { HandoverList } from './components/HandoverList';
import { HandoverDetailDrawer } from './components/HandoverDetailDrawer';
import { Button } from '@adatrack/ui';
import Link from 'next/link';

export function HandoversFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const [handovers, setHandovers] = useState<RentalHandover[]>([]);
  const [eligibleContracts, setEligibleContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Drawer & Dialog state
  const [selectedHandover, setSelectedHandover] = useState<RentalHandover | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, eligible] = await Promise.all([
        handoverService.getHandovers(),
        handoverService.getEligibleContracts(),
      ]);
      // Sort by newest first
      const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHandovers(sorted);
      setEligibleContracts(eligible);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return handovers.filter((h) => {
      // Filter by Search (ID Handover, Contract ID, Customer Name, Vehicle Plate/Name)
      if (search) {
        const s = search.toLowerCase();
        const matchSearch = 
          h.id.toLowerCase().includes(s) || 
          h.contractId.toLowerCase().includes(s) ||
          h.contract?.contractNumber?.toLowerCase().includes(s) ||
          h.customer?.name?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.brand?.toLowerCase().includes(s) ||
          h.vehicle?.coreVehicle?.vehicleName?.toLowerCase().includes(s);
        
        if (!matchSearch) return false;
      }
      return true;
    });
  }, [handovers, search]);

  const openDetail = (handover: RentalHandover) => {
    setSelectedHandover(handover);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedHandover(null), 300);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50/50 dark:bg-background">
      {/* Content */}
      <div className="flex-1 p-6 min-h-0 overflow-y-auto">
        <div className="h-full max-w-[1400px] mx-auto flex flex-col gap-8">
          
          {/* SECTION A: SIAP SERAH TERIMA */}
          {eligibleContracts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Siap Serah Terima
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eligibleContracts.map(contract => (
                  <div key={contract.id} className="bg-white dark:bg-neutral-900 border border-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">{contract.contractNumber}</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          CONFIRMED
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1 truncate">{contract.customer?.name}</p>
                      <Link href={`/tracking?vehicles=${contract.vehicle?.coreVehicle?.id}`} className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-danger transition-colors mb-4 w-fit" title="Lihat Lokasi Terkini di Pemantauan">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="group-hover:underline truncate">
                          {contract.vehicle?.coreVehicle?.brand} {contract.vehicle?.coreVehicle?.vehicleName} &bull; {contract.vehicle?.coreVehicle?.plateNumber}
                        </span>
                      </Link>
                    </div>
                    <Link href={`/rental/contracts/${contract.id}/handover`} className="w-full">
                      <Button variant="outline" className="w-full justify-between">
                        Proses Serah Terima
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION B: RIWAYAT SERAH TERIMA */}
          <section className="flex-1 flex flex-col min-h-[500px] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Key className="w-4 h-4" />
              Riwayat Serah Terima
            </h2>
            

            {loading ? (
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-900 border border-border rounded-xl shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-[400px] bg-white dark:bg-neutral-900 border border-border rounded-xl shadow-sm p-4">
                <HandoverList
                  data={filteredData}
                  searchValue={search}
                  onSearchChange={setSearch}
                  onViewDetail={openDetail}
                />
              </div>
            )}
          </section>
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
