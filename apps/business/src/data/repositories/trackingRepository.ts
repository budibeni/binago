/**
 * Tracking Repository
 *
 * Handles all data for Live, Playback, and Heatmap modes.
 * All three modes use the same vehicle entity — only the data view differs.
 *
 * VEHICLE_ROUTES and generatePlaybackData are simulation logic that belongs
 * in the Mock Repository layer. They will be replaced by API calls when
 * the backend is ready.
 */

import type {
  TrackingVehicle,
  TrackingVehicleGroup,
  Trip,
  PlaybackData,
} from '@/features/core/tracking/types/tracking';
import { mockVehicles as centralVehicles, mockTrackingState, mockTrips } from '../mock';

// --- Waypoint type (simulation only, not a Route master entity) ----------------

interface Waypoint {
  lat: number;
  lng: number;
  speedKph: number;
  address?: string;
}

// --- Playback Track Point (Mock output type) ------------------------------------

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

// --- Heatmap Point -------------------------------------------------------------

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
  status: 'driving' | 'idle' | 'parking';
}

// --- Vehicle Routes (simulation only) ------------------------------------------
// These are NOT Route master data. Route master data is in data/mock/routes.ts.
// These are GPS waypoints used to generate realistic playback animation.

const VEHICLE_ROUTES: Record<string, Waypoint[]> = {
  // B 9027 PU - Bandung → Jawilan, Kab. Serang, Banten
  'veh-001': [
    { lat: -6.9175, lng: 107.6191, speedKph: 0,   address: 'Jl. Dr. Djunjunan No. 143, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat' },
    { lat: -6.9050, lng: 107.5950, speedKph: 20,  address: 'Gerbang Tol Pasteur, Sukagalih, Kec. Sukajadi, Kota Bandung, Jawa Barat' },
    { lat: -6.8960, lng: 107.5640, speedKph: 35,  address: 'Tol Padaleunyi KM 125, Baros, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat' },
    { lat: -6.8700, lng: 107.5200, speedKph: 70,  address: 'Tol Padaleunyi KM 118, Kertamulya, Kec. Padalarang, Kab. Bandung Barat, Jawa Barat' },
    { lat: -6.8480, lng: 107.4800, speedKph: 85,  address: 'Tol Cipularang KM 110, Cempakamekar, Kec. Padalarang, Kab. Bandung Barat, Jawa Barat' },
    { lat: -6.8100, lng: 107.4500, speedKph: 90,  address: 'Tol Cipularang KM 105, Mandalamukti, Kec. Cikalongwetan, Kab. Bandung Barat, Jawa Barat' },
    { lat: -6.7500, lng: 107.4200, speedKph: 95,  address: 'Tol Cipularang KM 100, Sawit, Kec. Darangdan, Kab. Purwakarta, Jawa Barat' },
    { lat: -6.7000, lng: 107.4000, speedKph: 100, address: 'Rest Area KM 97 Tol Cipularang, Gununghejo, Kec. Darangdan, Kab. Purwakarta, Jawa Barat' },
    { lat: -6.6500, lng: 107.3950, speedKph: 0,   address: 'Rest Area KM 97 Tol Cipularang, Purwakarta, Jawa Barat' },
    { lat: -6.6200, lng: 107.3900, speedKph: 100, address: 'Tol Cipularang KM 88, Sukajaya, Kec. Sukatani, Kab. Purwakarta, Jawa Barat' },
    { lat: -6.5500, lng: 107.3800, speedKph: 95,  address: 'Tol Cipularang KM 76, Sadang, Kec. Purwakarta, Kab. Purwakarta, Jawa Barat' },
    { lat: -6.5000, lng: 107.4200, speedKph: 90,  address: 'Simpang Susun Dawuan, Cikampek, Kab. Karawang, Jawa Barat' },
    { lat: -6.4500, lng: 107.4500, speedKph: 85,  address: 'Tol Jakarta - Cikampek KM 62, Kosambi, Kec. Klari, Kab. Karawang, Jawa Barat' },
    { lat: -6.4000, lng: 107.4600, speedKph: 80,  address: 'Tol Jakarta - Cikampek KM 54, Pinayungan, Kec. Telukjambe Timur, Kab. Karawang, Jawa Barat' },
    { lat: -6.3600, lng: 107.4300, speedKph: 85,  address: 'Tol Jakarta - Cikampek KM 46, Karawang Barat, Kab. Karawang, Jawa Barat' },
    { lat: -6.3000, lng: 107.3000, speedKph: 90,  address: 'Tol Jakarta - Cikampek KM 38, Cikarang Timur, Kab. Bekasi, Jawa Barat' },
    { lat: -6.2600, lng: 107.1500, speedKph: 90,  address: 'Tol Jakarta - Cikampek KM 28, Cikarang Barat, Kab. Bekasi, Jawa Barat' },
    { lat: -6.2400, lng: 107.0000, speedKph: 85,  address: 'Tol Jakarta - Cikampek KM 14, Bekasi Timur, Kota Bekasi, Jawa Barat' },
    { lat: -6.2300, lng: 106.8500, speedKph: 85,  address: 'Tol Cawang Grogol, Kebon Baru, Kec. Tebet, Kota Jakarta Selatan, DKI Jakarta' },
    { lat: -6.2200, lng: 106.7000, speedKph: 90,  address: 'Tol Jakarta - Tangerang KM 9, Kembangan Selatan, Kota Jakarta Barat, DKI Jakarta' },
    { lat: -6.2100, lng: 106.5500, speedKph: 90,  address: 'Tol Jakarta - Tangerang KM 18, Kunciran, Kec. Pinang, Kota Tangerang, Banten' },
    { lat: -6.1900, lng: 106.4200, speedKph: 85,  address: 'Tol Tangerang - Merak KM 31, Balaraja, Kab. Tangerang, Banten' },
    { lat: -6.1650, lng: 106.3000, speedKph: 80,  address: 'Tol Tangerang - Merak KM 44, Cikande, Kab. Serang, Banten' },
    { lat: -6.1300, lng: 106.2000, speedKph: 70,  address: 'Gerbang Tol Ciujung, Kragilan, Kab. Serang, Banten' },
    { lat: -6.1200, lng: 106.1600, speedKph: 45,  address: 'Jl. Raya Serang - Jakarta KM 12, Kalodran, Kec. Walantaka, Kota Serang, Banten' },
    { lat: -6.1400, lng: 106.1300, speedKph: 35,  address: 'Jl. Raya Cikande Rangkasbitung KM 5, Kibin, Kab. Serang, Banten' },
    { lat: -6.1600, lng: 106.1100, speedKph: 20,  address: 'Jl. Raya Cikande Rangkasbitung KM 8, Cikande, Kab. Serang, Banten' },
    { lat: -6.1800, lng: 106.1000, speedKph: 0,   address: 'Jl. Raya Jawilan, Kec. Jawilan, Kab. Serang, Banten, 42177' },
  ],
  'veh-002': [
    { lat: -6.2000, lng: 106.7900, speedKph: 0,  address: 'Jl. Palmerah Utara No. 12, Palmerah, Kota Jakarta Barat, DKI Jakarta' },
    { lat: -6.2120, lng: 106.8050, speedKph: 25, address: 'Jl. Tentara Pelajar No. 45, Grogol Utara, Kebayoran Lama, Kota Jakarta Selatan, DKI Jakarta' },
    { lat: -6.2213, lng: 106.8200, speedKph: 40, address: 'Jl. Jenderal Gatot Subroto Kav. 36, Kuningan Barat, Mampang Prapatan, Jakarta Selatan' },
    { lat: -6.2297, lng: 106.8295, speedKph: 45, address: 'Jl. Rasuna Said Kav. B-12, Karet Kuningan, Setiabudi, Kota Jakarta Selatan' },
    { lat: -6.2600, lng: 106.8360, speedKph: 55, address: 'Jl. Warung Jati Barat No. 8, Kalibata, Pancoran, Kota Jakarta Selatan' },
    { lat: -6.2882, lng: 106.8300, speedKph: 50, address: 'Jl. T.B. Simatupang No. 15, Cilandak Timur, Pasar Minggu, Kota Jakarta Selatan' },
    { lat: -6.3010, lng: 106.8421, speedKph: 40, address: 'Jl. Lenteng Agung Raya No. 22, Jagakarsa, Kota Jakarta Selatan' },
    { lat: -6.3150, lng: 106.8550, speedKph: 35, address: 'Jl. Raya Bogor KM 28, Pekayon, Pasar Rebo, Kota Jakarta Timur' },
    { lat: -6.3200, lng: 106.8600, speedKph: 0,  address: 'Jl. Raya Bogor KM 30, Mekarsari, Cimanggis, Kota Depok, Jawa Barat' },
  ],
  'veh-003': [
    { lat: -6.2000, lng: 106.7900, speedKph: 0,  address: 'Jl. Slipi Raya No. 10, Palmerah, Kota Jakarta Barat, DKI Jakarta' },
    { lat: -6.1900, lng: 106.8100, speedKph: 35, address: 'Jl. Tomang Raya No. 25, Jatipulo, Palmerah, Kota Jakarta Barat' },
    { lat: -6.1734, lng: 106.8272, speedKph: 45, address: 'Jl. Medan Merdeka Barat No. 8, Gambir, Kota Jakarta Pusat, DKI Jakarta' },
    { lat: -6.1648, lng: 106.8480, speedKph: 50, address: 'Jl. Gunung Sahari Raya No. 60, Gunung Sahari Utara, Sawah Besar, Jakarta Pusat' },
    { lat: -6.1350, lng: 106.8600, speedKph: 55, address: 'Jl. Danau Sunter Utara No. 18, Sunter Agung, Tanjung Priok, Jakarta Utara' },
    { lat: -6.1600, lng: 106.9000, speedKph: 45, address: 'Jl. Boulevard Barat Raya Blok LC, Kelapa Gading Barat, Jakarta Utara' },
    { lat: -6.1750, lng: 106.9200, speedKph: 40, address: 'Jl. Pegangsaan Dua No. 99, Pegangsaan Dua, Kelapa Gading, Jakarta Utara' },
    { lat: -6.1883, lng: 106.9400, speedKph: 0,  address: 'Jl. Raya Bekasi KM 24, Ujung Menteng, Cakung, Kota Jakarta Timur' },
  ],
  'default': [
    { lat: -6.2088, lng: 106.8456, speedKph: 0,  address: 'Jl. M.H. Thamrin No. 28, Gondangdia, Menteng, Kota Jakarta Pusat, DKI Jakarta' },
    { lat: -6.2050, lng: 106.8300, speedKph: 30, address: 'Jl. Jenderal Sudirman No. 52, Karet Semanggi, Setiabudi, Jakarta Selatan' },
    { lat: -6.1950, lng: 106.8200, speedKph: 45, address: 'Jl. H.R. Rasuna Said Kav. C-22, Karet Kuningan, Setiabudi, Jakarta Selatan' },
    { lat: -6.1800, lng: 106.8150, speedKph: 50, address: 'Jl. Prof. DR. Satrio No. 18, Karet Semanggi, Setiabudi, Jakarta Selatan' },
    { lat: -6.1650, lng: 106.8300, speedKph: 55, address: 'Jl. Casablanca No. 88, Menteng Dalam, Tebet, Kota Jakarta Selatan' },
    { lat: -6.1500, lng: 106.8450, speedKph: 50, address: 'Jl. K.H. Abdullah Syafei No. 40, Manggarai Selatan, Tebet, Jakarta Selatan' },
    { lat: -6.1350, lng: 106.8600, speedKph: 40, address: 'Jl. Otista Raya No. 12, Bidara Cina, Jatinegara, Kota Jakarta Timur' },
    { lat: -6.1200, lng: 106.8700, speedKph: 35, address: 'Jl. DI Panjaitan Kav. 14, Cipinang Cempedak, Jatinegara, Jakarta Timur' },
    { lat: -6.1100, lng: 106.8800, speedKph: 0,  address: 'Jl. Mayjen Sutoyo No. 1, Cawang, Kramat Jati, Kota Jakarta Timur' },
  ],
};

