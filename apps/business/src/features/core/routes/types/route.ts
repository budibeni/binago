import { z } from 'zod';
import type { MapGeometry } from '@adatrack/maps';

export type RouteStatus = 'active' | 'inactive';

export interface RouteLocation {
  type: 'geofence' | 'coordinate';
  geofenceId?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  address?: string;
  sourceMode?: 'geofence' | 'coordinate' | 'address' | 'my_location';
}

export interface RouteStop {
  id: string;
  sequence: number;
  location: RouteLocation;
}

export interface Route {
  id: string;
  name: string;
  description?: string;
  groupId?: string;

  origin: RouteLocation;
  stops: RouteStop[];
  destination: RouteLocation;

  plannedPath?: MapGeometry;
  plannedDistance?: number;
  estimatedDuration?: number;

  status: RouteStatus;

  createdAt: string;
  updatedAt: string;
}

export type MapInteractionMode = 'idle' | 'select-location' | 'draw_multiline';

export type ActiveLocationTarget = 'origin' | 'destination' | `stop-${string}` | null;

export const getRouteFormSchema = (t?: Record<string, string>) =>
  z.object({
    name: z.string().min(1, t?.nameRequired || 'Nama rute operasional wajib diisi'),
    groupId: z.string().optional(),
    description: z.string().optional(),
    origin: z
      .object({
        type: z.enum(['geofence', 'coordinate']),
        geofenceId: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        radius: z.number().optional(),
        address: z.string().optional(),
        sourceMode: z.enum(['geofence', 'coordinate', 'address', 'my_location']).optional(),
      })
      .refine(
        (loc) => {
          if (loc.type === 'geofence') return !!loc.geofenceId;
          if (loc.type === 'coordinate') return loc.latitude !== undefined && loc.longitude !== undefined;
          return false;
        },
        { message: t?.originRequired || t?.locationRequired || 'Titik asal rute wajib ditentukan' }
      ),
    destination: z
      .object({
        type: z.enum(['geofence', 'coordinate']),
        geofenceId: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        radius: z.number().optional(),
        address: z.string().optional(),
        sourceMode: z.enum(['geofence', 'coordinate', 'address', 'my_location']).optional(),
      })
      .refine(
        (loc) => {
          if (loc.type === 'geofence') return !!loc.geofenceId;
          if (loc.type === 'coordinate') return loc.latitude !== undefined && loc.longitude !== undefined;
          return false;
        },
        { message: t?.destinationRequired || t?.locationRequired || 'Titik tujuan rute wajib ditentukan' }
      ),
    status: z.enum(['active', 'inactive']),
    plannedDistance: z.number().optional(),
    estimatedDuration: z.number().optional(),
  });

export type RouteFormData = z.infer<ReturnType<typeof getRouteFormSchema>>;
