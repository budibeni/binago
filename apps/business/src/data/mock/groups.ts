export const mockVehicleGroups = [
  { id: 'grp-v-001', name: 'Logistik Area Jakarta', description: 'Armada pengiriman wilayah Jakarta', memberCount: 8, type: 'vehicle' as const },
  { id: 'grp-v-002', name: 'Logistik Area Tangerang', description: 'Armada pengiriman wilayah Tangerang', memberCount: 5, type: 'vehicle' as const },
  { id: 'grp-v-003', name: 'Armada Ekspedisi Jarak Jauh', description: 'Truk antar kota dan provinsi', memberCount: 4, type: 'vehicle' as const },
  { id: 'grp-v-004', name: 'Armada Khusus B3', description: 'Kendaraan untuk bahan berbahaya', memberCount: 6, type: 'vehicle' as const },
];

export const mockDriverGroups = [
  { id: 'grp-d-001', name: 'Pengemudi Utama', description: 'Tim pengemudi shift pagi dan siang', memberCount: 10, type: 'driver' as const },
  { id: 'grp-d-002', name: 'Pengemudi Cadangan', description: 'Pengemudi siap siaga dan pengganti', memberCount: 4, type: 'driver' as const },
  { id: 'grp-d-003', name: 'Pengemudi Truk Besar', description: 'Spesialis kendaraan tronton dan trailer', memberCount: 5, type: 'driver' as const },
  { id: 'grp-d-004', name: 'Pengemudi Lintas Provinsi', description: 'Pengemudi rute jarak jauh', memberCount: 8, type: 'driver' as const },
];

export const mockGeofenceGroups = [
  { id: 'grp-g-001', name: 'Zona Pabrik & Gudang', description: 'Area utama pabrik dan gudang pusat', memberCount: 3, type: 'geofence' as const },
  { id: 'grp-g-002', name: 'Zona Pelabuhan', description: 'Area muat bongkar pelabuhan', memberCount: 2, type: 'geofence' as const },
  { id: 'grp-g-003', name: 'Jalur Rawan Macet', description: 'Jalur yang perlu dihindari saat jam sibuk', memberCount: 5, type: 'geofence' as const },
  { id: 'grp-g-004', name: 'Zona Rest Area', description: 'Titik perhentian aman untuk istirahat', memberCount: 8, type: 'geofence' as const },
];

export const mockGroups = [...mockVehicleGroups, ...mockDriverGroups, ...mockGeofenceGroups];

export function getGroupById(id: string) {
  return mockGroups.find(g => g.id === id);
}
