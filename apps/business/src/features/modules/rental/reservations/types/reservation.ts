import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import { z } from 'zod';

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

export const getReservationFormSchema = (t: Record<string, any>) => z.object({
  customerId: z.string().min(1, t.customerRequired || 'Pelanggan wajib dipilih'),
  vehicleId: z.string().min(1, t.vehicleRequired || 'Kendaraan wajib dipilih'),
  startDate: z.string().min(1, t.startDateRequired || 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, t.endDateRequired || 'Tanggal selesai wajib diisi'),
  rentalType: z.enum(['SELF_DRIVE', 'WITH_DRIVER'], t.rentalTypeRequired || 'Tipe rental wajib dipilih'),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  paymentMethod: z.string().optional(),
  rateType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  deposit: z.number().optional(),
  needDriver: z.boolean().optional(),
  needDelivery: z.boolean().optional(),
  needFuel: z.boolean().optional(),
  needInsurance: z.boolean().optional(),
  notes: z.string().optional(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate);
  }
  return true;
}, {
  message: t.dateRangeInvalid || 'Tanggal selesai harus setelah tanggal mulai',
  path: ['endDate'],
});
