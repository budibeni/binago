"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { ReservationCreateForm, type ReservationCreateFormData } from './components/ReservationCreateForm';
import { reservationService } from '@/data/modules/rental/services/reservationService';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';
import { rentalCustomerService as customerService } from '@/data/modules/rental/services/customerService';
import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';

export function ReservationCreateFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = t.reservation;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  // Default to tomorrow 09:00
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0);
  const defaultEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 9, 0);

  const [formData, setFormData] = useState<ReservationCreateFormData>({
    customerId: '',
    vehicleId: '',
    startDate: defaultStart.toISOString(),
    endDate: defaultEnd.toISOString(),
    duration: 2,
    rentalType: 'SELF_DRIVE',
    rateType: 'DAILY',
    deposit: 0,
    notes: '',
  });

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

  // Sync vehicle defaults when selected
  useEffect(() => {
    if (formData.vehicleId) {
      const v = vehicles.find(v => v.vehicleId === formData.vehicleId);
      if (v) {
        setFormData(prev => ({
          ...prev,
          deposit: v.deposit || 0
        }));
      }
    }
  }, [formData.vehicleId, vehicles]);

  // Sync duration when dates change
  useEffect(() => {
    const dur = reservationService.calculateDuration(formData.startDate, formData.endDate);
    setFormData(prev => ({ ...prev, duration: dur }));
  }, [formData.startDate, formData.endDate]);

  const selectedVehicle = useMemo(() => vehicles.find(v => v.vehicleId === formData.vehicleId), [vehicles, formData.vehicleId]);

  const totalAmount = useMemo(() => {
    if (!selectedVehicle) return 0;
    return reservationService.calculateTotalAmount(
      formData.rateType,
      formData.duration,
      selectedVehicle.dailyRate,
      selectedVehicle.weeklyRate,
      selectedVehicle.monthlyRate
    );
  }, [selectedVehicle, formData.rateType, formData.duration]);

  const remainingAmount = useMemo(() => {
    return Math.max(totalAmount - formData.deposit, 0);
  }, [totalAmount, formData.deposit]);

  const handleSubmit = async () => {
    if (!formData.customerId) return alert('Pelanggan wajib dipilih');
    if (!formData.vehicleId) return alert('Kendaraan wajib dipilih');
    if (!formData.startDate || !formData.endDate) return alert('Tanggal wajib diisi');
    if (formData.duration <= 0) return alert('Periode tidak valid');

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
        dailyRate: selectedVehicle!.dailyRate,
        weeklyRate: selectedVehicle!.weeklyRate,
        monthlyRate: selectedVehicle!.monthlyRate,
        totalAmount,
        deposit: formData.deposit,
        notes: formData.notes
      });

      alert(labels.createSuccess);

      router.push('/rental/reservations');
      router.refresh();

    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan reservasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReservationCreateForm
      formData={formData}
      setFormData={setFormData}
      customers={customers}
      vehicles={vehicles}
      labels={labels}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/rental/reservations')}
      isSubmitting={isSubmitting}
      totalAmount={totalAmount}
      remainingAmount={remainingAmount}
    />
  );
}
