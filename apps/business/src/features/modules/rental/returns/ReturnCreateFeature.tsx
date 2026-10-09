'use client';

import React from 'react';
import { ReturnForm } from './components/ReturnForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import { returnService } from '@/data/modules/rental/services/returnService';
import type { RentalContract } from '../contracts/types/contract';
import type { ReturnPayload } from './types/return';
import type { BookingItem } from '../bookings/types/booking';
import { Dialog } from '@adatrack/ui';

interface ReturnCreateFeatureProps {
  inline?: boolean;
  contractId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReturnCreateFeature({ contractId, open, onOpenChange, onSuccess , inline = false }: ReturnCreateFeatureProps) {
  const [contract, setContract] = React.useState<RentalContract | null>(null);
  const [itemsToReturn, setItemsToReturn] = React.useState<BookingItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if ((!open && !inline) || !contractId) return;
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

        const pendingItems = data.items?.filter(i => i.itemStatus === 'IN_USE') || [];

        if (pendingItems.length === 0) {
          setErrorMsg('Semua kendaraan di kontrak ini sudah dikembalikan atau belum diserahterimakan.');
          return;
        }

        setContract(data);
        setItemsToReturn(pendingItems);
      } catch (err: any) {
        setErrorMsg(err.message || 'Gagal memuat data kontrak.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [contractId, open]);

  const handleSubmit = async (data: ReturnPayload[]) => {
    setIsSubmitting(true);
    try {
      for (const d of data) {
        await returnService.createReturn(d);
      }
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

  if (!open && !inline) return null;

  if (inline) {
    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    if (errorMsg) return (
      <div className="w-full bg-background border border-border/50 rounded-xl overflow-hidden mt-4 shadow-sm p-8 text-center">
        <p className="text-danger font-bold mb-2">Gagal Memproses</p>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>
      </div>
    );
    if (!contract) return <div className="p-8 text-center text-muted-foreground animate-pulse">Menyiapkan form...</div>;
    return (
      <div className="w-full bg-background border border-border/50 rounded-xl overflow-hidden mt-4 shadow-sm">
        <ReturnForm
          contract={contract}
          itemsToReturn={itemsToReturn}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          layout="default"
        />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="h-full max-h-[100vh] w-full max-w-[1200px] ml-auto p-0 flex flex-col rounded-none sm:rounded-l-2xl after:hidden border-l border-border/50 bg-background/95 backdrop-blur-sm" hideCloseButton>
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full p-8 bg-neutral-50 dark:bg-neutral-950">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
            <p className="text-sm text-muted-foreground">Memuat data kontrak...</p>
          </div>
        ) : errorMsg ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full p-8 bg-neutral-50 dark:bg-neutral-950">
            <div className="text-danger mb-4 text-center">
              <p className="font-bold">Gagal Memproses</p>
              <p className="text-sm mt-1">{errorMsg}</p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 text-sm font-medium rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              Kembali
            </button>
          </div>
        ) : contract && itemsToReturn.length > 0 ? (
          <ReturnForm
            contract={contract}
            itemsToReturn={itemsToReturn}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            layout="drawer"
            open={open}
            onOpenChange={onOpenChange}
          />
        ) : null}
    </Dialog>
  );
}
