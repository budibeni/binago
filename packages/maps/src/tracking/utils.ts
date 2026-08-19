import type { LocationSearchResult } from '../tools/types';

/**
 * Mencari alamat menggunakan Nominatim OpenStreetMap (Public API).
 */
export async function defaultNominatimSearch(
  query: string,
  options?: { countryCode?: string; limit?: number },
): Promise<LocationSearchResult[]> {
  try {
    const cc = options?.countryCode ?? 'id';
    const limit = options?.limit ?? 5;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=${cc}&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'id-ID,id;q=0.9',
        'User-Agent': 'Adatrack-Maps/1.0',
      },
    });

    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();
    return data.map((item: any) => ({
      id: item.place_id.toString(),
      label: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error('Map search error:', error);
    return [];
  }
}

/**
 * Menghitung bounding box dari array koordinat.
 */
export function calcEntityBounds(
  positions: { lat: number; lng: number }[]
): [[number, number], [number, number]] | null {
  if (!positions || positions.length === 0) return null;
  
  let minLat = 90;
  let maxLat = -90;
  let minLng = 180;
  let maxLng = -180;
  
  let validPoints = 0;
  
  for (const pos of positions) {
    if (!pos) continue;
    
    const { lat, lng } = pos;
    
    // Basic validation for realistic coordinates
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      validPoints++;
    }
  }
  
  if (validPoints === 0) return null;
  
  // Pad bounds slightly to avoid markers being exactly on the edge
  const latPad = Math.abs(maxLat - minLat) * 0.1 || 0.01;
  const lngPad = Math.abs(maxLng - minLng) * 0.1 || 0.01;
  
  return [
    [minLng - lngPad, minLat - latPad],
    [maxLng + lngPad, maxLat + latPad]
  ];
}
