/**
 * Geofence Service
 */

import type { Geofence, GeofenceGroup } from '@/features/geofences/types';
import { geofenceRepository } from '../repositories/geofenceRepository';

export const geofenceService = {
  getGeofences(status?: 'active' | 'inactive' | 'all'): Geofence[] {
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
};
