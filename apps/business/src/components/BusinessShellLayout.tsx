'use client';

import React from 'react';
import {
  Map,
  Truck,
  Users,
  Package,
  Wrench,
  Cpu,
  MapPin,
  BarChart2,
  Settings,
} from 'lucide-react';
import { AppShell } from '@binago/ui';
import type { NavGroup, UserInfo, Locale } from '@binago/types';
import { getTranslation } from '../i18n';

const DUMMY_USER: UserInfo = {
  name: 'Budi Santoso',
  email: 'budi.santoso@binago.id',
  role: 'Administrator',
  initials: 'BS',
};

function buildNavigation(locale: Locale): NavGroup[] {
  const t = getTranslation(locale);
  return [
    {
      id: 'main',
      title: t.navGroup.main,
      items: [
        { id: 'tracking', label: t.nav.tracking, href: '/tracking', icon: Map },
      ],
    },
    {
      id: 'fleet',
      title: t.navGroup.fleet,
      items: [
        { id: 'vehicles', label: t.nav.vehicles, href: '/vehicles', icon: Truck },
        { id: 'drivers', label: t.nav.drivers, href: '/drivers', icon: Users },
        { id: 'deliveries', label: t.nav.deliveries, href: '/deliveries', icon: Package },
        { id: 'maintenance', label: t.nav.maintenance, href: '/maintenance', icon: Wrench },
      ],
    },
    {
      id: 'system',
      title: t.navGroup.system,
      items: [
        { id: 'devices', label: t.nav.devices, href: '/devices', icon: Cpu },
        { id: 'geofences', label: t.nav.geofences, href: '/geofences', icon: MapPin },
        { id: 'reports', label: t.nav.reports, href: '/reports', icon: BarChart2 },
        { id: 'administration', label: t.nav.administration, href: '/administration', icon: Settings },
      ],
    },
  ];
}

export const BusinessLocaleContext = React.createContext<Locale>('id');

export function useBusinessLocale() {
  return React.useContext(BusinessLocaleContext);
}

export function BusinessShellLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>('id');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [currentPath] = React.useState('/');

  const t = getTranslation(locale);
  const navigation = buildNavigation(locale);

  // In a real app, breadcrumbs would be dynamic based on currentPath.
  // For now, we pass a static breadcrumb or let the page define it. 
  // AppShell currently requires breadcrumbItems prop.
  // Let's provide a basic one.
  const breadcrumbItems = [{ label: 'Beranda' }];

  return (
    <AppShell
      brandName="BINAGO Business"
      navigation={navigation}
      currentPath={currentPath}
      breadcrumbItems={breadcrumbItems}
      user={DUMMY_USER}
      currentLocale={locale}
      onLocaleChange={setLocale}
      currentTheme={theme}
      onThemeChange={setTheme}
      userMenuLabels={t.userMenu}
    >
      <BusinessLocaleContext.Provider value={locale}>
        {children}
      </BusinessLocaleContext.Provider>
    </AppShell>
  );
}
