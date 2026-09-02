'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Home,
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
  CarFront, FileSignature, CalendarClock, Key, Undo2,
  Bus, Calendar, MapPin, Clock,
  ClipboardList, CheckSquare,
  LineChart, Handshake, UserPlus, ShoppingCart,
  CalendarDays, HardHat, CheckCircle,
  Shield, UserCheck, Search, AlertTriangle, History,
  Building, FolderKanban,
  Database
} from 'lucide-react';
import { AppShell } from '@adatrack/ui';
import type { NavGroup, NavItem, UserInfo, Locale } from '@adatrack/types';
import { getTranslation } from '../i18n';
import { ShareLocationProvider } from '../features/core/sharing/context/ShareLocationContext';

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
        { id: 'trips', label: t.nav.trips, href: '/trips', icon: Route },
      ],
    },
    {
      id: 'master',
      title: t.navGroup.master,
      icon: Database,
      items: [
        { id: 'vehicles', label: t.nav.vehicles, href: '/vehicles', icon: Truck },
        { id: 'drivers', label: t.nav.drivers, href: '/drivers', icon: UserRound },
        { id: 'geofences', label: t.nav.geofences, href: '/geofences', icon: MapPinned },
        { id: 'groups', label: t.nav.groups, href: '/groups', icon: Layers },
        { id: 'routes', label: t.nav.routes, href: '/routes', icon: Waypoints },
      ],
    },

    {
      id: 'asset',
      title: t.navGroup.asset,
      icon: BriefcaseBusiness,
      items: [
        { id: 'assets', label: t.nav.assets, href: '/assets', icon: BriefcaseBusiness },
        { id: 'maintenance', label: t.nav.maintenance, href: '/maintenance', icon: Wrench },
      ],
    },
    {
      id: 'safety',
      title: t.navGroup.safety,
      icon: ShieldCheck,
      items: [
        { id: 'safety', label: t.nav.safety, href: '/safety', icon: ShieldCheck },
        { id: 'incidents', label: t.nav.incidents, href: '/incidents', icon: CircleAlert },
      ],
    },
    {
      id: 'analysis',
      title: t.navGroup.analysis,
      icon: ChartNoAxesCombined,
      items: [
        { id: 'reports', label: t.nav.reports, href: '/reports', icon: FileText },
        { id: 'analytics', label: t.nav.analytics, href: '/analytics', icon: ChartNoAxesCombined },
      ],
    },
    {
      id: 'rental',
      title: t.navGroup.rental,
      icon: CarFront,
      items: [
        { id: 'rentalCustomers', label: t.nav.customers, href: '/rental/customers', icon: Users },
        { id: 'rentalVehicles', label: t.nav.rentalVehicles, href: '/rental/vehicles', icon: CarFront },
        { id: 'reservations', label: t.nav.reservations, href: '/rental/reservations', icon: CalendarClock },
        { id: 'rentalContracts', label: t.nav.rentalContracts, href: '/rental/contracts', icon: FileSignature },
        { id: 'handovers', label: t.nav.handovers, href: '/rental/handovers', icon: Key },
        { id: 'returns', label: t.nav.returns, href: '/rental/returns', icon: Undo2 },
        { id: 'rentalReports', label: t.nav.rentalReports, href: '/rental/reports', icon: FileText },
      ],
    },
    {
      id: 'transport',
      title: t.navGroup.transport,
      icon: Bus,
      items: [
        { id: 'dashboardTransport', label: t.nav.dashboardTransport, href: '/transport/dashboard', icon: Bus },
        { id: 'transportVehicles', label: t.nav.transportVehicles, href: '/transport/vehicles', icon: Bus },
        { id: 'operationalSchedules', label: t.nav.operationalSchedules, href: '/transport/schedules', icon: Calendar },
        { id: 'departures', label: t.nav.departures, href: '/transport/departures', icon: Clock },
        { id: 'checker', label: (t.nav as any).checker || 'Checker Penumpang', href: '/transport/checker', icon: Users },
      ],
    },
    {
      id: 'logistics',
      title: t.navGroup.logistics,
      icon: Package,
      items: [
        { id: 'dashboardLogistics', label: t.nav.dashboardLogistics, href: '/logistics/dashboard', icon: Package },
        { id: 'logisticsCustomers', label: t.nav.logisticsCustomers, href: '/logistics/customers', icon: Users },
        { id: 'shippingOrders', label: t.nav.shippingOrders, href: '/logistics/orders', icon: ClipboardList },
        { id: 'shipments', label: t.nav.shipments, href: '/logistics/shipments', icon: Truck },
        { id: 'manifests', label: t.nav.manifests, href: '/logistics/manifests', icon: FileText },
        { id: 'deliveriesLogistics', label: t.nav.deliveriesLogistics, href: '/logistics/deliveries', icon: CheckSquare },
        { id: 'proofOfDelivery', label: t.nav.proofOfDelivery, href: '/logistics/pod', icon: ClipboardCheck },
        { id: 'logisticsReports', label: t.nav.logisticsReports, href: '/logistics/reports', icon: FileText },
      ],
    },
    {
      id: 'sales',
      title: t.navGroup.sales,
      icon: LineChart,
      items: [
        { id: 'dashboardSales', label: t.nav.dashboardSales, href: '/sales/dashboard', icon: LineChart },
        { id: 'salesCustomers', label: t.nav.salesCustomers, href: '/sales/customers', icon: Users },
        { id: 'salesVisits', label: t.nav.salesVisits, href: '/sales/visits', icon: Handshake },
        { id: 'prospects', label: t.nav.prospects, href: '/sales/prospects', icon: UserPlus },
        { id: 'quotes', label: t.nav.quotes, href: '/sales/quotes', icon: FileSignature },
        { id: 'orders', label: t.nav.orders, href: '/sales/orders', icon: ShoppingCart },
        { id: 'salesReports', label: t.nav.salesReports, href: '/sales/reports', icon: FileText },
      ],
    },
    {
      id: 'fieldService',
      title: t.navGroup.fieldService,
      icon: Wrench,
      items: [
        { id: 'dashboardFieldService', label: t.nav.dashboardFieldService, href: '/field-service/dashboard', icon: Wrench },
        { id: 'fieldServiceCustomers', label: t.nav.fieldServiceCustomers, href: '/field-service/customers', icon: Users },
        { id: 'workOrders', label: t.nav.workOrders, href: '/field-service/work-orders', icon: ClipboardList },
        { id: 'assignments', label: t.nav.assignments, href: '/field-service/assignments', icon: UserCheck },
        { id: 'schedules', label: t.nav.schedules, href: '/field-service/schedules', icon: CalendarDays },
        { id: 'technicians', label: t.nav.technicians, href: '/field-service/technicians', icon: HardHat },
        { id: 'completions', label: t.nav.completions, href: '/field-service/completions', icon: CheckCircle },
        { id: 'fieldServiceReports', label: t.nav.fieldServiceReports, href: '/field-service/reports', icon: FileText },
      ],
    },
    {
      id: 'patrol',
      title: t.navGroup.patrol,
      icon: Shield,
      items: [
        { id: 'dashboardPatrol', label: t.nav.dashboardPatrol, href: '/patrol/dashboard', icon: Shield },
        { id: 'patrolSchedules', label: t.nav.patrolSchedules, href: '/patrol/schedules', icon: Calendar },
        { id: 'patrolAssignments', label: t.nav.patrolAssignments, href: '/patrol/assignments', icon: UserCheck },
        { id: 'checkpoints', label: t.nav.checkpoints, href: '/patrol/checkpoints', icon: MapPin },
        { id: 'inspections', label: t.nav.inspections, href: '/patrol/inspections', icon: Search },
        { id: 'patrolIncidents', label: t.nav.patrolIncidents, href: '/patrol/incidents', icon: AlertTriangle },
        { id: 'patrolReports', label: t.nav.patrolReports, href: '/patrol/reports', icon: FileText },
        { id: 'patrolHistory', label: t.nav.patrolHistory, href: '/patrol/history', icon: History },
      ],
    },
    {
      id: 'projectSite',
      title: t.navGroup.projectSite,
      icon: Building2,
      items: [
        { id: 'dashboardProject', label: t.nav.dashboardProject, href: '/project/dashboard', icon: Building },
        { id: 'projects', label: t.nav.projects, href: '/project/projects', icon: FolderKanban },
        { id: 'sites', label: t.nav.sites, href: '/project/sites', icon: MapPin },
        { id: 'projectAssignments', label: t.nav.projectAssignments, href: '/project/assignments', icon: UserCheck },
        { id: 'projectSchedules', label: t.nav.projectSchedules, href: '/project/schedules', icon: Calendar },
        { id: 'projectActivities', label: t.nav.projectActivities, href: '/project/activities', icon: Activity },
        { id: 'projectIncidents', label: t.nav.projectIncidents, href: '/project/incidents', icon: AlertTriangle },
        { id: 'projectReports', label: t.nav.projectReports, href: '/project/reports', icon: FileText },
      ],
    },
    {
      id: 'administration',
      title: t.navGroup.administration,
      icon: Settings,
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
