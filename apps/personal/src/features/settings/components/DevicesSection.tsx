'use client';

import React from 'react';
import { Smartphone } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { mockDevices } from '../data/mockSettingsData';
import { cn } from '@adatrack/utils';
import { Switch, Separator } from '@adatrack/ui';

export function DevicesSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.devices;

  return (
    <div className="flex flex-col gap-3">
      {mockDevices.map((device) => (
        <div key={device.id} className="bg-surface border border-border rounded-xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors hover:border-neutral-300">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-500 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground leading-none">{device.name}</h3>
                <div className={cn("w-2 h-2 rounded-full", device.status === 'online' ? "bg-green-500" : "bg-neutral-300")} />
              </div>
              <p className="text-xs text-foreground-muted mt-1.5">{device.id} &bull; {device.vehicleName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto mt-1 md:mt-0 justify-between md:justify-end">
            <div className="text-left md:text-right">
              <p className="text-[11px] font-medium text-foreground-muted uppercase tracking-wider">{s.lastUpdate}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {new Date(device.lastUpdate).toLocaleTimeString(locale === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            
            <Separator orientation="vertical" className="h-8 hidden md:block mx-1" />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider w-6 text-right">
                  {device.status === 'online' ? 'ON' : 'OFF'}
                </span>
                <Switch 
                  defaultChecked={device.status === 'online'} 
                  className="data-[state=checked]:!bg-green-500 data-[state=unchecked]:!bg-red-500" 
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
