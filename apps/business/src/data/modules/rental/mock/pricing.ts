import type {
  RentalPricingCategory,
  RentalRate,
  VehicleRateOverride,
  VehiclePricingAssignment
} from '../../../../features/modules/rental/pricing-category/types/pricing';
import type { RateType } from '../../../../features/modules/rental/bookings/types/booking';

export const mockPricingCategory: RentalPricingCategory[] = [
  {
    id: 'prg-001',
    code: 'REG-001',
    hourlyDeposit: 0,
    dailyDeposit: 1000000,
    name: 'MPV Standard',
    description: 'Kendaraan keluarga standar 7 penumpang',
    packages: [
      { id: 'pkg-001', name: 'Paket Mingguan', durationDays: 7, price: 2100000, deposit: 1000000 },
      { id: 'pkg-002', name: 'Paket Bulanan', durationDays: 30, price: 6000000, deposit: 2000000 },
    ],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prg-002',
    code: 'PRM-002',
    hourlyDeposit: 0,
    dailyDeposit: 2000000,
    name: 'MPV Premium',
    description: 'Kendaraan MPV kelas atas',
    packages: [
      { id: 'pkg-003', name: 'Paket Bisnis', durationDays: 15, price: 5000000, deposit: 1500000 },
    ],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'prg-003',
    code: 'SUV-003',
    hourlyDeposit: 0,
    dailyDeposit: 1500000,
    name: 'SUV Standard',
    description: 'Kendaraan SUV standar',
    packages: [
      { id: 'pkg-004', name: 'Paket Mingguan', durationDays: 7, price: 3600000, deposit: 2000000 },
    ],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

export const mockRentalRates: RentalRate[] = [
  // MPV Standard
  { id: 'rate-001', pricingCategoryId: 'prg-001', rateType: 'HOURLY' as RateType, amount: 50000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-002', pricingCategoryId: 'prg-001', rateType: 'DAILY' as RateType, amount: 350000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  
  // MPV Premium
  { id: 'rate-003', pricingCategoryId: 'prg-002', rateType: 'HOURLY' as RateType, amount: 75000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-004', pricingCategoryId: 'prg-002', rateType: 'DAILY' as RateType, amount: 500000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },

  // SUV Standard
  { id: 'rate-005', pricingCategoryId: 'prg-003', rateType: 'HOURLY' as RateType, amount: 80000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'rate-006', pricingCategoryId: 'prg-003', rateType: 'DAILY' as RateType, amount: 600000, status: 'ACTIVE', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
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
