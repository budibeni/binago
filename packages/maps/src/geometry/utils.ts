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

// Calculate total distance along a path of coordinates in meters
export function calculatePathDistance(coordinates: Coordinate[]): number {
  if (!coordinates || coordinates.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    total += getDistance(coordinates[i], coordinates[i + 1]);
  }
  return total;
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

function toLngLat(c: any): [number, number] | null {
  if (!c) return null;
  if (Array.isArray(c)) {
    const lng = Number(c[0]);
    const lat = Number(c[1]);
    if (!isNaN(lng) && !isNaN(lat)) return [lng, lat];
    return null;
  }
  if (typeof c === 'object') {
    const lng = Number(c.lng ?? c.longitude ?? c.lon);
    const lat = Number(c.lat ?? c.latitude);
    if (!isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0)) {
      return [lng, lat];
    }
  }
  return null;
}

export function geometryToGeoJSON(geometry: MapGeometry | any): GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.LineString> {
  const emptyPolygon: GeoJSON.Feature<GeoJSON.Polygon> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: []
    }
  };

  if (!geometry || typeof geometry !== 'object') {
    return emptyPolygon;
  }

  const rawCoords = Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
  const coords: [number, number][] = rawCoords
    .map(toLngLat)
    .filter((pt: any): pt is [number, number] => pt !== null);

  if (geometry.type === 'polygon') {
    if (coords.length < 3) return emptyPolygon;
    // Ensure ring is closed
    const first = coords[0];
    const last = coords[coords.length - 1];
    const closed = (first[0] === last[0] && first[1] === last[1]) ? coords : [...coords, first];
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [closed]
      }
    };
  }
  
  if (geometry.type === 'rectangle') {
    if (coords.length < 2) return emptyPolygon;
    
    if (coords.length === 2) {
      const sw: Coordinate = { lng: coords[0][0], lat: coords[0][1] };
      const ne: Coordinate = { lng: coords[1][0], lat: coords[1][1] };
      const rectCoords = getRectanglePolygon(sw, ne).map(c => [c.lng, c.lat] as [number, number]);
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [rectCoords]
        }
      };
    }

    // Already 4+ corners
    const first = coords[0];
    const last = coords[coords.length - 1];
    const closed = (first[0] === last[0] && first[1] === last[1]) ? coords : [...coords, first];
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [closed]
      }
    };
  }

  if (geometry.type === 'multiline' || geometry.type === 'linestring' || geometry.type === 'LineString') {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coords
      }
    };
  }
  
  return emptyPolygon;
}

