import {
  Map,
  Truck,
  UserRound,
  Route,
  Package,
  Bell,
  MapPinned,
  Wrench,
  ClipboardCheck,
  FileText,
  ShieldAlert,
  MonitorCog,
} from 'lucide-react';
import React from 'react';

export type IconColor = {
  bg: string;
  text: string;
};

// We don't import getTranslation here to avoid circular dependency or passing locale statically,
// but we just define the key so the component can resolve it.
export interface ShortcutDef {
  id: string;
  href: string;
  icon: React.ElementType;
  color: IconColor;
  translationKey: 'tracking' | 'vehicles' | 'drivers' | 'trips' | 'deliveries' | 'alerts' | 'geofences' | 'maintenance' | 'tasks' | 'reports' | 'incidents' | 'gpsDevices';
}

export const BUSINESS_SHORTCUTS: ShortcutDef[] = [
  { id: 'tracking',    href: '/tracking',     icon: Map,           color: { bg: 'bg-red-50',     text: 'text-red-500' },    translationKey: 'tracking' },
  { id: 'vehicles',   href: '/vehicles',     icon: Truck,          color: { bg: 'bg-emerald-50', text: 'text-emerald-600' }, translationKey: 'vehicles' },
  { id: 'drivers',    href: '/drivers',      icon: UserRound,      color: { bg: 'bg-orange-50',  text: 'text-orange-500' }, translationKey: 'drivers' },
  { id: 'trips',      href: '/trips',        icon: Route,          color: { bg: 'bg-blue-50',    text: 'text-blue-500' },   translationKey: 'trips' },
  { id: 'deliveries', href: '/deliveries',   icon: Package,        color: { bg: 'bg-indigo-50',  text: 'text-indigo-500' }, translationKey: 'deliveries' },
  { id: 'alerts',     href: '/alerts',       icon: Bell,           color: { bg: 'bg-amber-50',   text: 'text-amber-500' },  translationKey: 'alerts' },
  { id: 'geofences',  href: '/geofences',    icon: MapPinned,      color: { bg: 'bg-teal-50',    text: 'text-teal-500' },   translationKey: 'geofences' },
  { id: 'maintenance',href: '/maintenance',  icon: Wrench,         color: { bg: 'bg-rose-50',    text: 'text-rose-500' },   translationKey: 'maintenance' },
  { id: 'tasks',      href: '/tasks',        icon: ClipboardCheck, color: { bg: 'bg-violet-50',  text: 'text-violet-500' }, translationKey: 'tasks' },
  { id: 'reports',    href: '/reports',      icon: FileText,       color: { bg: 'bg-sky-50',     text: 'text-sky-600' },    translationKey: 'reports' },
  { id: 'incidents',  href: '/incidents',    icon: ShieldAlert,    color: { bg: 'bg-red-50',     text: 'text-red-600' },    translationKey: 'incidents' },
  { id: 'gpsDevices', href: '/gps-devices',  icon: MonitorCog,     color: { bg: 'bg-neutral-100',text: 'text-neutral-500' }, translationKey: 'gpsDevices' },
];
