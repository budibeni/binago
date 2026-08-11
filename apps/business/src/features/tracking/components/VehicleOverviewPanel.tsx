'use client';

import React from 'react';
import { X, MapPin, Clock, Gauge, Car, User } from 'lucide-react';
import { cn } from '@binago/utils';
import type { Locale } from '@binago/types';
import { getTranslation } from '../../../i18n';
import type { TrackingVehicle } from '../types/tracking';

interface VehicleOverviewPanelProps {
  vehicle: TrackingVehicle | null;
  onClose: () => void;
  locale?: Locale;
  className?: string;
}

export function VehicleOverviewPanel({ vehicle, onClose, locale = 'id', className }: VehicleOverviewPanelProps) {
  if (!vehicle) return null;

  const t = getTranslation(locale);
  const tTracking = t.tracking;

  const statusConfig = {
    driving: {
      label: tTracking.statusDriving,
      color: 'text-success',
      bg: 'bg-success/15 dark:bg-success/20',
      dot: 'bg-success',
    },
    idle: {
      label: tTracking.statusIdle,
      color: 'text-warning-600 dark:text-warning-400',
      bg: 'bg-warning/15 dark:bg-warning/20',
      dot: 'bg-warning',
    },
    parking: {
      label: tTracking.statusParking,
      color: 'text-neutral-600 dark:text-neutral-400',
      bg: 'bg-neutral-100 dark:bg-neutral-800',
      dot: 'bg-neutral-400 dark:bg-neutral-500',
    },
    offline: {
      label: tTracking.statusOffline,
      color: 'text-danger',
      bg: 'bg-danger/15 dark:bg-danger/20',
      dot: 'bg-danger',
    },
  };

  const status = statusConfig[vehicle.status];
  const dateObj = new Date(vehicle.lastUpdate);
  const formattedDate = dateObj.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <div className={cn('flex flex-col h-full w-full bg-background shadow-[-4px_-4px_15px_-3px_rgba(0,0,0,0.02)]', className)}>
      
      {/* ── Top Row ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-3 py-1.5 border-b border-border shrink-0 h-[40px] bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] font-bold text-foreground tracking-widest uppercase">
            {vehicle.plateNumber}
          </h2>
          
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none',
              status.bg,
              status.color,
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', status.dot)} />
            {status.label}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-muted hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 hover:text-foreground transition-colors focus:outline-none"
          aria-label={tTracking.overviewClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Details Grid ─────────────────────────────────────────────────── */}
      <div className="flex-1 py-2 px-3 overflow-hidden flex items-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          
          {/* Driver & Group */}
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-full bg-primary/10 text-primary shrink-0">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{tTracking.overviewDriverGroup}</p>
              <p className="text-[12px] font-semibold text-foreground truncate leading-tight">
                {vehicle.driverName || tTracking.overviewNoDriver}
              </p>
              <p className="text-[11px] text-foreground-muted truncate leading-tight">
                {vehicle.groupName}
              </p>
            </div>
          </div>

          {/* Speed */}
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shrink-0">
              <Gauge className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{tTracking.overviewSpeed}</p>
              <p className="text-[12px] font-semibold text-foreground truncate leading-tight">
                {vehicle.speed} <span className="text-[10px] font-normal text-foreground-muted">{tTracking.speedUnit}</span>
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-full bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 shrink-0">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{tTracking.overviewLocation}</p>
              <p className="text-[12px] font-semibold text-foreground truncate leading-tight" title={vehicle.location.address || `${vehicle.location.lat}, ${vehicle.location.lng}`}>
                {vehicle.location.address || `${vehicle.location.lat.toFixed(5)}, ${vehicle.location.lng.toFixed(5)}`}
              </p>
            </div>
          </div>

          {/* Last Update */}
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 shrink-0">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold mb-0.5">{tTracking.overviewLastUpdate}</p>
              <p className="text-[12px] font-semibold text-foreground truncate leading-tight">
                {formattedDate}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
