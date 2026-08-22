import { MapGeometry } from '@adatrack/maps';

export interface GeofenceGroup {
  id: string;
  name: string;
  description?: string;
}

export interface Geofence {
  id: string;
  groupId?: string;
  name: string;
  description?: string;
  geometry: MapGeometry;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
