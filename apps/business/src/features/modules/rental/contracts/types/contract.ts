import type { Booking, BookingStatusFilter } from '@/features/modules/rental/bookings/types/booking';

export type ContractStatus = 'CONTRACTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type RentalContract = Booking;

export type ContractStatusFilter = 'all' | ContractStatus;

export interface ContractFilters {
  search: string;
  status: ContractStatusFilter;
  startDate?: string;
  endDate?: string;
}
