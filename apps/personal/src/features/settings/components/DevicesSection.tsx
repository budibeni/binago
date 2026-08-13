'use client';

import React from 'react';
import { Smartphone } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { mockDevices } from '../data/mockSettingsData';
import { cn } from '@binago/utils';

export function DevicesSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.devices;

  return (
    <div className="flex flex-col gap-4">
      {mockDevices.map((device) => (
        <div key={device.id} className="bg-surface border border-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-500 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{device.name}</h3>
              <p className="text-sm text-foreground-muted mt-0.5">{device.id}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4 md:ml-auto md:items-center">
            <div className="flex flex-col bg-surface-elevated px-3 py-2 rounded-lg">
              <span className="text-xs text-foreground-muted">{s.vehicle}</span>
              <span className="text-sm font-semibold text-foreground mt-0.5">{device.vehicleName}</span>
            </div>
            <div className="flex flex-col bg-surface-elevated px-3 py-2 rounded-lg">
              <span className="text-xs text-foreground-muted">{s.status}</span>
              <span className={cn(
                "text-sm font-semibold mt-0.5",
                device.status === 'online' ? "text-green-600" : "text-foreground-muted"
              )}>
                {device.status === 'online' ? s.statusOnline : s.statusOffline}
              </span>
            </div>
            <div className="flex flex-col bg-surface-elevated px-3 py-2 rounded-lg">
              <span className="text-xs text-foreground-muted">{s.lastUpdate}</span>
              <span className="text-sm font-semibold text-foreground mt-0.5">
                {new Date(device.lastUpdate).toLocaleTimeString(locale === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
