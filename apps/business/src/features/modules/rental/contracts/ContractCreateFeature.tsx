'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { ChevronLeft } from 'lucide-react';

import { ContractForm } from './components/ContractForm';
import { contractService } from '@/data/modules/rental/services/contractService';
import type { Booking } from '@/features/modules/rental/bookings/types/booking';
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

  const [availableBookings, setAvailableBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await contractService.getAvailableBookingsForContract();
        setAvailableBookings(data);
      } catch (error) {
        console.error('Failed to load bookings for contract', error);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      fetchBookings();
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
      availableBookings={availableBookings}
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
