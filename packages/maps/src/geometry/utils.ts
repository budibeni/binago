import { Coordinate, MapGeometry } from './types';

// Convert degrees to radians
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

// Convert radians to degrees
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

// Calculate distance between two coordinates in meters
export function getDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371e3; // Earth's radius in meters
  const lat1 = toRadians(coord1.lat);
  const lat2 = toRadians(coord2.lat);
  const deltaLat = toRadians(coord2.lat - coord1.lat);
  const deltaLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Generate a polygon representing a circle
export function createCirclePolygon(center: Coordinate, radiusMeters: number, steps: number = 64): Coordinate[] {
  const coordinates: Coordinate[] = [];
  const R = 6371e3; // Earth's radius in meters
  
  for (let i = 0; i < steps; i++) {
    const bearing = (i * 360) / steps;
    const bearingRad = toRadians(bearing);
    
    const latRad = toRadians(center.lat);
    const lngRad = toRadians(center.lng);
    
    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(radiusMeters / R) +
      Math.cos(latRad) * Math.sin(radiusMeters / R) * Math.cos(bearingRad)
    );
    
    const newLngRad = lngRad + Math.atan2(
      Math.sin(bearingRad) * Math.sin(radiusMeters / R) * Math.cos(latRad),
      Math.cos(radiusMeters / R) - Math.sin(latRad) * Math.sin(newLatRad)
    );
    
    coordinates.push({
      lat: toDegrees(newLatRad),
      lng: toDegrees(newLngRad)
    });
  }
  
  // Close the polygon
  coordinates.push({ ...coordinates[0] });
  return coordinates;
}

export function geometryToGeoJSON(geometry: MapGeometry): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.Point> {
  if (geometry.type === 'polygon') {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [geometry.coordinates.map(c => [c.lng, c.lat])]
      }
    };
  }
  
  if (geometry.type === 'circle') {
    const circleCoords = createCirclePolygon(geometry.center, geometry.radius);
    return {
      type: 'Feature',
      properties: {
        isCircle: true,
        radius: geometry.radius,
        center: [geometry.center.lng, geometry.center.lat]
      },
      geometry: {
        type: 'Polygon',
        coordinates: [circleCoords.map(c => [c.lng, c.lat])]
      }
    };
  }
  
  throw new Error('Unsupported geometry type');
}
