import type { RateType } from '../../reservations/types/reservation';

export type PricingCategoryStatus = 'ACTIVE' | 'INACTIVE';

export interface RentalPricingCategory {
  id: string;
  name: string;
  description?: string;
  status: PricingCategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RentalRate {
  id: string;
  pricingCategoryId: string;
  rateType: RateType;
  amount: number;
  status: PricingCategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleRateOverride {
  id: string;
  vehicleId: string; // CORE Vehicle ID
  rateType: RateType;
  amount: number;
  status: PricingCategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclePricingAssignment {
  vehicleId: string;
  pricingCategoryId: string;
  assignedAt: string;
}

export type PricingCategoryStatusFilter = 'all' | PricingCategoryStatus;

export interface PricingCategoryFilters {
  search?: string;
  status?: PricingCategoryStatusFilter;
}
