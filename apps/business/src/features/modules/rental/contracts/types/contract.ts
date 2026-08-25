import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import type { Reservation } from '@/features/modules/rental/reservations/types/reservation';

export type ContractStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface RentalContract {
  id: string;
  contractNumber: string;
  reservationId: string;
  customerId: string;
  vehicleId: string;

  contractDate: string;

  startDate: string;
  endDate: string;
  duration: number;

  rentalType: 'SELF_DRIVE' | 'WITH_DRIVER';
  rateType: 'DAILY' | 'WEEKLY' | 'MONTHLY';

  rate: number;
  subtotal: number;
  totalAmount: number;

  deposit: number;
  remainingAmount: number;

  notes?: string;
  terms?: string;

  status: ContractStatus;

  createdAt: string;
  updatedAt: string;
  
  // Relations (populated for UI)
  customer?: Customer;
  vehicle?: RentalVehicle;
  reservation?: Reservation;
}

export type ContractStatusFilter = 'all' | ContractStatus;

export interface ContractFilters {
  search: string;
  status: ContractStatusFilter;
  startDate?: string;
  endDate?: string;
}
