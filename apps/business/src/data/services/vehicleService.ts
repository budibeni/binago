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

    if (status && status.length > 0) {
      vehicles = vehicles.filter((v) => status.includes(v.status));
    }

    if (groupIds && groupIds.length > 0) {
      vehicles = vehicles.filter((v) => groupIds.includes(v.groupId));
    }

    if (filters.stnkStatus && filters.stnkStatus.length > 0) {
      vehicles = vehicles.filter((v) => {
        if (!v.registrationExpiry) return false;
        const diff = (new Date(v.registrationExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        const stnkState = diff < 0 ? 'expired' : diff < 60 ? 'expiring' : 'active';
        return filters.stnkStatus!.includes(stnkState);
      });
    }

    if (filters.performanceStars && filters.performanceStars.length > 0) {
      const stars = filters.performanceStars;
      vehicles = vehicles.filter((v) => {
        const score = v.performanceMetrics?.score || 0;
        const rating = score >= 100 ? 5 : Math.floor(score / 20);
        return stars.includes(rating.toString());
      });
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
