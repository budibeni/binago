'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Car, Clock, WifiOff, Lock, Share2 } from 'lucide-react';
import { MapContainer } from '@adatrack/maps';
import { AdatrackLogo } from '@adatrack/ui';
import { ShareSession } from '@/features/sharing/types';
import { mockShareSessions } from '@/features/sharing/data/mockLocationSharing';
import { mockVehicles } from '@/features/tracking/data/mockTrackingData';
import type { TrackingVehicle as Vehicle } from '@/features/tracking/types/tracking';

// Inline mini-dictionary for public page (no shell locale context available)
const translations = {
  id: {
    liveLocation: 'Lokasi Langsung',
    lastUpdated: 'Diperbarui',
    locationUnavailable: 'Lokasi tidak tersedia',
    locationUnavailableDesc: 'Perangkat GPS belum mengirim lokasi.',
    poweredBy: 'Layanan oleh ADATRACK',
    countdown: 'Berakhir dalam',
    sharedBy: 'Dibagikan via ADATRACK',
    linkInactive: 'Link tidak aktif',
    linkInactiveDesc: 'Link berbagi lokasi ini sudah tidak tersedia.',
    linkExpired: 'Link berbagi lokasi telah kedaluwarsa.',
    linkRevoked: 'Berbagi lokasi telah dihentikan oleh pemilik kendaraan.',
    linkNotFound: 'Link tidak ditemukan atau tidak valid.',
    statusDriving: 'Berjalan',
    statusIdle: 'Berhenti',
    statusParking: 'Parkir',
    statusOffline: 'Offline',
    speedUnit: 'km/jam',
    offlineLastLocation: 'Lokasi terakhir',
  },
};

const t = translations.id;

function useCountdown(expiresAt: string) {
  const calc = () => {
    const diff = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const s = Math.floor(diff / 1000);
    return {
      h: Math.floor(s / 3600),
      m: Math.floor((s % 3600) / 60),
      s: s % 60,
      expired: diff === 0,
    };
  };

  const [state, setState] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => {
      const next = calc();
      setState(next);
      if (next.expired) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return state;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours} jam lalu`;
  if (minutes > 0) return `${minutes} menit lalu`;
  return 'baru saja';
}


interface ResolvedData {
  session: ShareSession;
  vehicle: Vehicle;
}

// resolveToken is kept here for future backend integration
// where token resolution will happen server-side

// --------------------------------------------------
// Sub-components
// --------------------------------------------------

function InactiveState({ reason }: { reason: 'expired' | 'revoked' | 'not_found' }) {
  const msg =
    reason === 'expired'
      ? t.linkExpired
      : reason === 'revoked'
        ? t.linkRevoked
        : t.linkNotFound;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-foreground p-8">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center">
        <div className="w-20 h-20 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
          <Lock className="w-10 h-10 text-foreground-muted" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t.linkInactive}</h1>
          <p className="text-sm text-foreground-muted mt-2">{msg}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Share2 className="w-4 h-4" />
          <span>{t.poweredBy}</span>
        </div>
      </div>
    </div>
  );
}

function LiveTrackingView({ data }: { data: ResolvedData }) {
  const { session, vehicle } = data;
  const countdown = useCountdown(session.expiresAt);
  const isOffline = vehicle.status === 'offline';

  const statusText =
    vehicle.status === 'driving'
      ? t.statusDriving
      : vehicle.status === 'idle'
        ? t.statusIdle
        : vehicle.status === 'parking'
          ? t.statusParking
          : t.statusOffline;

  const statusColor =
    vehicle.status === 'driving'
      ? 'text-green-600 dark:text-green-400'
      : vehicle.status === 'idle'
        ? 'text-amber-600 dark:text-amber-400'
        : vehicle.status === 'parking'
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-foreground-muted';

  const dotColor =
    vehicle.status === 'driving'
      ? 'bg-green-500'
      : vehicle.status === 'idle'
        ? 'bg-amber-500'
        : vehicle.status === 'parking'
          ? 'bg-blue-500'
          : 'bg-neutral-400';

  if (countdown.expired) {
    return <InactiveState reason="expired" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-foreground">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <AdatrackLogo className="h-6" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-foreground-muted bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>{t.liveLocation}</span>
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 min-h-[50vh]">
        <MapContainer
          viewport={{
            center: { lat: vehicle.location.lat, lng: vehicle.location.lng },
            zoom: 15,
          }}
          placeholderText={`${vehicle.vehicleType ?? ''} • ${vehicle.plateNumber}`}
          className="w-full h-full min-h-[50vh] rounded-none border-0"
        />
      </div>

      {/* Info Panel */}
      <div className="shrink-0 bg-surface border-t border-border">
        <div className="p-4 space-y-3 max-w-2xl mx-auto">
          {/* Vehicle Identity */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 flex items-center justify-center shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-base leading-tight">{vehicle.vehicleType ?? vehicle.plateNumber}</h1>
              <p className="text-sm text-foreground-muted">{vehicle.plateNumber}</p>
            </div>
          </div>

          {/* Status Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {isOffline
                ? <WifiOff className="w-4 h-4 text-foreground-muted" />
                : <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
              }
              <span className={`text-sm font-semibold ${statusColor}`}>{statusText}</span>
              {vehicle.speed !== undefined && vehicle.speed > 0 && (
                <span className="text-xs text-foreground-muted">{vehicle.speed} {t.speedUnit}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.lastUpdated} {formatRelativeTime(vehicle.lastUpdate)}</span>
            </div>
          </div>

          {/* Location */}
          {vehicle.location.address && (
            <div className="flex items-start gap-2 text-sm text-foreground-muted">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{vehicle.location.address}</span>
            </div>
          )}

          {/* Countdown */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-foreground-muted">{t.countdown}</span>
            <span className="font-mono text-sm font-bold text-foreground tabular-nums">
              {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </span>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-foreground-muted pt-1">{t.poweredBy}</p>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Main export
// --------------------------------------------------

interface PublicLocationPageProps {
  token: string;
  // Allow override from server-component (for SSG scenarios later)
  sessions?: ShareSession[];
}

export function PublicLocationPage({ token, sessions }: PublicLocationPageProps) {
  const source = sessions ?? mockShareSessions;
  const targetSession = source.find((s) => s.token === token);

  if (!targetSession) return <InactiveState reason="not_found" />;
  if (targetSession.status === 'revoked') return <InactiveState reason="revoked" />;

  const now = Date.now();
  const isExpired = new Date(targetSession.expiresAt).getTime() <= now;
  if (targetSession.status === 'expired' || isExpired) return <InactiveState reason="expired" />;

  const vehicle = mockVehicles.find((v) => v.id === targetSession.vehicleId);
  if (!vehicle) return <InactiveState reason="not_found" />;

  return <LiveTrackingView data={{ session: targetSession, vehicle }} />;
}
