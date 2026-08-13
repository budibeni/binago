export type VehicleStatus = 'driving' | 'idle' | 'parking' | 'offline';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  name?: string;
  type: string;
  status: VehicleStatus;
  speed?: number;
  driver?: string;
  lastUpdate: string; // ISO string
  location: Location;
}

export interface Trip {
  id: string;
  vehicleId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO string
  endTime: string; // ISO string
  distance: number; // in km
  duration: number; // in minutes
  avgSpeed: number; // in km/h
  maxSpeed: number; // in km/h
  startAddress: string;
  endAddress: string;
}

export interface PlaybackPoint {
  lat: number;
  lng: number;
  timestamp: string; // ISO string
  speed: number;
  heading?: number;
}

export interface PlaybackData {
  tripId: string;
  points: PlaybackPoint[];
}
