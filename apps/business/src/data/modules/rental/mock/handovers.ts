import type { RentalHandover } from '@/features/modules/rental/handover/types/handover';

export const mockHandovers: RentalHandover[] = [
  {
    id: 'HND-2026-0001', contractId: 'ctr-003', customerId: 'cust-ind-002', vehicleId: 'veh-001',
    handoverAt: '2026-08-23T04:42:26.960Z', handoverLatitude: -6.2088, handoverLongitude: 106.8456, handoverAddress: 'Jl. M.H. Thamrin, Jakarta Pusat',
    odometerStart: 15000, odometerSource: 'VEHICLE', fuelLevel: 'FULL', vehicleCondition: 'GOOD',
    equipmentChecklist: { stnk: true, spareTire: true, jack: true, toolkit: true, triangle: true },
    notes: 'Kondisi kendaraan sangat baik.', staffId: 'usr-budi', staffName: 'Budi Setiawan', status: 'COMPLETED',
    createdAt: '2026-08-23T04:42:26.960Z', updatedAt: '2026-08-23T04:42:26.960Z'
  },
  {
    id: 'HND-2026-0002', contractId: 'ctr-101', customerId: 'cust-ind-003', vehicleId: 'veh-006',
    handoverAt: '2026-08-20T04:42:26.960Z', handoverLatitude: -6.2297, handoverLongitude: 106.8202, handoverAddress: 'Jl. Gatot Subroto, Jakarta Selatan',
    odometerStart: 45000, odometerSource: 'VEHICLE', fuelLevel: 'THREE_QUARTER', vehicleCondition: 'GOOD',
    equipmentChecklist: { stnk: true, spareTire: true, jack: true, toolkit: true, triangle: true },
    notes: 'Kondisi kendaraan normal.', staffId: 'usr-budi', staffName: 'Budi Setiawan', status: 'COMPLETED',
    createdAt: '2026-08-20T04:42:26.960Z', updatedAt: '2026-08-20T04:42:26.960Z'
  },
  {
    id: 'HND-2026-0003', contractId: 'ctr-102', customerId: 'cust-comp-003', vehicleId: 'veh-007',
    handoverAt: '2026-08-21T04:42:26.960Z', handoverLatitude: -6.1558, handoverLongitude: 106.7451, handoverAddress: 'Jl. Daan Mogot, Jakarta Barat',
    odometerStart: 10500, odometerSource: 'VEHICLE', fuelLevel: 'HALF', vehicleCondition: 'MINOR_DAMAGE',
    equipmentChecklist: { stnk: true, spareTire: true, jack: true, toolkit: false, triangle: true },
    notes: 'Bekas gores ringan pada bumper belakang. Toolkit tidak ada.', staffId: 'usr-andi', staffName: 'Andi Pratama', status: 'COMPLETED',
    createdAt: '2026-08-21T04:42:26.960Z', updatedAt: '2026-08-21T04:42:26.960Z'
  },
  {
    id: 'HND-2026-0004', contractId: 'ctr-103', customerId: 'cust-ind-004', vehicleId: 'veh-009',
    handoverAt: '2026-08-22T04:42:26.960Z', handoverLatitude: -6.2991, handoverLongitude: 106.6719, handoverAddress: 'Jl. Raya Serpong, Tangerang Selatan',
    odometerStart: 32000, odometerSource: 'VEHICLE', fuelLevel: 'THREE_QUARTER', vehicleCondition: 'GOOD',
    equipmentChecklist: { stnk: true, spareTire: true, jack: true, toolkit: true, triangle: true, fireExtinguisher: true },
    notes: 'Dilengkapi APAR.', staffId: 'usr-rizky', staffName: 'Rizky Saputra', status: 'COMPLETED',
    createdAt: '2026-08-22T04:42:26.960Z', updatedAt: '2026-08-22T04:42:26.960Z'
  },
  {
    id: 'HND-2026-0005', contractId: 'ctr-104', customerId: 'cust-comp-004', vehicleId: 'veh-010',
    handoverAt: '2026-08-23T04:42:26.960Z', handoverLatitude: -6.2343, handoverLongitude: 106.9922, handoverAddress: 'Jl. Ahmad Yani, Bekasi',
    odometerStart: 41000, odometerSource: 'VEHICLE', fuelLevel: 'FULL', vehicleCondition: 'GOOD',
    equipmentChecklist: { stnk: true, spareTire: true, jack: true, toolkit: true, triangle: true },
    notes: 'Siap jalan.', staffId: 'usr-budi', staffName: 'Budi Setiawan', status: 'COMPLETED',
    createdAt: '2026-08-23T04:42:26.960Z', updatedAt: '2026-08-23T04:42:26.960Z'
  },
  {
    id: 'HND-2026-0006', contractId: 'ctr-002', customerId: 'cust-ind-001', vehicleId: 'veh-008',
    handoverAt: '2026-08-25T04:42:26.960Z', handoverLatitude: -6.1751, handoverLongitude: 106.8272, handoverAddress: 'Jl. Medan Merdeka Barat, Jakarta',
    odometerStart: 65000, odometerSource: 'VEHICLE', fuelLevel: 'EMPTY', vehicleCondition: 'GOOD',
    equipmentChecklist: { stnk: true, spareTire: true, jack: true, toolkit: true, triangle: true },
    notes: 'Draft handover menunggu pelanggan tiba.', staffId: 'usr-andi', staffName: 'Andi Pratama', status: 'DRAFT',
    createdAt: '2026-08-25T04:42:26.960Z', updatedAt: '2026-08-25T04:42:26.960Z'
  }
];
