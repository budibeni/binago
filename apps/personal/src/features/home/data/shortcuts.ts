import {
  Map,
  Car,
  MapPinned,
  MonitorCog,
  FileText,
  Settings,
} from 'lucide-react';
import React from 'react';

export type IconColor = {
  bg: string;
  text: string;
};

export interface ShortcutDef {
  id: string;
  href: string;
  icon: React.ElementType;
  color: IconColor;
  translationKey: 'tracking' | 'vehicles' | 'geofences' | 'gpsDevices' | 'reports' | 'settings';
}

export const PERSONAL_SHORTCUTS: ShortcutDef[] = [
  { id: 'tracking',   href: '/tracking',   icon: Map,       color: { bg: 'bg-red-50',     text: 'text-red-500' },     translationKey: 'tracking' },
  { id: 'vehicles',  href: '/vehicles',   icon: Car,       color: { bg: 'bg-emerald-50', text: 'text-emerald-600' }, translationKey: 'vehicles' },
  { id: 'geofences', href: '/geofences',  icon: MapPinned, color: { bg: 'bg-teal-50',    text: 'text-teal-500' },    translationKey: 'geofences' },
  { id: 'gpsDevices',href: '/gps-devices',icon: MonitorCog,color: { bg: 'bg-neutral-100',text: 'text-neutral-500' }, translationKey: 'gpsDevices' },
  { id: 'reports',   href: '/reports',    icon: FileText,  color: { bg: 'bg-sky-50',     text: 'text-sky-600' },    translationKey: 'reports' },
  { id: 'settings',  href: '/settings',   icon: Settings,  color: { bg: 'bg-violet-50',  text: 'text-violet-500' }, translationKey: 'settings' },
];
