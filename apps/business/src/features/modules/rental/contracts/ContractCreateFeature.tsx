'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { ChevronLeft } from 'lucide-react';

import { ContractForm } from './components/ContractForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import type { Reservation } from '@/features/modules/rental/reservations/types/reservation';
import type { RentalContract } from './types/contract';

interface ContractCreateFeatureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ContractCreateFeature({ open, onOpenChange, onSuccess }: ContractCreateFeatureProps) {
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
    if (open) {
      fetchReservations();
    }
  }, [open]);

  const handleSubmit = async (data: Partial<RentalContract>) => {
    setIsSubmitting(true);
    try {
      await contractService.createContract(data as any);
      alert('Kontrak rental berhasil dibuat dengan status Draft.');
      onSuccess();
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan saat membuat kontrak.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <ContractForm
      availableReservations={availableReservations}
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
