/**
 * Home Service
 *
 * Dashboard metric summary derived from unified data.
 * No separate vehicle/driver dataset — uses the same source as all other features.
 */

import type { MetricSummary, FleetAttentionItem } from '@/features/core/home/data/mockHomeData';
import { vehicleService } from './vehicleService';
import { driverService } from './driverService';
import { tripService } from './tripService';
import { mockTrackingState, mockDevices } from '../mock';

export const homeService = {
  getMetricSummary(): MetricSummary {
    const vehicles = vehicleService.getVehicles();
    const drivers = driverService.getDrivers();
    const trips = tripService.getTrips();

    return {
      totalVehicles: vehicles.length,
      movingVehicles: mockTrackingState.filter((t) => t.status === 'driving').length,
      activeAlerts: 15,
      tripsToday: trips.length,
      activeVehicles: mockTrackingState.filter((t) => t.status === 'driving' || t.status === 'idle').length,
      idleVehicles: mockTrackingState.filter((t) => t.status === 'parking' || t.status === 'offline').length,
      activeDrivers: drivers.filter((d) => d.status === 'active').length,
      ongoingDeliveries: trips.filter((t) => t.status === 'in_progress').length,
      onlineDevices: mockDevices.filter((d) => d.status === 'online').length,
    };
  },

  getFleetAttention(): FleetAttentionItem[] {
    return [
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
  },
};
