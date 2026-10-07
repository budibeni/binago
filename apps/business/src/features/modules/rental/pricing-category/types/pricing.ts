import { z } from 'zod';
import type { RateType } from '../../bookings/types/booking';

export type PricingCategoryStatus = 'ACTIVE' | 'INACTIVE';

export interface RentalPricingCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  hourlyDeposit: number;
  dailyDeposit: number;
  packages?: RentalPackage[];
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

export interface RentalPackage {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  deposit: number;
}

export const getPricingCategoryFormSchema = (t: Record<string, any>) => z.object({
  name: z.string().min(1, t.formNameRequired || 'Nama Kategori Tarif wajib diisi'),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  hourlyRate: z.number().min(0, 'Tarif minimal 0').optional(),
  dailyRate: z.number().min(0, 'Tarif minimal 0'),
  packages: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Nama paket wajib diisi'),
    durationDays: z.number().min(1, 'Durasi minimal 1 hari'),
    price: z.number().min(0, 'Harga minimal 0'),
    deposit: z.number().min(0, 'Deposit minimal 0')
  })).optional(),
  hourlyDeposit: z.number().min(0, 'Deposit minimal 0'),
  dailyDeposit: z.number().min(0, 'Deposit minimal 0'),
});
