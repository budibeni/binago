export interface MetricSummary {
  totalVehicles: number;
  movingVehicles: number;
  activeAlerts: number;
  tripsToday: number;
  // kept for backward compat
  activeVehicles: number;
  idleVehicles: number;
  activeDrivers: number;
  ongoingDeliveries: number;
  onlineDevices: number;
}

export const mockMetricSummary: MetricSummary = {
  totalVehicles: 1250,
  movingVehicles: 840,
  activeAlerts: 15,
  tripsToday: 320,
  // legacy fields
  activeVehicles: 840,
  idleVehicles: 410,
  activeDrivers: 620,
  ongoingDeliveries: 186,
  onlineDevices: 1180,
};

export interface FleetAttentionItem {
  id: string;
  type: 'maintenance' | 'offline' | 'alert';
  title: string;
  description: string;
  time: string;
}

export const mockFleetAttention: FleetAttentionItem[] = [
  {
    id: 'att-1',
    type: 'maintenance',
    title: 'Jadwal Perawatan',
    description: 'B 1234 CD mendekati batas kilometer servis rutin.',
    time: 'Hari ini',
  },
  {
    id: 'att-2',
    type: 'offline',
    title: 'Perangkat Offline',
    description: 'GPS pada B 9999 XX tidak merespons selama 2 jam.',
    time: '2 jam yang lalu',
  },
  {
    id: 'att-3',
    type: 'alert',
    title: 'Peringatan Kecepatan',
    description: 'B 5678 EF melebihi batas kecepatan di Tol Dalam Kota.',
    time: '15 mnt lalu',
  },
];
