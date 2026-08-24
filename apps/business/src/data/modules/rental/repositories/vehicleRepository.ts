import type { RentalVehicleProfile } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import { mockRentalVehicles } from '../mock/vehicles';

let vehiclesData = [...mockRentalVehicles];

export const rentalVehicleRepository = {
  getAll(): RentalVehicleProfile[] {
    return [...vehiclesData];
  },

  getById(id: string): RentalVehicleProfile | undefined {
    return vehiclesData.find(v => v.id === id);
  },

  getByVehicleId(vehicleId: string): RentalVehicleProfile | undefined {
    return vehiclesData.find(v => v.vehicleId === vehicleId);
  },

  create(data: Omit<RentalVehicleProfile, 'id' | 'createdAt' | 'updatedAt'>): RentalVehicleProfile {
    const newVehicle: RentalVehicleProfile = {
      ...data,
      id: `rveh-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vehiclesData.push(newVehicle);
    return newVehicle;
  },

  update(id: string, data: Partial<RentalVehicleProfile>): RentalVehicleProfile {
    const index = vehiclesData.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error(`Rental Vehicle with id ${id} not found`);
    }

    const updated = {
      ...vehiclesData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    vehiclesData[index] = updated;
    return updated;
  },

  delete(id: string): void {
    vehiclesData = vehiclesData.filter(v => v.id !== id);
  },
};
