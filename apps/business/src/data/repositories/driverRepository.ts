/**
 * Driver Repository
 */

import type { Driver } from '@/features/drivers/types/driver';
import { mockDrivers as centralDrivers } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface DriverRepository {
  getAll(): Driver[];
  getById(id: string): Driver | undefined;
}

// --- Mock Repository Implementation -------------------------------------------

class MockDriverRepository implements DriverRepository {
  private drivers: Driver[];

  constructor() {
    this.drivers = centralDrivers.map((d) => ({
      ...d,
      history: [],
    })) as unknown as Driver[];
  }

  getAll(): Driver[] {
    return this.drivers;
  }

  getById(id: string): Driver | undefined {
    return this.drivers.find((d) => d.id === id);
  }
}

// --- Singleton Export ----------------------------------------------------------

export const driverRepository: DriverRepository = new MockDriverRepository();
