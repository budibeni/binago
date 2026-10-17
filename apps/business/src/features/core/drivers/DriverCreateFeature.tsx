'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { driverService } from '@/data/services';
import { DriverForm } from './components/DriverForm';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { toast } from '@adatrack/ui';
import type { Driver } from './types/driver';

export function DriverCreateFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();

  const handleCancel = () => {
    router.push('/drivers');
  };

  const handleSave = (data: Partial<Driver>) => {
    driverService.createDriver(data);
    toast.success(
      locale === 'en'
        ? 'Driver registered successfully'
        : 'Data pengemudi berhasil ditambahkan',
    );
    router.push('/drivers');
  };

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col">
      <DriverForm
        driver={null}
        open={true}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleCancel();
        }}
        layout="default"
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
