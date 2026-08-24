'use client';

import React from 'react';
import { Route, Play, CheckCircle2, TrendingUp } from 'lucide-react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';

export interface TripSummaryProps {
  total: number;
  ongoing: number;
  completed: number;
  totalDistance: number;
}

export function TripSummary({ total, ongoing, completed, totalDistance }: TripSummaryProps) {
  const locale = useBusinessLocale() || 'id';
  const tTrips = getTranslation(locale).trips;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {/* Total */}
      <div className="bg-surface rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-foreground-muted">
            <Route className="h-4 w-4" />
          </div>
          <h3 className="text-[11px] font-bold text-foreground-muted tracking-wide uppercase">
            {tTrips.summaryTotal}
          </h3>
        </div>
        <p className="text-2xl font-bold text-foreground ml-1">
          {total}
        </p>
      </div>

      {/* Ongoing */}
      <div className="bg-surface rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500">
            <Play className="h-4 w-4" />
          </div>
          <h3 className="text-[11px] font-bold text-foreground-muted tracking-wide uppercase">
            {tTrips.summaryOngoing}
          </h3>
        </div>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 ml-1">
          {ongoing}
        </p>
      </div>

      {/* Completed */}
      <div className="bg-surface rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <h3 className="text-[11px] font-bold text-foreground-muted tracking-wide uppercase">
            {tTrips.summaryCompleted}
          </h3>
        </div>
        <p className="text-2xl font-bold text-green-600 dark:text-green-500 ml-1">
          {completed}
        </p>
      </div>

      {/* Total Distance */}
      <div className="bg-surface rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-danger/10 text-danger">
            <TrendingUp className="h-4 w-4" />
          </div>
          <h3 className="text-[11px] font-bold text-foreground-muted tracking-wide uppercase">
            {tTrips.summaryTotalDistance}
          </h3>
        </div>
        <p className="text-2xl font-bold text-foreground ml-1">
          {totalDistance.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')} <span className="text-sm text-foreground-muted font-medium">km</span>
        </p>
      </div>
    </div>
  );
}
