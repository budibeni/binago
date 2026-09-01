import type { Vehicle } from '@/features/core/vehicles/types/vehicle';

export type RentalStatus = 'READY' | 'RESERVED' | 'RENTED' | 'MAINTENANCE' | 'UNAVAILABLE';
export type RentalCondition = 'GOOD' | 'MINOR_DAMAGE' | 'NEEDS_REPAIR';

export interface RentalEquipment {
  stnk: boolean;
  bpkb: boolean;
  spareTire: boolean;
  jack: boolean;
  toolkit: boolean;
  firstAidKit: boolean;
  fireExtinguisher: boolean;
  carpet: boolean;
  audio: boolean;
}

export interface RentalVehicleProfile {
  id: string;
  vehicleId: string; // CORE Vehicle ID (e.g. 'veh-001')
  status: RentalStatus;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  deposit: number;
  condition: RentalCondition;
  currentOdometer: number;
  rentalStartOdometer?: number;
  stnkExpiredAt: string;
  taxExpiredAt: string;
  insuranceExpiredAt: string;
  notes?: string;
  equipment: RentalEquipment;
  createdAt: string;
  updatedAt: string;
  
  customerId?: string;
  rentalPeriod?: string;
}

export interface RentalVehicle extends RentalVehicleProfile {
  coreVehicle: Vehicle;
  isComplete: boolean;
  customerName?: string;
}

export type RentalStatusFilter = 'all' | RentalStatus;

export interface RentalVehicleFilters {
  search: string;
  status: RentalStatusFilter;
}
