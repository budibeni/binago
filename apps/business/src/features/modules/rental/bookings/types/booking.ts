import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import { z } from 'zod';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type RentalType = 'SELF_DRIVE' | 'WITH_DRIVER';

export type RateType = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface BookingItem {
  id: string;
  bookingId: string;
  vehicleId: string; // CORE Vehicle ID
  startDate: string; // ISO String
  endDate: string; // ISO String
  duration: number; // in days
  rateType: RateType;
  rateSnapshot: number; // Snapshot of the resolved rate
  subtotal: number;
  
  // Relations (populated for UI)
  vehicle?: RentalVehicle;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  startDate: string; // ISO String (Main period)
  endDate: string; // ISO String (Main period)
  duration: number; // in days
  rentalType: RentalType;
  rateType: RateType;
  totalAmount: number;
  deposit: number;
  remainingAmount: number;
  driverFee?: number;
  status: BookingStatus;
  paymentMethod?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  items: BookingItem[];
  
  // Relations (populated for UI)
  customer?: Customer;
}

export type BookingStatusFilter = 'all' | BookingStatus;

export interface BookingFilters {
  search: string;
  status: BookingStatusFilter;
  startDate?: string;
  endDate?: string;
}

export const getBookingFormSchema = (t: Record<string, any>) => z.object({
  customerId: z.string().min(1, t.customerRequired || 'Pelanggan wajib dipilih'),
  vehicleIds: z.array(z.string()).min(1, t.vehicleRequired || 'Pilih minimal satu kendaraan'),
  startDate: z.string().min(1, t.startDateRequired || 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, t.endDateRequired || 'Tanggal selesai wajib diisi'),
  rentalType: z.enum(['SELF_DRIVE', 'WITH_DRIVER'], t.rentalTypeRequired || 'Tipe rental wajib dipilih'),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  paymentMethod: z.string().optional(),
  rateType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  deposit: z.number().optional(),
  driverFee: z.number().optional(),
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
