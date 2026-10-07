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
  categoryId: string;
  status: RentalStatus;
  currentOdometer: number;
  
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
  hourlyRate: number;
  dailyRate: number;
  packageCount: number;
  packages?: any[];
}

export type RentalStatusFilter = 'all' | RentalStatus;

export interface RentalVehicleFilters {
  search: string;
  status: RentalStatusFilter;
}

export const getRentalVehicleFormSchema = (labels: Record<string, string>) => z.object({
  vehicleId: z.string().min(1, { message: labels.validationRequired }),
  categoryId: z.string().min(1, { message: labels.validationCategoryRequired }),
  status: z.enum(['READY', 'RESERVED', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE']),
  currentOdometer: z.number().min(0),
  condition: z.enum(['GOOD', 'MINOR_DAMAGE', 'NEEDS_REPAIR']).optional().nullable(),
  conditionNotes: z.string().max(500).optional().nullable(),
  completenessChecklist: z.object({
    stnkOriginal: z.boolean(),
    spareKey: z.boolean(),
    jackAndTools: z.boolean(),
    spareTire: z.boolean(),
    firstAidKit: z.boolean(),
  }),
});

export type RentalVehicleFormValues = z.infer<ReturnType<typeof getRentalVehicleFormSchema>>;
