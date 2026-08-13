export interface DeviceData {
  id: string;
  name: string;
  vehicleId: string;
  vehicleName: string;
  status: 'online' | 'offline';
  lastUpdate: string;
}

export interface GeofenceData {
  id: string;
  name: string;
  radius: number;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive';
}

export const mockDevices: DeviceData[] = [
  {
    id: 'GPS-001',
    name: 'Teltonika FMB920',
    vehicleId: 'v-001',
    vehicleName: 'Mobil Pribadi',
    status: 'online',
    lastUpdate: new Date(Date.now() - 1000 * 60).toISOString(),
  },
  {
    id: 'GPS-002',
    name: 'Concox GT06N',
    vehicleId: 'v-002',
    vehicleName: 'Motor Operasional',
    status: 'online',
    lastUpdate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'GPS-003',
    name: 'Ruptela Eco5',
    vehicleId: 'v-003',
    vehicleName: 'Mobil Cadangan',
    status: 'online',
    lastUpdate: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'GPS-004',
    name: 'SinoTrack ST-901',
    vehicleId: 'v-004',
    vehicleName: 'Motor Istri',
    status: 'offline',
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export const mockGeofences: GeofenceData[] = [
  { id: 'geo-1', name: 'Rumah', radius: 100, latitude: -6.2088, longitude: 106.8456, status: 'active' },
  { id: 'geo-2', name: 'Kantor', radius: 200, latitude: -6.2255, longitude: 106.8322, status: 'active' },
  { id: 'geo-3', name: 'Sekolah', radius: 150, latitude: -6.2133, longitude: 106.8211, status: 'inactive' },
  { id: 'geo-4', name: 'Gym', radius: 120, latitude: -6.2411, longitude: 106.8123, status: 'active' },
];
