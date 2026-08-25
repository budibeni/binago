'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@adatrack/ui';
import { ReturnForm } from './components/ReturnForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import { handoverRepository } from '@/data/modules/rental/repositories/handoverRepository';
import { returnService } from '@/data/modules/rental/services/returnService';
import type { RentalContract } from '../contracts/types/contract';
import type { RentalHandover } from '../handover/types/handover';
import type { RentalReturn } from './types/return';

interface ReturnFeatureProps {
  contractId: string;
}

export function ReturnFeature({ contractId }: ReturnFeatureProps) {
  const router = useRouter();

  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [handover, setHandover] = React.useState<RentalHandover | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
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
  }, [contractId]);

  const handleSubmit = async (data: Omit<RentalReturn, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await returnService.createReturn(data);
      alert('Pengembalian kendaraan berhasil disimpan.');
      router.push('/rental/returns');
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan pengembalian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
        <div className="max-w-md text-center bg-danger/5 border border-danger/20 rounded-xl p-8">
          <p className="text-lg font-bold text-danger mb-2">Tidak Dapat Memproses</p>
          <p className="text-muted-foreground text-sm">{errorMsg}</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  if (!contract || !handover) return null;

  return (
    <div className="flex flex-col h-full bg-neutral-50/50 dark:bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-white dark:bg-background flex items-center gap-4 shrink-0">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-1">
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-xl font-bold">Pengembalian Kendaraan</h1>
          <p className="text-sm text-muted-foreground">
            {contract.contractNumber} · {contract.customer?.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <ReturnForm
            contract={contract}
            handover={handover}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
