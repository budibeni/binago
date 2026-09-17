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
    { o: 'geo-011', d: 'geo-017', name: 'Terminal Leuwipanjang - Terminal Pakupatan', g: 'grp-r-001' }, // Antar Kota
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
      coordinates: [
        { lat: -6.1751, lng: 106.8271 }, // Mock start 
        { lat: -6.2000, lng: 106.8000 }  // Mock end
      ]
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
