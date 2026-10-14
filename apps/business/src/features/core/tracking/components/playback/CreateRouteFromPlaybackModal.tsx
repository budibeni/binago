'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@adatrack/ui';
import { Route as RouteIcon, Clock, MapPin, Gauge, Shield, ArrowRight, RotateCcw, Scissors } from 'lucide-react';
import type { MockPlaybackData, MockPlaybackTrackPoint } from '../../data/mockTrackingData';
import type { TrackingVehicle } from '../../types/tracking';
import type { Geofence } from '@/features/core/geofences/types';
import type { ParkingEvent } from './PlaybackMap';
import type { Route, RouteLocation, RouteStop } from '@/features/core/routes/types';
import { findGeofenceForCoordinate } from '../../utils/playbackLayerMatcher';

export interface CreateRouteFromPlaybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  playbackData: MockPlaybackData | null;
  vehicle: TrackingVehicle | null;
  geofences?: Geofence[];
  parkingEvents?: ParkingEvent[];
}

function downsamplePoints(pts: MockPlaybackTrackPoint[], maxPoints = 120): MockPlaybackTrackPoint[] {
  if (pts.length <= maxPoints) return pts;
  const step = (pts.length - 1) / (maxPoints - 1);
  const result: MockPlaybackTrackPoint[] = [];
  for (let i = 0; i < maxPoints - 1; i++) {
    result.push(pts[Math.round(i * step)]);
  }
  result.push(pts[pts.length - 1]);
  return result;
}

function formatDuration(totalSecs: number): string {
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  if (hours > 0) {
    return `${hours} jam ${minutes} menit`;
  }
  return `${minutes} menit`;
}

function formatTimeOnly(timestamp: string): string {
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return timestamp;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch {
    return timestamp;
  }
}

