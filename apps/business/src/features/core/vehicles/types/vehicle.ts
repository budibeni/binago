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
  vehicleId?: string;         // ID internal kendaraan
  gpsDeviceBrand?: string;    // Merek perangkat GPS
  gpsDeviceType?: string;     // Tipe perangkat GPS
  gpsInstallDate?: string;    // Tanggal instalasi GPS (YYYY-MM-DD)
  status: VehicleStatus;
  odometer: number;           // km
  lastServiceKm: number;      // km terakhir servis
  nextServiceKm: number;      // km servis berikutnya
  lastUpdate: string;         // ISO 8601
  registrationExpiry: string; // ISO date YYYY-MM-DD
  passengerCapacity?: number;
  color?: string;
  fuelCapacity?: number;      // liters
  notes?: string;
  assetNumber?: string;       // No Asset
  dimLength?: number;         // meter
  dimWidth?: number;          // meter
  dimHeight?: number;         // meter
  fuelRatio?: number;         // km/L
  maxSpeed?: number;          // km/h
  stnkNumber?: string;
  kirNumber?: string;
  bpkbNumber?: string;
  engineNumber?: string;
  chassisNumber?: string;
  engineCapacity?: number;    // CC
}

// --- Status Filter -----------------------------------------------------------

export type VehicleStatusFilter = VehicleStatus[];

// --- Table Filters -----------------------------------------------------------

export interface VehicleFilters {
  search: string;
  status: VehicleStatusFilter;
  groupIds: string[];
  stnkStatus: string[];
}

export const getVehicleFormSchema = (t: Record<string, string>) => z.object({
  plateNumber: z.string().min(1, t.plateRequired || 'Nomor polisi wajib diisi'),
  vehicleName: z.string().min(1, t.nameRequired || 'Nama kendaraan wajib diisi'),
  vehicleCategory: z.enum(['truck', 'minibus', 'pickup', 'motorcycle', 'other']),
  brand: z.string().optional(),
  year: z.number().nullable().optional(),
  color: z.string().optional(),
  fuelType: z.enum(['solar', 'bensin', 'listrik']),
  groupId: z.string().min(1, t.groupRequired || 'Grup kendaraan wajib dipilih'),
  driverId: z.string().nullable().optional(),
  deviceImei: z.string().nullable().optional(),
  deviceSimNumber: z.string().nullable().optional(),
  vehicleId: z.string().optional(),
  gpsDeviceBrand: z.string().optional(),
  gpsDeviceType: z.string().optional(),
  gpsInstallDate: z.string().optional(),
  fuelCapacity: z.number().nullable().optional(),
  registrationExpiry: z.string().optional(),
  notes: z.string().optional(),
  assetNumber: z.string().optional(),
  dimLength: z.number().nullable().optional(),
  dimWidth: z.number().nullable().optional(),
  dimHeight: z.number().nullable().optional(),
  fuelRatio: z.number().nullable().optional(),
  maxSpeed: z.number().nullable().optional(),
  passengerCapacity: z.number().nullable().optional(),
  stnkNumber: z.string().optional(),
  kirNumber: z.string().optional(),
  bpkbNumber: z.string().optional(),
  engineNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  engineCapacity: z.number().nullable().optional(),
  odometer: z.number().nullable().optional(),
  lastServiceKm: z.number().nullable().optional(),
  nextServiceKm: z.number().nullable().optional(),
});
