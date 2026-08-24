/**
 * Trip Service
 */

import { tripRepository, type TripRecord } from '../repositories/tripRepository';

export type { TripRecord };

export const tripService = {
  getTrips(filter?: { vehicleId?: string; driverId?: string; status?: string; search?: string }): TripRecord[] {
    let trips = tripRepository.getAll();

    if (!filter) return trips;

    if (filter.vehicleId && filter.vehicleId !== 'all') {
      trips = trips.filter((t) => t.vehicleId === filter.vehicleId);
    }

    if (filter.driverId && filter.driverId !== 'all') {
      trips = trips.filter((t) => t.driverId === filter.driverId);
    }

    if (filter.status && filter.status !== 'all') {
      trips = trips.filter((t) => t.status === filter.status);
    }

    if (filter.search?.trim()) {
      const q = filter.search.toLowerCase();
      trips = trips.filter(
        (t) =>
          t.startAddress?.toLowerCase().includes(q) ||
          t.endAddress?.toLowerCase().includes(q),
      );
    }

    return trips;
  },

  getTripById(id: string): TripRecord | undefined {
    return tripRepository.getById(id);
  },

  getTripsByVehicleId(vehicleId: string): TripRecord[] {
    return tripRepository.getByVehicleId(vehicleId);
  },
};
