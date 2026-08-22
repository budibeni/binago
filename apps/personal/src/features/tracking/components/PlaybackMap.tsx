'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { TrackingMap, useMapActions, MapMarker, MapPopup } from '@adatrack/maps';
import { Car, Clock, ExternalLink, X, Gauge, Activity, MapPin, Crosshair } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { PlaybackData, Vehicle } from '../types';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';

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
}

export interface PlaybackMapProps {
  data: PlaybackData;
  currentIndex: number;
  vehicle?: Vehicle;
  playbackTrack?: { lat: number; lng: number }[];
  playbackPassedTrack?: { lat: number; lng: number }[];
  playbackParkingEvents?: ParkingEvent[];
}

// --- Fit Bounds ----------------------------------------------------------------
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
  if (h > 0) return `${h} jam ${m} menit`;
  if (m > 0) return `${m} menit ${s} detik`;
  return `${s} detik`;
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
        <p className={cn('text-[11px] font-semibold text-foreground leading-snug break-words', valueClassName)}>
          {value}
        </p>
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
  const googleMapsUrl = `https://www.google.com/maps?q=${event.lat},${event.lng}`;

  return (
    <>
      <MapMarker id={`park-${index}`} position={{ lat: event.lat, lng: event.lng }}>
        <div
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="cursor-pointer hover:scale-110 active:scale-95 transition-transform origin-bottom drop-shadow-sm"
          title={tTracking?.playbackMarkerTooltip || 'Posisi Berhenti'}
        >
          <svg width="22" height="33" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="#ef4444" stroke="white" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="7.5" fill="white" />
            <text x="12" y="12.5" dominantBaseline="central" textAnchor="middle" fill="#b91c1c" fontWeight="900" fontSize="11" fontFamily="system-ui, sans-serif" letterSpacing="-0.5">P</text>
          </svg>
        </div>
      </MapMarker>

      {isOpen && (
        <MapPopup
          position={{ lat: event.lat, lng: event.lng }}
          offset={[0, -28]}
          anchor="bottom"
          className="custom-parking-popup"
          onClose={onToggle}
          autoPanPadding={{ top: 120, bottom: 20, left: 20, right: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="flex flex-col bg-background rounded-xl overflow-hidden shadow-2xl ring-1 ring-border"
            style={{ width: '260px' }}
          >
            <div className="flex items-center gap-2.5 px-3 py-2 border-b border-border bg-background shrink-0">
              <div className="flex items-center justify-center shrink-0 drop-shadow-sm">
                <svg width="18" height="27" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.373 0 0 5.373 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.373 18.627 0 12 0Z" fill="#ef4444" stroke="white" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="7.5" fill="white" />
                  <text x="12" y="12.5" dominantBaseline="central" textAnchor="middle" fill="#b91c1c" fontWeight="900" fontSize="11" fontFamily="system-ui, sans-serif" letterSpacing="-0.5">P</text>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[12px] font-extrabold text-foreground tracking-widest uppercase leading-none">
                  {vehicleName}
                </h2>
                <p className="text-[10px] text-foreground-muted leading-tight mt-0.5">
                  {tTracking?.playbackStop || 'Berhenti'} #{index + 1}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 shrink-0">
                <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                {tTracking?.playbackParking || 'Parkir'}
              </span>
              <button onClick={onToggle} className="text-foreground-muted hover:text-foreground transition-colors shrink-0 ml-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="px-3 py-3 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <InfoRow icon={Clock} label={tTracking?.playbackTime || 'Waktu'} value={formatTimestamp(event.startTimestamp)} />
                <InfoRow icon={Activity} label={tTracking?.playbackDuration || 'Durasi'} value={formatDuration(event.durationSecs)} />
                <InfoRow icon={Crosshair} label={tTracking?.popupCoordinates || 'Koordinat'} value={<span className="font-mono text-[10.5px]">{event.lat.toFixed(5)}, {event.lng.toFixed(5)}</span>} />
                <InfoRow icon={Gauge} label={tTracking?.playbackOdometer || 'Odometer'} value={`${event.odometer.toLocaleString('id-ID', { minimumFractionDigits: 1 })} km`} />
              </div>
              <div className="border-t border-border" />
              <InfoRow icon={MapPin} label={tTracking?.popupAddress || 'Alamat'} value={<span className="line-clamp-2" title={event.address}>{event.address}</span>} />
            </div>

            <div className="px-3 pb-3 flex justify-end">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold text-foreground-muted hover:text-foreground hover:bg-muted active:scale-95 transition-all" style={{ textDecoration: 'none' }}>
                {tTracking?.playbackOpenMaps || 'Maps'}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </MapPopup>
      )}
    </>
  );
}

// --- PlaybackMap Main Component ------------------------------------------------
export function PlaybackMap({
  data,
  currentIndex,
  vehicle,
  playbackTrack,
  playbackPassedTrack,
  playbackParkingEvents,
}: PlaybackMapProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const tTracking = t.tracking;

  const currentPoint = data.points[currentIndex];
  const allPoints = data.points;

  const getHeading = () => {
    if (currentPoint?.heading !== undefined) return currentPoint.heading;
    if (currentIndex > 0) {
      const prev = allPoints[currentIndex - 1];
      const curr = currentPoint;
      if (prev && curr) {
        const dLng = curr.lng - prev.lng;
        const dLat = curr.lat - prev.lat;
        return (Math.atan2(dLng, dLat) * 180) / Math.PI;
      }
    }
    return 0;
  };

  const entities = useMemo(() => {
    if (!currentPoint) return [];
    return [{
      id: vehicle?.id || 'dummy',
      plateNumber: vehicle?.plateNumber || 'Kendaraan',
      type: vehicle?.type || 'Mobil',
      status: currentPoint.speed > 0 ? 'driving' : 'parking',
      location: { lat: currentPoint.lat, lng: currentPoint.lng },
      heading: getHeading(),
    } as any];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPoint, vehicle]);

  const selectedIds = useMemo(() => (entities.length > 0 ? [entities[0].id] : []), [entities]);
  const vehicleName = vehicle?.plateNumber ?? 'Kendaraan';
  const [activePopupIndex, setActivePopupIndex] = useState<number | null>(null);

  useEffect(() => {
    setActivePopupIndex(null);
  }, [vehicle?.id]);

  if (!currentPoint) return null;

  return (
    <div className="w-full h-full relative">
      <TrackingMap
        entities={entities}
        selectedIds={selectedIds}
        getId={(v) => v.id}
        getPosition={(v) => v.location}
        getHeading={(v) => v.heading ?? 0}
        getLabel={(v) => v.plateNumber}
        getIcon={(v) => <Car className="w-5 h-5" />}
        enableClustering={false}
        entityLabel="Kendaraan"
        locale={locale}
        playbackTrack={playbackTrack}
        playbackPassedTrack={playbackPassedTrack}
        playbackParkingEvents={undefined} // Handled as children
        className="w-full h-full border-0 rounded-none min-h-0"
      >
        <PlaybackFitBounds track={playbackTrack} />

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
      </TrackingMap>
    </div>
  );
}
