'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Gauge,
  User,
  Crosshair,
  Wifi,
  SquareDashedBottom,
  Layers,
  Share2,
  History,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '@adatrack/ui';
import type { Locale } from '@adatrack/types';
import { getTranslation } from '../../../../../i18n';
import type { TrackingVehicle, VehicleContext } from '../../types/tracking';
import { ShareLocationDialog } from '../../../sharing/components/ShareLocationDialog';
import { useShareLocation } from '../../../sharing/context/ShareLocationContext';

interface VehicleOverviewPanelProps {
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
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  idle: {
    label: 'Idle',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
  },
  parking: {
    label: 'Parkir',
    color: 'text-sky-700 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-500/30',
    dot: 'bg-sky-500',
  },
  offline: {
    label: 'Offline',
    color: 'text-neutral-500 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    border: 'border-neutral-500/20',
    dot: 'bg-neutral-400',
  },
} as const;

// --- VehicleOverviewPanel -----------------------------------------------------

export function VehicleOverviewPanel({
  vehicle,
  onClose,
  locale = 'id',
  className,
  onPlayback,
  onShareLocation,
}: VehicleOverviewPanelProps) {
  if (!vehicle) return null;

  const t = getTranslation(locale);
  const tTracking = t.tracking;
  const status = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.offline;

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const shareContext = useShareLocation();
  const activeShare = shareContext?.getActiveSession(vehicle.id);

  const [activeTab, setActiveTab] = useState<'umum' | 'context'>('umum');
  const [vehicleContext, setVehicleContext] = useState<VehicleContext | null>(null);

  React.useEffect(() => {
    let mounted = true;
    try {
      const stored = sessionStorage.getItem(`adatrack_vehicle_context_${locale}_${vehicle.id}`);
      if (stored) {
        const parsed = JSON.parse(stored) as VehicleContext;
        if (parsed.vehicleId === vehicle.id) {
          if (mounted) setVehicleContext(parsed);
          return;
        }
      }
      if (mounted) {
        setVehicleContext(null);
        setActiveTab('umum');
      }
    } catch (e: any) {
      console.error('Failed to parse vehicle context', e);
      if (mounted) {
        setVehicleContext(null);
        setActiveTab('umum');
      }
    }
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

  const coords = `${vehicle.location.lat.toFixed(4)}, ${vehicle.location.lng.toFixed(4)}`;
  const heading = vehicle.heading ?? 0;
  const headingTitle = locale === 'id' ? `Arah: ${heading}°` : `Heading: ${heading}°`;

  return (
    <div className={cn('flex flex-col h-full w-full bg-background select-none justify-between overflow-hidden relative animate-overview-in', className)}>

      {/* Telemetry connection beam indicator on vehicle switch */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden pointer-events-none z-20">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-red-600 dark:via-red-500 to-transparent animate-overview-scan" />
      </div>

      {/* -- Row 1: Compact Header Bar (32px) --------------------------------- */}
      <div className="flex items-center justify-between gap-2 px-3 py-1 border-b border-border bg-surface/30 shrink-0 h-[34px]">

        {/* Left: Plate + Name + Subtitle + Status + Context Tabs */}
        <div className="flex items-center gap-2 min-w-0">
          
          {/* License Plate Badge */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs border border-neutral-700/60 dark:border-neutral-300 shrink-0 animate-overview-badge"
            title={headingTitle}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-2.5 h-2.5 fill-current transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${heading}deg)` }}
            >
              <path d="M12 2L21 21L12 17L3 21L12 2Z" />
            </svg>
            <span className="font-mono text-[10px] font-black tracking-wider uppercase">
              {vehicle.plateNumber}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border shrink-0',
              status.bg,
              status.color,
              status.border
            )}
          >
            <span className={cn('w-1 h-1 rounded-full shrink-0', status.dot, vehicle.status === 'driving' && 'animate-pulse')} />
            {status.label}
          </span>

          {/* Context Tab Switcher */}
          {vehicleContext && (
            <div className="hidden sm:flex items-center h-full ml-2 shrink-0 gap-3 border-l border-border/60 pl-3">
              <button
                type="button"
                onClick={() => setActiveTab('umum')}
                className={cn(
                  "h-full text-[10px] transition-colors border-b-2 -mb-[1px] flex items-center justify-center px-1 font-semibold",
                  activeTab === 'umum'
                    ? "border-red-600 text-foreground"
                    : "border-transparent text-foreground-muted hover:text-foreground"
                )}
              >
                {tTracking.popupGeneral}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('context')}
                className={cn(
                  "h-full text-[10px] transition-colors border-b-2 -mb-[1px] flex items-center justify-center px-1 font-semibold",
                  activeTab === 'context'
                    ? "border-red-600 text-foreground"
                    : "border-transparent text-foreground-muted hover:text-foreground"
                )}
              >
                {vehicleContext.label}
              </button>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            onClick={onPlayback}
            variant="outline"
            size="sm"
            className="rounded shadow-xs text-[11px] font-semibold h-6 px-2.5 border-red-500/35 text-red-600 bg-red-50/60 hover:bg-red-100/70 dark:bg-red-950/20 dark:text-red-400 dark:border-red-500/35 transition-colors"
            leftIcon={<History className="w-3 h-3 text-red-600 dark:text-red-400 shrink-0" />}
          >
            {tTracking.popupPlayback}
          </Button>

          {activeShare ? (
            <Button
              type="button"
              onClick={() => setShareDialogOpen(true)}
              variant="outline"
              size="sm"
              className="rounded border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 text-[11px] font-semibold h-6 px-2"
              leftIcon={<Share2 className="w-3 h-3 fill-current shrink-0" />}
            >
              {locale === 'id' ? 'Dibagikan' : 'Shared'}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                if (onShareLocation) onShareLocation();
                setShareDialogOpen(true);
              }}
              variant="outline"
              size="sm"
              className="rounded text-[11px] font-semibold border-border h-6 px-2 text-foreground hover:bg-muted"
              leftIcon={<Share2 className="w-3 h-3 shrink-0" />}
            >
              {locale === 'id' ? 'Bagikan' : 'Share'}
            </Button>
          )}

          <Button
            type="button"
            onClick={() => {
              const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${vehicle.location.lat},${vehicle.location.lng}${heading !== undefined ? `&heading=${heading}` : ''}`;
              window.open(streetViewUrl, '_blank', 'noopener,noreferrer');
            }}
            title="Google Maps Street View"
            aria-label="Google Maps Street View"
            variant="outline"
            size="sm"
            className="rounded text-[11px] font-semibold border-border text-foreground hover:bg-muted h-6 px-2"
            leftIcon={
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current shrink-0">
                <circle cx="12" cy="4.5" r="2.5" />
                <path d="M15 8.5H9c-1.1 0-2 .9-2 2v4.5h2v6h2v-6h2v6h2v-6h2v-4.5c0-1.1-.9-2-2-2z" />
              </svg>
            }
          >
            Street
          </Button>

          <Button
            type="button"
            onClick={() => {
              const url = `https://www.google.com/maps?q=${vehicle.location.lat},${vehicle.location.lng}`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            title="Google Maps"
            aria-label="Google Maps"
            variant="outline"
            size="sm"
            className="rounded text-[11px] font-semibold border-border text-foreground hover:bg-muted h-6 px-2"
            leftIcon={<ExternalLink className="w-3 h-3 shrink-0" />}
          >
            Maps
          </Button>

          <div className="h-3.5 w-px bg-border mx-0.5 hidden sm:block" />

          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded border border-border text-foreground-muted hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800 transition-colors focus:outline-none"
            aria-label="Tutup"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* -- Row 2: Compact Telemetry Strip ----------------------------------- */}
      <div className="flex-1 px-3 py-1.5 overflow-hidden flex flex-col justify-center">
        {activeTab === 'umum' ? (
          <div className="h-[88px] min-h-[88px] max-h-[88px] grid grid-cols-2 md:grid-cols-4 divide-x divide-border/50 bg-surface/50 rounded-lg animate-overview-tab">

            {/* Col 1: Driver, Speed, ACC */}
            <div className="flex flex-col justify-between py-1.5 px-3 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-foreground-muted font-medium flex items-center gap-1 truncate">
                  <User className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                  <strong className="text-foreground truncate">{vehicle.driverName || '-'}</strong>
                </span>
                {vehicle.acc !== undefined && (
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 border",
                      vehicle.acc
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-danger bg-danger/10 border-danger/20"
                    )}
                  >
                    ACC {vehicle.acc ? 'ON' : 'OFF'}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1.5 my-0.5">
                <Gauge className="w-3.5 h-3.5 text-primary shrink-0 self-center" />
                <span className="text-lg font-black font-mono tracking-tight text-foreground leading-none">
                  {vehicle.speed}
                </span>
                <span className="text-[11px] font-bold text-foreground-muted">km/h</span>
              </div>
              <span className="text-[10px] text-foreground-muted truncate">
                Tipe: <strong className="text-foreground font-semibold">{vehicle.vehicleType || '-'}</strong>
              </span>
            </div>

            {/* Col 2: Address & Alarm */}
            <div className="flex flex-col justify-between py-1.5 px-3 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-foreground-muted font-medium flex items-center gap-1 truncate">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="font-semibold">{tTracking.popupAddress}</span>
                </span>
                {vehicle.alarmEvent && vehicle.alarmEvent !== '-' && (
                  <span className="text-[9px] font-bold text-danger bg-danger/10 border border-danger/20 px-1.5 py-0.5 rounded truncate">
                    {vehicle.alarmEvent}
                  </span>
                )}
              </div>
              <p
                className="text-[11px] font-medium text-foreground leading-snug line-clamp-1 my-0.5"
                title={vehicle.location.address}
              >
                {vehicle.location.address || '-'}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-mono text-foreground-muted truncate">
                <Crosshair className="w-3 h-3 text-foreground-subtle shrink-0" />
                <span className="truncate">{coords}</span>
              </div>
            </div>

            {/* Col 3: Geofence & Heading */}
            <div className="flex flex-col justify-between py-1.5 px-3 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-foreground-muted font-medium flex items-center gap-1 truncate">
                  <SquareDashedBottom className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <strong className="text-foreground truncate">
                    {vehicle.geofenceName && vehicle.geofenceName !== '-' ? vehicle.geofenceName : 'Luar Geofence'}
                  </strong>
                </span>
                <span className="text-[9px] font-mono font-bold text-foreground-muted shrink-0 flex items-center gap-0.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3 h-3 fill-current text-primary"
                    style={{ transform: `rotate(${heading}deg)` }}
                  >
                    <path d="M12 2L21 21L12 17L3 21L12 2Z" />
                  </svg>
                  {heading}°
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted my-0.5 truncate">
                <Layers className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                <span className="truncate">{vehicle.geofenceArea && vehicle.geofenceArea !== '-' ? vehicle.geofenceArea : '-'}</span>
              </div>
              <span className="text-[10px] text-foreground-muted truncate">
                Status: <strong className={vehicle.geofenceName && vehicle.geofenceName !== '-' ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground-muted'}>
                  {vehicle.geofenceName && vehicle.geofenceName !== '-' ? 'Di Dalam Area' : 'Di Luar Area'}
                </strong>
              </span>
            </div>

            {/* Col 4: Coordinates, GPS SN, Last Update */}
            <div className="flex flex-col justify-between py-1.5 px-3 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] text-foreground-muted font-medium flex items-center gap-1 truncate">
                  <Wifi className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-mono font-bold text-foreground">{vehicle.gpsSerialNumber || '-'}</span>
                </span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  ONLINE
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-foreground-muted my-0.5 truncate">
                <Clock className="w-3.5 h-3.5 text-foreground-subtle shrink-0" />
                <span className="truncate">{formattedDate}</span>
              </div>
              <div className="text-[10px] text-foreground-muted truncate">
                Kota: <strong className="text-foreground font-semibold">{vehicle.city || '-'}</strong>
              </div>
            </div>

          </div>
        ) : (
          /* Context Data View (Compact) */
          <div className="h-[88px] min-h-[88px] max-h-[88px] grid grid-cols-2 md:grid-cols-4 divide-x divide-border/50 bg-surface/50 rounded-lg animate-overview-tab">
            {(() => {
              const items = vehicleContext?.data || [];
              const perCol = Math.ceil(items.length / 4);
              return Array.from({ length: 4 }).map((_, colIndex) => {
                const chunk = items.slice(colIndex * perCol, (colIndex + 1) * perCol);
                return (
                  <div
                    key={colIndex}
                    className="flex flex-col justify-center px-2.5 py-0.5 min-w-0"
                  >
                    {chunk.map((field, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-1 min-w-0 py-0.2">
                        <span className="text-[9px] font-medium text-foreground-muted truncate">
                          {field.label}:
                        </span>
                        <span className={cn(
                          "text-[10px] font-bold truncate text-foreground",
                          field.type === 'status' && field.value === 'RENTED' && 'text-primary',
                          field.type === 'status' && field.value === 'READY' && 'text-success',
                          field.type === 'status' && field.value === 'RESERVED' && 'text-warning',
                          field.type === 'currency' && 'text-accent font-extrabold'
                        )}>
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      <ShareLocationDialog
        vehicle={vehicle}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
}
