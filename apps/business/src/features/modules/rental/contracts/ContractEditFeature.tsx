'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { ChevronLeft } from 'lucide-react';

import { ContractEditForm } from './components/ContractEditForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import type { RentalContract } from './types/contract';

interface ContractEditFeatureProps {
  contractId: string;
}

export function ContractEditFeature({ contractId }: ContractEditFeatureProps) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalContractFeature || {};

  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await contractService.getContractById(contractId);
        if (!data) {
          alert('Kontrak tidak ditemukan');
          router.push('/rental/contracts');
          return;
        }
        if (data.status !== 'DRAFT') {
          alert('Hanya kontrak berstatus DRAFT yang dapat diedit');
          router.push('/rental/contracts');
          return;
        }
        setContract(data);
      } catch (error) {
        console.error('Failed to load contract', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [contractId, router]);

  const handleSubmit = async (data: Partial<RentalContract>) => {
    if (!contract) return;
    setIsSubmitting(true);
    try {
      await contractService.updateContract(contract.id, data);
      alert('Kontrak berhasil diperbarui.');
      router.push('/rental/contracts');
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat menyimpan kontrak.');
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{labels.editContract || 'Edit Kontrak'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-border">
                {contract.contractNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-border">
                Draft
              </span>
            </div>
            <p className="text-muted-foreground mt-1">Perbarui informasi, tanggal, atau syarat & ketentuan kontrak.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6">
        <ContractEditForm
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
