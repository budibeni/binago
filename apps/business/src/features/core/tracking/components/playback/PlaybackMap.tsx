'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrackingMap, useMapActions, MapMarker, MapPopup } from '@adatrack/maps';
import { Truck, Bus, CircleParking, Clock, Navigation, ExternalLink, X, Gauge, Activity, MapPin, Crosshair, Shield, Plus } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { TrackingVehicle } from '../../types/tracking';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import { PlaybackMapLayers } from './PlaybackMapLayers';
import { PlaybackVehicleMarker } from './PlaybackVehicleMarker';
import type { MockPlaybackTrackPoint } from '../../data/mockTrackingData';
import { findGeofenceForCoordinate, createCirclePolygon } from '../../utils/playbackLayerMatcher';
import { geofenceService } from '@/data/services';

// --- Types ---------------------------------------------------------------------

export interface ParkingEvent {
  lat: number;
  lng: number;
  address: string;
  startTimestamp: string;
  durationSecs: number;
  pointIndex: number;
  speed: number;
  odometer: number;
  geofenceName?: string;
  geofenceId?: string;
}

export interface PlaybackMapProps {
  vehicle: TrackingVehicle | null;
  currentPoint?: MockPlaybackTrackPoint | null;
  playbackTrack?: { lat: number; lng: number }[];
  playbackPassedTrack?: { lat: number; lng: number }[];
  playbackParkingEvents?: ParkingEvent[];
  selectedGeofenceIds?: string[];
  selectedRouteIds?: string[];
  cropTrack?: { lat: number; lng: number }[];
  isRouteCropMode?: boolean;
}

// --- Inner: auto-fit bounds when track loads -----------------------------------

function PlaybackFitBounds({ track }: { track?: { lat: number; lng: number }[] }) {
  const mapActions = useMapActions();

  useEffect(() => {
    if (!track || track.length < 2) return;

    let minLat = track[0].lat, maxLat = track[0].lat;
    let minLng = track[0].lng, maxLng = track[0].lng;
    for (const p of track) {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    }

    const id = setTimeout(() => {
      mapActions.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 60 }
      );
    }, 300);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  return null;
}

// --- Helpers -------------------------------------------------------------------

