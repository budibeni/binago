import type { RateType } from '../../reservations/types/reservation';

export type PricingGroupStatus = 'ACTIVE' | 'INACTIVE';

export interface RentalPricingGroup {
  id: string;
  name: string;
  description?: string;
  status: PricingGroupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RentalRate {
  id: string;
  pricingGroupId: string;
  rateType: RateType;
  amount: number;
  status: PricingGroupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleRateOverride {
  id: string;
  vehicleId: string; // CORE Vehicle ID
  rateType: RateType;
  amount: number;
  status: PricingGroupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePricingAssignment {
  vehicleId: string;
  pricingGroupId: string;
  assignedAt: string;
}

export type PricingGroupStatusFilter = 'all' | PricingGroupStatus;

export interface PricingGroupFilters {
  search?: string;
  status?: PricingGroupStatusFilter;
}
