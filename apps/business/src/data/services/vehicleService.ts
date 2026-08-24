/**
 * Vehicle Service
 *
 * Entry point for all vehicle data access.
 * Features call this service — not the repository directly.
 */

import type { Vehicle, VehicleGroup, VehicleFilters } from '@/features/core/vehicles/types/vehicle';
import { vehicleRepository } from '../repositories/vehicleRepository';

export const vehicleService = {
  /**
   * Get all vehicles with optional filtering.
   */
  getVehicles(filters?: Partial<VehicleFilters>): Vehicle[] {
    let vehicles = vehicleRepository.getAll();

    if (!filters) return vehicles;

    const { search, status, groupIds } = filters;

    if (search?.trim()) {
      const q = search.toLowerCase();
      vehicles = vehicles.filter(
        (v) =>
          v.plateNumber.toLowerCase().includes(q) ||
          v.vehicleName.toLowerCase().includes(q) ||
          (v.driverName?.toLowerCase().includes(q) ?? false),
      );
    }

    if (status && status !== 'all') {
      vehicles = vehicles.filter((v) => v.status === status);
    }

    if (groupIds && groupIds.length > 0) {
      vehicles = vehicles.filter((v) => groupIds.includes(v.groupId));
    }

    return vehicles;
  },

  /**
   * Get a single vehicle by ID.
   */
  getVehicleById(id: string): Vehicle | undefined {
    return vehicleRepository.getById(id);
  },

  /**
   * Get all vehicle groups.
   */
  getVehicleGroups(): VehicleGroup[] {
    return vehicleRepository.getGroups();
  },
};
