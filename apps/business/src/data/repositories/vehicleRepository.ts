/**
 * Vehicle Repository
 *
 * Abstraction layer between Service and data source.
 * Swap MockVehicleRepository for ApiVehicleRepository when backend is ready.
 */

import type { Vehicle, VehicleGroup } from '@/features/core/vehicles/types/vehicle';
import { mockVehicles as centralVehicles, mockGroups, mockTrackingState } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface VehicleRepository {
  getAll(): Vehicle[];
  getById(id: string): Vehicle | undefined;
  getGroups(): VehicleGroup[];
}

// --- Mock Repository Implementation -------------------------------------------

class MockVehicleRepository implements VehicleRepository {
  private vehicles: Vehicle[];

  constructor() {
    this.vehicles = centralVehicles.map((v) => {
      const tracking = mockTrackingState.find((t) => t.vehicleId === v.id);
      return {
        ...v,
        status: (tracking?.status ?? 'offline') as Vehicle['status'],
        odometer: 48000,
        lastServiceKm: 40000,
        nextServiceKm: 50000,
        lastUpdate: tracking?.lastUpdate ?? new Date().toISOString(),
        registrationExpiry: '2027-01-01',
      } as unknown as Vehicle;
    });
  }

  getAll(): Vehicle[] {
    return this.vehicles;
  }

  getById(id: string): Vehicle | undefined {
    return this.vehicles.find((v) => v.id === id);
  }

  getGroups(): VehicleGroup[] {
    return mockGroups as VehicleGroup[];
  }
}

// --- Singleton Export ----------------------------------------------------------

export const vehicleRepository: VehicleRepository = new MockVehicleRepository();
