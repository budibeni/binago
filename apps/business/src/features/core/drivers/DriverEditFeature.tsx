'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { driverService } from '@/data/services';
import { DriverForm } from './components/DriverForm';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { toast } from '@adatrack/ui';
import type { Driver } from './types/driver';

export function DriverEditFeature({ id }: { id: string }) {
  const router = useRouter();
  const locale = useBusinessLocale();

  const driver = React.useMemo(() => driverService.getDriverById(id), [id]);

  const handleCancel = () => {
    router.push('/drivers');
  };

  const handleSave = (data: Partial<Driver>) => {
    driverService.updateDriver(id, data);
    toast.success(
      locale === 'en'
        ? 'Driver data updated successfully'
        : 'Data pengemudi berhasil diperbarui',
    );
    router.push('/drivers');
  };

  if (!driver) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50/80 dark:bg-neutral-900/40 text-muted-foreground">
        {locale === 'en' ? 'Driver not found.' : 'Pengemudi tidak ditemukan.'}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col">
      <DriverForm
        driver={driver}
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
