import { Geofence, GeofenceGroup } from '../types';
import { mockGeofences as centralGeofences, mockGroups } from '../../../data/mock';

export const mockGeofenceGroups: GeofenceGroup[] = mockGroups.map(g => ({
  id: g.id,
  name: g.name
}));

export const mockGeofences: Geofence[] = centralGeofences.map(g => ({
  ...g,
  createdAt: '2025-01-10T08:00:00Z',
  updatedAt: '2025-01-15T10:30:00Z'
})) as Geofence[];
