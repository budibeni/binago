import { z } from 'zod';
import type { MapGeometry } from '@adatrack/maps';

export type GeofenceStatus = 'active' | 'inactive';
export type GeofenceDrawMode = 'polygon' | 'rectangle' | 'multiline';
export type GeofenceEditorMode = 'idle' | 'draw_polygon' | 'draw_rectangle' | 'draw_multiline' | 'edit';

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
  status: GeofenceStatus;
  createdAt: string;
  updatedAt: string;
}

export const getGeofenceFormSchema = (t?: Record<string, string>) =>
  z.object({
    name: z.string().min(1, t?.nameRequired || 'Nama batas wilayah (geofence) wajib diisi'),
    groupId: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']),
    geometry: z.custom<MapGeometry>(
      (val) => {
        if (!val || typeof val !== 'object') return false;
        const geom = val as MapGeometry;
        if (!geom.type) return false;
        if (geom.type === 'polygon' || geom.type === 'multiline') {
          return Array.isArray(geom.coordinates) && geom.coordinates.length >= 3;
        }
        if (geom.type === 'rectangle') {
          return Array.isArray(geom.coordinates) && geom.coordinates.length >= 2;
        }
        return false;
      },
      { message: t?.geometryRequired || 'Batas area pada peta wajib digambar' }
    ),
  });

export type GeofenceFormData = z.infer<ReturnType<typeof getGeofenceFormSchema>>;
