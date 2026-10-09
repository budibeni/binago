import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import { z } from 'zod';

export type BookingStatus = 'DRAFT' | 'BOOKED' | 'CONTRACTED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type RentalType = 'SELF_DRIVE' | 'WITH_DRIVER';

export type RateType = 'HOURLY' | 'DAILY' | 'PACKAGE';

export interface CustomerSnapshot {
  name: string;
  type: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  picName?: string;
  picPhone?: string;
}

export interface VehicleSnapshot {
  licensePlate: string;
  brand: string;
  model: string;
  categoryName: string;
}

export interface BookingItem {
  id: string;
  bookingId: string;
  vehicleId: string; // CORE Vehicle ID
  startDate: string; // ISO String
  endDate: string; // ISO String
  rateType: RateType;
  packageId?: string;
  packageName?: string;
  duration?: number;
  unitPrice: number; // Snapshot of the resolved rate (hourly/daily/package price)
  depositSnapshot: number; // Snapshot of deposit for this vehicle
  subtotal: number;
  vehicleSnapshot?: VehicleSnapshot; // Historical data

  // Operational fields (Handover & Return)
  itemStatus?: 'PENDING' | 'IN_USE' | 'RETURNED' | 'CANCELLED';
  handoverNumber?: string;
  handoverDate?: string;
  handoverBy?: string; // UUID of admin
  handoverOdometer?: number;
  handoverLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  handoverCondition?: {
    fuelLevel: string;
    vehicleCondition: string;
    equipmentChecklist: Record<string, boolean>;
    notes?: string;
    staffName?: string;
  };
  returnDate?: string;
  returnBy?: string; // UUID of admin
  returnOdometer?: number;
  returnCondition?: Record<string, any>;
  extraCharges?: number;

  // Relations (populated for UI)
  vehicle?: RentalVehicle;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  startDate: string; // ISO String (Main period)
  rentalType: RentalType;
  totalAmount: number;
  deposit: number;
  remainingAmount: number;
  driverFee?: number;
  status: BookingStatus;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // UUID of admin
  updatedBy?: string; // UUID of admin
  
  customerSnapshot?: CustomerSnapshot; // Historical data
  
  // Contract fields
  contractNumber?: string;
  contractDate?: string;
  contractNotes?: string;
  terms?: string;
  contractIssuedBy?: string; // UUID of admin
  contractIssuedAt?: string; // System timestamp when contract was issued

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
  items: z.array(z.object({
    vehicleId: z.string(),
    rateType: z.enum(['HOURLY', 'DAILY', 'PACKAGE']),
    packageId: z.string().optional(),
    duration: z.number().optional(),
    packageName: z.string().optional(),
    unitPrice: z.number(),
    depositSnapshot: z.number(),
    subtotal: z.number(),
  })).min(1, t.vehicleRequired || 'Pilih minimal satu kendaraan'),
  startDate: z.string().min(1, t.startDateRequired || 'Tanggal mulai wajib diisi'),
  rentalType: z.enum(['SELF_DRIVE', 'WITH_DRIVER'], t.rentalTypeRequired || 'Tipe rental wajib dipilih'),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  paymentMethod: z.string().optional(),
  deposit: z.number().optional(),
  driverFee: z.number().optional(),
  needDelivery: z.boolean().optional(),
  needFuel: z.boolean().optional(),
  needInsurance: z.boolean().optional(),
  notes: z.string().optional(),
});
