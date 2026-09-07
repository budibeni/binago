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
  const [handover, setHandover] = React.useState<RentalHandover | null>(null);
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
        if (data.status !== 'ACTIVE') {
          setErrorMsg('Kontrak ini belum dapat diproses untuk pengembalian. Status kontrak harus ACTIVE.');
          return;
        }

        const existingReturn = await returnService.getReturnByContractId(contractId);
        if (existingReturn) {
          setErrorMsg('Kontrak ini sudah memiliki data pengembalian.');
          return;
        }

        const hnd = await handoverRepository.getHandoverByContractId(contractId);
        if (!hnd) {
          setErrorMsg('Kontrak ini belum memiliki data serah terima.');
          return;
        }

        setContract(data);
        setHandover(hnd);
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

  if (!contract || !handover) return null;

  return (
    <ReturnForm
      contract={contract}
      handover={handover}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      layout="drawer"
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
