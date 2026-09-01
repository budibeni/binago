import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type RentalType = 'SELF_DRIVE' | 'WITH_DRIVER';

export type RateType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface Reservation {
  id: string;
  reservationNumber: string;
  customerId: string;
  vehicleId: string; // CORE Vehicle ID (e.g. 'veh-001')
  startDate: string; // ISO String
  endDate: string; // ISO String
  duration: number; // in days
  rentalType: RentalType;
  rateType: RateType;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  totalAmount: number;
  deposit: number;
  remainingAmount: number;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations (populated for UI)
  customer?: Customer;
  vehicle?: RentalVehicle;
}

export type ReservationStatusFilter = 'all' | ReservationStatus;

export interface ReservationFilters {
  search: string;
  status: ReservationStatusFilter;
  startDate?: string;
  endDate?: string;
}
