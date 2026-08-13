import { NotificationEvent } from '../types';

const now = new Date();
const todayString = now.toISOString();
const yesterdayString = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
const earlierTodayString = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(); // 4 hours ago

export const initialMockNotifications: NotificationEvent[] = [
  {
    id: 'notif-001',
    type: 'device_unplugged',
    vehicleId: 'v-001',
    timestamp: todayString,
    read: false,
  },
  {
    id: 'notif-002',
    type: 'vehicle_started',
    vehicleId: 'v-001',
    timestamp: earlierTodayString,
    read: false,
  },
  {
    id: 'notif-003',
    type: 'vehicle_offline',
    vehicleId: 'v-002',
    timestamp: yesterdayString,
    read: true,
  },
  {
    id: 'notif-004',
    type: 'geofence_enter',
    vehicleId: 'v-001',
    timestamp: yesterdayString,
    read: true,
    context: { geofenceName: 'Rumah' },
  }
];
