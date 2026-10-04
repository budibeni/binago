'use client';

import React from 'react';
import { Button, FormShell, FormCard, InputNumber, InputSelect, InputString, InputTextarea } from '@adatrack/ui';
import { CreditCard } from 'lucide-react';
import type { RentalPayment, PaymentType, PaymentMethod, PaymentStage } from '../types/payment';
import { PAYMENT_TYPE_LABEL, PAYMENT_METHOD_LABEL, PAYMENT_STAGE_LABEL } from '../types/payment';

interface PaymentFormProps {
  bookingId: string;
  customerId: string;
  defaultStage?: PaymentStage;
  defaultType?: PaymentType;
  hasPayments?: boolean;
  onSubmit: (data: Omit<RentalPayment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  layout?: 'default' | 'drawer' | 'dialog';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PaymentForm({
  bookingId,
  customerId,
  defaultStage = 'MANUAL',
  defaultType = 'RENTAL_PAYMENT',
  onSubmit,
  onCancel,
  isSubmitting,
  layout = 'dialog',
  open,
  onOpenChange,
  hasPayments = false,
}: PaymentFormProps) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultPaidAt = now.toISOString().slice(0, 16);

  const [type, setType] = React.useState<PaymentType>(defaultType);
  const [method, setMethod] = React.useState<PaymentMethod>('CASH');
  const [stage, setStage] = React.useState<PaymentStage>(defaultStage);
  const [amount, setAmount] = React.useState<number | null>(null);
  const [referenceNumber, setReferenceNumber] = React.useState('');
  const [paidAt, setPaidAt] = React.useState(defaultPaidAt);
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (open) {
      let initialType = defaultType;
      if (defaultStage === 'BOOKING') initialType = 'DOWN_PAYMENT';
      if (defaultStage === 'HANDOVER') initialType = 'RENTAL_PAYMENT';
      if (defaultStage === 'RETURN') initialType = 'ADDITIONAL_FEE';
      if (defaultStage === 'CONTRACT') initialType = 'RENTAL_PAYMENT';

      setType(initialType);
      setStage(defaultStage);
      setMethod('CASH');
      setAmount(null);
      setReferenceNumber('');
      setNotes('');
      const n = new Date();
      n.setMinutes(n.getMinutes() - n.getTimezoneOffset());
      setPaidAt(n.toISOString().slice(0, 16));
    }
  }, [open, defaultType, defaultStage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      alert('Nominal pembayaran harus diisi');
      return;
    }

    onSubmit({
      bookingId,
      customerId,
      type,
      method,
      status: 'VERIFIED',
      stage,
      amount: Number(amount),
      referenceNumber: referenceNumber || undefined,
      paidAt: new Date(paidAt).toISOString(),
      notes: notes || undefined,
      staffId: 'usr-budi',
      staffName: 'Budi Beni',
    });
  };

  const typeOptions = Object.entries(PAYMENT_TYPE_LABEL)
    .filter(([value]) => {
      if (stage === 'BOOKING') return ['BOOKING_FEE', 'DOWN_PAYMENT', 'RENTAL_PAYMENT'].includes(value);
      if (stage === 'HANDOVER') {
        return hasPayments 
          ? ['RENTAL_PAYMENT', 'DEPOSIT'].includes(value)
          : ['BOOKING_FEE', 'DOWN_PAYMENT', 'RENTAL_PAYMENT', 'DEPOSIT'].includes(value);
      }
      if (stage === 'CONTRACT') {
        return hasPayments 
          ? ['RENTAL_PAYMENT', 'ADDITIONAL_FEE'].includes(value)
          : ['BOOKING_FEE', 'DOWN_PAYMENT', 'RENTAL_PAYMENT', 'ADDITIONAL_FEE', 'DEPOSIT'].includes(value);
      }
      if (stage === 'RETURN') return ['RENTAL_PAYMENT', 'ADDITIONAL_FEE', 'REFUND'].includes(value);
      return true;
    })
    .map(([value, label]) => ({ value, label }));
  const methodOptions = Object.entries(PAYMENT_METHOD_LABEL).map(([value, label]) => ({ value, label }));
  const stageOptions = Object.entries(PAYMENT_STAGE_LABEL).map(([value, label]) => ({ value, label }));

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      cancelText="Batal"
      saveText={isSubmitting ? 'Menyimpan...' : 'Simpan Pembayaran'}
      saveProps={{ disabled: isSubmitting }}
      cancelProps={{ disabled: isSubmitting }}
      isSubmitting={isSubmitting}
    >
      <FormCard
        title="Detail Pembayaran"
        description="Isi detail transaksi pembayaran yang akan dicatat."
        icon={<CreditCard className="w-4 h-4" />}
        iconWrapperClassName="text-primary"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputSelect
            id="payment-type"
            label="Jenis Pembayaran"
            value={type}
            onChange={(v) => setType(v as PaymentType)}
            options={typeOptions}
            required
          />
          <InputSelect
            id="payment-stage"
            label="Tahap"
            value={stage}
            onChange={(v) => setStage(v as PaymentStage)}
            options={stageOptions}
            required
            disabled
          />
          <InputSelect
            id="payment-method"
            label="Metode Pembayaran"
            value={method}
            onChange={(v) => setMethod(v as PaymentMethod)}
            options={methodOptions}
            required
          />
          <InputNumber
            id="payment-amount"
            label="Nominal (Rp)"
            value={amount}
            onChange={(v) => setAmount(v)}
            placeholder="Contoh: 500000"
            min={1}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-foreground">Tanggal & Waktu Pembayaran</label>
            <input
              type="datetime-local"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-[38px]"
              required
            />
          </div>
          <InputString
            id="payment-ref"
            label="No. Bukti / Referensi (Opsional)"
            value={referenceNumber}
            onChange={setReferenceNumber}
            placeholder="Cth: TRF-20261004-001"
          />
        </div>
        <div className="mt-4">
          <InputTextarea
            id="payment-notes"
            label="Catatan (Opsional)"
            value={notes}
            onChange={setNotes}
            placeholder="Keterangan tambahan..."
            rows={2}
          />
        </div>
      </FormCard>
    </FormShell>
  );
}
