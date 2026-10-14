import type { Geofence } from '@/features/core/geofences/types';
import type { Route } from '@/features/core/routes/types';

/**
 * Menghitung jarak haversine antara dua koordinat lat/lng dalam satuan kilometer (km).
 */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Menghitung sudut arah (bearing 0-359°) dari koordinat titik A ke B.
 */
export function getBearing(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
  const dLng = to.lng - from.lng;
  const dLat = to.lat - from.lat;
  const radians = Math.atan2(dLng, dLat);
  return Math.round(((radians * 180) / Math.PI + 360) % 360);
}

/**
 * Menghasilkan polygon koordinat lingkaran beraturan tertutup dari titik pusat dan radius dalam meter.
 */
export function createCirclePolygon(
  center: { lat: number; lng: number },
  radiusMeters: number,
  points: number = 32
): { lat: number; lng: number }[] {
  const coords: { lat: number; lng: number }[] = [];
  const distanceRadians = radiusMeters / 6371000;
  const centerLatRad = (center.lat * Math.PI) / 180;
  const centerLngRad = (center.lng * Math.PI) / 180;

  for (let i = 0; i <= points; i++) {
    const bearing = (i * 2 * Math.PI) / points;
    const latRad = Math.asin(
      Math.sin(centerLatRad) * Math.cos(distanceRadians) +
      Math.cos(centerLatRad) * Math.sin(distanceRadians) * Math.cos(bearing)
    );
    const lngRad =
      centerLngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distanceRadians) * Math.cos(centerLatRad),
        Math.cos(distanceRadians) - Math.sin(centerLatRad) * Math.sin(latRad)
      );

    coords.push({
      lat: Number(((latRad * 180) / Math.PI).toFixed(6)),
      lng: Number(((lngRad * 180) / Math.PI).toFixed(6)),
    });
  }

  // Pastikan polygon ring tertutup rapat (first == last)
  if (coords.length > 0) {
    coords[coords.length - 1] = coords[0];
  }

  return coords;
}

/**
 * Mengecek apakah sebuah titik berada di dalam polygon menggunakan algoritma Ray-Casting.
 */
