'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { ChevronLeft } from 'lucide-react';
import { HandoverForm } from './components/HandoverForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import { handoverService } from '@/data/modules/rental/services/handoverService';
import type { RentalContract } from '../contracts/types/contract';
import type { RentalHandover } from './types/handover';

interface HandoverFeatureProps {
  contractId: string;
}

export function HandoverFeature({ contractId }: HandoverFeatureProps) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalHandoverFeature || {};

  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await contractService.getContractById(contractId);
        if (!data) {
          setErrorMsg(labels.errorInvalidContract || 'Kontrak tidak ditemukan.');
          return;
        }
        if (data.status !== 'CONFIRMED') {
          setErrorMsg(labels.errorInvalidContract || 'Kontrak ini tidak dapat diproses untuk serah terima.');
          return;
        }
        
        // Cek duplicate
        const existing = await handoverService.getHandoverByContractId(contractId);
        if (existing) {
          setErrorMsg('Kontrak ini sudah memiliki serah terima.');
          return;
        }

        setContract(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat data kontrak.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [contractId, labels]);

  const handleSubmit = async (data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await handoverService.createHandover(data);
      alert(labels.successMessage || 'Serah terima kendaraan berhasil disimpan.');
      router.push('/rental/contracts');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data serah terima.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-neutral-50/50 dark:bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] bg-neutral-50/50 dark:bg-background px-4 text-center">
        <p className="text-danger font-semibold mb-4">{errorMsg}</p>
        <button 
          onClick={handleCancel}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground rounded-lg font-medium transition-colors"
        >
          Kembali ke List Kontrak
        </button>
      </div>
    );
  }

  if (!contract) return null;

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
            <h1 className="text-2xl font-bold">{labels.title || 'Serah Terima Kendaraan'}</h1>
            <p className="text-muted-foreground mt-1">{labels.pageSubtitle || 'Pencatatan snapshot kondisi awal kendaraan saat diserahkan ke pelanggan.'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 max-w-5xl mx-auto w-full">
        <HandoverForm
          contract={contract}
          labels={labels}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
