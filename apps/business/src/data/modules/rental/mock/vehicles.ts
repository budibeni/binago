import type { RentalVehicleProfile } from '@/features/modules/rental/vehicles/types/rentalVehicle';

export const mockRentalVehicles: RentalVehicleProfile[] = [
  {
    "id": "rveh-001",
    "vehicleId": "veh-001",
    "status": "READY",
    "categoryId": "prg-001",
    "currentOdometer": 11000,
    "condition": "GOOD",
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": false,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": false
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "fuelLevelPercent": 80
  },
  {
    "id": "rveh-002",
    "vehicleId": "veh-002",
    "status": "RESERVED",
    "categoryId": "prg-001",
    "currentOdometer": 12000,
    "condition": "MINOR_DAMAGE",
    "conditionNotes": "Lecet di bumper depan",
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "fuelLevelPercent": 83,
    "currentBookingId": "bkg-002"
  },
  {
    "id": "rveh-003",
    "vehicleId": "veh-003",
    "status": "MAINTENANCE",
    "categoryId": "prg-001",
    "currentOdometer": 13000,
    "condition": "NEEDS_REPAIR",
    "conditionNotes": "AC tidak dingin, perlu servis",
    "completenessChecklist": {
      "stnkOriginal": false,
      "spareKey": false,
      "jackAndTools": false,
      "spareTire": false,
      "firstAidKit": false
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "fuelLevelPercent": 83
  },
  {
    "id": "rveh-004",
    "vehicleId": "veh-004",
    "status": "UNAVAILABLE",
    "categoryId": "prg-002",
    "currentOdometer": 14000,
    "condition": "GOOD",
    "conditionNotes": null,
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": false,
      "jackAndTools": true,
      "spareTire": false,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "fuelLevelPercent": 56
  },
  {
    "id": "rveh-005",
    "vehicleId": "veh-005",
    "status": "RENTED",
    "categoryId": "prg-001",
    "currentOdometer": 15000,
            "condition": "GOOD",
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
    "currentContractId": "ctr-005",
    "fuelLevelPercent": 67
  },
  {
    "id": "rveh-006",
    "vehicleId": "veh-006",
    "status": "RESERVED",
    "categoryId": "prg-001",
    "currentOdometer": 16000,
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
    "fuelLevelPercent": 53,
    "currentBookingId": "bkg-006"
  },
  {
    "id": "rveh-007",
    "vehicleId": "veh-007",
    "status": "RESERVED",
    "categoryId": "prg-001",
    "currentOdometer": 17000,
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
    "fuelLevelPercent": 92,
    "currentBookingId": "bkg-007"
  },
  {
    "id": "rveh-008",
    "vehicleId": "veh-008",
    "status": "RESERVED",
    "categoryId": "prg-001",
    "currentOdometer": 18000,
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
    "fuelLevelPercent": 44,
    "currentBookingId": "bkg-008"
  },
  {
    "id": "rveh-009",
    "vehicleId": "veh-009",
    "status": "MAINTENANCE",
    "categoryId": "prg-001",
    "currentOdometer": 19000,
            "conditionNotes": "Perlu perbaikan",
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "fuelLevelPercent": 85
  },
  {
    "id": "rveh-010",
    "vehicleId": "veh-010",
    "status": "MAINTENANCE",
    "categoryId": "prg-001",
    "currentOdometer": 20000,
    "conditionNotes": "Perlu perbaikan",
    "completenessChecklist": {
      "stnkOriginal": true,
      "spareKey": true,
      "jackAndTools": true,
      "spareTire": true,
      "firstAidKit": true
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2026-08-01T00:00:00Z",
    "fuelLevelPercent": 49
  },
  {
    "id": "rveh-011",
    "vehicleId": "veh-011",
    "status": "READY",
    "categoryId": "prg-001",
    "currentOdometer": 21000,
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
    "fuelLevelPercent": 49
  },
  {
    "id": "rveh-012",
    "vehicleId": "veh-012",
    "status": "READY",
    "categoryId": "prg-001",
    "currentOdometer": 22000,
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
    "fuelLevelPercent": 100
  },
  {
    "id": "rveh-013",
    "vehicleId": "veh-013",
    "status": "READY",
    "categoryId": "prg-001",
    "currentOdometer": 23000,
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
    "fuelLevelPercent": 86
  },
  {
    "id": "rveh-014",
    "vehicleId": "veh-014",
    "status": "READY",
    "categoryId": "prg-001",
    "currentOdometer": 24000,
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
    "fuelLevelPercent": 68
  },
  {
    "id": "rveh-015",
    "vehicleId": "veh-015",
    "status": "READY",
    "categoryId": "prg-001",
    "currentOdometer": 25000,
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
    "fuelLevelPercent": 73
  }
];
