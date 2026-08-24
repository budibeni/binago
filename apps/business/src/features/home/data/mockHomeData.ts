import { mockVehicles, mockTrackingState, mockDrivers, mockTrips, mockDevices } from '../../../data/mock';

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
  totalVehicles: mockVehicles.length,
  movingVehicles: mockTrackingState.filter(t => t.status === 'driving').length,
  activeAlerts: 15, // mock constant
  tripsToday: mockTrips.length,
  // legacy fields
  activeVehicles: mockTrackingState.filter(t => t.status === 'driving' || t.status === 'idle').length,
  idleVehicles: mockTrackingState.filter(t => t.status === 'parking' || t.status === 'offline').length,
  activeDrivers: mockDrivers.filter(d => d.status === 'active').length,
  ongoingDeliveries: mockTrips.filter(t => t.status === 'in_progress').length,
  onlineDevices: mockDevices.filter(d => d.status === 'online').length,
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

