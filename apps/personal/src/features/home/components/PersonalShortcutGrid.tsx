'use client';

import React from 'react';
import { Map, Cpu, MapPin, BarChart2, Settings } from 'lucide-react';
import { Card } from '@binago/ui';
import Link from 'next/link';
import { usePersonalLocale } from '../../../components/PersonalShellLayout';
import { getTranslation } from '../../../i18n';

export function PersonalShortcutGrid() {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);

  const shortcuts = [
    { id: 'tracking', label: t.nav.tracking, desc: 'Lihat posisi kendaraan di peta', href: '/tracking', icon: Map, color: 'text-primary' },
    { id: 'devices', label: t.nav.devices, desc: 'Status perangkat GPS', href: '/devices', icon: Cpu, color: 'text-info' },
    { id: 'geofences', label: t.nav.geofences, desc: 'Kelola zona aman', href: '/geofences', icon: MapPin, color: 'text-success' },
    { id: 'reports', label: t.nav.reports, desc: 'Riwayat & ringkasan perjalanan', href: '/reports', icon: BarChart2, color: 'text-warning' },
    { id: 'settings', label: t.nav.settings, desc: 'Pengaturan akun & aplikasi', href: '/settings', icon: Settings, color: 'text-neutral-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {shortcuts.map((s) => (
        <Link
          key={s.id}
          href={s.href}
          className="group block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-xl"
        >
          <Card
            variant="flat"
            className="p-4 flex flex-col items-start gap-3 hover:bg-neutral-50 hover:border-primary/20 transition-colors border border-transparent h-full cursor-pointer"
          >
            <div className={`p-2 rounded-lg bg-surface shadow-sm border border-border ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {s.label}
              </h3>
              <p className="text-xs text-foreground-muted mt-0.5 line-clamp-2">{s.desc}</p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
