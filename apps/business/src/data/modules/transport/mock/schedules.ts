import type { OperationalSchedule } from '@/features/modules/transport/schedules/types/schedule';

export const mockOperationalSchedules: OperationalSchedule[] = [
  {
    id: 'sch-001',
    name: 'Jadwal Pagi - Rute Tanjung Priok',
    routeId: 'route-001',
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
    name: 'Jadwal Sore - Rute Tanjung Priok',
    routeId: 'route-004',
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
    name: 'Shuttle JKT-TGR Pagi',
    routeId: 'route-005',
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
    name: 'Shuttle JKT-TGR Siang',
    routeId: 'route-005',
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
    name: 'Shuttle Bandara',
    routeId: 'route-006',
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
    name: 'Jadwal Malam - BKS',
    routeId: 'route-009',
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
    name: 'Charter Weekend BDG',
    routeId: 'route-012',
    activeDays: ['SATURDAY', 'SUNDAY'],
    times: [
      { id: 'st-007-1', departureTime: '08:00', vehicleIds: ['veh-015'] }
    ],
    status: 'ACTIVE',
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-05T10:00:00Z'
  }
];
