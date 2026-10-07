'use client';

import React from 'react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { HandoverForm } from './components/HandoverForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import { handoverService } from '@/data/modules/rental/services/handoverService';
import type { RentalContract } from '../contracts/types/contract';
import type { RentalHandover } from './types/handover';

interface HandoverFeatureProps {
  contractId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function HandoverFeature({ contractId, open, onOpenChange, onSuccess }: HandoverFeatureProps) {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = (t as any).rentalHandoverFeature || {};

  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [handedOverItemIds, setHandedOverItemIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open || !contractId) return;
    const loadData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const [data, handovers] = await Promise.all([
          contractService.getContractById(contractId),
          handoverService.getHandovers()
        ]);
        
        if (!data) {
          setErrorMsg(labels.errorInvalidContract || 'Kontrak tidak ditemukan.');
          return;
        }
        if (data.status !== 'CONTRACTED' && data.status !== 'ACTIVE') {
          setErrorMsg(labels.errorInvalidContract || 'Kontrak ini tidak dapat diproses untuk serah terima.');
          return;
        }

        const contractHandovers = handovers.filter(h => h.contractId === contractId);
        setHandedOverItemIds(contractHandovers.map(h => h.bookingItemId));
        setContract(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat data kontrak.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [contractId, open, labels]);

  const handleSubmit = async (dataArray: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    setIsSubmitting(true);
    try {
      for (const data of dataArray) {
        await handoverService.createHandover(data);
      }
      alert(labels.successMessage || 'Serah terima kendaraan berhasil disimpan.');
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data serah terima.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!contract) return null;

  return (
    <HandoverForm
      contract={contract}
      handedOverItemIds={handedOverItemIds}
      labels={labels}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      layout="default"
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