export function CreateRouteFromPlaybackModal({
  isOpen,
  onClose,
  playbackData,
  vehicle,
  geofences = [],
  parkingEvents = [],
}: CreateRouteFromPlaybackModalProps) {
  const router = useRouter();

  const points = useMemo(() => playbackData?.points || [], [playbackData]);
  const totalPoints = points.length;

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [routeName, setRouteName] = useState('');

  // Reset range when modal opens or playback data changes
  useEffect(() => {
    if (isOpen && points.length > 0) {
      setStartIndex(0);
      setEndIndex(points.length - 1);
    }
  }, [isOpen, points.length]);

  // Trimmed points
  const trimmedPoints = useMemo(() => {
    if (points.length === 0) return [];
    const s = Math.max(0, Math.min(startIndex, points.length - 1));
    const e = Math.max(s, Math.min(endIndex, points.length - 1));
    return points.slice(s, e + 1);
  }, [points, startIndex, endIndex]);

  const startPt = trimmedPoints[0] || points[0];
  const endPt = trimmedPoints[trimmedPoints.length - 1] || points[points.length - 1];

  // Geofence detection for start & end
  const startGeofence = useMemo(() => {
    if (!startPt || geofences.length === 0) return undefined;
    return findGeofenceForCoordinate({ lat: startPt.lat, lng: startPt.lng }, geofences);
  }, [startPt, geofences]);

  const endGeofence = useMemo(() => {
    if (!endPt || geofences.length === 0) return undefined;
    return findGeofenceForCoordinate({ lat: endPt.lat, lng: endPt.lng }, geofences);
  }, [endPt, geofences]);

  // Derived metrics
  const calculatedDistanceKm = useMemo(() => {
    if (!startPt || !endPt) return 0;
    const odoDiff = endPt.odometer - startPt.odometer;
    return Math.max(0, Math.round(odoDiff * 10) / 10);
  }, [startPt, endPt]);

  const calculatedDurationSecs = useMemo(() => {
    return Math.max(0, (trimmedPoints.length - 1) * 15);
  }, [trimmedPoints.length]);

  const stopsInRange = useMemo(() => {
    return parkingEvents.filter((p) => p.pointIndex >= startIndex && p.pointIndex <= endIndex);
  }, [parkingEvents, startIndex, endIndex]);

  // Set default route name
  useEffect(() => {
    if (vehicle && (startPt || endPt)) {
      const fromLabel = startGeofence?.name || 'Asal';
      const toLabel = endGeofence?.name || 'Tujuan';
      setRouteName(`Rute ${vehicle.plateNumber} (${fromLabel} - ${toLabel})`);
    }
  }, [vehicle, startGeofence, endGeofence, startPt, endPt]);

  // Presets
  const handleResetFull = () => {
    setStartIndex(0);
    setEndIndex(points.length - 1);
  };

  const handleTrimIdle = () => {
    if (points.length === 0) return;
    const firstMoveIdx = points.findIndex((p) => p.speed > 0);
    let lastMoveIdx = -1;
    for (let i = points.length - 1; i >= 0; i--) {
      if (points[i].speed > 0) {
        lastMoveIdx = i;
        break;
      }
    }
    if (firstMoveIdx >= 0 && lastMoveIdx > firstMoveIdx) {
      setStartIndex(Math.max(0, firstMoveIdx - 1));
      setEndIndex(Math.min(points.length - 1, lastMoveIdx + 1));
    }
  };

  const handleProceed = () => {
    if (!startPt || !endPt || trimmedPoints.length === 0) return;

    const originLocation: RouteLocation = startGeofence
      ? {
          type: 'geofence',
          geofenceId: startGeofence.id,
          latitude: startPt.lat,
          longitude: startPt.lng,
          address: startGeofence.name,
        }
      : {
          type: 'coordinate',
          latitude: startPt.lat,
          longitude: startPt.lng,
          address: startPt.address ?? `${startPt.lat.toFixed(5)}, ${startPt.lng.toFixed(5)}`,
        };

    const destLocation: RouteLocation = endGeofence
      ? {
          type: 'geofence',
          geofenceId: endGeofence.id,
          latitude: endPt.lat,
          longitude: endPt.lng,
          address: endGeofence.name,
        }
      : {
          type: 'coordinate',
          latitude: endPt.lat,
          longitude: endPt.lng,
          address: endPt.address ?? `${endPt.lat.toFixed(5)}, ${endPt.lng.toFixed(5)}`,
        };

    const stops: RouteStop[] = stopsInRange.map((p, i) => {
      const stopGf =
        p.geofenceId ||
        (p.geofenceName ? geofences.find((g) => g.name === p.geofenceName)?.id : undefined);
      return {
        id: `stop-${i + 1}`,
        sequence: i + 1,
        location: stopGf
          ? {
              type: 'geofence',
              geofenceId: stopGf,
              latitude: p.lat,
              longitude: p.lng,
              address: p.geofenceName,
            }
          : {
              type: 'coordinate',
              latitude: p.lat,
              longitude: p.lng,
              address: p.address,
            },
      };
    });

    const sampled = downsamplePoints(trimmedPoints, 120);

    const draftRoute: Partial<Route> = {
      name: routeName.trim() || `Rute ${vehicle?.plateNumber ?? ''}`,
      description: `Dibuat dari riwayat perjalanan playback armada ${vehicle?.plateNumber ?? ''} (${startPt.timestamp.slice(0, 10)})`,
      origin: originLocation,
      destination: destLocation,
      stops,
      plannedPath: {
        type: 'multiline',
        coordinates: sampled.map((p) => ({ lat: p.lat, lng: p.lng })),
      },
      plannedDistance: calculatedDistanceKm,
      estimatedDuration: Math.round(calculatedDurationSecs / 60),
      status: 'active',
    };

    // Save to sessionStorage and navigate
    sessionStorage.setItem('adatrack_draft_route', JSON.stringify(draftRoute));
    onClose();
    router.push('/routes');
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      className="max-w-xl p-5 bg-background border border-border shadow-2xl rounded-xl"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <RouteIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-foreground leading-tight">
              Buat Rute dari Hasil Playback
            </h2>
            <p className="text-[11px] text-foreground-muted leading-tight mt-0.5">
              Pilih dan potong rentang waktu perjalanan yang ingin dikonversi menjadi Master Rute.
            </p>
          </div>
        </div>

        {/* Input Nama Rute */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-foreground">Nama Rute Master</label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Masukkan nama rute..."
            className="w-full px-3 py-1.5 text-[12px] rounded border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
          />
        </div>

        {/* Range Selection / Trim Sliders */}
        <div className="flex flex-col gap-2 p-3 rounded-lg bg-surface border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-primary" />
              Seleksi Potongan Waktu (Trimming)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleTrimIdle}
                className="px-2 py-0.5 text-[10px] font-medium rounded bg-background hover:bg-muted border border-border text-foreground transition-colors"
                title="Potong waktu berhenti di awal dan akhir perjalanan"
              >
                Potong Diam
              </button>
              <button
                type="button"
                onClick={handleResetFull}
                className="px-2 py-0.5 text-[10px] font-medium rounded bg-background hover:bg-muted border border-border text-foreground transition-colors flex items-center gap-1"
                title="Kembalikan ke seluruh durasi perjalanan"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Penuh
              </button>
            </div>
          </div>

          {/* Slider Mulai */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="text-foreground-muted font-medium">Titik Mulai:</span>
              <span className="font-semibold text-foreground">
                {startPt ? `${formatTimeOnly(startPt.timestamp)} (${startPt.timestamp.slice(0, 10)})` : '-'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(0, endIndex - 1)}
              value={startIndex}
              onChange={(e) => setStartIndex(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider Selesai */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="text-foreground-muted font-medium">Titik Selesai:</span>
              <span className="font-semibold text-foreground">
                {endPt ? `${formatTimeOnly(endPt.timestamp)} (${endPt.timestamp.slice(0, 10)})` : '-'}
              </span>
            </div>
            <input
              type="range"
              min={Math.min(totalPoints - 1, startIndex + 1)}
              max={Math.max(0, totalPoints - 1)}
              value={endIndex}
              onChange={(e) => setEndIndex(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Selected Segment Summary Card */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Asal */}
          <div className="p-2.5 rounded-lg bg-surface border border-border flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-emerald-600" />
              Titik Asal (Origin)
            </div>
            <p className="text-[11.5px] font-semibold text-foreground truncate">
              {startGeofence?.name || startPt?.address || 'Koordinat Awal'}
            </p>
            {startGeofence && (
              <span className="inline-flex items-center gap-1 w-fit px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                <Shield className="w-2.5 h-2.5" />
                Geofence: {startGeofence.name}
              </span>
            )}
          </div>

          {/* Tujuan */}
          <div className="p-2.5 rounded-lg bg-surface border border-border flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-red-500" />
              Titik Tujuan (Destination)
            </div>
            <p className="text-[11.5px] font-semibold text-foreground truncate">
              {endGeofence?.name || endPt?.address || 'Koordinat Akhir'}
            </p>
            {endGeofence && (
              <span className="inline-flex items-center gap-1 w-fit px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                <Shield className="w-2.5 h-2.5" />
                Geofence: {endGeofence.name}
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 py-2 px-3 rounded-lg bg-surface border border-border text-center">
          <div>
            <p className="text-[9px] font-semibold uppercase text-foreground-muted">Jarak</p>
            <p className="text-[12px] font-bold text-foreground">{calculatedDistanceKm} km</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase text-foreground-muted">Durasi</p>
            <p className="text-[12px] font-bold text-foreground">
              {formatDuration(calculatedDurationSecs)}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase text-foreground-muted">Waypoints</p>
            <p className="text-[12px] font-bold text-foreground">{trimmedPoints.length} titik</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase text-foreground-muted">Perhentian</p>
            <p className="text-[12px] font-bold text-foreground">{stopsInRange.length} lokasi</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-[11px] font-semibold text-foreground bg-surface hover:bg-muted border border-border rounded transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleProceed}
            className="px-4 py-1.5 text-[11px] font-semibold text-white bg-primary hover:bg-primary/90 rounded transition-colors flex items-center gap-1.5 shadow-sm"
          >
            Lanjutkan ke Buat Rute
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Dialog>
  );
}
