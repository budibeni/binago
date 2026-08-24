'use client';

import React, { useEffect, useMemo } from 'react';
import { TrackingMap, useMapActions, MapMarker } from '@adatrack/maps';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { PlaybackMapLayers } from '../../tracking/components/playback/PlaybackMapLayers';
import { Bus, Truck, MapPin } from 'lucide-react';
import type { Trip } from '../types/trips';
import type { TrackingVehicle } from '../../tracking/types/tracking';

export interface TripMapProps {
  trip: Trip;
}

// Auto-fit bounds
function TripFitBounds({ track }: { track?: { lat: number; lng: number }[] }) {
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

export function TripMap({ trip }: TripMapProps) {
  const locale = useBusinessLocale() || 'id';

  const playbackTrack = useMemo(() => {
    return trip.track.map(t => ({
      lat: t.latitude,
      lng: t.longitude,
      speed: t.speed,
    }));
  }, [trip.track]);

  const selectedRouteIds = useMemo(() => {
    return trip.routeId ? [trip.routeId] : [];
  }, [trip.routeId]);

  // Using gf-01 and gf-02 as mock relevant geofences
  const selectedGeofenceIds = ['gf-01', 'gf-02'];

  const stops = useMemo(() => {
    return trip.events.filter(e => e.type === 'stop');
  }, [trip.events]);

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm h-full min-h-[400px] overflow-hidden relative">
      <TrackingMap<TrackingVehicle>
        entities={[]} // We don't render live entities here
        selectedIds={[]}
        getId={(v) => v.id}
        getPosition={(v) => v.location}
        getHeading={() => 0}
        getLabel={(v) => v.plateNumber}
        getIcon={() => <Truck className="w-5 h-5" />}
        enableClustering={false}
        entityLabel="Kendaraan"
        locale={locale}
        playbackTrack={playbackTrack}
        playbackPassedTrack={playbackTrack} // Shows full track in blue
        className="w-full h-full border-0 rounded-none"
      >
        <TripFitBounds track={playbackTrack} />
        
        <PlaybackMapLayers 
          selectedGeofenceIds={selectedGeofenceIds} 
          selectedRouteIds={selectedRouteIds} 
        />

        {/* Origin / Destination Markers */}
        {playbackTrack.length > 0 && (
          <MapMarker id="origin-marker" position={playbackTrack[0]}>
            <div className="flex flex-col items-center">
              <div className="bg-green-500 text-white p-1 rounded-full shadow-md border-2 border-white relative z-10">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="mt-1 bg-white/90 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm whitespace-nowrap z-20">
                Origin
              </div>
            </div>
          </MapMarker>
        )}

        {playbackTrack.length > 1 && (
          <MapMarker id="dest-marker" position={playbackTrack[playbackTrack.length - 1]}>
            <div className="flex flex-col items-center">
              <div className="bg-danger text-white p-1 rounded-full shadow-md border-2 border-white relative z-10">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="mt-1 bg-white/90 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm whitespace-nowrap z-20">
                Destination
              </div>
            </div>
          </MapMarker>
        )}

        {/* Stop Markers */}
        {stops.map((stop, i) => {
          if (!stop.location) return null;
          return (
            <MapMarker id={`stop-${stop.id}`} key={stop.id} position={{ lng: stop.location[0], lat: stop.location[1] }}>
              <div className="flex flex-col items-center">
                <div className="bg-orange-500 text-white p-1 rounded-full shadow-md border-2 border-white">
                  <div className="w-2 h-2" />
                </div>
                <div className="mt-1 bg-white/90 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm z-20">
                  Stop {i + 1}
                </div>
              </div>
            </MapMarker>
          );
        })}
      </TrackingMap>
    </div>
  );
}
