'use client';

import React from 'react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import type { Trip } from '../types/trips';
import { Clock, Navigation, Map as MapIcon } from 'lucide-react';

export interface TripDetailSummaryProps {
  trip: Trip;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
}

export function TripDetailSummary({ trip }: TripDetailSummaryProps) {
  const locale = useBusinessLocale() || 'id';
  const tTrips = getTranslation(locale).trips;

  const getMetric = (label: string, value: string) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      
      {/* Route Info */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-sm col-span-1 lg:col-span-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <MapIcon className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold text-foreground-muted uppercase tracking-wider">{tTrips.detailRoute.title}</h3>
        </div>
        
        {trip.routeName ? (
          <>
            <div className="text-sm font-semibold text-foreground">{trip.routeName}</div>
            <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-border border-dashed">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground-muted uppercase">{tTrips.detailRoute.routeDistance}</span>
                <span className="text-sm font-semibold text-foreground">{(trip.distance * 0.95).toFixed(1).replace('.', ',')} km</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground-muted uppercase">{tTrips.detailRoute.actualDistance}</span>
                <span className="text-sm font-semibold text-foreground">{trip.distance.toFixed(1).replace('.', ',')} km</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground-muted uppercase">{tTrips.detailRoute.diffDistance}</span>
                <span className="text-sm font-semibold text-danger">+{((trip.distance) - (trip.distance * 0.95)).toFixed(1).replace('.', ',')} km</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full justify-center text-foreground-muted text-sm pb-4">
            {tTrips.noRouteDesc}
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-sm col-span-1 lg:col-span-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0 mt-1">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-4 w-full">
              {getMetric(tTrips.detailSummary.distance, `${trip.distance.toFixed(1).replace('.', ',')} km`)}
              {getMetric(tTrips.detailSummary.averageSpeed, `${trip.averageSpeed} km/h`)}
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-foreground-muted shrink-0 mt-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-4 w-full">
              {getMetric(tTrips.detailSummary.duration, formatDuration(trip.duration))}
              {getMetric(tTrips.detailSummary.movingDuration, formatDuration(trip.movingDuration))}
            </div>
          </div>

          <div className="flex flex-col gap-4 pl-3 sm:border-l sm:border-border sm:border-dashed">
            {getMetric(tTrips.detailSummary.stopCount, trip.stopCount.toString())}
            {getMetric(tTrips.detailSummary.stoppedDuration, formatDuration(trip.stoppedDuration))}
          </div>
        </div>
      </div>
    </div>
  );
}
