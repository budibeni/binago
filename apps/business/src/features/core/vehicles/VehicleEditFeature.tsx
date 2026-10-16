'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { vehicleService } from '@/data/services';
import { VehicleForm } from './components/VehicleForm';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { toast } from '@adatrack/ui';
import type { Vehicle } from './types/vehicle';

export function VehicleEditFeature({ id }: { id: string }) {
  const router = useRouter();
  const locale = useBusinessLocale();

  const vehicle = React.useMemo(() => vehicleService.getVehicleById(id), [id]);

  const handleCancel = () => {
    router.push('/vehicles');
  };

  const handleSave = (data: Partial<Vehicle>) => {
    vehicleService.updateVehicle(id, data);
    toast.success(locale === 'en' ? 'Vehicle data updated successfully' : 'Data kendaraan berhasil diperbarui');
    router.push('/vehicles');
  };

  if (!vehicle) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50/80 dark:bg-neutral-900/40 text-muted-foreground">
        {locale === 'en' ? 'Vehicle not found.' : 'Kendaraan tidak ditemukan.'}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col">
      <VehicleForm
        vehicle={vehicle}
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