// --- Helper: heading calculation -----------------------------------------------

function calcHeading(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
  const dLng = to.lng - from.lng;
  const dLat = to.lat - from.lat;
  const radians = Math.atan2(dLng, dLat);
  return ((radians * 180) / Math.PI + 360) % 360;
}

// --- Repository Interface ------------------------------------------------------

export interface TrackingRepository {
  getLiveVehicles(): TrackingVehicle[];
  getLiveVehicleGroups(): TrackingVehicleGroup[];
  getTripsByVehicleId(vehicleId: string): Trip[];
  getPlaybackData(vehicleId: string, startDatetime: Date): MockPlaybackData;
  getHeatmapPoints(vehicleId?: string): HeatmapPoint[];
}

// --- Mock Repository Implementation -------------------------------------------

class MockTrackingRepository implements TrackingRepository {
  private vehicles: TrackingVehicle[];
  private vehicleGroups: TrackingVehicleGroup[];

  constructor() {
    this.vehicles = centralVehicles.map((v) => {
      const tracking = mockTrackingState.find((t) => t.vehicleId === v.id);
      return {
        ...v,
        ...tracking,
        vehicleType: v.vehicleName,
        city: 'Jakarta',
        acc: true,
        geofenceName: 'Geofence',
        geofenceArea: 'Area A',
        gpsSerialNumber: v.deviceImei,
        alarmEvent: '-',
      } as unknown as TrackingVehicle;
    });

    this.vehicleGroups = [];
    /*
      ...g,
      vehicles: this.vehicles.filter((v) => v.groupId === g.id),
    })) as unknown as TrackingVehicleGroup[]; */
  }

