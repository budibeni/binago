import type { RentalVehicleProfile } from '@/features/modules/rental/vehicles/types/rentalVehicle';

export const mockRentalVehicles: RentalVehicleProfile[] = [
  // 1-5: RENTED (Lengkap)
  {
    id: 'rveh-001', vehicleId: 'veh-001', status: 'RENTED',
    dailyRate: 350000, weeklyRate: 2000000, monthlyRate: 5500000, deposit: 1000000,
    condition: 'GOOD', currentOdometer: 15200, rentalStartOdometer: 15000,
    stnkExpiredAt: '2026-10-15', taxExpiredAt: '2026-10-15', insuranceExpiredAt: '2027-01-01',
    notes: 'Kondisi baik, disewa oleh PT Maju Jaya',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2024-01-10T10:00:00Z', updatedAt: '2026-08-01T10:00:00Z',
    customerId: 'cust-101', rentalPeriod: '20 - 25 Agustus 2026'
  },
  {
    id: 'rveh-002', vehicleId: 'veh-002', status: 'RENTED',
    dailyRate: 400000, weeklyRate: 2500000, monthlyRate: 7500000, deposit: 1500000,
    condition: 'GOOD', currentOdometer: 25100, rentalStartOdometer: 24500,
    stnkExpiredAt: '2027-05-10', taxExpiredAt: '2027-05-10', insuranceExpiredAt: '2028-02-20',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2024-02-15T10:00:00Z', updatedAt: '2026-08-02T10:00:00Z',
    customerId: 'cust-102', rentalPeriod: '1 - 30 September 2026'
  },
  {
    id: 'rveh-003', vehicleId: 'veh-003', status: 'RENTED',
    dailyRate: 500000, weeklyRate: 3000000, monthlyRate: 9000000, deposit: 2000000,
    condition: 'MINOR_DAMAGE', currentOdometer: 85200, rentalStartOdometer: 84000,
    stnkExpiredAt: '2026-12-12', taxExpiredAt: '2026-12-12', insuranceExpiredAt: '2027-06-01',
    notes: 'Lecet bumper depan',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: false, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: false },
    createdAt: '2024-03-20T10:00:00Z', updatedAt: '2026-08-05T10:00:00Z',
    customerId: 'cust-103', rentalPeriod: '10 - 20 Agustus 2026'
  },
  {
    id: 'rveh-004', vehicleId: 'veh-004', status: 'RENTED',
    dailyRate: 450000, weeklyRate: 2800000, monthlyRate: 8500000, deposit: 1500000,
    condition: 'GOOD', currentOdometer: 52000, rentalStartOdometer: 50500,
    stnkExpiredAt: '2027-01-15', taxExpiredAt: '2027-01-15', insuranceExpiredAt: '2027-10-10',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2024-04-10T10:00:00Z', updatedAt: '2026-08-10T10:00:00Z',
    customerId: 'cust-104', rentalPeriod: '15 Agustus - 15 September 2026'
  },
  {
    id: 'rveh-005', vehicleId: 'veh-005', status: 'RENTED',
    dailyRate: 380000, weeklyRate: 2200000, monthlyRate: 6500000, deposit: 1000000,
    condition: 'GOOD', currentOdometer: 12000, rentalStartOdometer: 11000,
    stnkExpiredAt: '2028-03-05', taxExpiredAt: '2028-03-05', insuranceExpiredAt: '2028-12-01',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2024-05-15T10:00:00Z', updatedAt: '2026-08-15T10:00:00Z',
    customerId: 'cust-105', rentalPeriod: '20 - 31 Agustus 2026'
  },

  // 6-10: READY (Lengkap)
  {
    id: 'rveh-006', vehicleId: 'veh-006', status: 'RENTED',
    dailyRate: 350000, weeklyRate: 2000000, monthlyRate: 5500000, deposit: 1000000,
    condition: 'GOOD', currentOdometer: 45000,
    stnkExpiredAt: '2027-08-20', taxExpiredAt: '2027-08-20', insuranceExpiredAt: '2028-01-15',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2024-06-10T10:00:00Z', updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'rveh-007', vehicleId: 'veh-007', status: 'RENTED',
    dailyRate: 250000, weeklyRate: 1500000, monthlyRate: 4500000, deposit: 500000,
    condition: 'GOOD', currentOdometer: 10500,
    stnkExpiredAt: '2028-09-10', taxExpiredAt: '2028-09-10', insuranceExpiredAt: '2029-02-28',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2024-07-22T10:00:00Z', updatedAt: '2026-08-21T10:00:00Z',
  },
  {
    id: 'rveh-008', vehicleId: 'veh-008', status: 'READY',
    dailyRate: 200000, weeklyRate: 1200000, monthlyRate: 3500000, deposit: 500000,
    condition: 'MINOR_DAMAGE', currentOdometer: 65000,
    stnkExpiredAt: '2026-11-05', taxExpiredAt: '2026-11-05', insuranceExpiredAt: '2027-04-10',
    notes: 'Kaca spion kiri sedikit retak',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: false, toolkit: true, firstAidKit: true, fireExtinguisher: false, carpet: true, audio: true },
    createdAt: '2024-08-11T10:00:00Z', updatedAt: '2026-08-22T10:00:00Z',
  },
  {
    id: 'rveh-009', vehicleId: 'veh-009', status: 'RENTED',
    dailyRate: 550000, weeklyRate: 3200000, monthlyRate: 9500000, deposit: 2500000,
    condition: 'GOOD', currentOdometer: 32000,
    stnkExpiredAt: '2027-02-18', taxExpiredAt: '2027-02-18', insuranceExpiredAt: '2027-11-11',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2024-09-05T10:00:00Z', updatedAt: '2026-08-23T10:00:00Z',
  },
  {
    id: 'rveh-010', vehicleId: 'veh-010', status: 'RENTED',
    dailyRate: 480000, weeklyRate: 2900000, monthlyRate: 8800000, deposit: 2000000,
    condition: 'GOOD', currentOdometer: 41000,
    stnkExpiredAt: '2027-04-25', taxExpiredAt: '2027-04-25', insuranceExpiredAt: '2028-05-15',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2024-10-12T10:00:00Z', updatedAt: '2026-08-24T10:00:00Z',
  },

  // 11-15: RESERVED & MAINTENANCE (Belum Lengkap)
  {
    id: 'rveh-011', vehicleId: 'veh-011', status: 'RESERVED',
    dailyRate: 0, weeklyRate: 0, monthlyRate: 0, deposit: 0,
    condition: 'GOOD', currentOdometer: 22000,
    stnkExpiredAt: '', taxExpiredAt: '', insuranceExpiredAt: '',
    equipment: { stnk: false, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2024-11-01T10:00:00Z', updatedAt: '2026-08-20T10:00:00Z',
    customerId: 'cust-106'
  },
  {
    id: 'rveh-012', vehicleId: 'veh-012', status: 'RESERVED',
    dailyRate: 350000, weeklyRate: 0, monthlyRate: 0, deposit: 1000000,
    condition: 'GOOD', currentOdometer: 18000,
    stnkExpiredAt: '2028-01-01', taxExpiredAt: '', insuranceExpiredAt: '',
    equipment: { stnk: true, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2024-12-10T10:00:00Z', updatedAt: '2026-08-21T10:00:00Z',
  },
  {
    id: 'rveh-013', vehicleId: 'veh-013', status: 'MAINTENANCE',
    dailyRate: 0, weeklyRate: 0, monthlyRate: 0, deposit: 0,
    condition: 'NEEDS_REPAIR', currentOdometer: 95000,
    stnkExpiredAt: '', taxExpiredAt: '', insuranceExpiredAt: '',
    notes: 'Turun mesin',
    equipment: { stnk: false, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2025-01-15T10:00:00Z', updatedAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'rveh-014', vehicleId: 'veh-014', status: 'MAINTENANCE',
    dailyRate: 0, weeklyRate: 0, monthlyRate: 0, deposit: 0,
    condition: 'NEEDS_REPAIR', currentOdometer: 112000,
    stnkExpiredAt: '2027-06-20', taxExpiredAt: '', insuranceExpiredAt: '',
    notes: 'Ganti kampas rem dan oli',
    equipment: { stnk: true, bpkb: false, spareTire: true, jack: true, toolkit: true, firstAidKit: true, fireExtinguisher: true, carpet: true, audio: true },
    createdAt: '2025-02-20T10:00:00Z', updatedAt: '2026-08-22T10:00:00Z',
  },
  {
    id: 'rveh-015', vehicleId: 'veh-015', status: 'UNAVAILABLE',
    dailyRate: 0, weeklyRate: 0, monthlyRate: 0, deposit: 0,
    condition: 'MINOR_DAMAGE', currentOdometer: 76000,
    stnkExpiredAt: '', taxExpiredAt: '', insuranceExpiredAt: '',
    notes: 'Kendaraan dipinjam direksi',
    equipment: { stnk: false, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2025-03-05T10:00:00Z', updatedAt: '2026-08-01T10:00:00Z',
  },

  // 16-20: READY (Belum Lengkap)
  {
    id: 'rveh-016', vehicleId: 'veh-016', status: 'READY',
    dailyRate: 0, weeklyRate: 0, monthlyRate: 0, deposit: 0,
    condition: 'GOOD', currentOdometer: 44000,
    stnkExpiredAt: '', taxExpiredAt: '', insuranceExpiredAt: '',
    equipment: { stnk: false, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2025-04-12T10:00:00Z', updatedAt: '2026-08-23T10:00:00Z',
  },
  {
    id: 'rveh-017', vehicleId: 'veh-017', status: 'READY',
    dailyRate: 400000, weeklyRate: 0, monthlyRate: 0, deposit: 1000000,
    condition: 'GOOD', currentOdometer: 38000,
    stnkExpiredAt: '2027-10-15', taxExpiredAt: '', insuranceExpiredAt: '',
    equipment: { stnk: true, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2025-05-18T10:00:00Z', updatedAt: '2026-08-24T10:00:00Z',
  },
  {
    id: 'rveh-018', vehicleId: 'veh-018', status: 'READY',
    dailyRate: 0, weeklyRate: 0, monthlyRate: 0, deposit: 0,
    condition: 'GOOD', currentOdometer: 15000,
    stnkExpiredAt: '', taxExpiredAt: '', insuranceExpiredAt: '',
    equipment: { stnk: false, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2025-06-25T10:00:00Z', updatedAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'rveh-019', vehicleId: 'veh-019', status: 'READY',
    dailyRate: 350000, weeklyRate: 0, monthlyRate: 0, deposit: 0,
    condition: 'GOOD', currentOdometer: 19000,
    stnkExpiredAt: '2028-02-20', taxExpiredAt: '', insuranceExpiredAt: '',
    equipment: { stnk: true, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2025-07-02T10:00:00Z', updatedAt: '2026-08-11T10:00:00Z',
  },
  {
    id: 'rveh-020', vehicleId: 'veh-020', status: 'READY',
    dailyRate: 0, weeklyRate: 0, monthlyRate: 0, deposit: 0,
    condition: 'MINOR_DAMAGE', currentOdometer: 55000,
    stnkExpiredAt: '', taxExpiredAt: '', insuranceExpiredAt: '',
    equipment: { stnk: false, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false },
    createdAt: '2025-08-10T10:00:00Z', updatedAt: '2026-08-20T10:00:00Z',
  },
];
