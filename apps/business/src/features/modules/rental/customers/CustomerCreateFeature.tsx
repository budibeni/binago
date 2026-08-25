'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { CustomerForm } from './components/CustomerForm';

export function CustomerCreateFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = t.rentalCustomers;

  const handleSave = (data: any) => {
    // Implement API call to save customer here
    console.log('Saved new customer:', data);
    alert(labels.createSuccess || 'Pelanggan berhasil ditambahkan');
    router.push('/rental/customers');
    router.refresh();
  };

  const handleCancel = () => {
    router.push('/rental/customers');
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-neutral-50/30 dark:bg-neutral-950">
      <CustomerForm
        customer={null}
        onCancel={handleCancel}
        onSave={handleSave}
        labels={labels}
      />
    </div>
  );
}
