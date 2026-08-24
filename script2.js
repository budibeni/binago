import * as fs from 'fs';

const filePath = 'd:/03. DEVELOPMENT/03. AJB/GPS/binago/apps/business/src/components/BusinessShellLayout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const newIcons = '  CarFront, FileSignature, CalendarClock, Key, Undo2, Bus, Calendar, MapPin, Clock, ClipboardList, CheckSquare, LineChart, Handshake, UserPlus, ShoppingCart, CalendarDays, HardHat, CheckCircle, Shield, UserCheck, Search, AlertTriangle, History, Building, FolderKanban,\n';

content = content.replace(/import\s*{\s*([^}]+)\s*}\s*from\s*'lucide-react';/, (match, p1) => {
  return "import { " + p1.trim() + ",\n" + newIcons + "} from 'lucide-react';";
});

const newNavGroups = 
    {
      id: 'rental',
      title: t.navGroup.rental,
      items: [
        { id: 'dashboardRental', label: t.nav.dashboardRental, href: '/modules/rental/dashboard', icon: CarFront },
        { id: 'rentalCustomers', label: t.nav.customers, href: '/modules/rental/customers', icon: Users },
        { id: 'rentalContracts', label: t.nav.rentalContracts, href: '/modules/rental/contracts', icon: FileSignature },
        { id: 'reservations', label: t.nav.reservations, href: '/modules/rental/reservations', icon: CalendarClock },
        { id: 'handovers', label: t.nav.handovers, href: '/modules/rental/handovers', icon: Key },
        { id: 'returns', label: t.nav.returns, href: '/modules/rental/returns', icon: Undo2 },
        { id: 'rentalReports', label: t.nav.rentalReports, href: '/modules/rental/reports', icon: FileText },
      ],
    },
    {
      id: 'transport',
      title: t.navGroup.transport,
      items: [
        { id: 'dashboardTransport', label: t.nav.dashboardTransport, href: '/modules/transport/dashboard', icon: Bus },
        { id: 'operationalSchedules', label: t.nav.operationalSchedules, href: '/modules/transport/schedules', icon: Calendar },
        { id: 'routesTransport', label: t.nav.routesTransport, href: '/modules/transport/routes', icon: Route },
        { id: 'stops', label: t.nav.stops, href: '/modules/transport/stops', icon: MapPin },
        { id: 'departures', label: t.nav.departures, href: '/modules/transport/departures', icon: Clock },
        { id: 'passengerManifests', label: t.nav.passengerManifests, href: '/modules/transport/manifests', icon: Users },
        { id: 'transportReports', label: t.nav.transportReports, href: '/modules/transport/reports', icon: FileText },
      ],
    },
    {
      id: 'logistics',
      title: t.navGroup.logistics,
      items: [
        { id: 'dashboardLogistics', label: t.nav.dashboardLogistics, href: '/modules/logistics/dashboard', icon: Package },
        { id: 'logisticsCustomers', label: t.nav.logisticsCustomers, href: '/modules/logistics/customers', icon: Users },
        { id: 'shippingOrders', label: t.nav.shippingOrders, href: '/modules/logistics/orders', icon: ClipboardList },
        { id: 'shipments', label: t.nav.shipments, href: '/modules/logistics/shipments', icon: Truck },
        { id: 'manifests', label: t.nav.manifests, href: '/modules/logistics/manifests', icon: FileText },
        { id: 'deliveriesLogistics', label: t.nav.deliveriesLogistics, href: '/modules/logistics/deliveries', icon: CheckSquare },
        { id: 'proofOfDelivery', label: t.nav.proofOfDelivery, href: '/modules/logistics/pod', icon: ClipboardCheck },
        { id: 'logisticsReports', label: t.nav.logisticsReports, href: '/modules/logistics/reports', icon: FileText },
      ],
    },
    {
      id: 'sales',
      title: t.navGroup.sales,
      items: [
        { id: 'dashboardSales', label: t.nav.dashboardSales, href: '/modules/sales/dashboard', icon: LineChart },
        { id: 'salesCustomers', label: t.nav.salesCustomers, href: '/modules/sales/customers', icon: Users },
        { id: 'salesVisits', label: t.nav.salesVisits, href: '/modules/sales/visits', icon: Handshake },
        { id: 'prospects', label: t.nav.prospects, href: '/modules/sales/prospects', icon: UserPlus },
        { id: 'quotes', label: t.nav.quotes, href: '/modules/sales/quotes', icon: FileSignature },
        { id: 'orders', label: t.nav.orders, href: '/modules/sales/orders', icon: ShoppingCart },
        { id: 'salesReports', label: t.nav.salesReports, href: '/modules/sales/reports', icon: FileText },
      ],
    },
    {
      id: 'fieldService',
      title: t.navGroup.fieldService,
      items: [
        { id: 'dashboardFieldService', label: t.nav.dashboardFieldService, href: '/modules/field-service/dashboard', icon: Wrench },
        { id: 'fieldServiceCustomers', label: t.nav.fieldServiceCustomers, href: '/modules/field-service/customers', icon: Users },
        { id: 'workOrders', label: t.nav.workOrders, href: '/modules/field-service/work-orders', icon: ClipboardList },
        { id: 'assignments', label: t.nav.assignments, href: '/modules/field-service/assignments', icon: UserCheck },
        { id: 'schedules', label: t.nav.schedules, href: '/modules/field-service/schedules', icon: CalendarDays },
        { id: 'technicians', label: t.nav.technicians, href: '/modules/field-service/technicians', icon: HardHat },
        { id: 'completions', label: t.nav.completions, href: '/modules/field-service/completions', icon: CheckCircle },
        { id: 'fieldServiceReports', label: t.nav.fieldServiceReports, href: '/modules/field-service/reports', icon: FileText },
      ],
    },
    {
      id: 'patrol',
      title: t.navGroup.patrol,
      items: [
        { id: 'dashboardPatrol', label: t.nav.dashboardPatrol, href: '/modules/patrol/dashboard', icon: Shield },
        { id: 'patrolSchedules', label: t.nav.patrolSchedules, href: '/modules/patrol/schedules', icon: Calendar },
        { id: 'patrolAssignments', label: t.nav.patrolAssignments, href: '/modules/patrol/assignments', icon: UserCheck },
        { id: 'checkpoints', label: t.nav.checkpoints, href: '/modules/patrol/checkpoints', icon: MapPin },
        { id: 'inspections', label: t.nav.inspections, href: '/modules/patrol/inspections', icon: Search },
        { id: 'patrolIncidents', label: t.nav.patrolIncidents, href: '/modules/patrol/incidents', icon: AlertTriangle },
        { id: 'patrolReports', label: t.nav.patrolReports, href: '/modules/patrol/reports', icon: FileText },
        { id: 'patrolHistory', label: t.nav.patrolHistory, href: '/modules/patrol/history', icon: History },
      ],
    },
    {
      id: 'projectSite',
      title: t.navGroup.projectSite,
      items: [
        { id: 'dashboardProject', label: t.nav.dashboardProject, href: '/modules/project/dashboard', icon: Building },
        { id: 'projects', label: t.nav.projects, href: '/modules/project/projects', icon: FolderKanban },
        { id: 'sites', label: t.nav.sites, href: '/modules/project/sites', icon: MapPin },
        { id: 'projectAssignments', label: t.nav.projectAssignments, href: '/modules/project/assignments', icon: UserCheck },
        { id: 'projectSchedules', label: t.nav.projectSchedules, href: '/modules/project/schedules', icon: Calendar },
        { id: 'projectActivities', label: t.nav.projectActivities, href: '/modules/project/activities', icon: Activity },
        { id: 'projectIncidents', label: t.nav.projectIncidents, href: '/modules/project/incidents', icon: AlertTriangle },
        { id: 'projectReports', label: t.nav.projectReports, href: '/modules/project/reports', icon: FileText },
      ],
    },
;

content = content.replace(/({\s*id:\s*'administration',[^]+?},\s*)/, (match) => {
  return match + newNavGroups.replace(/\$/g, '');
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('BusinessShellLayout updated!');
