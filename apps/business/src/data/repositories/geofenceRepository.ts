/**
 * Geofence Repository
 */

import type { Geofence, GeofenceGroup } from '@/features/geofences/types';
import { mockGeofences as centralGeofences, mockGroups } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface GeofenceRepository {
  getAll(): Geofence[];
  getById(id: string): Geofence | undefined;
  getGroups(): GeofenceGroup[];
}

// --- Mock Repository Implementation -------------------------------------------

class MockGeofenceRepository implements GeofenceRepository {
  private geofences: Geofence[];
  private groups: GeofenceGroup[];

  constructor() {
    this.geofences = centralGeofences.map((g) => ({
      ...g,
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
    })) as unknown as Geofence[];

    this.groups = mockGroups.map((g) => ({
      id: g.id,
      name: g.name,
    }));
  }

  getAll(): Geofence[] {
    return this.geofences;
  }

  getById(id: string): Geofence | undefined {
    return this.geofences.find((g) => g.id === id);
  }

  getGroups(): GeofenceGroup[] {
    return this.groups;
  }
}

// --- Singleton Export ----------------------------------------------------------

export const geofenceRepository: GeofenceRepository = new MockGeofenceRepository();
