'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { vehicleService } from '@/data/services';
import { VehicleForm } from './components/VehicleForm';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { toast } from '@adatrack/ui';
import type { Vehicle } from './types/vehicle';

export function VehicleCreateFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();

  const handleCancel = () => {
    router.push('/vehicles');
  };

  const handleSave = (data: Partial<Vehicle>) => {
    vehicleService.createVehicle(data);
    toast.success(
      locale === 'en'
        ? 'Vehicle registered successfully'
        : 'Kendaraan berhasil didaftarkan'
    );
    router.push('/vehicles');
  };

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col">
      <VehicleForm
        vehicle={null}
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
