'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getRentalVehiclesTranslation } from './i18n';
import { RentalVehicleForm } from './components/RentalVehicleForm';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';
import { pricingService } from '@/data/modules/rental/services/pricingService';
import type { RentalVehicleFormValues } from './types/rentalVehicle';
import { toast } from '@adatrack/ui';

export function RentalVehicleEditFeature({ id }: { id: string }) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const labels = getRentalVehiclesTranslation(locale);

  const vehicle = rentalVehicleService.getRentalVehicles().find(v => v.id === id);
  const pricingCategorys = pricingService.getPricingCategory({ status: 'ACTIVE' });
  const pricingRates = pricingCategorys.flatMap(c => pricingService.getRatesByGroupId(c.id));

  const handleSave = (formData: RentalVehicleFormValues) => {
    try {
      const payload = {
        ...formData,
        condition: formData.condition === null ? undefined : formData.condition
      };
      rentalVehicleService.updateRentalVehicle(id, payload as any);
      toast.success(labels.updateSuccess || 'Data berhasil diperbarui');
      router.push('/rental/vehicles');
      router.refresh();
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  };

  const handleCancel = (open: boolean) => {
    if (!open) {
      router.push('/rental/vehicles');
    }
  };

  if (!vehicle) return <div className="p-4 text-center text-muted-foreground">Kendaraan tidak ditemukan</div>;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-neutral-50/30 dark:bg-neutral-950">
      <RentalVehicleForm
        open={true}
        onOpenChange={handleCancel}
        onSave={handleSave}
        onCancel={() => handleCancel(false)}
        initialData={vehicle}
        availablePricingCategory={pricingCategorys}
        availableRates={pricingRates}
        title={labels.actionEdit || 'Edit Data Rental'}
        layout="default"
        labels={labels as any}
      />
    </div>
  );
}
