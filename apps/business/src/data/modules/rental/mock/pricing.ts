import type {
  RentalPricingCategory,
  RentalRate,
  VehicleRateOverride,
  VehiclePricingAssignment
} from '../../../../features/modules/rental/pricing-category/types/pricing';

export const mockPricingCategory: RentalPricingCategory[] = [
  {
    id: 'prg-001',
    name: 'MPV Standard',
    description: 'Kendaraan keluarga standar 7 penumpang',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prg-002',
    name: 'MPV Premium',
    description: 'Kendaraan MPV kelas atas',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prg-003',
    name: 'SUV Standard',
    description: 'Kendaraan SUV standar',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

export const mockRentalRates: RentalRate[] = [
  // MPV Standard
  { id: 'rate-001', pricingCategoryId: 'prg-001', rateType: 'DAILY', amount: 350000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-002', pricingCategoryId: 'prg-001', rateType: 'WEEKLY', amount: 2100000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-003', pricingCategoryId: 'prg-001', rateType: 'MONTHLY', amount: 6000000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  
  // MPV Premium
  { id: 'rate-004', pricingCategoryId: 'prg-002', rateType: 'DAILY', amount: 500000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-005', pricingCategoryId: 'prg-002', rateType: 'WEEKLY', amount: 3000000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-006', pricingCategoryId: 'prg-002', rateType: 'MONTHLY', amount: 9000000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // SUV Standard
  { id: 'rate-007', pricingCategoryId: 'prg-003', rateType: 'DAILY', amount: 600000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-008', pricingCategoryId: 'prg-003', rateType: 'WEEKLY', amount: 3600000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-009', pricingCategoryId: 'prg-003', rateType: 'MONTHLY', amount: 10500000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
];

export const mockVehiclePricingAssignments: VehiclePricingAssignment[] = [
  // MPV Standard
  { vehicleId: 'rveh-001', pricingCategoryId: 'prg-001', assignedAt: '2026-01-01T00:00:00Z' },
  { vehicleId: 'rveh-002', pricingCategoryId: 'prg-001', assignedAt: '2026-01-01T00:00:00Z' },
  { vehicleId: 'rveh-003', pricingCategoryId: 'prg-001', assignedAt: '2026-01-01T00:00:00Z' },
  
  // MPV Premium
  { vehicleId: 'rveh-004', pricingCategoryId: 'prg-002', assignedAt: '2026-01-01T00:00:00Z' },
  { vehicleId: 'rveh-005', pricingCategoryId: 'prg-002', assignedAt: '2026-01-01T00:00:00Z' },
  
  // SUV Standard
  { vehicleId: 'rveh-006', pricingCategoryId: 'prg-003', assignedAt: '2026-01-01T00:00:00Z' },
  { vehicleId: 'rveh-007', pricingCategoryId: 'prg-003', assignedAt: '2026-01-01T00:00:00Z' },
];

export const mockVehicleRateOverrides: VehicleRateOverride[] = [
  // Vehicle 1 has special rate
  {
    id: 'ovr-001',
    vehicleId: 'rveh-001',
    rateType: 'DAILY',
    amount: 400000,
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  }
];
