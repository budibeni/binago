import { mockGeofences } from './geofences';

function getGeofenceCenter(id: string): { lat: number; lng: number } {
  const gf = mockGeofences.find((g) => g.id === id);
  if (!gf || !gf.geometry?.coordinates?.length) return { lat: -6.1751, lng: 106.8271 };
  let sumLat = 0, sumLng = 0;
  for (const c of gf.geometry.coordinates) {
    sumLat += c.lat;
    sumLng += c.lng;
  }
  return {
    lat: Number((sumLat / gf.geometry.coordinates.length).toFixed(5)),
    lng: Number((sumLng / gf.geometry.coordinates.length).toFixed(5)),
  };
}

// Preset corridor waypoints mengikuti jalur tol & jalan arteri utama
const PRESET_CORRIDORS: Record<string, { lat: number; lng: number }[]> = {
  // Bandung -> Serang (e.g. Terminal Leuwipanjang - Terminal Pakupatan)
  'geo-011_geo-017': [
    { lat: -6.9175, lng: 107.6191 },
    { lat: -6.8480, lng: 107.4800 },
    { lat: -6.6500, lng: 107.3950 },
    { lat: -6.4000, lng: 107.4600 },
    { lat: -6.3000, lng: 107.3000 },
    { lat: -6.2600, lng: 107.1500 },
    { lat: -6.2400, lng: 107.0000 },
    { lat: -6.2300, lng: 106.8500 },
    { lat: -6.2100, lng: 106.5500 },
    { lat: -6.1900, lng: 106.4200 },
    { lat: -6.1650, lng: 106.3000 },
    { lat: -6.1165, lng: 106.1558 },
  ],
  // Hub Pasteur Bandung -> Hub Logistik Jawilan
  'geo-022_geo-023': [
    { lat: -6.9175, lng: 107.6191 },
    { lat: -6.8480, lng: 107.4800 },
    { lat: -6.6500, lng: 107.3950 },
    { lat: -6.4000, lng: 107.4600 },
    { lat: -6.3000, lng: 107.3000 },
    { lat: -6.2600, lng: 107.1500 },
    { lat: -6.2400, lng: 107.0000 },
    { lat: -6.2300, lng: 106.8500 },
    { lat: -6.2100, lng: 106.5500 },
    { lat: -6.1900, lng: 106.4200 },
    { lat: -6.1650, lng: 106.3000 },
    { lat: -6.1800, lng: 106.1000 },
  ],
  // Jakarta -> Bandung
  'geo-001_geo-011': [
    { lat: -6.1751, lng: 106.8271 },
    { lat: -6.2300, lng: 106.8500 },
    { lat: -6.2400, lng: 107.0000 },
    { lat: -6.2600, lng: 107.1500 },
    { lat: -6.3000, lng: 107.3000 },
    { lat: -6.4000, lng: 107.4600 },
    { lat: -6.6500, lng: 107.3950 },
    { lat: -6.8480, lng: 107.4800 },
    { lat: -6.8895, lng: 107.5901 },
  ],
  // Jakarta -> Serang
  'geo-001_geo-017': [
    { lat: -6.1751, lng: 106.8271 },
    { lat: -6.1823, lng: 106.6277 },
    { lat: -6.1900, lng: 106.4200 },
    { lat: -6.1650, lng: 106.3000 },
    { lat: -6.1165, lng: 106.1558 },
  ],
  // Jakarta Monas -> Sudirman
  'geo-001_geo-004': [
    { lat: -6.1751, lng: 106.8271 },
    { lat: -6.1880, lng: 106.8235 },
    { lat: -6.1950, lng: 106.8230 },
    { lat: -6.2080, lng: 106.8200 },
    { lat: -6.2215, lng: 106.8048 },
  ],
  // Jakarta Monas -> Tanjung Priok
  'geo-001_geo-002': [
    { lat: -6.1751, lng: 106.8271 },
    { lat: -6.1580, lng: 106.8350 },
    { lat: -6.1380, lng: 106.8480 },
    { lat: -6.1200, lng: 106.8700 },
    { lat: -6.1086, lng: 106.8821 },
  ],
  // Jakarta Monas -> Cakung
  'geo-001_geo-003': [
    { lat: -6.1751, lng: 106.8271 },
    { lat: -6.1780, lng: 106.8650 },
    { lat: -6.1820, lng: 106.9050 },
    { lat: -6.1856, lng: 106.9405 },
  ],
  // Tangerang -> Bandara Soetta
  'geo-005_geo-006': [
    { lat: -6.1823, lng: 106.6277 },
    { lat: -6.1550, lng: 106.6400 },
    { lat: -6.1350, lng: 106.6500 },
    { lat: -6.1256, lng: 106.6558 },
  ],
  // Tangerang -> BSD
  'geo-005_geo-007': [
    { lat: -6.1823, lng: 106.6277 },
    { lat: -6.2300, lng: 106.6350 },
    { lat: -6.2700, lng: 106.6450 },
    { lat: -6.3023, lng: 106.6521 },
  ],
  // Jakarta -> MM2100 Bekasi
  'geo-001_geo-008': [
    { lat: -6.1751, lng: 106.8271 },
    { lat: -6.2300, lng: 106.8500 },
    { lat: -6.2400, lng: 107.0000 },
    { lat: -6.3061, lng: 107.0865 },
  ],
};

