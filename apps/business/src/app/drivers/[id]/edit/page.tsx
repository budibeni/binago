'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getTranslation } from '../../../../i18n';
import { useBusinessLocale } from '../../../../components/BusinessShellLayout';
import { DriverForm } from '../../../../features/drivers/components/DriverForm';
import { mockDrivers } from '../../../../features/drivers/data/mockDrivers';

export default function EditDriverPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  
  const id = params.id as string;
  const driver = mockDrivers.find(d => d.id === id);

  const tEdit = t.drivers.editPage;

  const handleCancel = () => {
    router.push('/drivers');
  };

  const handleSubmit = (data: any) => {
    console.log('Update driver:', { id, ...data });
    // TODO: Connect to actual API
    router.push('/drivers');
  };

  if (!driver) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50/80 dark:bg-neutral-900/40 text-foreground-subtle">
        Pengemudi tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col">
      <DriverForm 
        labels={tEdit} 
        initialData={driver}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
