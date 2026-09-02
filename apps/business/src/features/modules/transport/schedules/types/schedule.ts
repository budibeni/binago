import type { Route } from '@/features/core/routes/types';

export type ScheduleStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface ScheduleTime {
  id: string;
  departureTime: string; // HH:mm format
  vehicleIds: string[]; // CORE Vehicle IDs
}

export interface OperationalSchedule {
  id: string;
  name: string;
  routeId: string; // CORE Route.id
  activeDays: DayOfWeek[];
  times: ScheduleTime[];
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;

  // Relations populated for UI
  route?: Route;
}

export type ScheduleFilterStatus = 'all' | ScheduleStatus;

export interface ScheduleFilters {
  search: string;
  status: ScheduleFilterStatus;
}
