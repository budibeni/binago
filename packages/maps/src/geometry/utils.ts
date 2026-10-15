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

/**
 * Menghitung luas area (meter persegi) dari polygon atau rectangle pada permukaan bumi (geodesic).
 */
export function calculateGeometryArea(geometry: MapGeometry | null | undefined): number {
  if (!geometry) return 0;

  if (geometry.type === 'multiline') {
    return 0; // Garis lintasan tidak memiliki luas
  }

  if (geometry.type === 'rectangle') {
    const [sw, ne] = geometry.coordinates;
    const width = getDistance(sw, { lat: sw.lat, lng: ne.lng });
    const height = getDistance(sw, { lat: ne.lat, lng: sw.lng });
    return width * height;
  }

  if (geometry.type === 'polygon') {
    const coords = geometry.coordinates;
    if (!coords || coords.length < 3) return 0;

    // Bersihkan titik penutup jika ada di akhir
    const ring = [...coords];
    if (ring.length > 3) {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (Math.abs(first.lat - last.lat) < 1e-7 && Math.abs(first.lng - last.lng) < 1e-7) {
        ring.pop();
      }
    }
    const n = ring.length;
    if (n < 3) return 0;

    // Gauss-Bonnet / Trapeze spherical formula (Radius Bumi = 6,371,008.8 meter)
    const R = 6371008.8;
    let total = 0;

    for (let i = 0; i < n; i++) {
      const p1 = ring[i];
      const p2 = ring[(i + 1) % n];
      const lat1Rad = toRadians(p1.lat);
      const lat2Rad = toRadians(p2.lat);
      const deltaLngRad = toRadians(p2.lng - p1.lng);

      total += deltaLngRad * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad));
    }

    const area = Math.abs((total * R * R) / 2);
    return area;
  }

  return 0;
}

/**
 * Menghitung keliling / panjang lintasan (meter) dari geometri secara geodesic.
 */
export function calculateGeometryPerimeter(geometry: MapGeometry | null | undefined): number {
  if (!geometry) return 0;

  if (geometry.type === 'rectangle') {
    const [sw, ne] = geometry.coordinates;
    const width = getDistance(sw, { lat: sw.lat, lng: ne.lng });
    const height = getDistance(sw, { lat: ne.lat, lng: sw.lng });
    return 2 * (width + height);
  }

  if (geometry.type === 'multiline') {
    const coords = geometry.coordinates;
    if (!coords || coords.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      total += getDistance(coords[i], coords[i + 1]);
    }
    return total;
  }

  if (geometry.type === 'polygon') {
    const coords = geometry.coordinates;
    if (!coords || coords.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      total += getDistance(coords[i], coords[i + 1]);
    }
    // Tutup polygon jika titik terakhir belum menyambung ke awal
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (Math.abs(first.lat - last.lat) > 1e-7 || Math.abs(first.lng - last.lng) > 1e-7) {
      total += getDistance(last, first);
    }
    return total;
  }

  return 0;
}

/**
 * Format representasi teks untuk luas area.
 */
export function formatGeometryArea(areaM2: number, locale = 'id'): string {
  if (!areaM2 || areaM2 <= 0) return '-';

  if (areaM2 >= 1000000) {
    const km2 = (areaM2 / 1000000).toFixed(2);
    return `${km2} km²`;
  }

  if (areaM2 >= 10000) {
    const ha = (areaM2 / 10000).toFixed(2);
    const m2Formatted = Math.round(areaM2).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US');
    return `${m2Formatted} m² (${ha} ha)`;
  }

  const m2Formatted = Math.round(areaM2).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US');
  return `${m2Formatted} m²`;
}

/**
 * Format representasi teks untuk keliling atau jarak.
 */
export function formatGeometryDistance(meters: number, locale = 'id'): string {
  if (!meters || meters <= 0) return '-';

  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(2);
    return `${km} km`;
  }

  const mFormatted = Math.round(meters).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US');
  return `${mFormatted} m`;
}
