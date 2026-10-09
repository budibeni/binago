'use client';

import React from 'react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { HandoverForm } from './components/HandoverForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import { handoverService } from '@/data/modules/rental/services/handoverService';
import type { RentalContract } from '../contracts/types/contract';
import type { RentalHandover } from './types/handover';

interface HandoverCreateFeatureProps {
  contractId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  labels?: Record<string, any>;
}

export function HandoverCreateFeature({ contractId, open, onOpenChange, onSuccess, labels = {} }: HandoverCreateFeatureProps) {

  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [eligibleContracts, setEligibleContracts] = React.useState<RentalContract[]>([]);
  const [handedOverItemIds, setHandedOverItemIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      // Reset state when closed
      if (!contractId) setContract(null);
      return;
    }
    const loadData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        if (contractId) {
          const [data, handovers] = await Promise.all([
            contractService.getContractById(contractId),
            handoverService.getHandovers()
          ]);
          
          if (!data || (data.status !== 'CONTRACTED' && data.status !== 'ACTIVE')) {
            setErrorMsg(labels.errorInvalidContract || 'Kontrak tidak ditemukan atau tidak dapat diproses.');
            return;
          }

          const contractHandovers = handovers.filter(h => h.contractId === contractId);
          setHandedOverItemIds(contractHandovers.map(h => h.bookingItemId));
          setContract(data);
        } else {
          // Fetch eligible contracts
          const [eligible, handovers] = await Promise.all([
            handoverService.getEligibleContracts(),
            handoverService.getHandovers()
          ]);
          setEligibleContracts(eligible);
          setHandedOverItemIds(handovers.map(h => h.bookingItemId));
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [contractId, open]);

  const handleSubmit = async (dataArray: (Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt' | 'handoverNumber'> & { handoverNumber?: string })[]) => {
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

  return (
    <HandoverForm
      contract={contract}
      eligibleContracts={eligibleContracts}
      onSelectContract={setContract}
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
