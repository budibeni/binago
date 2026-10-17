/**
 * Geofence Service
 *
 * Public facade for geofence domain, consumed directly by UI feature components.
 */

import type { Geofence, GeofenceGroup, GeofenceStatus } from '@/features/core/geofences/types';
import { geofenceRepository } from '../repositories/geofenceRepository';

export const geofenceService = {
  getGeofences(status?: GeofenceStatus | 'all'): Geofence[] {
    const all = geofenceRepository.getAll();
    if (!status || status === 'all') return all;
    return all.filter((g) => g.status === status);
  },

  getGeofenceById(id: string): Geofence | undefined {
    return geofenceRepository.getById(id);
  },

  getGeofenceGroups(): GeofenceGroup[] {
    return geofenceRepository.getGroups();
  },

  createGeofence(data: Partial<Geofence>): Geofence {
    return geofenceRepository.create(data);
  },

  updateGeofence(id: string, data: Partial<Geofence>): Geofence | undefined {
    return geofenceRepository.update(id, data);
  },

  deleteGeofence(id: string): boolean {
    return geofenceRepository.delete(id);
  },

  subscribe(listener: () => void): () => void {
    return geofenceRepository.subscribe(listener);
  },
};
