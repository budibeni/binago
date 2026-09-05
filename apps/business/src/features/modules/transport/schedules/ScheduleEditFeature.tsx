'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScheduleForm } from './components/ScheduleForm';
import { operationalScheduleService } from '@/data/modules/transport/services/scheduleService';
import { routeService, vehicleService } from '@/data/services';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@adatrack/ui';
import type { Route } from '@/features/core/routes/types';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';
import type { OperationalSchedule } from './types/schedule';

export function ScheduleEditFeature({ id }: { id: string }) {
  const router = useRouter();
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [schedule, setSchedule] = useState<OperationalSchedule | null>(null);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAvailableRoutes(routeService.getRoutes());
    setAvailableVehicles(vehicleService.getVehicles());
    
    // Load schedule
    try {
      const data = operationalScheduleService.getScheduleById(id);
      if (data) {
        setSchedule(data);
      } else {
        setFormError('Jadwal tidak ditemukan');
      }
    } catch (err: any) {
      setFormError('Gagal memuat jadwal');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleSave = (data: any) => {
    try {
      operationalScheduleService.updateSchedule(id, data);
      router.push('/transport/schedules');
      router.refresh();
    } catch (e: any) {
      setFormError(e.message || 'Terjadi kesalahan saat menyimpan jadwal');
    }
  };

  const handleCancel = () => {
    router.push('/transport/schedules');
  };

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-500">Memuat data...</div>;
  }

  if (!schedule) {
    return (
      <div className="p-8 text-center text-red-500 flex flex-col items-center gap-4">
        {formError}
        <Button variant="outline" onClick={handleCancel}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-surface">
      <div className="flex-1 flex flex-col min-h-0 w-full bg-[#fafafa] dark:bg-neutral-950/50">
        <ScheduleForm
          initialData={schedule}
          availableRoutes={availableRoutes}
          availableVehicles={availableVehicles}
          onCancel={handleCancel}
          onSave={handleSave}
          error={formError}
        />
      </div>
    </div>
  );
}
