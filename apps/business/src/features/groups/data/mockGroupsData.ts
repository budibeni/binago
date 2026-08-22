export interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: 'vehicle' | 'driver' | 'geofence';
}

export const mockVehicleGroups: GroupData[] = [
  { id: 'vg-01', name: 'Logistik Jabodetabek', description: 'Armada pengiriman area Jabodetabek', memberCount: 15, type: 'vehicle' },
  { id: 'vg-02', name: 'Distribusi Jawa Tengah', description: 'Truk kargo antar provinsi', memberCount: 8, type: 'vehicle' },
  { id: 'vg-03', name: 'Operasional Gudang', description: 'Kendaraan ringan operasional', memberCount: 5, type: 'vehicle' },
  { id: 'vg-04', name: 'Eksekutif', description: 'Mobil operasional direksi', memberCount: 3, type: 'vehicle' },
];

export const mockDriverGroups: GroupData[] = [
  { id: 'dg-01', name: 'Sopir Truk Utama', description: 'Pengemudi dengan lisensi B2 Umum', memberCount: 20, type: 'driver' },
  { id: 'dg-02', name: 'Sopir Ekspedisi Lokal', description: 'Pengemudi mobil boks area kota', memberCount: 12, type: 'driver' },
  { id: 'dg-03', name: 'Sopir Cadangan', description: 'Pengemudi on-call', memberCount: 4, type: 'driver' },
];

export const mockGeofenceGroups: GroupData[] = [
  { id: 'gg-01', name: 'Gudang Utama', description: 'Geofence untuk pusat distribusi', memberCount: 2, type: 'geofence' },
  { id: 'gg-02', name: 'Area Terlarang', description: 'Zona rawan kecelakaan dan macet', memberCount: 5, type: 'geofence' },
  { id: 'gg-03', name: 'Cabang Jawa Barat', description: 'Geofence titik cabang', memberCount: 8, type: 'geofence' },
];
