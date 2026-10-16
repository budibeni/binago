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
  create(vehicle: Partial<Vehicle>): Vehicle;
  update(id: string, data: Partial<Vehicle>): Vehicle | undefined;
}

// --- Mock Repository Implementation -------------------------------------------

class MockVehicleRepository implements VehicleRepository {
  private vehicles: Vehicle[];

  constructor() {
    this.vehicles = centralVehicles.map((v, i) => {
      const tracking = mockTrackingState.find((t) => t.vehicleId === v.id);
      const baseOdo = 25000 + (parseInt(v.id.split('-')[1] || '0', 10) * 1250);
      const lastService = baseOdo - (3000 + ((i * 500) % 5000));
      const nextService = lastService + 10000;
      return {
        ...v,
        status: (tracking?.status ?? 'offline') as Vehicle['status'],
        odometer: baseOdo,
        lastServiceKm: lastService,
        nextServiceKm: nextService,
        lastUpdate: tracking?.lastUpdate ?? '2026-10-16T18:30:00Z',
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

  create(data: Partial<Vehicle>): Vehicle {
    const id = data.id || `veh-${Date.now().toString().slice(-4)}`;
    const group = mockVehicleGroups.find((g) => g.id === data.groupId);
    const newVehicle: Vehicle = {
      id,
      plateNumber: data.plateNumber || 'B 1000 XXX',
      vehicleName: data.vehicleName || 'Kendaraan Baru',
      vehicleCategory: data.vehicleCategory || 'truck',
      brand: data.brand || '',
      year: data.year || new Date().getFullYear(),
      fuelType: data.fuelType || 'solar',
      groupId: data.groupId || (mockVehicleGroups[0]?.id ?? 'grp-1'),
      groupName: group?.name || 'Logistik Umum',
      driverId: data.driverId || null,
      driverName: data.driverName || null,
      deviceImei: data.deviceImei || null,
      deviceSimNumber: data.deviceSimNumber || null,
      vehicleId: data.vehicleId || `VID-${id.toUpperCase()}`,
      status: 'offline',
      lastUpdate: new Date().toISOString(),
      speed: 0,
      course: 0,
      odometer: data.odometer ?? 0,
      lastServiceKm: data.lastServiceKm ?? 0,
      nextServiceKm: data.nextServiceKm ?? 10000,
      registrationExpiry: data.registrationExpiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      passengerCapacity: data.passengerCapacity,
      color: data.color,
      fuelCapacity: data.fuelCapacity,
      notes: data.notes,
      assetNumber: data.assetNumber,
      dimLength: data.dimLength,
      dimWidth: data.dimWidth,
      dimHeight: data.dimHeight,
      fuelRatio: data.fuelRatio,
      maxSpeed: data.maxSpeed,
      stnkNumber: data.stnkNumber,
      kirNumber: data.kirNumber,
      bpkbNumber: data.bpkbNumber,
      engineNumber: data.engineNumber,
      chassisNumber: data.chassisNumber,
      engineCapacity: data.engineCapacity,
      performanceMetrics: {
        score: 85,
        idleRatio: 5,
        activeHours: 120,
        speedingRatio: 2,
        signalStability: 98,
      },
      ...data,
    } as Vehicle;

    this.vehicles = [newVehicle, ...this.vehicles];
    return newVehicle;
  }

  update(id: string, data: Partial<Vehicle>): Vehicle | undefined {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) return undefined;

    const group = data.groupId ? mockVehicleGroups.find((g) => g.id === data.groupId) : undefined;
    const updated: Vehicle = {
      ...this.vehicles[index],
      ...data,
      groupName: group ? group.name : this.vehicles[index].groupName,
    };

    this.vehicles[index] = updated;
    return updated;
  }
}

// --- Singleton Export ----------------------------------------------------------

export const vehicleRepository: VehicleRepository = new MockVehicleRepository();
