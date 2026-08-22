import { MapGeometry } from '@adatrack/maps';

export interface Geofence {
  id: string;
  name: string;
  description?: string;
  geometry: MapGeometry;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
