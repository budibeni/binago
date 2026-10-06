import type { RentalVehicleProfile } from '@/features/modules/rental/vehicles/types/rentalVehicle';

export const mockRentalVehicles: RentalVehicleProfile[] = [
  {
    "id": "rveh-001",
    "vehicleId": "veh-001",
    "status": "RENTED",
    "categoryId": null,
    "currentOdometer": 11000,
    "rateOverrideDaily": 500000,
    "rateOverrideWeekly": 2000000,
    "rateOverrideMonthly": 6000000,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "currentContractId": "ctr-001"
  },
  {
    "id": "rveh-002",
    "vehicleId": "veh-002",
    "status": "RENTED",
    "categoryId": "prg-001",
    "currentOdometer": 12000,
    "rateOverrideDaily": null,
    "rateOverrideWeekly": null,
    "rateOverrideMonthly": null,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "currentContractId": "ctr-002"
  },
  {
    "id": "rveh-003",
    "vehicleId": "veh-003",
    "status": "RENTED",
    "categoryId": null,
    "currentOdometer": 13000,
    "rateOverrideDaily": 400000,
    "rateOverrideWeekly": 2000000,
    "rateOverrideMonthly": 6000000,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "currentContractId": "ctr-003"
  },
  {
    "id": "rveh-004",
    "vehicleId": "veh-004",
    "status": "RENTED",
    "categoryId": "prg-001",
    "currentOdometer": 14000,
    "rateOverrideDaily": null,
    "rateOverrideWeekly": null,
    "rateOverrideMonthly": null,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "currentContractId": "ctr-004"
  },
  {
    "id": "rveh-005",
    "vehicleId": "veh-005",
    "status": "RENTED",
    "categoryId": null,
    "currentOdometer": 15000,
    "rateOverrideDaily": 550000,
    "rateOverrideWeekly": 2000000,
    "rateOverrideMonthly": 6000000,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "currentContractId": "ctr-005"
  },
  {
    "id": "rveh-006",
    "vehicleId": "veh-006",
    "status": "RESERVED",
    "categoryId": "prg-001",
    "currentOdometer": 16000,
    "rateOverrideDaily": null,
    "rateOverrideWeekly": null,
    "rateOverrideMonthly": null,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "currentContractId": "ctr-006"
  },
  {
    "id": "rveh-007",
    "vehicleId": "veh-007",
    "status": "RESERVED",
    "categoryId": null,
    "currentOdometer": 17000,
    "rateOverrideDaily": 450000,
    "rateOverrideWeekly": 2000000,
    "rateOverrideMonthly": 6000000,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "currentContractId": "ctr-007"
  },
  {
    "id": "rveh-008",
    "vehicleId": "veh-008",
    "status": "RESERVED",
    "categoryId": "prg-001",
    "currentOdometer": 18000,
    "rateOverrideDaily": null,
    "rateOverrideWeekly": null,
    "rateOverrideMonthly": null,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "currentContractId": "ctr-008"
  },
  {
    "id": "rveh-009",
    "vehicleId": "veh-009",
    "status": "MAINTENANCE",
    "categoryId": null,
    "currentOdometer": 19000,
    "rateOverrideDaily": 550000,
    "rateOverrideWeekly": 2000000,
    "rateOverrideMonthly": 6000000,
    "conditionNotes": "Perlu perbaikan",
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z"
  },
  {
    "id": "rveh-010",
    "vehicleId": "veh-010",
    "status": "MAINTENANCE",
    "categoryId": "prg-001",
    "currentOdometer": 20000,
    "rateOverrideDaily": null,
    "rateOverrideWeekly": null,
    "rateOverrideMonthly": null,
    "conditionNotes": "Perlu perbaikan",
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z"
  },
  {
    "id": "rveh-011",
    "vehicleId": "veh-011",
    "status": "READY",
    "categoryId": null,
    "currentOdometer": 21000,
    "rateOverrideDaily": 550000,
    "rateOverrideWeekly": 2000000,
    "rateOverrideMonthly": 6000000,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z"
  },
  {
    "id": "rveh-012",
    "vehicleId": "veh-012",
    "status": "READY",
    "categoryId": "prg-001",
    "currentOdometer": 22000,
    "rateOverrideDaily": null,
    "rateOverrideWeekly": null,
    "rateOverrideMonthly": null,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z"
  },
  {
    "id": "rveh-013",
    "vehicleId": "veh-013",
    "status": "READY",
    "categoryId": null,
    "currentOdometer": 23000,
    "rateOverrideDaily": 450000,
    "rateOverrideWeekly": 2000000,
    "rateOverrideMonthly": 6000000,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z"
  },
  {
    "id": "rveh-014",
    "vehicleId": "veh-014",
    "status": "READY",
    "categoryId": "prg-001",
    "currentOdometer": 24000,
    "rateOverrideDaily": null,
    "rateOverrideWeekly": null,
    "rateOverrideMonthly": null,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z"
  },
  {
    "id": "rveh-015",
    "vehicleId": "veh-015",
    "status": "READY",
    "categoryId": null,
    "currentOdometer": 25000,
    "rateOverrideDaily": 500000,
    "rateOverrideWeekly": 2000000,
    "rateOverrideMonthly": 6000000,
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z"
  }
];
