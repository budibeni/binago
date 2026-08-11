export interface PersonalMetricSummary {
  registeredVehicles: number;
  gpsOnline: number;
  gpsOffline: number;
  activeGeofences: number;
}

export const mockPersonalMetricSummary: PersonalMetricSummary = {
  registeredVehicles: 2,
  gpsOnline: 2,
  gpsOffline: 0,
  activeGeofences: 3,
};

export interface PersonalVehicleStatus {
  id: string;
  name: string;
  plate: string;
  status: 'Bergerak' | 'Parkir' | 'Offline';
  speed: number;
  lastUpdate: string;
  location: string;
}

export const mockPersonalVehicleStatus: PersonalVehicleStatus[] = [
  {
    id: 'veh-1',
    name: 'Mobil Utama',
    plate: 'B 1234 CD',
    status: 'Bergerak',
    speed: 45,
    lastUpdate: 'Baru saja',
    location: 'Jl. Jend. Sudirman, Jakarta Selatan',
  },
  {
    id: 'veh-2',
    name: 'Motor Istri',
    plate: 'B 5678 EF',
    status: 'Parkir',
    speed: 0,
    lastUpdate: '10 mnt lalu',
    location: 'Rumah - Kebayoran Baru',
  },
];
