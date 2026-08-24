import { mockGroups } from '../../../data/mock';

export interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: 'vehicle' | 'driver' | 'geofence';
}

export const mockVehicleGroups: GroupData[] = mockGroups;

export const mockDriverGroups: GroupData[] = mockGroups.map(g => ({
  ...g,
  id: g.id.replace('grp', 'dg'),
  type: 'driver' as const
}));

export const mockGeofenceGroups: GroupData[] = mockGroups.map(g => ({
  ...g,
  id: g.id.replace('grp', 'gg'),
  type: 'geofence' as const
}));