  getLiveVehicles(): TrackingVehicle[] {
    return this.vehicles;
  }

  getLiveVehicleGroups(): TrackingVehicleGroup[] {
    return this.vehicleGroups;
  }

  getTripsByVehicleId(vehicleId: string): Trip[] {
    return mockTrips
      .filter((t) => t.vehicleId === vehicleId)
      .map((t) => t as unknown as Trip);
  }

  /**
   * Generate realistic GPS playback track for a given vehicle.
   * Uses VEHICLE_ROUTES with interpolated points (15s interval).
   * This is simulation logic — in production, data comes from the GPS backend.
   */
  getPlaybackData(vehicleId: string, startDatetime: Date): MockPlaybackData {
    const waypoints = VEHICLE_ROUTES[vehicleId] ?? VEHICLE_ROUTES['default'];
    const POINTS_PER_SEGMENT = 25;
    const INTERVAL_SECS = 15;

    const points: MockPlaybackTrackPoint[] = [];
    let currentTime = startDatetime.getTime();
    let odoMeter = 48000.000;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];
      const heading = calcHeading(from, to);

      const dLat = (to.lat - from.lat) * Math.PI / 180;
      const dLng = (to.lng - from.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      const segmentDistKm = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distPerPoint = segmentDistKm / POINTS_PER_SEGMENT;

      for (let j = 0; j <= POINTS_PER_SEGMENT; j++) {
        const t = j / POINTS_PER_SEGMENT;
        const lat = from.lat + (to.lat - from.lat) * t;
        const lng = from.lng + (to.lng - from.lng) * t;
        const speedBase = from.speedKph + (to.speedKph - from.speedKph) * t;
        const jitter = (Math.random() - 0.5) * 4;
        const speed = Math.max(0, Math.round(speedBase + jitter));

        if (speed > 0) {
          odoMeter += distPerPoint;
        }

        const address = from.address || to.address || 'Jl. Jenderal Sudirman, Jakarta Pusat, DKI Jakarta';

        points.push({
          lat, lng, speed, heading,
          timestamp: new Date(currentTime).toISOString(),
          address,
          odometer: parseFloat(odoMeter.toFixed(3)),
        });
        currentTime += INTERVAL_SECS * 1000;
      }
    }

