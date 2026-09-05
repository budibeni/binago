import type { OperationalSchedule } from '@/features/modules/transport/schedules/types/schedule';

export const mockOperationalSchedules: OperationalSchedule[] = [
  {
    id: 'sch-001',
    name: 'Jadwal Pagi - Kp. Rambutan ke Leuwipanjang',
    routeId: 'route-021',
    activeDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    times: [
      { id: 'st-001-1', departureTime: '06:00', vehicleIds: ['veh-001', 'veh-002'] },
      { id: 'st-001-2', departureTime: '08:00', vehicleIds: ['veh-003', 'veh-004'] }
    ],
    status: 'ACTIVE',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'sch-002',
    name: 'Jadwal Sore - Kp. Rambutan ke Leuwipanjang',
    routeId: 'route-021',
    activeDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    times: [
      { id: 'st-002-1', departureTime: '16:00', vehicleIds: ['veh-005', 'veh-006'] },
      { id: 'st-002-2', departureTime: '17:30', vehicleIds: ['veh-007'] }
    ],
    status: 'ACTIVE',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'sch-003',
    name: 'Pulo Gebang - Bungurasih Pagi',
    routeId: 'route-022',
    activeDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    times: [
      { id: 'st-003-1', departureTime: '07:30', vehicleIds: ['veh-008'] }
    ],
    status: 'ACTIVE',
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z'
  },
  {
    id: 'sch-004',
    name: 'Blok M - Bandara Soetta Siang',
    routeId: 'route-023',
    activeDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    times: [
      { id: 'st-004-1', departureTime: '12:00', vehicleIds: ['veh-009'] }
    ],
    status: 'SUSPENDED',
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'sch-005',
    name: 'Shuttle Bandara (Bekasi - Poris)',
    routeId: 'route-024',
    activeDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    times: [
      { id: 'st-005-1', departureTime: '05:00', vehicleIds: ['veh-010', 'veh-011'] },
      { id: 'st-005-2', departureTime: '13:00', vehicleIds: ['veh-012', 'veh-013'] }
    ],
    status: 'ACTIVE',
    createdAt: '2026-08-03T10:00:00Z',
    updatedAt: '2026-08-03T10:00:00Z'
  },
  {
    id: 'sch-006',
    name: 'Jadwal Malam - Leuwipanjang Pakupatan',
    routeId: 'route-025',
    activeDays: ['FRIDAY', 'SATURDAY', 'SUNDAY'],
    times: [
      { id: 'st-006-1', departureTime: '20:00', vehicleIds: ['veh-014'] }
    ],
    status: 'ACTIVE',
    createdAt: '2026-08-04T10:00:00Z',
    updatedAt: '2026-08-04T10:00:00Z'
  },
  {
    id: 'sch-007',
    name: 'Charter Weekend - Pakupatan Soetta',
    routeId: 'route-027',
    activeDays: ['SATURDAY', 'SUNDAY'],
    times: [
      { id: 'st-007-1', departureTime: '08:00', vehicleIds: ['veh-015'] }
    ],
    status: 'ACTIVE',
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-05T10:00:00Z'
  }
];
