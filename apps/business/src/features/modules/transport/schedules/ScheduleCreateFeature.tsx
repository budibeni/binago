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

export function ScheduleCreateFeature() {
  const router = useRouter();
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setAvailableRoutes(routeService.getRoutes());
    setAvailableVehicles(vehicleService.getVehicles());
  }, []);

  const handleSave = (data: any) => {
    try {
      operationalScheduleService.createSchedule(data);
      router.push('/transport/schedules');
      router.refresh();
    } catch (e: any) {
      setFormError(e.message || 'Terjadi kesalahan saat menyimpan jadwal');
    }
  };

  const handleCancel = () => {
    router.push('/transport/schedules');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-surface">
      <div className="flex-1 flex flex-col min-h-0 w-full bg-[#fafafa] dark:bg-neutral-950/50">
        <ScheduleForm
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
