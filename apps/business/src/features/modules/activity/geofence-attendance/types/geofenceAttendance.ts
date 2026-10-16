export type GeofenceAttendanceStatus = 'inside' | 'tolerance_warning';

export interface GeofenceAttendanceRecord {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar?: string;
  vehiclePlate: string;
  vehicleModel?: string;
  geofenceId: string;
  geofenceName: string;
  geofenceCategory: string; // e.g. Pool, Gudang, Klien, Workshop, Pelabuhan
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  locationAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceMeters: number;
  isWithinGeofence: boolean;
  photo: string; // SVG data URI or URL
  notes?: string;
}

export interface GeofenceAttendanceStats {
  total: number;
  today: number;
  verifiedInside: number;
  outsideWarning: number;
  uniqueGeofences: number;
}
