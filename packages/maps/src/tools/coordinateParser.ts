/**
 * @adatrack/maps - coordinateParser.ts
 *
 * Utilitas komprehensif untuk mengekstrak latitude dan longitude dari:
 * 1. Angka Decimal langsung: "-6.2088, 106.8456" atau "-6.2088 106.8456"
 * 2. Format Key-Value: "lat: -6.2088, lng: 106.8456"
 * 3. Format DMS (Degrees, Minutes, Seconds): 6°12'31.7"S 106°50'44.2"E
 * 4. URL Google Maps lengkap: https://www.google.com/maps/.../@-6.2424,106.3581,15z
 * 5. Deteksi short link Google Maps (maps.app.goo.gl / goo.gl/maps)
 */

export interface ParsedCoordinateResult {
  lat: number;
  lng: number;
  type: 'decimal' | 'dms' | 'google_maps_url';
}

/**
 * Cek apakah string merupakan tautan pendek (shortlink) Google Maps yang membutuhkan resolusi redirect
 */
export function isGoogleMapsShortLink(text: string): boolean {
  if (!text) return false;
  return /https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps)\/[A-Za-z0-9_-]+/i.test(text.trim());
}

/**
 * Konversi DMS (Degrees, Minutes, Seconds) ke Decimal Degrees
 */
function dmsToDecimal(degrees: number, minutes: number, seconds: number, direction: string): number {
  let dd = degrees + minutes / 60 + (seconds || 0) / 3600;
  const dir = direction.toUpperCase();
  if (dir === 'S' || dir === 'W') {
    dd = dd * -1;
  }
  return dd;
}

/**
 * Parse teks input apapun menjadi koordinat { lat, lng } jika valid
 */
export function parseCoordinateInput(rawInput: string): ParsedCoordinateResult | null {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const text = rawInput.trim();

  // 1. Cek Google Maps URL format: !3d-6.2472!4d106.3627
  const placeMatch = text.match(/!3d(-?\d+(?:\.\d+)?)[^!]*!4d(-?\d+(?:\.\d+)?)/);
  if (placeMatch) {
    const lat = parseFloat(placeMatch[1]);
    const lng = parseFloat(placeMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng, type: 'google_maps_url' };
    }
  }

  // 2. Cek Google Maps URL viewport format: @-6.2424985,106.3581531
  const atMatch = text.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng, type: 'google_maps_url' };
    }
  }

  // 3. Cek Google Maps URL query format: ?q=-6.2472,106.3627 atau ?ll=-6.2472,106.3627
  const queryMatch = text.match(/[?&](?:q|ll|query|center)=(-?\d+(?:\.\d+)?)[,;](-?\d+(?:\.\d+)?)/);
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng, type: 'google_maps_url' };
    }
  }

  // 4. Cek Format Key-Value (lat: -6.2088, lng: 106.8456)
  const kvMatch = text.match(/lat(?:itude)?[:\s=]+(-?\d+(?:\.\d+)?)[,\s]+l(?:o?ng|on|ongitude)?[:\s=]+(-?\d+(?:\.\d+)?)/i);
  if (kvMatch) {
    const lat = parseFloat(kvMatch[1]);
    const lng = parseFloat(kvMatch[2]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng, type: 'decimal' };
    }
  }

  // 5. Cek Format DMS: contoh 6°12'31.7"S 106°50'44.2"E atau 6 12 31.7 S, 106 50 44.2 E
  const dmsRegex = /(\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([NSns])[,\s]+(\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([EWew])/;
  const dmsMatch = text.match(dmsRegex);
  if (dmsMatch) {
    const latDeg = parseFloat(dmsMatch[1]);
    const latMin = parseFloat(dmsMatch[2]);
    const latSec = dmsMatch[3] ? parseFloat(dmsMatch[3]) : 0;
    const latDir = dmsMatch[4];

    const lngDeg = parseFloat(dmsMatch[5]);
    const lngMin = parseFloat(dmsMatch[6]);
    const lngSec = dmsMatch[7] ? parseFloat(dmsMatch[7]) : 0;
    const lngDir = dmsMatch[8];

    const lat = dmsToDecimal(latDeg, latMin, latSec, latDir);
    const lng = dmsToDecimal(lngDeg, lngMin, lngSec, lngDir);

    if (isValidLatLng(lat, lng)) {
      return { lat, lng, type: 'dms' };
    }
  }

  // 6. Cek Format Standar Decimal: "-6.2088, 106.8456", "-6.2088 106.8456", dll
  const decimalMatches = text.match(/(-?\d+(?:\.\d+)?)/g);
  if (decimalMatches && decimalMatches.length >= 2) {
    const lat = parseFloat(decimalMatches[0]);
    const lng = parseFloat(decimalMatches[1]);
    if (isValidLatLng(lat, lng)) {
      return { lat, lng, type: 'decimal' };
    }
  }

  return null;
}

function isValidLatLng(lat: number, lng: number): boolean {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
