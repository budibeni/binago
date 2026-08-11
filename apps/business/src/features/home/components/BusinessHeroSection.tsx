'use client';

import React from 'react';
import { Truck, TrendingUp, AlertTriangle, Route } from 'lucide-react';
import { mockMetricSummary } from '../data/mockHomeData';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getTranslation } from '../../../i18n';

interface MetricCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
  iconBg?: string;
}

function MetricCard({ icon: Icon, value, label, iconBg = 'bg-white/10' }: MetricCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 flex items-center gap-3">
      <div className={`${iconBg} rounded-lg p-2.5 shrink-0`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
        <p className="text-xs text-white/60 mt-0.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}

export function BusinessHeroSection() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  const h = t.home;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-900 px-8 pt-8 pb-6 w-full">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Accent glow top-right */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-40 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />

      {/* Content grid */}
      <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
        {/* Left: greeting + subtitle */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/60 mb-1">{h.heroGreeting}</p>
          <h1 className="text-3xl font-bold text-white leading-tight mb-3">
            Budi Setiawan!
          </h1>
          <p className="text-sm text-white/60 max-w-sm leading-relaxed">
            {h.heroSubtitle}
          </p>
        </div>

        {/* Right: decorative vehicle silhouette area */}
        <div className="hidden lg:flex items-center justify-center w-52 shrink-0">
          <div className="flex flex-col items-center gap-2 opacity-20">
            <Truck className="h-20 w-20 text-white" />
          </div>
        </div>
      </div>

      {/* Metric cards row */}
      <div className="relative z-10 mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={Truck}
          value={mockMetricSummary.totalVehicles.toLocaleString('id-ID')}
          label={h.metrics.totalVehicles}
        />
        <MetricCard
          icon={TrendingUp}
          value={mockMetricSummary.movingVehicles.toLocaleString('id-ID')}
          label={h.metrics.movingVehicles}
          iconBg="bg-emerald-500/20"
        />
        <MetricCard
          icon={AlertTriangle}
          value={mockMetricSummary.activeAlerts.toLocaleString('id-ID')}
          label={h.metrics.activeAlerts}
          iconBg="bg-amber-500/20"
        />
        <MetricCard
          icon={Route}
          value={mockMetricSummary.tripsToday.toLocaleString('id-ID')}
          label={h.metrics.tripsToday}
          iconBg="bg-blue-500/20"
        />
      </div>
    </div>
  );
}
