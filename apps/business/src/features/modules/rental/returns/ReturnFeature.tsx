'use client';

import React from 'react';
import { ReturnForm } from './components/ReturnForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import { handoverRepository } from '@/data/modules/rental/repositories/handoverRepository';
import { returnService } from '@/data/modules/rental/services/returnService';
import type { RentalContract } from '../contracts/types/contract';
import type { RentalHandover } from '../handover/types/handover';
import type { RentalReturn } from './types/return';

interface ReturnFeatureProps {
  contractId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReturnFeature({ contractId, open, onOpenChange, onSuccess }: ReturnFeatureProps) {
  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [handovers, setHandovers] = React.useState<RentalHandover[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open || !contractId) return;
    const loadData = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const data = await contractService.getContractById(contractId);
        if (!data) {
          setErrorMsg('Kontrak tidak ditemukan.');
          return;
        }
        if (data.status !== 'ACTIVE' && data.status !== 'COMPLETED') {
          setErrorMsg('Kontrak ini belum dapat diproses untuk pengembalian. Status kontrak harus ACTIVE atau COMPLETED.');
          return;
        }

        const loadedHandovers: RentalHandover[] = [];
        for (const item of data.booking?.items || []) {
          const existingReturn = await returnService.getReturnByBookingItemId(contractId, item.id);
          if (!existingReturn) {
            const hnd = await handoverRepository.getHandoverByBookingItemId(contractId, item.id);
            if (hnd) loadedHandovers.push(hnd);
          }
        }

        if (loadedHandovers.length === 0) {
          setErrorMsg('Semua kendaraan di kontrak ini sudah dikembalikan atau belum diserahterimakan.');
          return;
        }

        setContract(data);
        setHandovers(loadedHandovers);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat data kontrak.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [contractId, open]);

  const handleSubmit = async (data: Omit<RentalReturn, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await returnService.createReturn(data);
      alert('Pengembalian kendaraan berhasil disimpan.');
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan pengembalian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!contract || handovers.length === 0) return null;

  return (
    <ReturnForm
      contract={contract}
      handovers={handovers}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      layout="default"
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