    const last = waypoints[waypoints.length - 1];
    points.push({
      lat: last.lat,
      lng: last.lng,
      speed: 0,
      heading: points[points.length - 1]?.heading ?? 0,
      timestamp: new Date(currentTime).toISOString(),
      address: last.address || 'Jl. Jenderal Sudirman, Jakarta Pusat, DKI Jakarta',
      odometer: parseFloat(odoMeter.toFixed(3)),
    });

    return {
      vehicleId,
      points,
      totalDurationSecs: points.length * INTERVAL_SECS,
    };
  }

  /**
   * Generate heatmap points from live tracking state.
   * Heatmap uses the same vehicle/tracking data as Live — no separate dataset.
   */
  getHeatmapPoints(vehicleId?: string): HeatmapPoint[] {
    const states = vehicleId
      ? mockTrackingState.filter((t) => t.vehicleId === vehicleId)
      : mockTrackingState;

    return states
      .filter((t) => t.status !== 'offline')
      .map((t) => ({
        lat: t.location.lat,
        lng: t.location.lng,
        weight: t.status === 'driving' ? 1.0 : t.status === 'idle' ? 0.6 : 0.3,
        status: t.status as 'driving' | 'idle' | 'parking',
      }));
  }
}

// --- Singleton Export ----------------------------------------------------------

export const trackingRepository: TrackingRepository = new MockTrackingRepository();
