'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getTranslation } from '../../../../../i18n';
import { useBusinessLocale } from '../../../../../components/BusinessShellLayout';
import { DriverForm } from '../../../../../features/core/drivers/components/DriverForm';
import { api } from '@adatrack/utils';
import type { Driver } from '@/features/core/drivers/types/driver';

export default function EditDriverPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  
  const id = params.id as string;
  const [driver, setDriver] = React.useState<Driver | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    api.get(`/drivers/${id}`)
      .then((res: any) => {
        if (isMounted) {
          const d = res.data || res;
          setDriver({
            id: String(d.id),
            name: d.name || '-',
            phone: d.phone || '-',
            email: d.email || '-',
            address: '-',
            ktpNumber: '-',
            placeOfBirth: '-',
            dateOfBirth: new Date().toISOString(),
            joinDate: new Date().toISOString(),
            placement: '-',
            licenseNumber: d.license_number || '-',
            licenseExpiry: d.license_expiry || new Date().toISOString(),
            status: 'active',
            performanceScore: 100,
            history: [],
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [id]);

  // Removed tEdit

  const handleCancel = () => {
    router.push('/drivers');
  };

  const handleSubmit = async (data: any) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        license_number: data.licenseNumber,
        license_type: 'SIM B1',
      };
      await api.put(`/drivers/${id}`, payload);
      router.push('/drivers');
    } catch (err) {
      console.error('Failed to update driver', err);
      alert('Failed to update driver');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50/80 dark:bg-neutral-900/40 text-foreground-subtle">
        Memuat data pengemudi...
      </div>
    );
  }

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
        driver={driver}
        open={true}
        onOpenChange={() => {}}
        layout="fullscreen"
        onCancel={handleCancel}
        onSave={handleSubmit}
      />
    </div>
  );
}
