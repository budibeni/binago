'use client';

import React from 'react';
import { 
  Car, 
  Smartphone, 
  Bell, 
  ShieldAlert, 
  User, 
  HelpCircle, 
  Info, 
  ChevronRight 
} from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { cn } from '@adatrack/utils';

export type SettingsSection = 
  | 'overview' 
  | 'vehicles' 
  | 'devices' 
  | 'notifications' 
  | 'geofences' 
  | 'account' 
  | 'help' 
  | 'about';

interface SettingsMenuProps {
  onSelect: (section: SettingsSection) => void;
}

export function SettingsMenu({ onSelect }: SettingsMenuProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const s = t.settings.menus;

  const menuItems = [
    {
      id: 'vehicles' as const,
      title: s.vehicles.title,
      description: s.vehicles.desc,
      icon: Car,
      iconBg: 'bg-red-50 text-red-500',
    },
    {
      id: 'devices' as const,
      title: s.devices.title,
      description: s.devices.desc,
      icon: Smartphone,
      iconBg: 'bg-blue-50 text-blue-500',
    },
    {
      id: 'notifications' as const,
      title: s.notifications.title,
      description: s.notifications.desc,
      icon: Bell,
      iconBg: 'bg-yellow-50 text-yellow-500',
    },
    {
      id: 'geofences' as const,
      title: s.geofences.title,
      description: s.geofences.desc,
      icon: ShieldAlert,
      iconBg: 'bg-green-50 text-green-500',
    },
    {
      id: 'account' as const,
      title: s.account.title,
      description: s.account.desc,
      icon: User,
      iconBg: 'bg-purple-50 text-purple-500',
    },
    {
      id: 'help' as const,
      title: s.help.title,
      description: s.help.desc,
      icon: HelpCircle,
      iconBg: 'bg-orange-50 text-orange-500',
    },
    {
      id: 'about' as const,
      title: s.about.title,
      description: s.about.desc,
      icon: Info,
      iconBg: 'bg-surface-elevated text-foreground-muted',
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 text-left hover:bg-surface-elevated transition-colors w-full"
        >
          <div className={cn("flex items-center justify-center w-12 h-12 rounded-xl shrink-0", item.iconBg)}>
            <item.icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">
              {item.title}
            </h3>
            <p className="text-sm text-foreground-muted truncate mt-0.5">
              {item.description}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-foreground-subtle shrink-0" />
        </button>
      ))}
    </div>
  );
}
