'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { mockGeofences } from '../data/mockSettingsData';
import { cn } from '@binago/utils';

export function GeofenceSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.geofences;

  return (
    <div className="flex flex-col gap-4">
      {mockGeofences.map((geo) => (
        <div key={geo.id} className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 text-green-500 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">{geo.name}</h3>
              <p className="text-sm text-neutral-500 mt-0.5">{s.radius}: {geo.radius}m</p>
            </div>
          </div>
          
          <div className="flex gap-4 md:ml-auto md:items-center mt-2 md:mt-0">
            {/* Simple toggle switch representation */}
            <div className="flex items-center gap-3">
              <span className={cn(
                "text-sm font-semibold",
                geo.status === 'active' ? "text-green-600" : "text-neutral-500"
              )}>
                {geo.status === 'active' ? s.active : s.inactive}
              </span>
              <button
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative cursor-default",
                  geo.status === 'active' ? "bg-red-500" : "bg-neutral-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  geo.status === 'active' ? "left-6" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
