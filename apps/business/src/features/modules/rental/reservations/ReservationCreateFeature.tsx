"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ReservationForm, type ReservationFormData } from './components/ReservationForm';
import { getReservationTranslation } from './i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { reservationService } from '@/data/modules/rental/services/reservationService';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';
import { rentalCustomerService as customerService } from '@/data/modules/rental/services/customerService';
import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';

interface ReservationCreateFeatureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReservationCreateFeature({ open, onOpenChange, onSuccess }: ReservationCreateFeatureProps) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getReservationTranslation(locale);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      const [cData, vData] = await Promise.all([
        customerService.getCustomers(),
        rentalVehicleService.getRentalVehicles()
      ]);
      setCustomers(cData);
      setVehicles(vData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (formData: ReservationFormData) => {

    try {
      setIsSubmitting(true);

      await reservationService.createReservation({
        customerId: formData.customerId,
        vehicleId: formData.vehicleId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration,
        rentalType: formData.rentalType,
        rateType: formData.rateType,
        dailyRate: 0, // In real app, fetch from vehicle
        weeklyRate: 0,
        monthlyRate: 0,
        totalAmount: 0, // calculate inside service or backend
        deposit: formData.deposit,
        notes: formData.notes
      });

      alert(t.createSuccess || 'Reservasi berhasil dibuat.');
      onSuccess();

    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan reservasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReservationForm
      customers={customers}
      vehicles={vehicles}
      onSubmit={handleSubmit}
      onCancel={() => onOpenChange(false)}
      layout="default"
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
