/**
 * Proxy: features/geofences/data/mockGeofences.ts
 *
 * Backward-compatible adapter. All data comes from geofenceService.
 */

import type { Geofence, GeofenceGroup } from '../types';
import { geofenceService } from '@/data/services/geofenceService';

export const mockGeofences: Geofence[] = geofenceService.getGeofences();
export const mockGeofenceGroups: GeofenceGroup[] = geofenceService.getGeofenceGroups();
