'use client';

import React from 'react';
import { EntityMarker } from '@adatrack/maps';
import type { TrackingVehicle } from '../../types/tracking';
import type { MockPlaybackTrackPoint } from '../../data/mockTrackingData';

export interface PlaybackVehicleMarkerProps {
  vehicle: TrackingVehicle;
  currentPoint?: MockPlaybackTrackPoint | null;
  onClick?: () => void;
}

/**
 * PlaybackVehicleMarker
 *
 * Marker armada bergerak untuk mode Playback yang identik dengan mode Live:
 * - Menggunakan EntityMarker standar ADATRACK:
 *   - Arrow navigasi warna merah (#ef4444) berbingkai putih yang berputar presisi sesuai sudut heading (0-360°).
 *   - Signal pulse beacon animation.
 *   - Label pill hitam dengan teks plat nomor kendaraan putih (e.g. "B 1023 GHI") di bawahnya.
 * - Mempertahankan arah heading terakhir saat kendaraan berhenti/parkir (tidak mendadak memutar ke 0° Utara).
 * - Menggunakan fastTransition untuk pergerakan heading yang responsif selama simulasi playback.
 */
export function PlaybackVehicleMarker({
  vehicle,
  currentPoint,
  onClick,
}: PlaybackVehicleMarkerProps) {
  const lastHeadingRef = React.useRef<number>((vehicle as any).heading ?? 0);

  let rawHeading = currentPoint ? currentPoint.heading : ((vehicle as any).heading ?? 0);
  if (rawHeading && rawHeading > 0) {
    lastHeadingRef.current = rawHeading;
  } else if (rawHeading === 0 && lastHeadingRef.current > 0) {
    // Pertahankan arah hadap kendaraan saat berhenti agar tetap sesuai arah jalan
    rawHeading = lastHeadingRef.current;
  }

  const markerPosition = currentPoint && !isNaN(currentPoint.lat) && !isNaN(currentPoint.lng)
    ? { lat: currentPoint.lat, lng: currentPoint.lng }
    : vehicle.location;

  if (!markerPosition || isNaN(markerPosition.lat) || isNaN(markerPosition.lng)) {
    return null;
  }

  return (
    <EntityMarker
      id={`playback-marker-${vehicle.id}`}
      position={markerPosition}
      heading={rawHeading}
      label={vehicle.plateNumber}
      color="#ef4444"
      selected={true}
      fastTransition={true}
      onClick={onClick}
    />
  );
}
