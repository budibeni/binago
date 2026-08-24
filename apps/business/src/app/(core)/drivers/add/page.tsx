'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '../../../../i18n';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';
import { DriverForm } from '../../../../features/core/drivers/components/DriverForm';


export default function AddDriverPage() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const tAdd = t.drivers.addPage;

  const handleCancel = () => {
    router.push('/drivers');
  };

  const handleSubmit = (data: any) => {
    console.log('Submitted driver data:', data);
    // Here we would normally make an API request to save the data
    alert("Data pengemudi berhasil disimpan");
    router.push('/drivers');
  };

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col">
      <DriverForm
        labels={tAdd}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