export function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
): boolean {
  if (!polygon || polygon.length < 3) return false;
  const x = point.lng;
  const y = point.lat;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;
    const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Mengecek apakah satu titik koordinat tertentu berada di dalam atau sangat dekat dengan geofence.
 */
export function isPointInGeofence(
  point: { lat: number; lng: number },
  geofence: Geofence,
  proximityKm: number = 0.08 // Toleransi 80 meter (antara 50 - 100 meter)
): boolean {
  const coords = geofence.geometry?.coordinates;
  if (!coords || coords.length === 0) return false;

  // 1. Ray-casting jika tipe polygon (titik berada di dalam poligon)
  if (geofence.geometry.type === 'polygon' && isPointInPolygon(point, coords)) {
    return true;
  }

  // 2. Proximity check terhadap setiap vertex atau centroid (toleransi 80 meter)
  let sumLat = 0, sumLng = 0;
  for (const c of coords) {
    if (getDistanceKm(point.lat, point.lng, c.lat, c.lng) <= proximityKm) {
      return true;
    }
    sumLat += c.lat;
    sumLng += c.lng;
  }

  // Cek centroid
  const centerLat = sumLat / coords.length;
  const centerLng = sumLng / coords.length;
  if (getDistanceKm(point.lat, point.lng, centerLat, centerLng) <= proximityKm) {
    return true;
  }

  return false;
}

/**
 * Mencari geofence yang melingkupi atau terdekat dengan titik koordinat tertentu (misal lokasi parkir).
 */
export function findGeofenceForCoordinate(
  coord: { lat: number; lng: number },
  geofences: Geofence[],
  maxProximityKm: number = 0.08 // Toleransi 80 meter (antara 50 - 100 meter)
): Geofence | undefined {
  if (!geofences || geofences.length === 0) return undefined;

  // 1. Prioritaskan polygon containment presisi
  for (const gf of geofences) {
    if (gf.status === 'inactive') continue;
    if (gf.geometry?.type === 'polygon' && isPointInPolygon(coord, gf.geometry.coordinates)) {
      return gf;
    }
  }

  // 2. Fallback jika berada dalam toleransi radius geofence (maksimal 80 meter)
  for (const gf of geofences) {
    if (gf.status === 'inactive') continue;
    if (isPointInGeofence(coord, gf, maxProximityKm)) {
      return gf;
    }
  }

  return undefined;
}

/**
 * Mendeteksi semua geofence yang dilewati oleh jalur track perjalanan kendaraan (toleransi 80 meter).
 */
export function detectTraversedGeofenceIds(
  geofences: Geofence[],
  trackPoints: { lat: number; lng: number }[],
  proximityKm: number = 0.08 // Toleransi 80 meter (50 - 100 meter)
): string[] {
  if (!trackPoints || trackPoints.length === 0 || !geofences || geofences.length === 0) {
    return [];
  }

  const traversedIds = new Set<string>();

  // Bounding box pre-filter untuk mengecek setiap titik track tanpa melewatkan geofence kecil
  for (const gf of geofences) {
    if (gf.status === 'inactive') continue;
    const coords = gf.geometry?.coordinates;
    if (!coords || coords.length === 0) continue;

    // Hitung bounding box geofence + buffer ~100m (~0.001 derajat)
    const bufferDeg = 0.001;
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    for (const c of coords) {
      if (c.lat < minLat) minLat = c.lat;
      if (c.lat > maxLat) maxLat = c.lat;
      if (c.lng < minLng) minLng = c.lng;
      if (c.lng > maxLng) maxLng = c.lng;
    }
    minLat -= bufferDeg;
    maxLat += bufferDeg;
    minLng -= bufferDeg;
    maxLng += bufferDeg;

    // Cari apakah ada titik track yang melintas di bounding box dan masuk ke dalam geofence
    const isHit = trackPoints.some(
      (pt) => pt.lat >= minLat && pt.lat <= maxLat && pt.lng >= minLng && pt.lng <= maxLng && isPointInGeofence(pt, gf, proximityKm)
    );

    if (isHit) {
      traversedIds.add(gf.id);
    }
  }

  return Array.from(traversedIds);
}

/**
 * Menghitung skor kemiripan antara lintasan kendaraan (trackPoints) dengan sebuah master rute (0.0 - 1.0).
 */
export function calculateRouteSimilarity(
  route: Route,
  trackPoints: { lat: number; lng: number }[],
  traversedGeofenceIds: string[],
  geoMap: Map<string, Geofence>
): number {
  if (!trackPoints || trackPoints.length < 2) return 0;

  const oId = route.origin?.geofenceId;
  const dId = route.destination?.geofenceId;
  const oGeo = oId ? geoMap.get(oId) : undefined;
  const dGeo = dId ? geoMap.get(dId) : undefined;

  const originCoord = oGeo?.geometry?.coordinates?.[0] ?? (
    route.origin?.latitude && route.origin?.longitude
      ? { lat: route.origin.latitude, lng: route.origin.longitude }
      : undefined
  );
  const destCoord = dGeo?.geometry?.coordinates?.[0] ?? (
    route.destination?.latitude && route.destination?.longitude
      ? { lat: route.destination.latitude, lng: route.destination.longitude }
      : undefined
  );

  if (!originCoord || !destCoord) return 0;

  const trackStart = trackPoints[0];
  const trackEnd = trackPoints[trackPoints.length - 1];
  const traversedSet = new Set(traversedGeofenceIds);

  // 1. Endpoint Matching
  const hasOriginGeo = oId ? traversedSet.has(oId) : false;
  const hasDestGeo = dId ? traversedSet.has(dId) : false;

  const distStartToOrigin = getDistanceKm(trackStart.lat, trackStart.lng, originCoord.lat, originCoord.lng);
  const distEndToDest = getDistanceKm(trackEnd.lat, trackEnd.lng, destCoord.lat, destCoord.lng);

  let originScore = 0;
  if (hasOriginGeo || distStartToOrigin <= 0.8) {
    originScore = 1.0;
  } else if (distStartToOrigin <= 3.0) {
    originScore = Math.max(0, 1 - (distStartToOrigin - 0.8) / 2.2);
  } else {
    // Cek apakah origin rute berada di dekat kuadran awal track (max 2 km)
    const earlySlice = trackPoints.slice(0, Math.max(2, Math.floor(trackPoints.length * 0.20)));
    const minEarlyDist = Math.min(...earlySlice.map(p => getDistanceKm(p.lat, p.lng, originCoord.lat, originCoord.lng)));
    if (minEarlyDist <= 1.5) originScore = 0.9;
  }

  let destScore = 0;
  if (hasDestGeo || distEndToDest <= 0.8) {
    destScore = 1.0;
  } else if (distEndToDest <= 3.0) {
    destScore = Math.max(0, 1 - (distEndToDest - 0.8) / 2.2);
  } else {
    // Cek apakah destination rute berada di dekat kuadran akhir track (max 2 km)
    const lateSlice = trackPoints.slice(Math.floor(trackPoints.length * 0.80));
    const minLateDist = Math.min(...lateSlice.map(p => getDistanceKm(p.lat, p.lng, destCoord.lat, destCoord.lng)));
    if (minLateDist <= 1.5) destScore = 0.9;
  }

  const endpointScore = (originScore + destScore) / 2;

  // 2. Direction Alignment (Keselarasan Arah Vektor)
  const routeBearing = getBearing(originCoord, destCoord);
  const trackBearing = getBearing(trackStart, trackEnd);
  let bearingDiff = Math.abs(routeBearing - trackBearing);
  if (bearingDiff > 180) bearingDiff = 360 - bearingDiff;
  const directionScore = Math.max(0, 1 - bearingDiff / 65);

  // Jika arah perjalanannya berlawanan arah (> 90 derajat melenceng), tidak bisa dianggap rute yang sama
  if (bearingDiff > 90) {
    return 0;
  }

  // 3. Corridor & Path Overlap Sampling
  const pathCoords = (route.plannedPath?.type === 'multiline' && route.plannedPath.coordinates.length >= 2)
    ? route.plannedPath.coordinates
    : null;

  const corridorSamples: { lat: number; lng: number }[] = [];
  if (pathCoords) {
    // Gunakan titik koordinat plannedPath sebenarnya dari master rute
    const step = Math.max(1, Math.floor(pathCoords.length / 30));
    for (let i = 0; i < pathCoords.length; i += step) {
      corridorSamples.push(pathCoords[i]);
    }
  } else {
    // Fallback: interpolasi garis antara origin dan destination
    const sampleSteps = 20;
    for (let s = 0; s <= sampleSteps; s++) {
      const fraction = s / sampleSteps;
      corridorSamples.push({
        lat: originCoord.lat + (destCoord.lat - originCoord.lat) * fraction,
        lng: originCoord.lng + (destCoord.lng - originCoord.lng) * fraction,
      });
    }
  }

  let matchedCorridorPoints = 0;
  for (const cs of corridorSamples) {
    // Toleransi koridor: titik rute harus berjarak maksimal 2.5 km dari lintasan kendaraan
    const isNearTrack = trackPoints.some(tp => getDistanceKm(tp.lat, tp.lng, cs.lat, cs.lng) <= 2.5);
    if (isNearTrack) matchedCorridorPoints++;
  }
  const corridorOverlap = corridorSamples.length > 0 ? matchedCorridorPoints / corridorSamples.length : 0;

  // Bobot komposit kemiripan
  let similarity = endpointScore * 0.40 + corridorOverlap * 0.40 + directionScore * 0.20;

  // Boost jika origin dan destination geofence keduanya terlewati dan arahnya searah
  if (hasOriginGeo && hasDestGeo && directionScore >= 0.7) {
    similarity = Math.max(similarity, 0.88 + corridorOverlap * 0.1);
  }

  return Math.min(1.0, Math.max(0, Math.round(similarity * 100) / 100));
}

export interface RouteMatchResult {
  matchedRouteIds: string[]; // HANYA 1 rute paling mirip (top match) yang diceklist
  eligibleRouteIds: string[]; // Semua rute dengan kemiripan >= minSimilarity (80%)
  routeSimilarityMap: Record<string, number>; // routeId -> similarity percentage (e.g. 93)
}

/**
 * Mendeteksi master rute yang memiliki kemiripan minimal 80% (>= 0.80)
 * dan HANYA mengambil 1 rute yang paling mirip (top match) untuk di-check.
 */
export function detectSimilarRoutes(
  routes: Route[],
  trackPoints: { lat: number; lng: number }[],
  traversedGeofenceIds: string[],
  geofences: Geofence[],
  minSimilarity: number = 0.80
): RouteMatchResult {
  if (!trackPoints || trackPoints.length === 0 || !routes || routes.length === 0) {
    return { matchedRouteIds: [], eligibleRouteIds: [], routeSimilarityMap: {} };
  }

  const geoMap = new Map<string, Geofence>(geofences.map((g) => [g.id, g]));
  const scoredRoutes: { routeId: string; score: number; percentage: number }[] = [];
  const routeSimilarityMap: Record<string, number> = {};

  for (const rt of routes) {
    if (rt.status === 'inactive') continue;

    const score = calculateRouteSimilarity(rt, trackPoints, traversedGeofenceIds, geoMap);
    const percentage = Math.round(score * 100);

    // Rekam persentase kemiripan untuk rute yang memiliki kecocokan > 0
    if (percentage > 0) {
      routeSimilarityMap[rt.id] = percentage;
    }

    // Syarat ambang batas minimal kemiripan 80% (>= 0.80)
    if (score >= minSimilarity) {
      scoredRoutes.push({ routeId: rt.id, score, percentage });
    }
  }

  // Urutkan rute dari skor kemiripan tertinggi ke terendah
  scoredRoutes.sort((a, b) => b.score - a.score);

  // Semua rute yang memenuhi syarat >= 80%
  const eligibleRouteIds = scoredRoutes.map((sr) => sr.routeId);

  // HANYA ceklist 1 rute yang paling mirip (top match) jika memenuhi syarat minimal 80%
  const matchedRouteIds = scoredRoutes.length > 0 ? [scoredRoutes[0].routeId] : [];

  return { matchedRouteIds, eligibleRouteIds, routeSimilarityMap };
}
