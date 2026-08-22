'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Home,
  Map,
  Truck,
  UserRound,
  MapPinned,
  Layers,
  Route,
  Package,
  Wrench,
  BriefcaseBusiness,
  ShieldCheck,
  CircleAlert,
  ClipboardCheck,
  FileText,
  ChartNoAxesCombined,
  Users,
  Building2,
  MonitorCog,
  Link,
  Settings,
  CircleHelp,
  Waypoints,
  Activity,
} from 'lucide-react';
import { AppShell } from '@adatrack/ui';
import type { NavGroup, NavItem, UserInfo, Locale } from '@adatrack/types';
import { getTranslation } from '../i18n';
import { ShareLocationProvider } from '../features/sharing/context/ShareLocationContext';

const DUMMY_USER: UserInfo = {
  name: 'Budi Setiawan',
  email: 'budi.setiawan@adatrack.id',
  role: 'Super Admin',
  initials: 'BS',
};

function buildNavigation(locale: Locale): NavGroup[] {
  const t = getTranslation(locale);
  return [
    {
      id: 'main',
      title: t.navGroup.main,
      items: [
        { id: 'home', label: t.nav.home, href: '/', icon: Home },
        { id: 'tracking', label: t.nav.tracking, href: '/tracking', icon: Map },
      ],
    },
    {
      id: 'master',
      title: t.navGroup.master,
      items: [
        { id: 'vehicles', label: t.nav.vehicles, href: '/vehicles', icon: Truck },
        { id: 'drivers', label: t.nav.drivers, href: '/drivers', icon: UserRound },
        { id: 'geofences', label: t.nav.geofences, href: '/geofences', icon: MapPinned },
        { id: 'groups', label: t.nav.groups, href: '/groups', icon: Layers },
      ],
    },
    {
      id: 'operational',
      title: t.navGroup.operational,
      items: [
        { id: 'routes', label: t.nav.routes, href: '/routes', icon: Waypoints },
        { id: 'trips', label: t.nav.trips, href: '/trips', icon: Route },
        { id: 'activities', label: t.nav.activities, href: '/activities', icon: Activity },
      ],
    },
    {
      id: 'asset',
      title: t.navGroup.asset,
      items: [
        { id: 'assets', label: t.nav.assets, href: '/assets', icon: BriefcaseBusiness },
        { id: 'maintenance', label: t.nav.maintenance, href: '/maintenance', icon: Wrench },
      ],
    },
    {
      id: 'safety',
      title: t.navGroup.safety,
      items: [
        { id: 'safety', label: t.nav.safety, href: '/safety', icon: ShieldCheck },
        { id: 'incidents', label: t.nav.incidents, href: '/incidents', icon: CircleAlert },
      ],
    },
    {
      id: 'analysis',
      title: t.navGroup.analysis,
      items: [
        { id: 'reports', label: t.nav.reports, href: '/reports', icon: FileText },
        { id: 'analytics', label: t.nav.analytics, href: '/analytics', icon: ChartNoAxesCombined },
      ],
    },
    {
      id: 'administration',
      title: t.navGroup.administration,
      items: [
        { id: 'usersAccess', label: t.nav.usersAccess, href: '/users', icon: Users },
        { id: 'organization', label: t.nav.organization, href: '/organization', icon: Building2 },
        { id: 'gpsDevices', label: t.nav.gpsDevices, href: '/gps-devices', icon: MonitorCog },
        { id: 'integrations', label: t.nav.integrations, href: '/integrations', icon: Link },
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

export const BusinessLocaleContext = React.createContext<Locale>('id');

export function useBusinessLocale() {
  return React.useContext(BusinessLocaleContext);
}

export function BusinessShellLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>('id');
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const currentPath = usePathname() || '/';

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

  const breadcrumbItems: { label: string; href?: string }[] = [];
  let foundItem = null;
  let foundGroup = null;

  for (const group of navigation) {
    for (const item of group.items) {
      if (item.href === currentPath) {
        foundItem = item;
        foundGroup = group;
        break;
      }
    }
    if (foundItem) break;
  }

  if (foundItem && currentPath !== '/') {
    breadcrumbItems.push({ label: foundGroup?.title || '' });
    breadcrumbItems.push({ label: foundItem.label });
  } else {
    breadcrumbItems.push({ label: t.nav.home });
  }

  return (
    <AppShell
      brandName="ADATRACK"
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
      <ShareLocationProvider>
        <BusinessLocaleContext.Provider value={locale}>
          {children}
        </BusinessLocaleContext.Provider>
      </ShareLocationProvider>
    </AppShell>
  );
}
