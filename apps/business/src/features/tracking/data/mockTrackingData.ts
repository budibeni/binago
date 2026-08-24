import type { TrackingVehicle, TrackingVehicleGroup, Trip, PlaybackData, PlaybackPoint } from '../types/tracking';
import { 
  mockGroups, 
  mockVehicles as centralVehicles, 
  mockTrackingState,
  mockTrips
} from '../../../data/mock';

export const mockVehicles: TrackingVehicle[] = centralVehicles.map(v => {
  const tracking = mockTrackingState.find(t => t.vehicleId === v.id);
  return {
    ...v,
    ...tracking,
    vehicleType: v.vehicleName,
    city: 'Jakarta',
    acc: true,
    geofenceName: 'Geofence',
    geofenceArea: 'Area A',
    gpsSerialNumber: v.deviceImei,
    alarmEvent: '-'
  };
}) as unknown as TrackingVehicle[];

export const mockVehicleGroups: TrackingVehicleGroup[] = mockGroups.map(g => ({
  ...g,
  vehicles: mockVehicles.filter(v => v.groupId === g.id)
})) as unknown as TrackingVehicleGroup[];

export const mockTripsByVehicleId: Record<string, Trip[]> = mockTrips.reduce((acc: Record<string, Trip[]>, t) => {
  if (!acc[t.vehicleId]) acc[t.vehicleId] = [];
  acc[t.vehicleId].push(t as unknown as Trip);
  return acc;
}, {});

// Using central mockTrips to generate mockPlaybackData
export const mockPlaybackData: PlaybackData[] = mockTrips.map(t => ({
  tripId: t.id,
  vehicleId: t.vehicleId,
  points: t.track.map((p: any) => ({
    lat: p.latitude,
    lng: p.longitude,
    speed: p.speed,
    heading: 0,
    timestamp: p.timestamp,
    address: 'Unknown',
    odometer: 0
  })),
  totalDurationSecs: t.duration
}));
interface Waypoint { lat: number; lng: number; speedKph: number; address?: string }
const VEHICLE_ROUTES: Record<string, Waypoint[]> = {
  // B 9027 PU - Bandung → Jawilan, Kab. Serang, Banten
  // Rute: Kota Bandung → GT Pasteur → Tol Cipularang → Cikampek →
  //        Tol Jakarta-Merak → Serang Timur → Jawilan (~210 km)
  'veh-001': [
    { lat: -6.9175, lng: 107.6191, speedKph: 0,   address: 'Jl. Soekarno-Hatta No.1, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat, 40161' }, // [00] Gudang Bandung
    { lat: -6.9050, lng: 107.5950, speedKph: 20  }, // [01] Jl. Pasteur - Keluar Pool
    { lat: -6.8960, lng: 107.5640, speedKph: 35  }, // [02] Gerbang Tol Pasteur
    { lat: -6.8700, lng: 107.5200, speedKph: 70  }, // [03] Tol Padalarang
    { lat: -6.8480, lng: 107.4800, speedKph: 85  }, // [04] Padalarang - Tol Cipularang awal
    { lat: -6.8100, lng: 107.4500, speedKph: 90  }, // [05] Cianjur junction (km 55)
    { lat: -6.7500, lng: 107.4200, speedKph: 95  }, // [06] Tol Cipularang (km 75)
    { lat: -6.7000, lng: 107.4000, speedKph: 100 }, // [07] Tol Cipularang (km 90)
    { lat: -6.6500, lng: 107.3950, speedKph: 0,   address: 'Rest Area KM 97 Tol Cipularang, Purwakarta, Jawa Barat, 41181' }, // [08] Rest area km 97 - PARKIR
    { lat: -6.6500, lng: 107.3950, speedKph: 0   }, // [08b] Parkir lanjutan
    { lat: -6.6200, lng: 107.3900, speedKph: 100 }, // [09] Tol Cipularang (km 105)
    { lat: -6.5500, lng: 107.3800, speedKph: 95  }, // [10] Sadang
    { lat: -6.5000, lng: 107.4200, speedKph: 90  }, // [11] Purwakarta
    { lat: -6.4500, lng: 107.4500, speedKph: 85  }, // [12] Dawuan / Cikarang Barat
    { lat: -6.4000, lng: 107.4600, speedKph: 80  }, // [13] GT Cikampek
    { lat: -6.3600, lng: 107.4300, speedKph: 85  }, // [14] Masuk Tol Trans Jawa
    { lat: -6.3000, lng: 107.3000, speedKph: 90  }, // [15] Karawang
    { lat: -6.2600, lng: 107.1500, speedKph: 90  }, // [16] Bekasi Timur
    { lat: -6.2400, lng: 107.0000, speedKph: 85  }, // [17] Cibitung / Bekasi Barat
    { lat: -6.2300, lng: 106.8500, speedKph: 85  }, // [18] Junction Cikunir
    { lat: -6.2200, lng: 106.7000, speedKph: 90  }, // [19] Tangerang (Tol Jakarta-Merak)
    { lat: -6.2100, lng: 106.5500, speedKph: 90  }, // [20] GT Cikupa
    { lat: -6.1900, lng: 106.4200, speedKph: 85  }, // [21] Balaraja
    { lat: -6.1650, lng: 106.3000, speedKph: 80  }, // [22] Kramasan / Serang Timur
    { lat: -6.1300, lng: 106.2000, speedKph: 70  }, // [23] GT Serang Timur - Keluar tol
    { lat: -6.1200, lng: 106.1600, speedKph: 45  }, // [24] Kota Serang
    { lat: -6.1400, lng: 106.1300, speedKph: 35  }, // [25] Menuju Jawilan
    { lat: -6.1600, lng: 106.1100, speedKph: 20  }, // [26] Masuk Kec. Jawilan
    { lat: -6.1800, lng: 106.1000, speedKph: 0,   address: 'Jl. Raya Jawilan, Kec. Jawilan, Kab. Serang, Banten, 42177' }, // [27] Jawilan - Tujuan Akhir
  ],
  'veh-002': [
    { lat: -6.2000, lng: 106.7900, speedKph: 0 },
    { lat: -6.2120, lng: 106.8050, speedKph: 25 },
    { lat: -6.2213, lng: 106.8200, speedKph: 40 },
    { lat: -6.2297, lng: 106.8295, speedKph: 45 },
    { lat: -6.2600, lng: 106.8360, speedKph: 55 },
    { lat: -6.2882, lng: 106.8300, speedKph: 50 },
    { lat: -6.3010, lng: 106.8421, speedKph: 40 },
    { lat: -6.3150, lng: 106.8550, speedKph: 35 },
    { lat: -6.3200, lng: 106.8600, speedKph: 0 },
  ],
  'veh-003': [
    { lat: -6.2000, lng: 106.7900, speedKph: 0 },
    { lat: -6.1900, lng: 106.8100, speedKph: 35 },
    { lat: -6.1734, lng: 106.8272, speedKph: 45 },
    { lat: -6.1648, lng: 106.8480, speedKph: 50 },
    { lat: -6.1350, lng: 106.8600, speedKph: 55 },
    { lat: -6.1600, lng: 106.9000, speedKph: 45 },
    { lat: -6.1750, lng: 106.9200, speedKph: 40 },
    { lat: -6.1883, lng: 106.9400, speedKph: 0 },
  ],
  'default': [
    { lat: -6.2088, lng: 106.8456, speedKph: 0 },
    { lat: -6.2050, lng: 106.8300, speedKph: 30 },
    { lat: -6.1950, lng: 106.8200, speedKph: 45 },
    { lat: -6.1800, lng: 106.8150, speedKph: 50 },
    { lat: -6.1650, lng: 106.8300, speedKph: 55 },
    { lat: -6.1500, lng: 106.8450, speedKph: 50 },
    { lat: -6.1350, lng: 106.8600, speedKph: 40 },
    { lat: -6.1200, lng: 106.8700, speedKph: 35 },
    { lat: -6.1100, lng: 106.8800, speedKph: 0 },
  ],
};

