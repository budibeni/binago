'use client';

import React from 'react';
import { Car } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { mockVehicles } from '../../tracking/data/mockTrackingData';
import { cn } from '@binago/utils';

export function VehiclesSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.vehicles;

  return (
    <div className="flex flex-col gap-4">
      {mockVehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-surface border border-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-500 shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{vehicle.name}</h3>
              <p className="text-sm text-foreground-muted mt-0.5">{vehicle.plateNumber}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4 md:ml-auto md:items-center">
            <div className="flex flex-col bg-surface-elevated px-3 py-2 rounded-lg">
              <span className="text-xs text-foreground-muted">{s.type}</span>
              <span className="text-sm font-semibold text-foreground mt-0.5">{vehicle.type}</span>
            </div>
            <div className="flex flex-col bg-surface-elevated px-3 py-2 rounded-lg">
              <span className="text-xs text-foreground-muted">{s.status}</span>
              <span className={cn(
                "text-sm font-semibold mt-0.5 capitalize",
                vehicle.status === 'driving' ? "text-green-600" :
                vehicle.status === 'parking' ? "text-blue-600" :
                vehicle.status === 'idle' ? "text-yellow-600" : "text-foreground-muted"
              )}>
                {vehicle.status === 'driving' ? t.tracking?.statusDriving :
                 vehicle.status === 'parking' ? t.tracking?.statusParking :
                 vehicle.status === 'idle' ? t.tracking?.statusIdle :
                 t.tracking?.statusOffline}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
