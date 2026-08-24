/**
 * Trip Repository
 */

import { mockTrips } from '../mock';

// --- Domain Types (local to avoid circular deps) --------------------------------

export type TripStatus = 'completed' | 'in_progress' | 'scheduled';

export interface TripTrackPoint {
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
}

export interface TripEvent {
  id: string;
  type: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  description: string;
  severity: string;
}

export interface TripRecord {
  id: string;
  vehicleId: string;
  driverId: string | null | undefined;
  routeId: string | null | undefined;
  startTime: string;
  endTime: string | undefined;
  distance: number;
  duration: number;
  avgSpeed: number;
  maxSpeed: number;
  startAddress: string;
  endAddress: string;
  status: TripStatus;
  events: TripEvent[];
  track: TripTrackPoint[];
}

// --- Repository Interface -------------------------------------------------------

export interface TripRepository {
  getAll(): TripRecord[];
  getById(id: string): TripRecord | undefined;
  getByVehicleId(vehicleId: string): TripRecord[];
}

// --- Mock Repository Implementation --------------------------------------------

class MockTripRepository implements TripRepository {
  private trips: TripRecord[];

  constructor() {
    this.trips = mockTrips as unknown as TripRecord[];
  }

  getAll(): TripRecord[] {
    return this.trips;
  }

  getById(id: string): TripRecord | undefined {
    return this.trips.find((t) => t.id === id);
  }

  getByVehicleId(vehicleId: string): TripRecord[] {
    return this.trips.filter((t) => t.vehicleId === vehicleId);
  }
}

// --- Singleton Export ----------------------------------------------------------

export const tripRepository: TripRepository = new MockTripRepository();
