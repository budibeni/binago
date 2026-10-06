import { z } from 'zod';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';

export type RentalStatus = 'READY' | 'RESERVED' | 'RENTED' | 'MAINTENANCE' | 'UNAVAILABLE';
export type RentalCondition = 'GOOD' | 'MINOR_DAMAGE' | 'NEEDS_REPAIR';

export interface CompletenessChecklist {
  stnkOriginal: boolean;
  spareKey: boolean;
  jackAndTools: boolean;
  spareTire: boolean;
  firstAidKit: boolean;
}

export interface RentalVehicleProfile {
  id: string;
  vehicleId: string;
  categoryId?: string | null;
  status: RentalStatus;
  currentOdometer: number;
  rateOverrideDaily?: number | null;
  rateOverrideWeekly?: number | null;
  rateOverrideMonthly?: number | null;
  
  // Operational fields from TASK-03
  currentBookingId?: string | null;
  currentContractId?: string | null;
  fuelLevelPercent?: number | null;
  condition?: RentalCondition;
  conditionNotes?: string | null;
  completenessChecklist: CompletenessChecklist;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalVehicle extends RentalVehicleProfile {
  coreVehicle: Vehicle;
  isComplete: boolean;
  categoryName?: string;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
}

export type RentalStatusFilter = 'all' | RentalStatus;

export interface RentalVehicleFilters {
  search: string;
  status: RentalStatusFilter;
}

export const getRentalVehicleFormSchema = (labels: Record<string, string>) => z.object({
  vehicleId: z.string().min(1, { message: labels.validationRequired }),
  categoryId: z.string().optional().nullable(),
  status: z.enum(['READY', 'RESERVED', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE']),
  currentOdometer: z.number().min(0),
  pricingType: z.enum(['CATEGORY', 'INDEPENDENT']),
  rateOverrideDaily: z.number().optional().nullable(),
  rateOverrideWeekly: z.number().optional().nullable(),
  rateOverrideMonthly: z.number().optional().nullable(),
  condition: z.enum(['GOOD', 'MINOR_DAMAGE', 'NEEDS_REPAIR']).optional().nullable(),
  conditionNotes: z.string().max(500).optional().nullable(),
  completenessChecklist: z.object({
    stnkOriginal: z.boolean(),
    spareKey: z.boolean(),
    jackAndTools: z.boolean(),
    spareTire: z.boolean(),
    firstAidKit: z.boolean(),
  }),
}).refine(data => {
  if (data.pricingType === 'CATEGORY' && (!data.categoryId || data.categoryId === '')) {
    return false;
  }
  return true;
}, {
  message: labels.validationCategoryRequired,
  path: ['categoryId']
});

export type RentalVehicleFormValues = z.infer<ReturnType<typeof getRentalVehicleFormSchema>>;
