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

// Calculate bounding box corners for a rectangle
export function getRectanglePolygon(sw: Coordinate, ne: Coordinate): Coordinate[] {
  return [
    sw, // bottom-left
    { lat: sw.lat, lng: ne.lng }, // bottom-right
    ne, // top-right
    { lat: ne.lat, lng: sw.lng }, // top-left
    sw // close
  ];
}

export function geometryToGeoJSON(geometry: MapGeometry): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.LineString> {
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
  
  if (geometry.type === 'rectangle') {
    const [sw, ne] = geometry.coordinates;
    const coords = getRectanglePolygon(sw, ne);
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [coords.map(c => [c.lng, c.lat])]
      }
    };
  }

  if (geometry.type === 'multiline') {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: geometry.coordinates.map(c => [c.lng, c.lat])
      }
    };
  }
  
  throw new Error('Unsupported geometry type');
}
