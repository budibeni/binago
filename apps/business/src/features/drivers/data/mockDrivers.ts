/**
 * Proxy: features/drivers/data/mockDrivers.ts
 *
 * Backward-compatible adapter. All data comes from driverService.
 * New code should import from '@/data/services' directly.
 */

import type { Driver, DriverStatusFilter } from '../types/driver';
import { driverService } from '@/data/services/driverService';

export const mockDrivers: Driver[] = driverService.getDrivers();

// filterDrivers kept for backward compatibility
export function filterDrivers(
  drivers: Driver[],
  search: string,
  statusFilter: DriverStatusFilter,
  groupIds: string[],
): Driver[] {
  return driverService.getDrivers(search, statusFilter, groupIds);
}
