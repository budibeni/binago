import * as fs from 'fs';

const filePath = 'd:/03. DEVELOPMENT/03. AJB/GPS/binago/apps/business/src/components/BusinessShellLayout.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Database to lucide-react imports
content = content.replace(/import\s*{\s*([^}]+)\s*}\s*from\s*'lucide-react';/, (match, p1) => {
  return "import { " + p1.trim() + ",\n  Database\n} from 'lucide-react';";
});

// 2. Add icons to each NavGroup
// main -> no icon needed (already no title)
// master -> Database
// asset -> BriefcaseBusiness
// safety -> ShieldCheck
// analysis -> ChartNoAxesCombined
// administration -> Settings
// rental -> CarFront
// transport -> Bus
// logistics -> Package
// sales -> LineChart
// fieldService -> Wrench
// patrol -> Shield
// projectSite -> Building2

content = content.replace(/id:\s*'master',\s*title:\s*t\.navGroup\.master,/, "id: 'master',\n      title: t.navGroup.master,\n      icon: Database,");
content = content.replace(/id:\s*'asset',\s*title:\s*t\.navGroup\.asset,/, "id: 'asset',\n      title: t.navGroup.asset,\n      icon: BriefcaseBusiness,");
content = content.replace(/id:\s*'safety',\s*title:\s*t\.navGroup\.safety,/, "id: 'safety',\n      title: t.navGroup.safety,\n      icon: ShieldCheck,");
content = content.replace(/id:\s*'analysis',\s*title:\s*t\.navGroup\.analysis,/, "id: 'analysis',\n      title: t.navGroup.analysis,\n      icon: ChartNoAxesCombined,");
content = content.replace(/id:\s*'administration',\s*title:\s*t\.navGroup\.administration,/, "id: 'administration',\n      title: t.navGroup.administration,\n      icon: Settings,");
content = content.replace(/id:\s*'rental',\s*title:\s*t\.navGroup\.rental,/, "id: 'rental',\n      title: t.navGroup.rental,\n      icon: CarFront,");
content = content.replace(/id:\s*'transport',\s*title:\s*t\.navGroup\.transport,/, "id: 'transport',\n      title: t.navGroup.transport,\n      icon: Bus,");
content = content.replace(/id:\s*'logistics',\s*title:\s*t\.navGroup\.logistics,/, "id: 'logistics',\n      title: t.navGroup.logistics,\n      icon: Package,");
content = content.replace(/id:\s*'sales',\s*title:\s*t\.navGroup\.sales,/, "id: 'sales',\n      title: t.navGroup.sales,\n      icon: LineChart,");
content = content.replace(/id:\s*'fieldService',\s*title:\s*t\.navGroup\.fieldService,/, "id: 'fieldService',\n      title: t.navGroup.fieldService,\n      icon: Wrench,");
content = content.replace(/id:\s*'patrol',\s*title:\s*t\.navGroup\.patrol,/, "id: 'patrol',\n      title: t.navGroup.patrol,\n      icon: Shield,");
content = content.replace(/id:\s*'projectSite',\s*title:\s*t\.navGroup\.projectSite,/, "id: 'projectSite',\n      title: t.navGroup.projectSite,\n      icon: Building2,");

fs.writeFileSync(filePath, content, 'utf8');
console.log('BusinessShellLayout updated!');
