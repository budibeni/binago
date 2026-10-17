/**
 * Driver Repository
 */

import type { Driver } from '@/features/core/drivers/types/driver';
import { mockDrivers as centralDrivers, mockVehicleGroups } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface DriverRepository {
  getAll(): Driver[];
  getById(id: string): Driver | undefined;
  create(data: Partial<Driver>): Driver;
  update(id: string, data: Partial<Driver>): Driver | undefined;
  delete(id: string): boolean;
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

  create(data: Partial<Driver>): Driver {
    const id = data.id || `drv-${Date.now().toString().slice(-4)}`;
    const group = mockVehicleGroups.find((g) => g.id === data.groupId);
    const newDriver: Driver = {
      id,
      name: data.name || 'Pengemudi Baru',
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      phone: data.phone || '081200000000',
      email: data.email || `${id}@example.com`,
      address: data.address || 'Jakarta, Indonesia',
      ktpNumber: data.ktpNumber || '3171000000000000',
      placeOfBirth: data.placeOfBirth || 'Jakarta',
      dateOfBirth: data.dateOfBirth || '1990-01-01',
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
      placement: data.placement || 'Pusat Logistik Jakarta',
      groupId: data.groupId || (mockVehicleGroups[0]?.id ?? 'grp-1'),
      groupName: group?.name || 'Logistik Umum',
      licenseNumber: data.licenseNumber || 'SIM-B2-00000000',
      licenseExpiry: data.licenseExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: data.status || 'active',
      assignedVehicleId: data.assignedVehicleId,
      assignedVehiclePlate: data.assignedVehiclePlate,
      performanceScore: data.performanceScore ?? 85,
      performanceMetrics: data.performanceMetrics || {
        harshDriving: 1,
        speeding: 0,
        overIdling: 2,
        fatigueDriving: 0,
      },
      history: data.history || [
        {
          id: `hist-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().split('T')[0],
          type: 'assignment',
          description: 'Bergabung sebagai pengemudi',
        },
      ],
      ...data,
    } as Driver;

    this.drivers = [newDriver, ...this.drivers];
    return newDriver;
  }

  update(id: string, data: Partial<Driver>): Driver | undefined {
    const index = this.drivers.findIndex((d) => d.id === id);
    if (index === -1) return undefined;

    const group = data.groupId ? mockVehicleGroups.find((g) => g.id === data.groupId) : undefined;
    const updated: Driver = {
      ...this.drivers[index],
      ...data,
      groupName: group ? group.name : this.drivers[index].groupName,
    };

    this.drivers[index] = updated;
    return updated;
  }

  delete(id: string): boolean {
    const prevLen = this.drivers.length;
    this.drivers = this.drivers.filter((d) => d.id !== id);
    return this.drivers.length < prevLen;
  }
}

// --- Singleton Export ----------------------------------------------------------

export const driverRepository: DriverRepository = new MockDriverRepository();
