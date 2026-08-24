export type TripStatus = 'ongoing' | 'completed';

export type TripEventType =
  | 'ignition_on'
  | 'ignition_off'
  | 'moving'
  | 'stop'
  | 'geofence_in'
  | 'geofence_out'
  | 'overspeed';

export interface TripEvent {
  id: string;
  time: string; // ISO 8601
  type: TripEventType;
  title: string; // e.g. "Ignition ON", "Masuk Geofence"
  description?: string; // e.g. "Gudang Jakarta", "85 km/h"
  location?: [number, number]; // [lng, lat]
}

export interface TripTrackPoint {
  timestamp: string; // ISO 8601
  longitude: number;
  latitude: number;
  speed: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  vehicleName: string; // or plate number
  driverId?: string;
  driverName?: string;
  
  startTime: string; // ISO 8601
  endTime: string | null; // null if ongoing
  
  origin: string;
  destination: string;
  
  distance: number; // in km
  duration: number; // in seconds
  movingDuration: number; // in seconds
  stoppedDuration: number; // in seconds
  
  stopCount: number;
  averageSpeed: number; // in km/h
  maxSpeed: number; // in km/h
  
  status: TripStatus;
  
  routeId?: string | null;
  routeName?: string | null;
  
  events: TripEvent[];
  track: TripTrackPoint[];
}
