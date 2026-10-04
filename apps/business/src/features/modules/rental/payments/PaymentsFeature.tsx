'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { paymentService } from '@/data/modules/rental/services/paymentService';
import type { RentalPayment } from './types/payment';
import { PaymentList } from './components/PaymentList';
import { PaymentForm } from './components/PaymentForm';

interface PaymentsFeatureProps {
  bookingId: string;
  customerId: string;
  totalAmount: number;
  deposit: number;
  remainingAmount: number;
  defaultStage?: import('./types/payment').PaymentStage;
}

export function PaymentsFeature({ 
  bookingId, 
  customerId, 
  totalAmount, 
  deposit, 
  remainingAmount, 
  defaultStage = 'MANUAL'
}: PaymentsFeatureProps) {
  const [payments, setPayments] = useState<RentalPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentService.getPaymentsByBookingId(bookingId);
      setPayments(data);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data pembayaran');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleAddPayment = async (data: Omit<RentalPayment, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      await paymentService.createPayment(data);
      alert('Pembayaran berhasil ditambahkan!');
      setIsFormOpen(false);
      fetchPayments();
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan pembayaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (id: string) => {
    if (!confirm('Verifikasi pembayaran ini? Setelah diverifikasi, pembayaran tidak dapat dihapus.')) return;
    try {
      await paymentService.verifyPayment(id);
      fetchPayments();
    } catch (err: any) {
      alert(err.message || 'Gagal memverifikasi');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Batalkan transaksi pembayaran ini?')) return;
    try {
      await paymentService.cancelPayment(id);
      fetchPayments();
    } catch (err: any) {
      alert(err.message || 'Gagal membatalkan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi pembayaran ini secara permanen?')) return;
    try {
      await paymentService.deletePayment(id);
      fetchPayments();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50/30 dark:bg-neutral-950/20">
      <div className="p-4 flex-1 overflow-y-auto">
        <PaymentList
          payments={payments}
          isLoading={loading}
          totalAmount={totalAmount}
          deposit={deposit}
          remainingAmount={remainingAmount}
          activeStage={defaultStage}
          onAdd={() => setIsFormOpen(true)}
          onVerify={handleVerify}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      </div>

      <PaymentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        bookingId={bookingId}
        customerId={customerId}
        onSubmit={handleAddPayment}
        onCancel={() => setIsFormOpen(false)}
        isSubmitting={isSubmitting}
        defaultStage={defaultStage}
        hasPayments={payments.length > 0}
      />
    </div>
  );
}
