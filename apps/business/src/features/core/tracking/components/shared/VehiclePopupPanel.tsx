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
  History,
  ExternalLink
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '@adatrack/ui';
import type { Locale } from '@adatrack/types';
import { getTranslation } from '../../../../../i18n';
import type { TrackingVehicle, VehicleContext } from '../../types/tracking';
import { ShareLocationDialog } from '../../../sharing/components/ShareLocationDialog';
import { useShareLocation } from '../../../sharing/context/ShareLocationContext';

interface VehiclePopupPanelProps {
  vehicle: TrackingVehicle | null;
  onClose: () => void;
  locale?: Locale;
  className?: string;
  onPlayback?: () => void;
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
    label: 'Idle',
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
  icon?: React.FC<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      {Icon && <Icon className="h-3 w-3 text-foreground-subtle mt-[1px] shrink-0" />}
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

// --- VehiclePopupPanel --------------------------------------------------------

export function VehiclePopupPanel({
  vehicle,
  onClose,
  locale = 'id',
  className,
  onPlayback,
  onShareLocation
}: VehiclePopupPanelProps) {
  if (!vehicle) return null;

  const t = getTranslation(locale);
  const tTracking = t.tracking;
  const status = STATUS_CONFIG[vehicle.status];

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const shareContext = useShareLocation();
  // Safe check if context is available (in case provider is missing)
  const activeShare = shareContext?.getActiveSession(vehicle.id);

  const [activeTab, setActiveTab] = useState<'umum' | 'context'>('umum');
  const [vehicleContext, setVehicleContext] = useState<VehicleContext | null>(null);

  React.useEffect(() => {
    let mounted = true;
    
    // 1. Coba baca dari sessionStorage untuk load instan (jika tersedia dari navigasi)
    try {
      const stored = sessionStorage.getItem(`adatrack_vehicle_context_${locale}_${vehicle.id}`);
      if (stored) {
        const parsed = JSON.parse(stored) as VehicleContext;
        if (parsed.vehicleId === vehicle.id) {
          setVehicleContext(parsed);
        }
      }
    } catch (e: any) {
      console.error('Failed to parse vehicle context', e);
    }

    // 2. Fetch data context terbaru secara asinkron (agar selalu update dan bekerja untuk multi-select)
    import('@/data/modules/rental/services/vehicleContextBuilder')
      .then((m) => m.buildRentalVehicleContext(vehicle.id, locale))
      .then((ctx) => {
         if (mounted && ctx) {
            setVehicleContext(ctx);
            // Update cache session storage
            sessionStorage.setItem(`adatrack_vehicle_context_${locale}_${vehicle.id}`, JSON.stringify(ctx));
         }
      })
      .catch((e) => console.error('Failed to dynamically fetch vehicle context', e));

    return () => { mounted = false; };
  }, [vehicle.id, locale]);

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

  return (
    <div className={cn('flex flex-col w-[420px] bg-background rounded-xl overflow-hidden shadow-2xl ring-1 ring-border', className)}>

      {/* -- Header ----------------------------------------------------------- */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-background shrink-0">

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

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-foreground-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none ml-1 shrink-0"
          aria-label="Tutup"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* -- Tabs ------------------------------------------------------------- */}
      {vehicleContext && (
        <div className="flex px-3 border-b border-border bg-neutral-50/50 dark:bg-neutral-900/50">
          <button
            onClick={() => setActiveTab('umum')}
            className={cn(
              "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2",
              activeTab === 'umum' 
                ? "border-danger text-foreground" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tTracking.popupGeneral}
          </button>
          <button
            onClick={() => setActiveTab('context')}
            className={cn(
              "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2",
              activeTab === 'context' 
                ? "border-danger text-foreground" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {vehicleContext.label}
          </button>
        </div>
      )}

      {/* -- Body ----------------------------------------------------------- */}
      <div className="grid grid-cols-3 divide-x divide-border overflow-hidden">
        {activeTab === 'umum' ? (
          <>
            {/* -- Col 1: Driver, Speed, ACC, Alarm ----------------------- */}
            <div className="flex flex-col gap-2 px-2.5 py-2 overflow-hidden">
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
              <InfoRow
                icon={Bell}
                label={tTracking.popupAlarm}
                value={vehicle.alarmEvent || '-'}
                valueClassName={vehicle.alarmEvent && vehicle.alarmEvent !== '-' ? 'text-danger' : undefined}
              />
            </div>

            {/* -- Col 2: Address, Geofence Location, Geofence Area ------- */}
            <div className="flex flex-col gap-2 px-2.5 py-2 overflow-hidden">
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

            {/* -- Col 3: Coordinates, GPS SN, Last Update ----------------- */}
            <div className="flex flex-col gap-2 px-2.5 py-2 overflow-hidden">
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
          </>
        ) : (
          <>
            {(() => {
              const items = vehicleContext?.data || [];
              const perCol = Math.ceil(items.length / 3);
              return Array.from({ length: 3 }).map((_, colIndex) => {
                const chunk = items.slice(colIndex * perCol, (colIndex + 1) * perCol);
                return (
                  <div key={colIndex} className="flex flex-col gap-2 px-2.5 py-2 overflow-hidden">
                    {chunk.map((field, idx) => (
                      <InfoRow
                        key={idx}
                        label={field.label}
                        value={field.value}
                        valueClassName={cn(
                          field.type === 'status' && field.value === 'RENTED' && 'text-primary font-bold',
                          field.type === 'status' && field.value === 'READY' && 'text-success font-bold',
                          field.type === 'status' && field.value === 'RESERVED' && 'text-warning font-bold',
                          field.type === 'currency' && 'font-bold text-accent'
                        )}
                      />
                    ))}
                  </div>
                );
              });
            })()}
          </>
        )}
      </div>

      {/* -- Footer ----------------------------------------------------------- */}
      <div className="flex items-center gap-2 px-3 py-2 border-t border-border bg-background">
        <Button
          type="button"
          onClick={onPlayback}
          size="sm"
          className="flex-1 rounded-lg shadow-sm text-xs font-semibold bg-red-600 hover:bg-red-700 text-white border-0"
          leftIcon={<History className="w-3.5 h-3.5" />}
        >
          {tTracking.popupPlayback}
        </Button>
        {activeShare ? (
          <Button
            type="button"
            onClick={() => setShareDialogOpen(true)}
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 text-xs font-semibold"
            leftIcon={<Share2 className="w-3.5 h-3.5 fill-current" />}
          >
            {locale === 'id' ? 'Dibagikan' : 'Shared'}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={(e) => {
              if (onShareLocation) onShareLocation();
              setShareDialogOpen(true);
            }}
            variant="outline"
            size="sm"
            className="flex-1 rounded-lg text-xs font-semibold border-border"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
          >
            {locale === 'id' ? 'Bagikan' : 'Share'}
          </Button>
        )}
        <Button
          type="button"
          onClick={() => {
            const url = `https://www.google.com/maps?q=${vehicle.location.lat},${vehicle.location.lng}`;
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
          variant="outline"
          size="sm"
          className="flex-1 rounded-lg text-xs font-semibold border-border text-foreground hover:bg-muted"
          leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          Maps
        </Button>
      </div>

      <ShareLocationDialog
        vehicle={vehicle}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
}
