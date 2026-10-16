import type { Route, RouteLocation } from '../types';
import type { Geofence } from '../../geofences/types';

/**
 * Normalizes any route (with plannedPath MapGeometry, GeoJSON, waypoints, or origin/stops/destination)
 * into a valid GeoJSON LineString coordinate array of [longitude, latitude].
 */
export function extractRouteCoordinates(rt: Route | any, geofences: Geofence[] = []): number[][] {
  if (!rt) return [];

  // 1. Try plannedPath
  if (rt.plannedPath) {
    let parsed: any = rt.plannedPath;
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed); } catch (e) {}
    }

    if (parsed?.type === 'Feature' && parsed?.geometry) {
      parsed = parsed.geometry;
    }

    if (parsed && Array.isArray(parsed.coordinates) && parsed.coordinates.length > 0) {
      const first = parsed.coordinates[0];
      // Object format from MapGeometry: [{lat, lng}, ...] or [{lat, lon}, ...]
      if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
        const coords: number[][] = parsed.coordinates
          .filter((c: any) => c && (c.lat !== undefined || c.latitude !== undefined))
          .map((c: any) => [
            Number(c.lng ?? c.longitude ?? c.lon ?? 0),
            Number(c.lat ?? c.latitude ?? 0)
          ])
          .filter(([lng, lat]: number[]) => !isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0));
        if (coords.length > 1) return coords;
      } else if (Array.isArray(first)) {
        // Standard GeoJSON [lng, lat] pairs
        const coords: number[][] = parsed.coordinates
          .map((c: any) => [Number(c[0] ?? 0), Number(c[1] ?? 0)])
          .filter(([lng, lat]: number[]) => !isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0));
        if (coords.length > 1) return coords;
      }
    }
  }

  // 2. Try waypoints array
  if (Array.isArray(rt.waypoints) && rt.waypoints.length > 1) {
    const coords: number[][] = rt.waypoints
      .map((wp: any) => [
        Number(wp.lng ?? wp.longitude ?? wp.lon ?? 0),
        Number(wp.lat ?? wp.latitude ?? 0)
      ])
      .filter(([lng, lat]: number[]) => !isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0));
    if (coords.length > 1) return coords;
  }

  // 3. Fallback: connect origin -> stops -> destination
  const points: number[][] = [];
  const resolveLoc = (loc?: RouteLocation): [number, number] | null => {
    if (!loc) return null;
    if (loc.type === 'coordinate' && loc.latitude !== undefined && loc.longitude !== undefined) {
      const lng = Number(loc.longitude ?? (loc as any).lng ?? (loc as any).lon ?? 0);
      const lat = Number(loc.latitude ?? (loc as any).lat ?? 0);
      if (!isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0)) {
        return [lng, lat];
      }
    }
    if (loc.type === 'geofence' && loc.geofenceId) {
      const gf = geofences.find(g => g.id === loc.geofenceId);
      if (gf?.geometry?.coordinates && gf.geometry.coordinates.length > 0) {
        let sumLng = 0, sumLat = 0;
        gf.geometry.coordinates.forEach((c: any) => {
          sumLng += Number(c.lng ?? c.lon ?? 0);
          sumLat += Number(c.lat ?? 0);
        });
        const avgLng = sumLng / gf.geometry.coordinates.length;
        const avgLat = sumLat / gf.geometry.coordinates.length;
        if (!isNaN(avgLng) && !isNaN(avgLat) && (avgLng !== 0 || avgLat !== 0)) {
          return [avgLng, avgLat];
        }
      }
    }
    return null;
  };

  const origCoord = resolveLoc(rt.origin);
  if (origCoord) points.push(origCoord);

  if (Array.isArray(rt.stops)) {
    rt.stops.forEach((s: any) => {
      const stopCoord = resolveLoc(s.location);
      if (stopCoord) points.push(stopCoord);
    });
  }

  const destCoord = resolveLoc(rt.destination);
  if (destCoord) points.push(destCoord);

  if (points.length > 1) return points;

  return [];
}
