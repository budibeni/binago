/**
 * Driver Service
 */

import type { Driver, DriverStatusFilter } from '@/features/core/drivers/types/driver';
import { driverRepository } from '../repositories/driverRepository';

export const driverService = {
  getDrivers(search?: string, status?: DriverStatusFilter, groupIds?: string[]): Driver[] {
    let drivers = driverRepository.getAll();

    if (search?.trim()) {
      const q = search.toLowerCase();
      drivers = drivers.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.ktpNumber.includes(q) ||
          d.phone.includes(q) ||
          d.licenseNumber.toLowerCase().includes(q),
      );
    }

    if (status && status !== 'all') {
      drivers = drivers.filter((d) => d.status === status);
    }

    if (groupIds && groupIds.length > 0) {
      drivers = drivers.filter((d) => d.groupId && groupIds.includes(d.groupId));
    }

    return drivers;
  },

  getDriverById(id: string): Driver | undefined {
    return driverRepository.getById(id);
  },
};
