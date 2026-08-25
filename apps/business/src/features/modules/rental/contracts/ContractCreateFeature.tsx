'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { ChevronLeft } from 'lucide-react';

import { ContractCreateForm } from './components/ContractCreateForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import type { Reservation } from '@/features/modules/rental/reservations/types/reservation';
import type { RentalContract } from './types/contract';

export function ContractCreateFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalContractFeature || {};

  const [availableReservations, setAvailableReservations] = React.useState<Reservation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await contractService.getAvailableReservationsForContract();
        setAvailableReservations(data);
      } catch (error) {
        console.error('Failed to load reservations for contract', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleSubmit = async (data: Partial<RentalContract>) => {
    setIsSubmitting(true);
    try {
      await contractService.createContract(data as any);
      alert('Kontrak rental berhasil dibuat dengan status Draft.');
      router.push('/rental/contracts');
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat membuat kontrak.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-neutral-50/50 dark:bg-background">
      <div className="px-6 py-6 pb-4 max-w-5xl mx-auto w-full">
        
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{labels.addContract || 'Buat Kontrak Rental'}</h1>
            <p className="text-muted-foreground">Buat kontrak baru berdasarkan reservasi yang sudah dikonfirmasi.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ContractCreateForm
            availableReservations={availableReservations}
            labels={labels}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
