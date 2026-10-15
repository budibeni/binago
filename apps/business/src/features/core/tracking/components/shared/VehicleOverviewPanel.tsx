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
  Hexagon,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { Locale } from '@adatrack/types';
import { getTranslation } from '../../../../../i18n';
import type { TrackingVehicle, VehicleContext } from '../../types/tracking';
import { ShareLocationDialog } from '../../../sharing/components/ShareLocationDialog';
import { useShareLocation } from '../../../sharing/context/ShareLocationContext';
import { CreateGeofenceFromVehicleModal } from './CreateGeofenceFromVehicleModal';

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
    color: 'text-gray-500 dark:text-neutral-400',
    bg: 'bg-gray-100 dark:bg-neutral-800',
    border: 'border-gray-500/20',
    dot: 'bg-gray-400',
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
  const statusLabels: Record<string, string> = {
    driving: locale === 'en' ? 'Driving' : 'Berjalan',
    idle: 'Idle',
    parking: locale === 'en' ? 'Parking' : 'Parkir',
    offline: 'Offline',
  };
  const baseStatus = STATUS_CONFIG[vehicle.status] || STATUS_CONFIG.offline;
  const status = {
    ...baseStatus,
    label: statusLabels[vehicle.status] || baseStatus.label,
  };

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [geofenceModalOpen, setGeofenceModalOpen] = useState(false);
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
  const headingTitle = locale === 'id' ? `Arah: ${heading}°` : `Heading: ${heading}°`; return (
    <div
      className={cn(
        'flex flex-col h-full w-full bg-gray-50 dark:bg-neutral-950 select-none justify-between overflow-hidden relative animate-overview-in',
        className
      )}
    >
      {/* -- Row 1: Header Bar (34px) --------------------------------- */}
      <div className="flex items-center justify-between gap-2 px-3 py-1 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 shrink-0 h-[34px]">

        {/* Left: Plate + Status + Context Tabs */}
        <div className="flex items-center gap-2.5 min-w-0">

          {/* License Plate (Bold Clean Monospace) */}
          <div
            className="flex items-center gap-1.5 shrink-0"
            title={headingTitle}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-2.5 h-2.5 fill-current text-gray-400 dark:text-neutral-500 transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${heading}deg)` }}
            >
              <path d="M12 2L21 21L12 17L3 21L12 2Z" />
            </svg>
            <span className="font-mono text-xs font-bold tracking-wider uppercase text-foreground">
              {vehicle.plateNumber}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium border shrink-0',
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
            <div className="hidden sm:flex items-center h-full ml-1 shrink-0 gap-2 border-l border-gray-200 dark:border-neutral-800 pl-2">
              <button
                type="button"
                onClick={() => setActiveTab('umum')}
                className={cn(
                  "h-full text-[10px] transition-colors border-b-2 -mb-[1px] flex items-center justify-center px-1 font-medium",
                  activeTab === 'umum'
                    ? "border-red-600 text-foreground font-semibold"
                    : "border-transparent text-foreground-muted hover:text-foreground"
                )}
              >
                {tTracking.popupGeneral}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('context')}
                className={cn(
                  "h-full text-[10px] transition-colors border-b-2 -mb-[1px] flex items-center justify-center px-1 font-medium",
                  activeTab === 'context'
                    ? "border-red-600 text-foreground font-semibold"
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
          {/* 1. Playback */}
          <button
            type="button"
            onClick={onPlayback}
            title={tTracking.popupPlayback}
            className="flex items-center gap-1.5 h-6 px-2.5 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 text-[11px] font-medium transition-colors focus:outline-none"
          >
            <History className="w-3 h-3 shrink-0 text-gray-500 dark:text-neutral-400" />
            <span className="hidden sm:inline">{tTracking.popupPlayback}</span>
          </button>

          {/* 2. Create Geofence */}
          <button
            type="button"
            onClick={() => setGeofenceModalOpen(true)}
            title={locale === 'id' ? 'Buat Geofence' : 'Create Geofence'}
            className="flex items-center gap-1.5 h-6 px-2 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 text-[11px] font-medium transition-colors focus:outline-none"
          >
            <Hexagon className="w-3 h-3 shrink-0 text-gray-500 dark:text-neutral-400" />
            <span className="hidden sm:inline">Geofence</span>
          </button>

          {/* 3. Google Maps */}
          <button
            type="button"
            onClick={() => {
              const url = `https://www.google.com/maps?q=${vehicle.location.lat},${vehicle.location.lng}`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
            title={locale === 'id' ? 'Buka Google Maps' : 'Open Google Maps'}
            className="flex items-center gap-1.5 h-6 px-2 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 text-[11px] font-medium transition-colors focus:outline-none"
          >
            <ExternalLink className="w-3 h-3 shrink-0 text-gray-500 dark:text-neutral-400" />
            <span className="hidden sm:inline">Maps</span>
          </button>

          {/* 4. Google Maps Street View */}
          <button
            type="button"
            onClick={() => {
              const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${vehicle.location.lat},${vehicle.location.lng}${heading !== undefined ? `&heading=${heading}` : ''}`;
              window.open(streetViewUrl, '_blank', 'noopener,noreferrer');
            }}
            title="Google Maps Street View"
            className="flex items-center gap-1.5 h-6 px-2 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 text-[11px] font-medium transition-colors focus:outline-none"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current shrink-0 text-gray-500 dark:text-neutral-400">
              <circle cx="12" cy="4.5" r="2.5" />
              <path d="M15 8.5H9c-1.1 0-2 .9-2 2v4.5h2v6h1.5v-5.5h3v5.5H15v-6h2v-4.5c0-1.1-.9-2-2-2z" />
            </svg>
            <span className="hidden sm:inline">Street</span>
          </button>

          {/* 5. Share Location (Bagikan) */}
          <button
            type="button"
            onClick={() => {
              if (onShareLocation) onShareLocation();
              setShareDialogOpen(true);
            }}
            title={activeShare ? (locale === 'id' ? 'Tautan Dibagikan (Aktif)' : 'Shared Link (Active)') : (locale === 'id' ? 'Bagikan Lokasi' : 'Share Location')}
            className={cn(
              "flex items-center gap-1.5 h-6 px-2 rounded border text-[11px] font-medium transition-colors focus:outline-none",
              activeShare
                ? "border-emerald-500/40 bg-emerald-50/40 text-gray-700 dark:bg-emerald-950/20 dark:text-neutral-300"
                : "border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-700"
            )}
          >
            <Share2 className={cn("w-3 h-3 shrink-0", activeShare ? "text-emerald-600 dark:text-emerald-400 fill-current" : "text-gray-500 dark:text-neutral-400")} />
            <span className="hidden sm:inline">{activeShare ? (locale === 'id' ? 'Dibagikan' : 'Shared') : (locale === 'id' ? 'Bagikan' : 'Share')}</span>
          </button>

          <div className="h-3.5 w-px bg-gray-200 dark:bg-neutral-800 mx-0.5 hidden sm:block" />

          {/* 6. Close button (X) */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors focus:outline-none"
            aria-label={locale === 'id' ? 'Tutup' : 'Close'}
            title={locale === 'id' ? 'Tutup (Esc)' : 'Close (Esc)'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* -- Row 2: Modular KPI Cards Grid ---------------------------- */}
      <div className="flex-1 px-3 py-1.5 overflow-hidden flex flex-col justify-center">
        {activeTab === 'umum' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 h-[74px] animate-overview-tab">

            {/* KPI Card 1: Speed & Ignition */}
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-2 flex flex-col justify-between min-w-0 transition-all hover:border-gray-300 dark:hover:border-neutral-600">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 flex items-center gap-1 uppercase tracking-wider">
                  <Gauge className="w-3 h-3 text-primary shrink-0" />
                  {locale === 'id' ? 'Kecepatan' : 'Speed'}
                </span>
                {vehicle.acc !== undefined && (
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-[1px] rounded uppercase shrink-0 border leading-none tracking-wide",
                      vehicle.acc
                        ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30"
                        : "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-500/30"
                    )}
                  >
                    ACC {vehicle.acc ? 'ON' : 'OFF'}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-xl font-black font-mono tracking-tight text-foreground leading-none">
                  {vehicle.speed}
                </span>
                <span className="text-[10px] font-bold text-gray-500 dark:text-neutral-400">km/h</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-neutral-400 truncate">
                <span>{locale === 'id' ? 'Tipe:' : 'Type:'}</span>
                <span className="font-semibold text-foreground truncate">{vehicle.vehicleType || '-'}</span>
              </div>
            </div>

            {/* KPI Card 2: Driver & Hardware */}
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-2 flex flex-col justify-between min-w-0 transition-all hover:border-gray-300 dark:hover:border-neutral-600">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 flex items-center gap-1 uppercase tracking-wider">
                  <User className="w-3 h-3 text-primary shrink-0" />
                  {locale === 'id' ? 'Pengemudi' : 'Driver'}
                </span>
                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-[1px] rounded leading-none shrink-0">
                  ONLINE
                </span>
              </div>
              <div className="font-bold text-xs text-foreground truncate my-0.5" title={vehicle.driverName || (locale === 'id' ? 'Tidak Ada Pengemudi' : 'No Driver')}>
                {vehicle.driverName || (locale === 'id' ? 'Tidak Ada Pengemudi' : 'No Driver')}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500 dark:text-neutral-400 truncate">
                <Wifi className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">SN: {vehicle.gpsSerialNumber || '-'}</span>
              </div>
            </div>

            {/* KPI Card 3: Location & Address */}
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-2 flex flex-col justify-between min-w-0 transition-all hover:border-gray-300 dark:hover:border-neutral-600">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 flex items-center gap-1 uppercase tracking-wider">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  {locale === 'id' ? 'Lokasi Terkini' : 'Current Location'}
                </span>
                {vehicle.alarmEvent && vehicle.alarmEvent !== '-' && (
                  <span className="text-[9px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 px-1.5 py-[1px] rounded truncate leading-none">
                    {vehicle.alarmEvent}
                  </span>
                )}
              </div>
              <p
                className="text-[11px] font-medium text-foreground leading-tight line-clamp-1 my-0.5"
                title={vehicle.location.address}
              >
                {vehicle.location.address || '-'}
              </p>
              <div className="flex items-center justify-between gap-1 text-[10px] truncate">
                <span className="flex items-center gap-1 font-mono text-gray-500 dark:text-neutral-400 truncate">
                  <Crosshair className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="truncate">{coords}</span>
                </span>
                {vehicle.city && (
                  <span className="font-medium text-foreground-muted shrink-0 text-[10px] hidden sm:inline">
                    {vehicle.city}
                  </span>
                )}
              </div>
            </div>

            {/* KPI Card 4: Geofence & Heading */}
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-2 flex flex-col justify-between min-w-0 transition-all hover:border-gray-300 dark:hover:border-neutral-600">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-gray-500 dark:text-neutral-400 flex items-center gap-1 uppercase tracking-wider">
                  <SquareDashedBottom className="w-3 h-3 text-sky-500 shrink-0" />
                  Geofence
                </span>
                <span className={cn(
                  "text-[9px] font-bold px-1.5 py-[1px] rounded uppercase shrink-0 border leading-none",
                  vehicle.geofenceName && vehicle.geofenceName !== '-'
                    ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30"
                    : "text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700"
                )}>
                  {vehicle.geofenceName && vehicle.geofenceName !== '-' ? (locale === 'id' ? 'Dalam' : 'Inside') : (locale === 'id' ? 'Luar' : 'Outside')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1.5 my-0.5 min-w-0">
                <span className="font-bold text-xs text-foreground truncate" title={vehicle.geofenceName || (locale === 'id' ? 'Luar Geofence' : 'Outside Geofence')}>
                  {vehicle.geofenceName && vehicle.geofenceName !== '-' ? vehicle.geofenceName : (locale === 'id' ? 'Luar Geofence' : 'Outside Geofence')}
                </span>
                <span className="inline-flex items-center gap-1 shrink-0 font-mono font-bold text-[11px] text-foreground bg-gray-100 dark:bg-neutral-700 px-1.5 py-[2px] rounded border border-gray-200 dark:border-neutral-700 leading-none" title={headingTitle}>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-2.5 h-2.5 fill-current text-primary shrink-0 transition-transform duration-300"
                    style={{ transform: `rotate(${heading}deg)` }}
                  >
                    <path d="M12 2L21 21L12 17L3 21L12 2Z" />
                  </svg>
                  <span>{heading}°</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500 dark:text-neutral-400 truncate">
                <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{formattedDate}</span>
              </div>
            </div>

          </div>
        ) : (
          /* Context Data View (Matching 4 Modular KPI Cards) */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 h-[74px] animate-overview-tab">
            {(() => {
              const items = vehicleContext?.data || [];
              const perCol = Math.ceil(items.length / 4);
              return Array.from({ length: 4 }).map((_, colIndex) => {
                const chunk = items.slice(colIndex * perCol, (colIndex + 1) * perCol);
                return (
                  <div
                    key={colIndex}
                    className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-2 flex flex-col justify-center min-w-0"
                  >
                    {chunk.map((field, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-1 min-w-0 py-0.5">
                        <span className="text-[10px] font-medium text-gray-500 dark:text-neutral-400 truncate">
                          {field.label}:
                        </span>
                        <span className={cn(
                          "text-xs font-bold truncate text-foreground",
                          field.type === 'status' && field.value === 'RENTED' && 'text-primary',
                          field.type === 'status' && field.value === 'READY' && 'text-emerald-600 dark:text-emerald-400',
                          field.type === 'status' && field.value === 'RESERVED' && 'text-amber-600 dark:text-amber-400',
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

      <CreateGeofenceFromVehicleModal
        isOpen={geofenceModalOpen}
        onClose={() => setGeofenceModalOpen(false)}
        vehicle={vehicle}
        locale={locale}
      />
    </div>
  );
}
