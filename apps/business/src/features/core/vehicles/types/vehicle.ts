import { z } from 'zod';

// --- Vehicle Status ---------------------------------------------------------

export type VehicleStatus = 'driving' | 'idle' | 'parking' | 'offline';

// --- Vehicle Category --------------------------------------------------------

export type VehicleCategory = 'truck' | 'minibus' | 'pickup' | 'motorcycle' | 'other';

// --- Fuel Type ---------------------------------------------------------------

export type FuelType = 'solar' | 'bensin' | 'listrik';

// --- Vehicle Group -----------------------------------------------------------

export interface VehicleGroup {
  id: string;
  name: string;
}

// --- Vehicle -----------------------------------------------------------------

export interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleName: string;
  vehicleCategory: VehicleCategory;
  brand: string;
  year: number;
  fuelType: FuelType;
  groupId: string;
  groupName: string;
  driverId: string | null;
  driverName: string | null;
  deviceImei: string | null;
  deviceSimNumber?: string | null;
  status: VehicleStatus;
  odometer: number;           // km
  lastServiceKm: number;      // km terakhir servis
  nextServiceKm: number;      // km servis berikutnya
  lastUpdate: string;         // ISO 8601
  registrationExpiry: string; // ISO date YYYY-MM-DD
  kirExpiry?: string;         // ISO date YYYY-MM-DD
  passengerCapacity?: number;
  color?: string;
  fuelCapacity?: number;      // liters
  notes?: string;
}

// --- Status Filter -----------------------------------------------------------

export type VehicleStatusFilter = 'all' | VehicleStatus;

// --- Table Filters -----------------------------------------------------------

export interface VehicleFilters {
  search: string;
  status: VehicleStatusFilter;
  groupIds: string[];
}

export const getVehicleFormSchema = (t: Record<string, string>) => z.object({
  plateNumber: z.string().min(1, t.plateRequired || 'Nomor polisi wajib diisi'),
  vehicleName: z.string().min(1, t.nameRequired || 'Nama kendaraan wajib diisi'),
  vehicleCategory: z.enum(['truck', 'minibus', 'pickup', 'motorcycle', 'other']),
  brand: z.string().optional(),
  year: z.number().nullable().optional(),
  color: z.string().optional(),
  fuelType: z.enum(['solar', 'bensin', 'listrik']),
  groupId: z.string().min(1, t.groupRequired || 'Grup armada wajib dipilih'),
  driverId: z.string().nullable().optional(),
  deviceImei: z.string().nullable().optional(),
  deviceSimNumber: z.string().nullable().optional(),
  fuelCapacity: z.number().nullable().optional(),
  registrationExpiry: z.string().optional(),
  kirExpiry: z.string().optional(),
  notes: z.string().optional(),
});
