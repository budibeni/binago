import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import type { Booking } from '@/features/modules/rental/bookings/types/booking';

export type ContractStatus =
  | 'DRAFT'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface RentalContract {
  id: string;
  contractNumber: string;
  bookingId: string;
  customerId: string;

  contractDate: string;

  rentalType: 'SELF_DRIVE' | 'WITH_DRIVER';
  rateType: 'DAILY' | 'WEEKLY' | 'MONTHLY';

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
  booking?: Booking;
}

export type ContractStatusFilter = 'all' | ContractStatus;

export interface ContractFilters {
  search: string;
  status: ContractStatusFilter;
  startDate?: string;
  endDate?: string;
}
