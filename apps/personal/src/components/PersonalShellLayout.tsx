'use client';

import React from 'react';
import {
  Map,
  Cpu,
  MapPin,
  BarChart2,
  Settings,
} from 'lucide-react';
import { AppShell } from '@binago/ui';
import type { NavGroup, UserInfo, Locale } from '@binago/types';
import { getTranslation } from '../i18n';

const DUMMY_USER: UserInfo = {
  name: 'Budi Beni',
  email: 'budi.beni@gmail.com',
  role: 'Pengguna Personal',
  initials: 'BB',
};

function buildNavigation(locale: Locale): NavGroup[] {
  const t = getTranslation(locale);
  return [
    {
      id: 'main',
      title: t.navGroup.main,
      items: [
        { id: 'tracking', label: t.nav.tracking, href: '/tracking', icon: Map },
        { id: 'devices', label: t.nav.devices, href: '/devices', icon: Cpu },
        { id: 'geofences', label: t.nav.geofences, href: '/geofences', icon: MapPin },
        { id: 'reports', label: t.nav.reports, href: '/reports', icon: BarChart2 },
      ],
    },
    {
      id: 'system',
      title: t.navGroup.system,
      items: [
        { id: 'settings', label: t.nav.settings, href: '/settings', icon: Settings },
      ],
    },
  ];
}

export const PersonalLocaleContext = React.createContext<Locale>('id');

export function usePersonalLocale() {
  return React.useContext(PersonalLocaleContext);
}

export function PersonalShellLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>('id');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [currentPath] = React.useState('/');

  const t = getTranslation(locale);
  const navigation = buildNavigation(locale);

  const breadcrumbItems = [{ label: 'Beranda' }];

  return (
    <AppShell
      brandName="BINAGO Personal"
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
      <PersonalLocaleContext.Provider value={locale}>
        {children}
      </PersonalLocaleContext.Provider>
    </AppShell>
  );
}
