"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BookingForm, type BookingFormData } from './components/BookingForm';
import { getBookingTranslation } from './i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { bookingService } from '@/data/modules/rental/services/bookingService';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';
import { rentalCustomerService as customerService } from '@/data/modules/rental/services/customerService';
import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';

interface BookingCreateFeatureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BookingCreateFeature({ open, onOpenChange, onSuccess }: BookingCreateFeatureProps) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getBookingTranslation(locale);

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

  const handleSubmit = async (formData: BookingFormData) => {

    try {
      setIsSubmitting(true);

      await bookingService.createBooking({
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

      alert(t.createSuccess || 'Booking berhasil dibuat.');
      onSuccess();

    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookingForm
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
