'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';
import { RentalVehicleForm } from './components/RentalVehicleForm';
import type { RentalVehicle } from './types/rentalVehicle';

interface EditRentalVehicleFeatureProps {
  id: string;
}

export function EditRentalVehicleFeature({ id }: EditRentalVehicleFeatureProps) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const labels = t.rentalVehicles;

  const [vehicle, setVehicle] = React.useState<RentalVehicle | null>(null);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    try {
      const data = rentalVehicleService.getRentalVehicleById(id);
      if (data) {
        setVehicle(data);
      } else {
        setError('Kendaraan tidak ditemukan');
      }
    } catch (e: any) {
      setError(e.message || 'Gagal memuat data kendaraan');
    }
  }, [id]);

  const handleCancel = () => {
    router.push('/rental/vehicles');
  };

  const handleSave = (data: any) => {
    try {
      rentalVehicleService.updateRentalVehicle(id, data);
      alert('Data rental berhasil diperbarui');
      router.push('/rental/vehicles');
    } catch (e: any) {
      alert(`Gagal menyimpan: ${e.message}`);
    }
  };

  if (error) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center bg-neutral-50/80 dark:bg-neutral-900/40">
        <p className="text-danger font-semibold">{error}</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center bg-neutral-50/80 dark:bg-neutral-900/40">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full bg-neutral-50/80 dark:bg-neutral-900/40 overflow-y-auto relative flex flex-col">
      <RentalVehicleForm
        title={labels.actionEdit || "Edit Data Rental"}
        labels={labels}
        initialData={vehicle}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