function formatDuration(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h} jam ${m} mnt`;
  if (m > 0) return `${m} mnt ${s} dtk`;
  return `${s} dtk`;
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  } catch {
    return iso;
  }
}

function formatPointTimestamp(iso?: string): string {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return iso;
  }
}

// --- InfoRow ------------------------------------------------------------------

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClassName,
  title,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  title?: string;
}) {
  return (
    <div className="flex items-start gap-1.5 min-w-0" title={title}>
      <Icon className="h-3 w-3 text-foreground-subtle mt-[2px] shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-foreground-muted mb-0.5 leading-none">
          {label}
        </p>
        <div className={cn('text-[11px] font-semibold text-foreground leading-tight', valueClassName)}>
          {value}
        </div>
      </div>
    </div>
  );
}

// --- Parking Marker with Popup -------------------------------------------------

function ParkingMarkerWithPopup({
  event,
  index,
  vehicleName,
  isOpen,
  onToggle,
  tTracking
}: {
  event: ParkingEvent;
  index: number;
  vehicleName: string;
  isOpen: boolean;
  onToggle: () => void;
  tTracking: any;
}) {
  const router = useRouter();
  const [geofenceRadius, setGeofenceRadius] = useState<number>(50);

  const googleMapsUrl = `https://www.google.com/maps?q=${event.lat},${event.lng}`;

  const geofenceName = event.geofenceName ?? useMemo(() => {
    const allGeofences = geofenceService.getGeofences();
    return findGeofenceForCoordinate({ lat: event.lat, lng: event.lng }, allGeofences)?.name;
  }, [event.lat, event.lng, event.geofenceName]);

  const handleCreateGeofence = () => {
    const circleCoords = createCirclePolygon({ lat: event.lat, lng: event.lng }, geofenceRadius);
    const draftGeofence = {
      name: event.address && event.address !== `${event.lat.toFixed(5)}, ${event.lng.toFixed(5)}`
        ? `Area ${event.address.split(',')[0].trim()}`
        : `Geofence Parkir #${index + 1}`,
      description: `Titik parkir ${vehicleName} pada ${formatTimestamp(event.startTimestamp)} (Radius ${geofenceRadius}m)`,
      status: 'active',
      geometry: {
        type: 'polygon' as const,
        coordinates: circleCoords,
      },
    };

    try {
      sessionStorage.setItem('adatrack_draft_geofence', JSON.stringify(draftGeofence));
    } catch (err) {
      console.error('Failed to save draft geofence to sessionStorage:', err);
    }

    router.push('/geofences');
  };

  return (
    <>
      {/* Marker "P" */}
      <MapMarker id={`park-${index}`} position={{ lat: event.lat, lng: event.lng }}>
        <div
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="cursor-pointer hover:scale-110 active:scale-95 transition-transform origin-bottom drop-shadow-sm"
          title={tTracking.playbackMarkerTooltip}
        >
          <svg width="22" height="33" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="#ef4444" stroke="white" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="7.5" fill="white" />
            <text x="12" y="12.5" dominantBaseline="central" textAnchor="middle" fill="#b91c1c" fontWeight="900" fontSize="11" fontFamily="system-ui, sans-serif" letterSpacing="-0.5">P</text>
          </svg>
        </div>
      </MapMarker>

      {/* Popup */}
      {isOpen && (
        <MapPopup
          position={{ lat: event.lat, lng: event.lng }}
          offset={[0, -28]}
          anchor="bottom"
          className="custom-parking-popup !z-[500]"
          onClose={onToggle}
          autoPanPadding={{ top: 80, bottom: 90, left: 30, right: 350 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="flex flex-col w-[280px] bg-background rounded-xl overflow-hidden shadow-2xl ring-1 ring-border text-foreground"
          >
            {/* -- Header -- */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border bg-surface/50 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                  <CircleParking className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-[11px] font-extrabold text-foreground tracking-wider uppercase leading-none truncate">
                      {vehicleName}
                    </h2>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-surface border border-border/80 text-foreground-muted leading-none">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 leading-none">
                      {tTracking.playbackParking}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="flex h-6 w-6 items-center justify-center rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors focus:outline-none shrink-0"
                title="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* -- Body -- */}
            <div className="p-2.5 flex flex-col gap-2">
              {/* Telemetry Card: Row 1 Waktu & Durasi, Row 2 Koordinat & Odometer */}
              <div className="p-2 rounded-lg bg-surface/50 border border-border/60 flex flex-col gap-2">
                {/* Waktu & Durasi */}
                <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2">
                  <div className="flex items-start gap-1.5 min-w-0 flex-1">
                    <Clock className="w-3 h-3 text-foreground-subtle mt-[2px] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-foreground-muted block leading-none mb-0.5">
                        {tTracking.playbackTime}
                      </span>
                      <span className="font-mono text-[10.5px] font-bold text-foreground leading-tight block whitespace-nowrap" title={formatTimestamp(event.startTimestamp)}>
                        {formatTimestamp(event.startTimestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-foreground-muted block leading-none mb-0.5">
                      {tTracking.playbackDuration}
                    </span>
                    <span className="text-[10.5px] font-semibold text-foreground leading-tight block whitespace-nowrap">
                      {formatDuration(event.durationSecs)}
                    </span>
                  </div>
                </div>

                {/* Koordinat & Odometer */}
                <div className="grid grid-cols-2 gap-2">
                  <InfoRow
                    icon={Crosshair}
                    label={tTracking.popupCoordinates}
                    value={<span className="font-mono text-[10px]">{event.lat.toFixed(4)}, {event.lng.toFixed(4)}</span>}
                    title={`${event.lat.toFixed(5)}, ${event.lng.toFixed(5)}`}
                  />
                  <InfoRow
                    icon={Gauge}
                    label={tTracking.playbackOdometer}
                    value={`${event.odometer.toLocaleString('id-ID', { minimumFractionDigits: 1 })} km`}
                  />
                </div>
              </div>

              {/* Geofence Info or Create Geofence Widget */}
              {geofenceName ? (
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-300/70 leading-none">
                        {tTracking.playbackGeofences ?? 'GEOFENCE'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[11px] font-bold truncate leading-tight mt-0.5 text-emerald-700 dark:text-emerald-300" title={geofenceName}>
                      {geofenceName}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-surface/70 border border-border">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-foreground-muted flex items-center gap-1">
                      <Shield className="w-3 h-3 text-amber-500 shrink-0" />
                      Geofence:
                    </span>
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <span className="text-foreground-muted text-[9px]">Radius:</span>
                      <input
                        type="number"
                        min={10}
                        max={5000}
                        step={5}
                        value={geofenceRadius}
                        onChange={(e) => setGeofenceRadius(Math.max(1, Number(e.target.value) || 50))}
                        className="w-12 px-1 py-0.5 text-right font-mono text-[10.5px] font-bold bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-danger text-foreground"
                      />
                      <span className="text-foreground-muted text-[9px]">m</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateGeofence}
                    className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded-md bg-danger hover:bg-danger/90 active:scale-[0.98] text-white text-[10.5px] font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    Buat Geofence
                  </button>
                </div>
              )}

              {/* Alamat & Maps Link */}
              <div className="flex items-start gap-1.5 pt-0.5">
                <MapPin className="w-3 h-3 text-foreground-subtle mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-foreground-muted leading-none">
                      {tTracking.popupAddress}
                    </span>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface hover:bg-surface-elevated border border-border text-[9.5px] font-semibold text-foreground-muted hover:text-foreground transition-colors shrink-0"
                      style={{ textDecoration: 'none' }}
                      title="Buka Google Maps"
                    >
                      <span>Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <p className="text-[11px] font-medium text-foreground line-clamp-2 leading-snug" title={event.address}>
                    {event.address || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MapPopup>
      )}
    </>
  );
}

// --- PlaybackMap ---------------------------------------------------------------

export function PlaybackMap({
  vehicle,
  currentPoint,
  playbackTrack,
  playbackPassedTrack,
  playbackParkingEvents,
  selectedGeofenceIds = [],
  selectedRouteIds = [],
  cropTrack,
  isRouteCropMode,
}: PlaybackMapProps) {
  const locale = useBusinessLocale();
  const tTracking = getTranslation(locale).tracking;

  const vehicleName = vehicle?.plateNumber ?? 'Kendaraan';
  const [activePopupIndex, setActivePopupIndex] = useState<number | null>(null);

  // Telemetry values for HUD
  const displaySpeed = currentPoint ? currentPoint.speed : (vehicle?.speed ?? 0);
  const displayHeading = currentPoint ? currentPoint.heading : ((vehicle as any)?.heading ?? 0);
  const displayTimestamp = formatPointTimestamp(currentPoint ? currentPoint.timestamp : vehicle?.lastUpdate);

  // Close popup if vehicle changes
  useEffect(() => {
    setActivePopupIndex(null);
  }, [vehicle?.id]);

  if (!vehicle) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface">
        <p className="text-sm text-foreground-muted">{tTracking.playbackEmpty}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <TrackingMap<TrackingVehicle>
        entities={[]}
        selectedIds={[]}

        getId={(v) => v.id}
        getPosition={(v) => v.location}
        getHeading={(v) => (v as any).heading ?? 0}
        getLabel={(v) => v.plateNumber}

        enableClustering={false}
        entityLabel="Kendaraan"
        locale={locale}

        playbackTrack={playbackTrack}
        playbackPassedTrack={playbackPassedTrack}
        // Parking markers are handled via children for rich popup support
        playbackParkingEvents={undefined}
        className="w-full h-full border-0 rounded-none min-h-0"
      >
        {/* Auto-fit to route bounds on load */}
        <PlaybackFitBounds track={playbackTrack} />

        {/* Map Layers (Geofences and Routes) */}
        <PlaybackMapLayers
          selectedGeofenceIds={selectedGeofenceIds}
          selectedRouteIds={selectedRouteIds}
          cropTrack={cropTrack}
        />

        {/* Crop Route Start & End Markers (Opsi 2: Titik Potong Segmen Bersih - Pas di Garis - Warna Gold) */}
        {cropTrack && cropTrack.length > 1 && (
          <>
            {/* Titik Awal Mulai Crop - Lingkaran Pas di Garis Rute (Gold) */}
            <MapMarker id="crop-marker-start" position={cropTrack[0]}>
              <div className="relative flex items-center justify-center pointer-events-none select-none">
                {/* Titik Lingkaran Dot: Pusatnya berhimpit 100% pas di koordinat garis rute */}
                <div className="w-4 h-4 rounded-full bg-white border-[2.5px] border-amber-500 flex items-center justify-center shadow-lg shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </div>

                {/* Badge Caption AWAL mengambang tepat di atas lingkaran titik */}
                <div className="absolute bottom-full mb-1 flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded bg-amber-500 text-white text-[9.5px] font-bold font-mono tracking-wider uppercase shadow-md ring-1 ring-white/90 whitespace-nowrap">
                    Awal
                  </div>
                  <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-amber-500" />
                </div>
              </div>
            </MapMarker>

            {/* Titik Akhir Selesai Crop - Lingkaran Pas di Garis Rute (Gold) */}
            <MapMarker id="crop-marker-end" position={cropTrack[cropTrack.length - 1]}>
              <div className="relative flex items-center justify-center pointer-events-none select-none">
                {/* Titik Lingkaran Dot: Pusatnya berhimpit 100% pas di koordinat garis rute */}
                <div className="w-4 h-4 rounded-full bg-white border-[2.5px] border-amber-500 flex items-center justify-center shadow-lg shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </div>

                {/* Badge Caption AKHIR mengambang tepat di atas lingkaran titik */}
                <div className="absolute bottom-full mb-1 flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded bg-amber-500 text-white text-[9.5px] font-bold font-mono tracking-wider uppercase shadow-md ring-1 ring-white/90 whitespace-nowrap">
                    Akhir
                  </div>
                  <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-amber-500" />
                </div>
              </div>
            </MapMarker>
          </>
        )}

        {/* Rich parking markers with popup inside MapProvider context */}
        {playbackParkingEvents && playbackParkingEvents.map((event, idx) => (
          <ParkingMarkerWithPopup
            key={`park-${idx}-${event.pointIndex}`}
            event={event}
            index={idx}
            vehicleName={vehicleName}
            isOpen={activePopupIndex === idx}
            onToggle={() => setActivePopupIndex(prev => prev === idx ? null : idx)}
            tTracking={tTracking}
          />
        ))}

        {/* Dedicated Animated Playback Vehicle Marker (Sesuai Icon Live + Rotasi Heading Presisi) */}
        {vehicle && (
          <PlaybackVehicleMarker
            vehicle={vehicle}
            currentPoint={currentPoint || (playbackTrack && playbackTrack.length > 0 ? ({
              lat: playbackTrack[0].lat,
              lng: playbackTrack[0].lng,
              speed: 0,
              heading: (vehicle as any).heading ?? 0,
              timestamp: vehicle.lastUpdate
            } as any) : null)}
          />
        )}
      </TrackingMap>

      {/* Floating Telematics HUD on Map Canvas - Aligned with Mode Toggle */}
      {vehicle && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-auto">
          <div className="flex items-center h-[34px] px-2.5 rounded-lg bg-background border border-border dark:border-border-strong shadow-lg gap-2 sm:gap-2.5">
            {/* Heading Indicator Icon */}
            <div
              className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center shrink-0"
              title={`Arah: ${displayHeading}°`}
            >
              <div
                className="transition-transform duration-300 ease-out flex items-center justify-center"
                style={{ transform: `rotate(${displayHeading}deg)` }}
              >
                <Navigation className="w-3 h-3 text-accent fill-accent" />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 sm:gap-2.5 h-full">
              {/* Kecepatan */}
              <div className="flex flex-col justify-center h-full">
                <span className="text-[7.5px] uppercase tracking-wider text-foreground-muted font-semibold leading-none select-none">
                  Kecepatan
                </span>
                <div className="flex items-baseline gap-0.5 mt-0.5">
                  <span className="text-[11px] font-bold text-foreground tabular-nums leading-none">
                    {displaySpeed}
                  </span>
                  <span className="text-[8.5px] font-medium text-foreground-muted leading-none">
                    km/h
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-4.5 bg-border shrink-0 self-center" />

              {/* Waktu */}
              <div className="flex flex-col justify-center h-full">
                <span className="text-[7.5px] uppercase tracking-wider text-foreground-muted font-semibold leading-none select-none">
                  Waktu
                </span>
                <div className="flex items-baseline mt-0.5">
                  <span className="text-[11px] font-semibold text-foreground tabular-nums leading-none font-mono tracking-tight">
                    {displayTimestamp}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-4.5 bg-border shrink-0 self-center hidden sm:block" />

              {/* Heading */}
              <div className="hidden sm:flex flex-col justify-center h-full">
                <span className="text-[7.5px] uppercase tracking-wider text-foreground-muted font-semibold leading-none select-none">
                  Heading
                </span>
                <div className="flex items-baseline mt-0.5">
                  <span className="text-[11px] font-bold text-foreground tabular-nums leading-none">
                    {displayHeading}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
