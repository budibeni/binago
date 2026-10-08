import { BasemapId } from './types';

/**
 * BASEMAP_METADATA
 *
 * Berisi label UI, informasi provider, attribution, dan usage policy untuk setiap basemap.
 *
 * PENTING - Usage Policy:
 * - Standard (CartoDB Positron): Free/public development provider. License CC BY 3.0.
 *   Attribution wajib ditampilkan.
 * - OpenStreetMap: Free/public development provider.
 *   Wajib menghormati OSM Tile Usage Policy: https://operations.osmfoundation.org/policies/tiles/
 *   Jangan melakukan tile prefetch massal, bulk download, atau offline cache.
 *   Attribution wajib ditampilkan.
 * - Satellite (Esri WorldImagery): Free/public development provider.
 *   Penggunaan production commercial memerlukan review lisensi Esri.
 *   Attribution wajib ditampilkan.
 */
export const BASEMAP_METADATA: Record<
  BasemapId,
  {
    label: string;
    provider: string;
    usagePolicy: string;
    attribution: string;
  }
> = {
  standard: {
    label: 'Standar',
    provider: 'CartoDB Positron',
    usagePolicy:
      'Free/public development provider. License: CC BY 3.0. Attribution wajib ditampilkan.',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
  },
  dark: {
    label: 'Gelap',
    provider: 'CartoDB Dark Matter',
    usagePolicy:
      'Free/public development provider. License: CC BY 3.0. Attribution wajib ditampilkan.',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
  },
  osm: {
    label: 'OpenStreetMap',
    provider: 'OpenStreetMap',
    usagePolicy:
      'Free/public development provider. Hormati OSM Tile Usage Policy. Jangan lakukan bulk download atau offline cache.',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  },
  satellite: {
    label: 'Satelit',
    provider: 'Esri WorldImagery',
    usagePolicy:
      'Free/public development provider. Penggunaan production commercial memerlukan review lisensi Esri.',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  },
  google_streets: {
    label: 'Google Streets',
    provider: 'Google Maps',
    usagePolicy: 'Development use only without official API Key.',
    attribution: '&copy; Google Maps',
  },
  google_hybrid: {
    label: 'Google Hybrid',
    provider: 'Google Maps',
    usagePolicy: 'Development use only without official API Key.',
    attribution: '&copy; Google Maps',
  },
};

/**
 * Bangun MapLibre style object untuk raster tile basemap.
 * Digunakan oleh OSM dan Satellite.
 */
function buildRasterTileStyle(tileUrl: string, attribution: string) {
  return {
    version: 8 as const,
    glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
    sources: {
      'raster-tiles': {
        type: 'raster' as const,
        tiles: [tileUrl],
        tileSize: 256,
        attribution,
      },
    },
    layers: [
      {
        id: 'raster-tiles',
        type: 'raster' as const,
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
}

/**
 * CartoDB Positron vector style URL.
 * Standard basemap menggunakan vector style dari CartoDB.
 */
const STANDARD_STYLE_URL =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

/**
 * CartoDB Dark Matter vector style URL.
 */
const DARK_STYLE_URL =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

/**
 * OSM raster tile URL.
 * Gunakan HTTPS. Hormati OSM Tile Usage Policy.
 */
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

/**
 * Esri WorldImagery raster tile URL.
 * Free/public development. Production commercial perlu review lisensi Esri.
 */
const ESRI_SATELLITE_TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const GOOGLE_STREETS_URL = 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
const GOOGLE_HYBRID_URL = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';

/**
 * getBasemapStyle - resolve MapLibre style untuk basemap yang dipilih.
 *
 * Standard: vector style URL string (CartoDB Positron)
 * OSM: raster tile style object
 * Satellite: raster tile style object (Esri WorldImagery)
 */
export function getBasemapStyle(id: BasemapId): string | object {
  switch (id) {
    case 'standard':
      return STANDARD_STYLE_URL;

    case 'dark':
      return DARK_STYLE_URL;

    case 'osm':
      return buildRasterTileStyle(OSM_TILE_URL, BASEMAP_METADATA.osm.attribution);

    case 'satellite':
      return buildRasterTileStyle(
        ESRI_SATELLITE_TILE_URL,
        BASEMAP_METADATA.satellite.attribution,
      );

    case 'google_streets':
      return buildRasterTileStyle(
        GOOGLE_STREETS_URL,
        BASEMAP_METADATA.google_streets.attribution,
      );

    case 'google_hybrid':
      return buildRasterTileStyle(
        GOOGLE_HYBRID_URL,
        BASEMAP_METADATA.google_hybrid.attribution,
      );

    default:
      return STANDARD_STYLE_URL;
  }
}

// Pre-computed map untuk akses langsung (backward compat)
export const BASEMAP_STYLES: Record<BasemapId, string | object> = {
  standard: getBasemapStyle('standard'),
  dark: getBasemapStyle('dark'),
  osm: getBasemapStyle('osm'),
  satellite: getBasemapStyle('satellite'),
  google_streets: getBasemapStyle('google_streets'),
  google_hybrid: getBasemapStyle('google_hybrid'),
};

// Legacy - tetap tersedia untuk backward compatibility
export const BASEMAP_PROVIDERS = BASEMAP_METADATA;


// Cache for Google Map Tiles API session token
let googleSessionToken: string | null = null;
let googleSessionTokenExpiry: number = 0;

async function getGoogleTilesSession(mapType: 'roadmap' | 'satellite'): Promise<string | null> {
  const apiKey = (process.env as any).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;
  
  // Create a new session if none exists or it has expired (tokens usually last 2 weeks, we cache for 1 day for safety)
  if (googleSessionToken && Date.now() < googleSessionTokenExpiry) {
    return googleSessionToken;
  }
  
  try {
    const res = await fetch(`https://tile.googleapis.com/v1/createSession?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mapType: mapType,
        language: 'id-ID',
        region: 'ID',
        overlay: mapType === 'satellite' // to show labels on satellite (hybrid)
      })
    });
    
    if (!res.ok) {
      console.warn('Google Map Tiles API error:', await res.text());
      return null;
    }
    
    const data = await res.json();
    if (data.session) {
      googleSessionToken = data.session;
      googleSessionTokenExpiry = Date.now() + 1000 * 60 * 60 * 24; // 1 day
      return data.session;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch Google Map Tiles session:', error);
    return null;
  }
}

export async function getBasemapStyleAsync(id: BasemapId): Promise<string | object> {
  const apiKey = (process.env as any).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (id === 'google_streets') {
    if (!apiKey) return getBasemapStyle('standard'); // Fallback to standard
    const session = await getGoogleTilesSession('roadmap');
    if (!session) return getBasemapStyle('standard');
    return buildRasterTileStyle(
      `https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${session}&key=${apiKey}`,
      BASEMAP_METADATA.google_streets.attribution
    );
  }
  
  if (id === 'google_hybrid') {
    if (!apiKey) return getBasemapStyle('standard'); // Fallback to standard
    const session = await getGoogleTilesSession('satellite');
    if (!session) return getBasemapStyle('standard');
    return buildRasterTileStyle(
      `https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${session}&key=${apiKey}`,
      BASEMAP_METADATA.google_hybrid.attribution
    );
  }

  return getBasemapStyle(id);
}
