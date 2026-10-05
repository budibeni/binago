import React from 'react';
import { AllPaymentsFeature } from '@/features/modules/rental/payments/AllPaymentsFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pembayaran Rental | ADATRACK',
};

export default function PaymentsPage() {
  return <AllPaymentsFeature />;
}
