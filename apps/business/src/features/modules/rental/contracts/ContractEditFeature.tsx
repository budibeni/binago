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
  contractId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ContractEditFeature({ contractId, open, onOpenChange, onSuccess }: ContractEditFeatureProps) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalContractFeature || {};

  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open || !contractId) {
      return;
    }
    const fetchContract = async () => {
      setLoading(true);
      try {
        const data = await contractService.getContractById(contractId);
        if (!data) {
          alert('Kontrak tidak ditemukan');
          onOpenChange(false);
          return;
        }
        if (data.status !== 'DRAFT') {
          alert('Hanya kontrak berstatus DRAFT yang dapat diedit');
          onOpenChange(false);
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
  }, [contractId, open, onOpenChange]);

  const handleSubmit = async (data: Partial<RentalContract>) => {
    if (!contract) return;
    setIsSubmitting(true);
    try {
      await contractService.updateContract(contract.id, data);
      alert('Kontrak berhasil diperbarui.');
      onSuccess();
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat menyimpan kontrak.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!contract) {
    return null;
  }

  return (
    <ContractEditForm
      contract={contract}
      labels={labels}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      mode="drawer"
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
