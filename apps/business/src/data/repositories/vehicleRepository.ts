/**
 * Vehicle Repository
 *
 * Abstraction layer between Service and data source.
 * Swap MockVehicleRepository for ApiVehicleRepository when backend is ready.
 */

import type { Vehicle, VehicleGroup } from '@/features/core/vehicles/types/vehicle';
import { mockVehicles as centralVehicles, mockVehicleGroups, mockTrackingState } from '../mock';

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
        odometer: (v as any).odometer ?? (48000 + (parseInt(v.id.split('-')[1] || '0') * 100)),
        lastServiceKm: (v as any).lastServiceKm ?? (40000 + (parseInt(v.id.split('-')[1] || '0') * 100)),
        nextServiceKm: (v as any).nextServiceKm ?? (50000 + (parseInt(v.id.split('-')[1] || '0') * 100)),
        lastUpdate: tracking?.lastUpdate ?? new Date().toISOString(),
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
    return mockVehicleGroups as VehicleGroup[];
  }
}

// --- Singleton Export ----------------------------------------------------------

export const vehicleRepository: VehicleRepository = new MockVehicleRepository();
