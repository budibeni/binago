import type { OperationalSchedule } from '../../schedules/types/schedule';
import type { Driver } from '@/features/core/drivers/types/driver';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';
import type { Route } from '@/features/core/routes/types';

export type DepartureStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface Departure {
  id: string;
  scheduleId: string;
  scheduleTimeId: string;
  routeId: string; // CORE Route.id
  vehicleId: string; // CORE Vehicle.id
  driverId?: string; // CORE Driver.id
  
  date: string; // YYYY-MM-DD
  scheduledDepartureAt: string; // ISO 8601
  actualDepartureAt?: string; // ISO 8601
  actualArrivalAt?: string; // ISO 8601
  
  status: DepartureStatus;
  createdAt: string;
  updatedAt: string;

  // Relations populated for UI
  schedule?: OperationalSchedule;
  route?: Route;
  vehicle?: Vehicle; // Changed from TransportVehicle
  driver?: Driver;
}

export type DepartureFilterStatus = 'all' | DepartureStatus;

export interface DepartureFilters {
  search: string;
  status: DepartureFilterStatus;
}
