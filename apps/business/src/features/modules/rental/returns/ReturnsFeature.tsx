'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { RotateCcw, FileText, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@adatrack/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { returnService } from '@/data/modules/rental/services/returnService';
import { trackingNavigationService } from '@/features/core/tracking/services/trackingNavigationService';
import type { RentalReturn } from './types/return';
import type { RentalContract } from '../contracts/types/contract';
import { ReturnList } from './components/ReturnList';
import { ReturnDetailDrawer } from './components/ReturnDetailDrawer';

export function ReturnsFeature() {
  const router = useRouter();
  const [returns, setReturns] = useState<RentalReturn[]>([]);
  const [eligibleContracts, setEligibleContracts] = useState<RentalContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedReturn, setSelectedReturn] = useState<RentalReturn | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [data, eligible] = await Promise.all([
        returnService.getReturns(),
        returnService.getEligibleContracts(),
      ]);
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReturns(sorted);
      setEligibleContracts(eligible);
    } catch (err) {
      console.error('Failed to load returns data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return returns.filter((r) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(s) ||
        r.contractId.toLowerCase().includes(s) ||
        r.contract?.contractNumber?.toLowerCase().includes(s) ||
        r.customer?.name?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.plateNumber?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.brand?.toLowerCase().includes(s) ||
        r.vehicle?.coreVehicle?.vehicleName?.toLowerCase().includes(s)
      );
    });
  }, [returns, search]);

  const openDetail = (ret: RentalReturn) => {
    setSelectedReturn(ret);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedReturn(null), 300);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50/50 dark:bg-background">
      {/* Content */}
      <div className="flex-1 p-6 min-h-0 overflow-y-auto">
        <div className="h-full max-w-[1400px] mx-auto flex flex-col gap-8">

          {/* SECTION A: SIAP DIKEMBALIKAN */}
          {eligibleContracts.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Siap Dikembalikan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eligibleContracts.map(contract => (
                  <div
                    key={contract.id}
                    className="bg-white dark:bg-neutral-900 border border-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">{contract.contractNumber}</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-success/10 text-success">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1 truncate">{contract.customer?.name}</p>
                      <button
                        onClick={() => {
                          if (contract.vehicle?.coreVehicle?.id) {
                            trackingNavigationService.navigateToTracking(router, {
                              mode: 'live',
                              vehicleId: contract.vehicle.coreVehicle.id
                            });
                          }
                        }}
                        className="group flex items-center gap-1.5 text-xs text-muted-foreground hover:text-danger transition-colors mb-1 w-fit"
                        title="Lihat Lokasi Terkini"
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="group-hover:underline truncate">
                          {contract.vehicle?.coreVehicle?.brand} {contract.vehicle?.coreVehicle?.vehicleName} &bull; {contract.vehicle?.coreVehicle?.plateNumber}
                        </span>
                      </button>
                      <p className="text-xs text-muted-foreground mb-1">
                        Odometer: {contract.vehicle?.currentOdometer?.toLocaleString('id-ID') || '-'} KM
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
                        Jatuh Tempo: {contract.endDate ? new Date(contract.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                      </p>
                    </div>
                    <Link href={`/rental/contracts/${contract.id}/return`} className="w-full">
                      <Button variant="outline" className="w-full justify-between">
                        Proses Pengembalian
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION B: RIWAYAT PENGEMBALIAN */}
          <section className="flex-1 flex flex-col min-h-[500px] space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Riwayat Pengembalian
            </h2>

            {loading ? (
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-neutral-900 border border-border rounded-xl shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-[400px] bg-white dark:bg-neutral-900 border border-border rounded-xl shadow-sm p-4">
                <ReturnList
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

      <ReturnDetailDrawer
        open={isDetailOpen}
        onClose={closeDetail}
        ret={selectedReturn}
      />
    </div>
  );
}
