'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Gauge,
  User,
  KeyRound,
  Bell,
  Crosshair,
  Wifi,
  SquareDashedBottom,
  Layers,
  Share2,
  Navigation,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { Locale } from '@adatrack/types';
import { getTranslation } from '../../../../../i18n';
import type { TrackingVehicle } from '../../types/tracking';
import { ShareLocationDialog } from '../../../sharing/components/ShareLocationDialog';
import { useShareLocation } from '../../../sharing/context/ShareLocationContext';

interface VehicleOverviewPanelProps {
  vehicle: TrackingVehicle | null;
  onClose: () => void;
  locale?: Locale;
  className?: string;
  onShareLocation?: () => void;
}

// --- Status config -------------------------------------------------------------

const STATUS_CONFIG = {
  driving: {
    label: 'Berjalan',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    dot: 'bg-emerald-500',
  },
  idle: {
    label: 'Berhenti',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    dot: 'bg-amber-500',
  },
  parking: {
    label: 'Parkir',
    color: 'text-sky-700 dark:text-sky-400',
    bg: 'bg-sky-100 dark:bg-sky-900/30',
    dot: 'bg-sky-500',
  },
  offline: {
    label: 'Offline',
    color: 'text-neutral-500 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    dot: 'bg-neutral-400',
  },
} as const;

// --- InfoRow ------------------------------------------------------------------

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <Icon className="h-3 w-3 text-foreground-subtle mt-[1px] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-foreground-muted mb-px">
          {label}
        </p>
        <p className={cn('text-[11px] font-semibold text-foreground leading-snug', valueClassName)}>
          {value}
        </p>
      </div>
    </div>
  );
}

// --- VehicleOverviewPanel -----------------------------------------------------

export function VehicleOverviewPanel({
  vehicle,
  onClose,
  locale = 'id',
  className,
  onShareLocation,
}: VehicleOverviewPanelProps) {
  if (!vehicle) return null;

  const t = getTranslation(locale);
  const tTracking = t.tracking;
  const status = STATUS_CONFIG[vehicle.status];

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const shareContext = useShareLocation();
  const activeShare = shareContext?.getActiveSession(vehicle.id);

  const dateObj = new Date(vehicle.lastUpdate);
  const formattedDate = [
    String(dateObj.getFullYear()).slice(2),
    String(dateObj.getMonth() + 1).padStart(2, '0'),
    String(dateObj.getDate()).padStart(2, '0'),
  ].join('/') + ' ' + [
    String(dateObj.getHours()).padStart(2, '0'),
    String(dateObj.getMinutes()).padStart(2, '0'),
    String(dateObj.getSeconds()).padStart(2, '0'),
  ].join(':');

  const coords = `${vehicle.location.lat.toFixed(4)} , ${vehicle.location.lng.toFixed(4)}`;

  const isMinibus = vehicle.vehicleType?.toLowerCase().includes('hiace')
    || vehicle.vehicleType?.toLowerCase().includes('bus')
    || vehicle.vehicleType?.toLowerCase().includes('minibus');

  return (
    <div className={cn('flex flex-col h-full w-full bg-background', className)}>

      {/* -- Header ----------------------------------------------------------- */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-neutral-50/60 dark:bg-neutral-900/40 shrink-0">

        {/* Vehicle Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 shrink-0 text-primary">
          <Navigation className="w-3.5 h-3.5 fill-current" />
        </div>

        {/* Plate + subtitle */}
        <div className="min-w-0 flex-1">
          <h2 className="text-[13px] font-extrabold text-foreground tracking-widest uppercase leading-none">
            {vehicle.plateNumber}
          </h2>
          <p className="text-[10px] text-foreground-muted leading-tight mt-0.5 truncate">
            {[vehicle.city, vehicle.vehicleType].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Status badge */}
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold leading-none shrink-0',
            status.bg,
            status.color,
          )}
        >
          <span className={cn('w-1 h-1 rounded-full shrink-0', status.dot)} />
          {status.label}
        </span>

        {/* Share + Close buttons */}
        <div className="flex items-center gap-1 ml-1 shrink-0">
          {activeShare ? (
            <button
              type="button"
              onClick={() => setShareDialogOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-colors focus:outline-none"
              title={locale === 'id' ? 'Dibagikan' : 'Shared'}
            >
              <Share2 className="w-3.5 h-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onShareLocation) onShareLocation();
                setShareDialogOpen(true);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-foreground-muted hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800 transition-colors focus:outline-none"
              title={tTracking.popupShareLocation}
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-foreground-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
            aria-label={tTracking.overviewClose}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* -- Body - 4-column grid --------------------------------------------- */}
      <div className="flex-1 grid grid-cols-4 divide-x divide-border overflow-hidden">

        {/* -- Col 1: Driver, Speed, ACC ----------------------- */}
        <div className="flex flex-col gap-1.5 px-2.5 py-1.5 overflow-hidden">
          <InfoRow
            icon={User}
            label={tTracking.popupDriver}
            value={vehicle.driverName || '-'}
          />
          <InfoRow
            icon={Gauge}
            label={tTracking.popupSpeed}
            value={`${vehicle.speed} km/h`}
          />
          <InfoRow
            icon={KeyRound}
            label={tTracking.popupAcc}
            value={
              vehicle.acc !== undefined
                ? <span className={vehicle.acc ? 'text-emerald-600 dark:text-emerald-400' : 'text-danger font-bold'}>{vehicle.acc ? 'ON' : 'OFF'}</span>
                : '-'
            }
          />
        </div>

        {/* -- Col 2: Address, Alarm ------- */}
        <div className="flex flex-col gap-1.5 px-2.5 py-1.5 overflow-hidden">
          <InfoRow
            icon={MapPin}
            label={tTracking.popupAddress}
            value={
              <span className="text-accent">
                {vehicle.location.address || '-'}
              </span>
            }
          />
          <InfoRow
            icon={Bell}
            label={tTracking.popupAlarm}
            value={vehicle.alarmEvent || '-'}
            valueClassName={vehicle.alarmEvent && vehicle.alarmEvent !== '-' ? 'text-danger' : undefined}
          />
        </div>

        {/* -- Col 3: Geofence Location, Geofence Area ------- */}
        <div className="flex flex-col gap-1.5 px-2.5 py-1.5 overflow-hidden">
          <InfoRow
            icon={SquareDashedBottom}
            label={tTracking.popupGeofenceLocation}
            value={vehicle.geofenceName && vehicle.geofenceName !== '-' ? vehicle.geofenceName : '-'}
          />
          <InfoRow
            icon={Layers}
            label={tTracking.popupGeofenceArea}
            value={vehicle.geofenceArea && vehicle.geofenceArea !== '-' ? vehicle.geofenceArea : '-'}
          />
        </div>

        {/* -- Col 4: Coordinates, GPS SN, Last Update ----------------- */}
        <div className="flex flex-col gap-1.5 px-2.5 py-1.5 overflow-hidden">
          <InfoRow
            icon={Crosshair}
            label={tTracking.popupCoordinates}
            value={coords}
          />
          <InfoRow
            icon={Wifi}
            label={tTracking.popupGpsSn}
            value={vehicle.gpsSerialNumber || '-'}
          />
          <InfoRow
            icon={Clock}
            label={tTracking.popupLastUpdate}
            value={formattedDate}
          />
        </div>
      </div>



      <ShareLocationDialog
        vehicle={vehicle}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
}
