'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2 } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { Switch } from '@adatrack/ui';
import { useNotifications } from '../../notifications/context/NotificationContext';

interface NotificationSetting {
  id: string;
  labelKey: keyof ReturnType<typeof getTranslation>['settings']['notifications'];
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { id: 'movement', labelKey: 'movement' },
  { id: 'stop', labelKey: 'stop' },
  { id: 'offline', labelKey: 'offline' },
  { id: 'deviceUnplugged', labelKey: 'deviceUnplugged' },
  { id: 'enterGeofence', labelKey: 'enterGeofence' },
  { id: 'exitGeofence', labelKey: 'exitGeofence' },
];

export function NotificationsSection() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.notifications;
  const { settings, updateSettings } = useNotifications();

  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!showFeedback) return;
    const timer = setTimeout(() => setShowFeedback(false), 2500);
    return () => clearTimeout(timer);
  }, [showFeedback]);

  const handleToggle = (id: string, checked: boolean) => {
    updateSettings({ [id]: checked });
    setShowFeedback(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Inline Feedback */}
      {showFeedback && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400 text-sm font-medium"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          {s.savedSuccess}
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl p-4 md:p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 text-yellow-500 shrink-0">
            <Bell className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{s.title}</h3>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {NOTIFICATION_SETTINGS.map(({ id, labelKey }) => (
            <div key={id} className="flex items-center justify-between border-b border-border last:border-0 pb-4 last:pb-0">
              <label htmlFor={`notif-${id}`} className="text-sm font-medium text-foreground cursor-pointer">
                {s[labelKey as keyof typeof s] as string}
              </label>
              
              <Switch
                id={`notif-${id}`}
                checked={settings[id as keyof typeof settings] || false}
                onCheckedChange={(checked) => handleToggle(id, checked)}
                aria-label={s[labelKey as keyof typeof s] as string}
                className="data-[state=checked]:!bg-yellow-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