function getRouteCoordinates(originId: string, destId: string): { lat: number; lng: number }[] {
  const key = `${originId}_${destId}`;
  if (PRESET_CORRIDORS[key]) {
    return PRESET_CORRIDORS[key];
  }
  const revKey = `${destId}_${originId}`;
  if (PRESET_CORRIDORS[revKey]) {
    return [...PRESET_CORRIDORS[revKey]].reverse();
  }

  // Fallback: hubungkan titik pusat origin ke destination dengan kurva jalan halus
  const start = getGeofenceCenter(originId);
  const end = getGeofenceCenter(destId);
  const steps = 6;
  const result: { lat: number; lng: number }[] = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const curve = Math.sin(t * Math.PI) * 0.005;
    result.push({
      lat: Number((start.lat + (end.lat - start.lat) * t + curve).toFixed(5)),
      lng: Number((start.lng + (end.lng - start.lng) * t - curve).toFixed(5)),
    });
  }
  return result;
}

export const mockRoutes = Array.from({ length: 27 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  
  // Create logical pairs of geofences to route between
  const routePairs = [
    { o: 'geo-001', d: 'geo-002', name: 'Gudang Pusat - Tanjung Priok', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-001', d: 'geo-003', name: 'Gudang Pusat - Pool Cakung', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-001', d: 'geo-004', name: 'Gudang Pusat - Customer A', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-002', d: 'geo-001', name: 'Tanjung Priok - Gudang Pusat', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-001', d: 'geo-005', name: 'Gudang JKT - Gudang TGR', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-005', d: 'geo-006', name: 'Gudang TGR - Bandara Soetta', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-006', d: 'geo-005', name: 'Bandara Soetta - Gudang TGR', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-005', d: 'geo-007', name: 'Gudang TGR - Pool BSD', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-001', d: 'geo-008', name: 'Gudang JKT - MM2100 BKS', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-008', d: 'geo-009', name: 'MM2100 - Gudang Tambun', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-009', d: 'geo-010', name: 'Gudang Tambun - Workshop Cikarang', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-001', d: 'geo-011', name: 'Gudang JKT - Gudang Pasteur BDG', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-011', d: 'geo-012', name: 'Pasteur - Pool Gedebage', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-011', d: 'geo-013', name: 'Pasteur - Customer B Dago', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-014', d: 'geo-015', name: 'Gudang Rungkut - Tanjung Perak', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-015', d: 'geo-014', name: 'Tanjung Perak - Gudang Rungkut', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-014', d: 'geo-016', name: 'Gudang Rungkut - Pool Margomulyo', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-001', d: 'geo-017', name: 'Gudang JKT - Gudang Serang', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-017', d: 'geo-018', name: 'Gudang Serang - Pelabuhan Merak', g: 'grp-r-002' }, // Dalam Kota
    { o: 'geo-017', d: 'geo-019', name: 'Gudang Serang - KI Cilegon', g: 'grp-r-002' }, // Dalam Kota
    // Transport Routes (Passenger Bus)
    { o: 'geo-001', d: 'geo-011', name: 'Terminal Kp. Rambutan - Terminal Leuwipanjang', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-001', d: 'geo-014', name: 'Terminal Pulo Gebang - Terminal Bungurasih', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-001', d: 'geo-006', name: 'Terminal Blok M - Bandara Soetta', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-008', d: 'geo-005', name: 'Terminal Bekasi - Terminal Poris Plawad', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-022', d: 'geo-023', name: 'Hub Pasteur Bandung - Hub Logistik Jawilan', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-014', d: 'geo-011', name: 'Terminal Bungurasih - Terminal Cicaheum', g: 'grp-r-001' }, // Antar Kota
    { o: 'geo-017', d: 'geo-006', name: 'Terminal Pakupatan - Bandara Soetta', g: 'grp-r-001' }, // Antar Kota
  ];

  const pair = routePairs[i % routePairs.length];

  return {
    id: `route-${num}`,
    name: pair.name,
    description: `Rute dari ${pair.o} ke ${pair.d}`,
    origin: { type: 'geofence' as const, geofenceId: pair.o },
    stops: [],
    destination: { type: 'geofence' as const, geofenceId: pair.d },
    plannedDistance: 10 + (i * 2), // Mock distance
    estimatedDuration: 30 + (i * 5), // Mock duration
    plannedPath: {
      type: 'multiline' as const,
      coordinates: getRouteCoordinates(pair.o, pair.d),
    },
    status: 'active' as const,
    groupId: pair.g,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

export function getRouteById(id: string) {
  return mockRoutes.find(r => r.id === id);
}
