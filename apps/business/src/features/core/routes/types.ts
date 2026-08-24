import { MapGeometry } from '@adatrack/maps';

export interface RouteLocation {
  type: 'geofence' | 'coordinate';
  geofenceId?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  address?: string;
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

  origin: RouteLocation;
  stops: RouteStop[];
  destination: RouteLocation;

  plannedPath?: MapGeometry;
  plannedDistance?: number;
  estimatedDuration?: number;

  status: 'active' | 'inactive';

  createdAt: string;
  updatedAt: string;
}

export type MapInteractionMode = 'idle' | 'select-location' | 'draw_multiline';

export type ActiveLocationTarget = 'origin' | 'destination' | `stop-${string}` | null;