function calcHeading(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
  const dLng = to.lng - from.lng;
  const dLat = to.lat - from.lat;
  const radians = Math.atan2(dLng, dLat);
  return ((radians * 180) / Math.PI + 360) % 360;
}

export interface MockPlaybackTrackPoint {
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  timestamp: string;
  address?: string;
  odometer: number;
}

export interface MockPlaybackData {
  vehicleId: string;
  points: MockPlaybackTrackPoint[];
  totalDurationSecs: number;
}

/**
 * Generates a realistic GPS playback track for a given vehicle.
 * Creates smooth interpolated points across the predefined route.
 * One GPS ping = every 15 seconds.
 */
export function generateMockPlaybackData(vehicleId: string, startDatetime: Date): MockPlaybackData {
  const waypoints = VEHICLE_ROUTES[vehicleId] ?? VEHICLE_ROUTES['default'];
  const POINTS_PER_SEGMENT = 25;
  const INTERVAL_SECS = 15;

  const points: MockPlaybackTrackPoint[] = [];
  let currentTime = startDatetime.getTime();
  // Mock odometer: start at some realistic value (e.g. 48,000 km)
  let odoMeter = 48000.000;

  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = waypoints[i];
    const to = waypoints[i + 1];
    const heading = calcHeading(from, to);

    // Rough segment distance in km (haversine approximation)
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLng = (to.lng - from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(from.lat * Math.PI/180) * Math.cos(to.lat * Math.PI/180) * Math.sin(dLng/2)**2;
    const segmentDistKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distPerPoint = segmentDistKm / POINTS_PER_SEGMENT;

    for (let j = 0; j <= POINTS_PER_SEGMENT; j++) {
      const t = j / POINTS_PER_SEGMENT;
      const lat = from.lat + (to.lat - from.lat) * t;
      const lng = from.lng + (to.lng - from.lng) * t;
      const speedBase = from.speedKph + (to.speedKph - from.speedKph) * t;
      const jitter = (Math.random() - 0.5) * 4;
      const speed = Math.max(0, Math.round(speedBase + jitter));

      // Only increment odometer when moving
      if (speed > 0) {
        odoMeter += distPerPoint;
      }

      // Use waypoint address if at start (j===0) and address exists
      const address = (j === 0 && from.address) ? from.address : undefined;

      points.push({
        lat, lng, speed, heading,
        timestamp: new Date(currentTime).toISOString(),
        address,
        odometer: parseFloat(odoMeter.toFixed(3)),
      });
      currentTime += INTERVAL_SECS * 1000;
    }
  }

  // Add final destination
  const last = waypoints[waypoints.length - 1];
  points.push({
    lat: last.lat,
    lng: last.lng,
    speed: 0,
    heading: points[points.length - 1]?.heading ?? 0,
    timestamp: new Date(currentTime).toISOString(),
    address: last.address,
    odometer: parseFloat(odoMeter.toFixed(3)),
  });

  return {
    vehicleId,
    points,
    totalDurationSecs: points.length * INTERVAL_SECS,
  };
}


