'use client';

import React from 'react';
import {
  Home,
  Map,
  Car,
  MonitorCog,
  MapPinned,
  FileText,
  Settings,
  CircleHelp,
} from 'lucide-react';
import { AppShell } from '@binago/ui';
import type { NavGroup, NavItem, UserInfo, Locale } from '@binago/types';
import { getTranslation } from '../i18n';

const DUMMY_USER: UserInfo = {
  name: 'Andi Pratama',
  email: 'andi.pratama@gmail.com',
  role: 'Pengguna Personal',
  initials: 'AP',
};

function buildNavigation(locale: Locale): NavGroup[] {
  const t = getTranslation(locale);
  return [
    {
      id: 'main',
      title: t.navGroup.main,
      items: [
        { id: 'home', label: t.nav.home, href: '/', icon: Home },
      ],
    },
    {
      id: 'operational',
      title: t.navGroup.operational,
      items: [
        { id: 'tracking', label: t.nav.tracking, href: '/tracking', icon: Map },
        { id: 'vehicles', label: t.nav.vehicles, href: '/vehicles', icon: Car },
        { id: 'geofences', label: t.nav.geofences, href: '/geofences', icon: MapPinned },
      ],
    },
    {
      id: 'system',
      title: t.navGroup.system,
      items: [
        { id: 'gpsDevices', label: t.nav.gpsDevices, href: '/gps-devices', icon: MonitorCog },
      ],
    },
    {
      id: 'analysis',
      title: t.navGroup.analysis,
      items: [
        { id: 'reports', label: t.nav.reports, href: '/reports', icon: FileText },
      ],
    },
    {
      id: 'settings',
      title: t.navGroup.settings,
      items: [
        { id: 'settings', label: t.nav.settings, href: '/settings', icon: Settings },
      ],
    },
  ];
}

function buildBottomNavigation(locale: Locale): NavItem[] {
  const t = getTranslation(locale);
  return [
    { id: 'help', label: t.nav.helpCenter, href: '/help', icon: CircleHelp },
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

  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('binago.theme') as 'light' | 'dark';
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, []);

  const handleThemeChange = React.useCallback((newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('binago.theme', newTheme);
      if (newTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, []);

  const t = getTranslation(locale);
  const navigation = buildNavigation(locale);

  const breadcrumbItems = [{ label: t.nav.home }];

  return (
    <AppShell
      brandName="BINAGO"
      navigation={navigation}
      bottomNavigation={buildBottomNavigation(locale)}
      currentPath={currentPath}
      breadcrumbItems={breadcrumbItems}
      user={DUMMY_USER}
      currentLocale={locale}
      onLocaleChange={setLocale}
      currentTheme={theme}
      onThemeChange={handleThemeChange}
      userMenuLabels={t.userMenu}
    >
      <PersonalLocaleContext.Provider value={locale}>
        {children}
      </PersonalLocaleContext.Provider>
    </AppShell>
  );
}
