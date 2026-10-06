import { z } from 'zod';
import type { RateType } from '../../bookings/types/booking';

export type PricingCategoryStatus = 'ACTIVE' | 'INACTIVE';

export interface RentalPricingCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  defaultDeposit: number;
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

export const getPricingCategoryFormSchema = (t: Record<string, any>) => z.object({
  name: z.string().min(1, t.formNameRequired || 'Nama Kategori Tarif wajib diisi'),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  dailyRate: z.number().min(0, 'Tarif minimal 0'),
  weeklyRate: z.number().min(0, 'Tarif minimal 0'),
  monthlyRate: z.number().min(0, 'Tarif minimal 0'),
  defaultDeposit: z.number().min(0, 'Deposit minimal 0'),
});
