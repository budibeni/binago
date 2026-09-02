import type { PassengerEvent } from '@/features/modules/transport/passenger-events/types/passengerEvent';

export const mockPassengerEvents: PassengerEvent[] = [
  {
    id: 'pe-001',
    departureId: 'dep-001',
    vehicleId: 'veh-016',
    geofenceId: 'geo-001', // Gudang Pusat Jakarta (Terminal Kp. Rambutan context)
    type: 'BOARDING',
    quantity: 20,
    recordedAt: '2026-08-01T08:10:00Z',
    recordedBy: 'chk-001',
    note: 'Penumpang awal',
  },
  {
    id: 'pe-002',
    departureId: 'dep-001',
    vehicleId: 'veh-016',
    geofenceId: 'geo-008', // Kawasan Industri MM2100 (Cikarang context)
    type: 'ALIGHTING',
    quantity: 3,
    recordedAt: '2026-08-01T09:30:00Z',
    recordedBy: 'chk-002',
  },
  {
    id: 'pe-003',
    departureId: 'dep-001',
    vehicleId: 'veh-016',
    geofenceId: 'geo-008',
    type: 'BOARDING',
    quantity: 7,
    recordedAt: '2026-08-01T09:35:00Z',
    recordedBy: 'chk-002',
  },
  {
    id: 'pe-004',
    departureId: 'dep-001',
    vehicleId: 'veh-016',
    geofenceId: 'geo-011', // Gudang Pasteur (Terminal Leuwipanjang context)
    type: 'ALIGHTING',
    quantity: 24,
    recordedAt: '2026-08-01T12:00:00Z',
    recordedBy: 'chk-003',
    note: 'Semua penumpang turun',
  },
  {
    id: 'pe-005',
    departureId: 'dep-002',
    vehicleId: 'veh-017',
    geofenceId: 'geo-001',
    type: 'BOARDING',
    quantity: 15,
    recordedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    recordedBy: 'chk-001',
  },
];
