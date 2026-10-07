"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingForm, type BookingFormData } from './components/BookingForm';
import { getBookingTranslation } from './i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { bookingService } from '@/data/modules/rental/services/bookingService';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';
import { rentalCustomerService as customerService } from '@/data/modules/rental/services/customerService';
import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import type { Booking } from '@/features/modules/rental/bookings/types/booking';

interface BookingEditFeatureProps {
  bookingId: string | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BookingEditFeature({ bookingId, onOpenChange, onSuccess }: BookingEditFeatureProps) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getBookingTranslation(locale);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<RentalVehicle[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cData, vData, bData] = await Promise.all([
          customerService.getCustomers(),
          rentalVehicleService.getRentalVehicles(),
          bookingService.getBookingById(bookingId)
        ]);
        setCustomers(cData);
        setVehicles(vData);
        setBooking(bData || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const handleSubmit = async (formData: BookingFormData) => {
    if (!bookingId) return;
    try {
      setIsSubmitting(true);
      
      // Update status if it changed
      if (formData.status && formData.status !== booking?.status) {
        await bookingService.updateBookingStatus(bookingId, formData.status);
      }
      
      // Simulate other updates
      // await bookingService.updateBooking(bookingId, { ... })

      alert('Booking berhasil diperbarui.');
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingId) return null;
  if (loading || !booking) return null;

  const initialData: Partial<BookingFormData> = {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    customerId: booking.customerId,
    createdAt: booking.createdAt,
    items: booking.items?.map(i => ({
      vehicleId: i.vehicleId,
      rateType: i.rateType,
      packageId: i.packageId,
      packageName: i.packageName,
      unitPrice: i.unitPrice,
      depositSnapshot: i.depositSnapshot,
        duration: i.duration || 1,
      subtotal: i.subtotal,
    })) || [],
    startDate: booking.startDate,
    rentalType: booking.rentalType,
    deposit: booking.deposit,
    notes: booking.notes
  };

  return (
    <BookingForm
      open={!!bookingId}
      onOpenChange={onOpenChange}
      customers={customers}
      vehicles={vehicles}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => onOpenChange(false)}
      layout="default"
    />
  );
}
