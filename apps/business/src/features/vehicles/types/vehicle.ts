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
  status: VehicleStatus;
  odometer: number;           // km
  lastServiceKm: number;      // km terakhir servis
  nextServiceKm: number;      // km servis berikutnya
  lastUpdate: string;         // ISO 8601
  registrationExpiry: string; // ISO date YYYY-MM-DD
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
