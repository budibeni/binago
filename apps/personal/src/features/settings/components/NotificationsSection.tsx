'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { cn } from '@binago/utils';

interface NotificationSetting {
  id: string;
  labelKey: keyof ReturnType<typeof getTranslation>['settings']['notifications'];
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { id: 'movement', labelKey: 'movement' },
  { id: 'stop', labelKey: 'stop' },
  { id: 'offline', labelKey: 'offline' },
  { id: 'enterGeofence', labelKey: 'enterGeofence' },
  { id: 'exitGeofence', labelKey: 'exitGeofence' },
];

export function NotificationsSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.notifications;

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    movement: true,
    stop: false,
    offline: true,
    enterGeofence: true,
    exitGeofence: true,
  });

  const toggle = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-4 md:p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-50 text-yellow-500 shrink-0">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900">{s.title}</h3>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {NOTIFICATION_SETTINGS.map(({ id, labelKey }) => (
          <div key={id} className="flex items-center justify-between border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
            <span className="text-sm font-medium text-neutral-900">{s[labelKey as keyof typeof s]}</span>
            
            {/* Simple toggle switch */}
            <button
              onClick={() => toggle(id)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                toggles[id] ? "bg-red-500" : "bg-neutral-200"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                toggles[id] ? "left-6" : "left-1"
              )} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
