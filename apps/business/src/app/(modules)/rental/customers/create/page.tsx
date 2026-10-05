'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/features/modules/rental/customers/components/CustomerForm';
import { rentalCustomerService } from '@/data/modules/rental';

export default function CreateCustomerPage() {
  const router = useRouter();

  return (
    <CustomerForm
      layout="default"
      open={true}
      customer={null}
      onCancel={() => {
        router.push('/rental/customers');
      }}
      onSave={(data) => {
        // TODO: dispatch save logic
        router.push('/rental/customers');
      }}
    />
  );
}
