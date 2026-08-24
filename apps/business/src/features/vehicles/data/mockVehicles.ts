/**
 * Proxy: features/vehicles/data/mockVehicles.ts
 *
 * Backward-compatible adapter. All data comes from vehicleService.
 * New code should import from '@/data/services' directly.
 */

import type { Vehicle, VehicleGroup } from '../types/vehicle';
import { vehicleService } from '@/data/services/vehicleService';

export const mockVehicleGroups: VehicleGroup[] = vehicleService.getVehicleGroups();
export const mockVehicles: Vehicle[] = vehicleService.getVehicles();

// filterVehicles kept for backward compatibility with VehiclesFeature
export function filterVehicles(
  _vehicles: Vehicle[],
  search: string,
  status: string,
  groupIds: string[],
): Vehicle[] {
  return vehicleService.getVehicles({ search, status: status as any, groupIds });
}
