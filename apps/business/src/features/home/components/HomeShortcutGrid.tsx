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
} from 'lucide-react';
import { Card } from '@binago/ui';
// In a real app we'd use Next.js Link. We can use native a tag for UI mockup or just div.
import Link from 'next/link';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getTranslation } from '../../../i18n';

export function HomeShortcutGrid() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);

  // We map the shortcuts dynamically to use translation labels
  const shortcuts = [
    { id: 'tracking', label: t.nav.tracking, desc: 'Lacak posisi real-time', href: '/tracking', icon: Map, color: 'text-primary' },
    { id: 'vehicles', label: t.nav.vehicles, desc: 'Manajemen data kendaraan', href: '/vehicles', icon: Truck, color: 'text-info' },
    { id: 'drivers', label: t.nav.drivers, desc: 'Data & status pengemudi', href: '/drivers', icon: Users, color: 'text-warning' },
    { id: 'deliveries', label: t.nav.deliveries, desc: 'Daftar tugas pengiriman', href: '/deliveries', icon: Package, color: 'text-success' },
    { id: 'maintenance', label: t.nav.maintenance, desc: 'Jadwal & riwayat servis', href: '/maintenance', icon: Wrench, color: 'text-danger' },
    { id: 'devices', label: t.nav.devices, desc: 'Status GPS & hardware', href: '/devices', icon: Cpu, color: 'text-neutral-500' },
    { id: 'geofences', label: t.nav.geofences, desc: 'Zona aman & batas rute', href: '/geofences', icon: MapPin, color: 'text-primary' },
    { id: 'reports', label: t.nav.reports, desc: 'Analitik & rekapan data', href: '/reports', icon: BarChart2, color: 'text-info' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {shortcuts.map((s) => (
        <Link key={s.id} href={s.href} className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-xl">
          <Card variant="flat" className="p-4 flex flex-col items-start gap-3 hover:bg-neutral-50 hover:border-primary/20 transition-colors border border-transparent h-full cursor-pointer">
            <div className={`p-2 rounded-lg bg-surface shadow-sm border border-border ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{s.label}</h3>
              <p className="text-xs text-foreground-muted mt-0.5 line-clamp-1">{s.desc}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
