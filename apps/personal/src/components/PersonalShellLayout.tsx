'use client';

import React from 'react';
import {
  Map,
  Activity,
  Settings,
} from 'lucide-react';
import type { NavItem, UserInfo, Locale } from '@adatrack/types';
import { getTranslation } from '../i18n';
import { PersonalAppShell } from './PersonalAppShell';
import { NotificationProvider } from '../features/notifications/context/NotificationContext';

const DUMMY_USER: UserInfo = {
  name: 'Andi Pratama',
  email: 'andi.pratama@gmail.com',
  role: 'Pengguna Personal',
  initials: 'AP',
};

function buildNavigation(locale: Locale): NavItem[] {
  const t = getTranslation(locale);
  return [
    { id: 'tracking', label: t.nav.tracking, href: '/', icon: Map },
    { id: 'statistics', label: t.nav.statistics, href: '/statistics', icon: Activity },
    { id: 'settings', label: t.nav.settings, href: '/settings', icon: Settings },
  ];
}

export const PersonalLocaleContext = React.createContext<Locale>('id');

export function usePersonalLocale() {
  return React.useContext(PersonalLocaleContext);
}

export function PersonalShellLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>('id');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('adatrack.theme') as 'light' | 'dark';
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
      localStorage.setItem('adatrack.theme', newTheme);
      if (newTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, []);

  const t = getTranslation(locale);
  const navigation = buildNavigation(locale);

  return (
    <NotificationProvider>
      <PersonalAppShell
        navigation={navigation}
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
      </PersonalAppShell>
    </NotificationProvider>
  );
}
