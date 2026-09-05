export const mockRoutes = Array.from({ length: 27 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  
  // Create logical pairs of geofences to route between
  const routePairs = [
    { o: 'geo-001', d: 'geo-002', name: 'Gudang Pusat - Tanjung Priok' },
    { o: 'geo-001', d: 'geo-003', name: 'Gudang Pusat - Pool Cakung' },
    { o: 'geo-001', d: 'geo-004', name: 'Gudang Pusat - Customer A' },
    { o: 'geo-002', d: 'geo-001', name: 'Tanjung Priok - Gudang Pusat' },
    { o: 'geo-001', d: 'geo-005', name: 'Gudang JKT - Gudang TGR' },
    { o: 'geo-005', d: 'geo-006', name: 'Gudang TGR - Bandara Soetta' },
    { o: 'geo-006', d: 'geo-005', name: 'Bandara Soetta - Gudang TGR' },
    { o: 'geo-005', d: 'geo-007', name: 'Gudang TGR - Pool BSD' },
    { o: 'geo-001', d: 'geo-008', name: 'Gudang JKT - MM2100 BKS' },
    { o: 'geo-008', d: 'geo-009', name: 'MM2100 - Gudang Tambun' },
    { o: 'geo-009', d: 'geo-010', name: 'Gudang Tambun - Workshop Cikarang' },
    { o: 'geo-001', d: 'geo-011', name: 'Gudang JKT - Gudang Pasteur BDG' },
    { o: 'geo-011', d: 'geo-012', name: 'Pasteur - Pool Gedebage' },
    { o: 'geo-011', d: 'geo-013', name: 'Pasteur - Customer B Dago' },
    { o: 'geo-014', d: 'geo-015', name: 'Gudang Rungkut - Tanjung Perak' },
    { o: 'geo-015', d: 'geo-014', name: 'Tanjung Perak - Gudang Rungkut' },
    { o: 'geo-014', d: 'geo-016', name: 'Gudang Rungkut - Pool Margomulyo' },
    { o: 'geo-001', d: 'geo-017', name: 'Gudang JKT - Gudang Serang' },
    { o: 'geo-017', d: 'geo-018', name: 'Gudang Serang - Pelabuhan Merak' },
    { o: 'geo-017', d: 'geo-019', name: 'Gudang Serang - KI Cilegon' },
    // Transport Routes (Passenger Bus)
    { o: 'geo-001', d: 'geo-011', name: 'Terminal Kp. Rambutan - Terminal Leuwipanjang' },
    { o: 'geo-001', d: 'geo-014', name: 'Terminal Pulo Gebang - Terminal Bungurasih' },
    { o: 'geo-001', d: 'geo-006', name: 'Terminal Blok M - Bandara Soetta' },
    { o: 'geo-008', d: 'geo-005', name: 'Terminal Bekasi - Terminal Poris Plawad' },
    { o: 'geo-011', d: 'geo-017', name: 'Terminal Leuwipanjang - Terminal Pakupatan' },
    { o: 'geo-014', d: 'geo-011', name: 'Terminal Bungurasih - Terminal Cicaheum' },
    { o: 'geo-017', d: 'geo-006', name: 'Terminal Pakupatan - Bandara Soetta' },
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
      coordinates: [
        { lat: -6.1751, lng: 106.8271 }, // Mock start 
        { lat: -6.2000, lng: 106.8000 }  // Mock end
      ]
    },
    status: 'active' as const
  };
});

export function getRouteById(id: string) {
  return mockRoutes.find(r => r.id === id);
}
