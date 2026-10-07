import type { Booking } from '@/features/modules/rental/bookings/types/booking';

export const mockBookings: Booking[] = [
  {
    "id": "res-multi-001",
    "bookingNumber": "RES-2610-MIX",
    "customerId": "cust-com-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 4150000,
    "deposit": 1500000,
    "remainingAmount": 4150000,
    "status": "DRAFT",
    "createdAt": "2026-10-06T10:00:00.000Z",
    "updatedAt": "2026-10-06T10:00:00.000Z",
    "startDate": "2026-10-15T08:00:00.000Z",
    "items": [
      {
        "id": "res-multi-001-item-1",
        "bookingId": "res-multi-001",
        "vehicleId": "veh-011",
        "rateType": "DAILY",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-18T08:00:00.000Z",
        "duration": 3,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 1200000,
        "vehicleSnapshot": {
          "licensePlate": "B 10011 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-multi-001-item-2",
        "bookingId": "res-multi-001",
        "vehicleId": "veh-012",
        "rateType": "HOURLY",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-15T20:00:00.000Z",
        "duration": 12,
        "unitPrice": 50000,
        "depositSnapshot": 500000,
        "subtotal": 600000,
        "vehicleSnapshot": {
          "licensePlate": "B 10012 GHI",
          "brand": "Suzuki",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-multi-001-item-3",
        "bookingId": "res-multi-001",
        "vehicleId": "veh-013",
        "rateType": "PACKAGE",
        "packageId": "pkg-001",
        "packageName": "Paket Wisata 3 Hari 2 Malam",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-18T08:00:00.000Z",
        "duration": 1,
        "unitPrice": 2350000,
        "depositSnapshot": 500000,
        "subtotal": 2350000,
        "vehicleSnapshot": {
          "licensePlate": "B 10013 GHI",
          "brand": "Isuzu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Mock Name",
      "type": "Perusahaan",
      "phone": "022-7654321",
      "email": "contact@makmursentosa.com",
      "address": "Jl. Braga No. 22",
      "city": "Bandung",
      "province": "Jawa Barat",
      "picName": "Bambang S",
      "picPhone": "08111222444"
    }
  },
  {
    "id": "res-mega-001",
    "bookingNumber": "RES-2610-999",
    "customerId": "cust-com-001",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 24000000,
    "deposit": 24000000,
    "remainingAmount": 24000000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-001",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-10-06T10:00:00.000Z",
    "updatedAt": "2026-10-06T10:00:00.000Z",
    "startDate": "2026-10-15T08:00:00.000Z",
    "items": [
      {
        "id": "res-mega-001-item-1",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-001",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10001 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-2",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-002",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10002 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-3",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-003",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10003 GHI",
          "brand": "Mitsubishi",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-4",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-004",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10004 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Premium"
        }
      },
      {
        "id": "res-mega-001-item-5",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-005",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10005 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-6",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-006",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10006 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-7",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-007",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10007 GHI",
          "brand": "Honda",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-8",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-008",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10008 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-9",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-009",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10009 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-10",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-010",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10010 GHI",
          "brand": "Mitsubishi",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-11",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-011",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10011 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-mega-001-item-12",
        "bookingId": "res-mega-001",
        "vehicleId": "veh-012",
        "startDate": "2026-10-15T08:00:00.000Z",
        "endDate": "2026-10-20T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10012 GHI",
          "brand": "Suzuki",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Mock Name",
      "type": "Perusahaan",
      "phone": "021-1234567",
      "email": "info@majuterus.co.id",
      "address": "Jl. MH Thamrin No. 11",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta",
      "picName": "Ahmad Fauzi",
      "picPhone": "08111222333"
    }
  },
  {
    "id": "res-completed-001",
    "bookingNumber": "RES-2609-801",
    "customerId": "cust-ind-004",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 1200000,
    "remainingAmount": 1200000,
    "status": "COMPLETED",
    "contractNumber": "KTR-2410-002",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-10T10:00:00.000Z",
    "updatedAt": "2026-09-15T18:00:00.000Z",
    "startDate": "2026-09-12T08:00:00.000Z",
    "items": [
      {
        "id": "res-completed-001-item-1",
        "bookingId": "res-completed-001",
        "vehicleId": "veh-008",
        "rateType": "DAILY",
        "startDate": "2026-09-12T08:00:00.000Z",
        "endDate": "2026-09-15T18:00:00.000Z",
        "duration": 3,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 1200000,
        "vehicleSnapshot": {
          "licensePlate": "B 10008 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Dewi Lestari",
      "type": "Individu",
      "phone": "081234567893",
      "email": "dewi.lestari@example.com",
      "address": "Jl. Malioboro No. 40",
      "city": "Yogyakarta",
      "province": "DI Yogyakarta"
    }
  },
  {
    "id": "res-cancelled-001",
    "bookingNumber": "RES-2610-101",
    "customerId": "cust-ind-005",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 0,
    "remainingAmount": 2500000,
    "status": "CANCELLED",
    "contractNumber": "KTR-2410-003",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-10-01T10:00:00.000Z",
    "updatedAt": "2026-10-02T10:00:00.000Z",
    "startDate": "2026-10-05T08:00:00.000Z",
    "items": [
      {
        "id": "res-cancelled-001-item-1",
        "bookingId": "res-cancelled-001",
        "vehicleId": "veh-009",
        "rateType": "DAILY",
        "startDate": "2026-10-05T08:00:00.000Z",
        "endDate": "2026-10-10T18:00:00.000Z",
        "duration": 5,
        "unitPrice": 500000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10009 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Rudi Hermawan",
      "type": "Individu",
      "phone": "081234567894",
      "email": "rudi.h@example.com",
      "address": "Jl. Pahlawan No. 50",
      "city": "Semarang",
      "province": "Jawa Tengah"
    }
  },
  {
    "id": "res-001",
    "bookingNumber": "RES-2608-001",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 6000000,
    "deposit": 1000000,
    "remainingAmount": 6000000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-004",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "items": [
      {
        "id": "res-001-item-1",
        "bookingId": "res-001",
        "vehicleId": "veh-001",
        "rateType": "DAILY",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10001 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-001-item-2",
        "bookingId": "res-001",
        "vehicleId": "veh-004",
        "rateType": "DAILY",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10004 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Premium"
        }
      },
      {
        "id": "res-001-item-3",
        "bookingId": "res-001",
        "vehicleId": "veh-005",
        "rateType": "DAILY",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10005 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Budi Santoso",
      "type": "Individu",
      "phone": "081234567890",
      "email": "budi.santoso@example.com",
      "address": "Jl. Sudirman No. 10",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta"
    }
  },
  {
    "id": "res-002",
    "bookingNumber": "RES-2608-002",
    "customerId": "cust-ind-002",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 4000000,
    "deposit": 1000000,
    "remainingAmount": 4000000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-005",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "items": [
      {
        "id": "res-002-item-1",
        "bookingId": "res-002",
        "vehicleId": "veh-002",
        "rateType": "DAILY",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10002 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      },
      {
        "id": "res-002-item-2",
        "bookingId": "res-002",
        "vehicleId": "veh-007",
        "rateType": "DAILY",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10007 GHI",
          "brand": "Honda",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Siti Aminah",
      "type": "Individu",
      "phone": "081234567891",
      "email": "siti.aminah@example.com",
      "address": "Jl. Asia Afrika No. 20",
      "city": "Bandung",
      "province": "Jawa Barat"
    }
  },
  {
    "id": "res-003",
    "bookingNumber": "RES-2608-003",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 2000000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-006",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "items": [
      {
        "id": "res-003-item-1",
        "bookingId": "res-003",
        "vehicleId": "veh-003",
        "rateType": "DAILY",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10003 GHI",
          "brand": "Mitsubishi",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Andi Wijaya",
      "type": "Individu",
      "phone": "081234567892",
      "email": "andi.wijaya@example.com",
      "address": "Jl. Pemuda No. 30",
      "city": "Surabaya",
      "province": "Jawa Timur"
    }
  },
  {
    "id": "res-004",
    "bookingNumber": "RES-2608-004",
    "customerId": "cust-ind-004",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 2000000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-007",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "items": [
      {
        "id": "res-004-item-1",
        "bookingId": "res-004",
        "vehicleId": "veh-004",
        "rateType": "DAILY",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10004 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Premium"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Dewi Lestari",
      "type": "Individu",
      "phone": "081234567893",
      "email": "dewi.lestari@example.com",
      "address": "Jl. Malioboro No. 40",
      "city": "Yogyakarta",
      "province": "DI Yogyakarta"
    }
  },
  {
    "id": "res-005",
    "bookingNumber": "RES-2608-005",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 2000000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-008",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "items": [
      {
        "id": "res-005-item-1",
        "bookingId": "res-005",
        "vehicleId": "veh-005",
        "rateType": "DAILY",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 2000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10005 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Rudi Hermawan",
      "type": "Individu",
      "phone": "081234567894",
      "email": "rudi.h@example.com",
      "address": "Jl. Pahlawan No. 50",
      "city": "Semarang",
      "province": "Jawa Tengah"
    }
  },
  {
    "id": "res-006",
    "bookingNumber": "RES-2608-006",
    "customerId": "cust-com-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 1200000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-009",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-22T12:00:00.000Z",
    "updatedAt": "2026-08-25T12:00:00.000Z",
    "startDate": "2026-08-27T12:00:00.000Z",
    "items": [
      {
        "id": "res-006-item-1",
        "bookingId": "res-006",
        "vehicleId": "veh-006",
        "rateType": "DAILY",
        "startDate": "2026-08-27T12:00:00.000Z",
        "endDate": "2026-08-30T12:00:00.000Z",
        "duration": 3,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 1200000,
        "vehicleSnapshot": {
          "licensePlate": "B 10006 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Mock Name",
      "type": "Perusahaan",
      "phone": "021-1234567",
      "email": "info@majuterus.co.id",
      "address": "Jl. MH Thamrin No. 11",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta",
      "picName": "Ahmad Fauzi",
      "picPhone": "08111222333"
    }
  },
  {
    "id": "res-007",
    "bookingNumber": "RES-2608-007",
    "customerId": "cust-com-002",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 1200000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-010",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-22T12:00:00.000Z",
    "updatedAt": "2026-08-25T12:00:00.000Z",
    "startDate": "2026-08-27T12:00:00.000Z",
    "items": [
      {
        "id": "res-007-item-1",
        "bookingId": "res-007",
        "vehicleId": "veh-007",
        "rateType": "DAILY",
        "startDate": "2026-08-27T12:00:00.000Z",
        "endDate": "2026-08-30T12:00:00.000Z",
        "duration": 3,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 1200000,
        "vehicleSnapshot": {
          "licensePlate": "B 10007 GHI",
          "brand": "Honda",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Mock Name",
      "type": "Perusahaan",
      "phone": "022-7654321",
      "email": "contact@makmursentosa.com",
      "address": "Jl. Braga No. 22",
      "city": "Bandung",
      "province": "Jawa Barat",
      "picName": "Bambang S",
      "picPhone": "08111222444"
    }
  },
  {
    "id": "res-008",
    "bookingNumber": "RES-2608-008",
    "customerId": "cust-com-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 1200000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-011",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-22T12:00:00.000Z",
    "updatedAt": "2026-08-25T12:00:00.000Z",
    "startDate": "2026-08-27T12:00:00.000Z",
    "items": [
      {
        "id": "res-008-item-1",
        "bookingId": "res-008",
        "vehicleId": "veh-008",
        "rateType": "DAILY",
        "startDate": "2026-08-27T12:00:00.000Z",
        "endDate": "2026-08-30T12:00:00.000Z",
        "duration": 3,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 1200000,
        "vehicleSnapshot": {
          "licensePlate": "B 10008 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Mock Name",
      "type": "Perusahaan",
      "phone": "031-1234567",
      "email": "hello@logistikcepat.id",
      "address": "Jl. Rungkut Industri No. 33",
      "city": "Surabaya",
      "province": "Jawa Timur",
      "picName": "Candra Irawan",
      "picPhone": "08111222555"
    }
  },
  {
    "id": "res-009",
    "bookingNumber": "RES-2608-009",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 1200000,
    "status": "COMPLETED",
    "contractNumber": "KTR-2410-012",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-10T12:00:00.000Z",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "startDate": "2026-08-15T12:00:00.000Z",
    "items": [
      {
        "id": "res-009-item-1",
        "bookingId": "res-009",
        "vehicleId": "veh-011",
        "rateType": "DAILY",
        "startDate": "2026-08-15T12:00:00.000Z",
        "endDate": "2026-08-18T12:00:00.000Z",
        "duration": 3,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 1200000,
        "vehicleSnapshot": {
          "licensePlate": "B 10011 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Budi Santoso",
      "type": "Individu",
      "phone": "081234567890",
      "email": "budi.santoso@example.com",
      "address": "Jl. Sudirman No. 10",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta"
    }
  },
  {
    "id": "res-010",
    "bookingNumber": "RES-2608-010",
    "customerId": "cust-ind-002",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 1200000,
    "status": "COMPLETED",
    "contractNumber": "KTR-2410-013",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-10T12:00:00.000Z",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "startDate": "2026-08-15T12:00:00.000Z",
    "items": [
      {
        "id": "res-010-item-1",
        "bookingId": "res-010",
        "vehicleId": "veh-012",
        "rateType": "DAILY",
        "startDate": "2026-08-15T12:00:00.000Z",
        "endDate": "2026-08-18T12:00:00.000Z",
        "duration": 3,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 1200000,
        "vehicleSnapshot": {
          "licensePlate": "B 10012 GHI",
          "brand": "Suzuki",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Siti Aminah",
      "type": "Individu",
      "phone": "081234567891",
      "email": "siti.aminah@example.com",
      "address": "Jl. Asia Afrika No. 20",
      "city": "Bandung",
      "province": "Jawa Barat"
    }
  },
  {
    "id": "res-011",
    "bookingNumber": "RES-2608-011",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 1200000,
    "status": "COMPLETED",
    "contractNumber": "KTR-2410-014",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-10T12:00:00.000Z",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "startDate": "2026-08-15T12:00:00.000Z",
    "items": [
      {
        "id": "res-011-item-1",
        "bookingId": "res-011",
        "vehicleId": "veh-013",
        "rateType": "DAILY",
        "startDate": "2026-08-15T12:00:00.000Z",
        "endDate": "2026-08-18T12:00:00.000Z",
        "duration": 3,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 1200000,
        "vehicleSnapshot": {
          "licensePlate": "B 10013 GHI",
          "brand": "Isuzu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Andi Wijaya",
      "type": "Individu",
      "phone": "081234567892",
      "email": "andi.wijaya@example.com",
      "address": "Jl. Pemuda No. 30",
      "city": "Surabaya",
      "province": "Jawa Timur"
    }
  },
  {
    "id": "res-012",
    "bookingNumber": "RES-2608-012",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 800000,
    "deposit": 500000,
    "remainingAmount": 800000,
    "status": "CANCELLED",
    "contractNumber": "KTR-2410-015",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-15T12:00:00.000Z",
    "updatedAt": "2026-08-18T12:00:00.000Z",
    "startDate": "2026-08-20T12:00:00.000Z",
    "items": [
      {
        "id": "res-012-item-1",
        "bookingId": "res-012",
        "vehicleId": "veh-014",
        "rateType": "DAILY",
        "startDate": "2026-08-20T12:00:00.000Z",
        "endDate": "2026-08-22T12:00:00.000Z",
        "duration": 2,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 800000,
        "vehicleSnapshot": {
          "licensePlate": "B 10014 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Rudi Hermawan",
      "type": "Individu",
      "phone": "081234567894",
      "email": "rudi.h@example.com",
      "address": "Jl. Pahlawan No. 50",
      "city": "Semarang",
      "province": "Jawa Tengah"
    }
  },
  {
    "id": "res-013",
    "bookingNumber": "RES-2608-013",
    "customerId": "cust-com-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 800000,
    "deposit": 500000,
    "remainingAmount": 800000,
    "status": "BOOKED",
    "createdAt": "2026-08-25T12:00:00.000Z",
    "updatedAt": "2026-08-28T12:00:00.000Z",
    "startDate": "2026-08-30T12:00:00.000Z",
    "items": [
      {
        "id": "res-013-item-1",
        "bookingId": "res-013",
        "vehicleId": "veh-015",
        "rateType": "DAILY",
        "startDate": "2026-08-30T12:00:00.000Z",
        "endDate": "2026-09-01T12:00:00.000Z",
        "duration": 2,
        "unitPrice": 400000,
        "depositSnapshot": 500000,
        "subtotal": 800000,
        "vehicleSnapshot": {
          "licensePlate": "B 10015 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Mock Name",
      "type": "Perusahaan",
      "phone": "021-9876543",
      "email": "contact@konstruksijaya.co.id",
      "address": "Jl. TB Simatupang No. 55",
      "city": "Jakarta Selatan",
      "province": "DKI Jakarta",
      "picName": "Eko Prasetyo",
      "picPhone": "08111222777"
    }
  },
  {
    "id": "res-015",
    "bookingNumber": "RES-2608-015",
    "customerId": "cust-ind-006",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1000000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-016",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-08-25T12:00:00.000Z",
    "updatedAt": "2026-08-28T12:00:00.000Z",
    "startDate": "2026-08-30T12:00:00.000Z",
    "items": [
      {
        "id": "res-015-item-1",
        "bookingId": "res-015",
        "vehicleId": "veh-015",
        "rateType": "DAILY",
        "startDate": "2026-08-30T12:00:00.000Z",
        "endDate": "2026-09-01T12:00:00.000Z",
        "duration": 2,
        "unitPrice": 500000,
        "depositSnapshot": 500000,
        "subtotal": 1000000,
        "vehicleSnapshot": {
          "licensePlate": "B 10015 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Maya Sari",
      "type": "Individu",
      "phone": "081234567895",
      "email": "maya.sari@example.com",
      "address": "Jl. Gatot Subroto No. 60",
      "city": "Medan",
      "province": "Sumatera Utara"
    }
  },
  {
    "id": "res-016",
    "bookingNumber": "RES-2609-016",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-017",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-17T08:00:00.000Z",
    "items": [
      {
        "id": "res-016-item-1",
        "bookingId": "res-016",
        "vehicleId": "veh-002",
        "rateType": "DAILY",
        "startDate": "2026-10-17T08:00:00.000Z",
        "endDate": "2026-10-19T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10002 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Rudi Hermawan",
      "type": "Individu",
      "phone": "081234567894",
      "email": "rudi.h@example.com",
      "address": "Jl. Pahlawan No. 50",
      "city": "Semarang",
      "province": "Jawa Tengah"
    }
  },
  {
    "id": "res-017",
    "bookingNumber": "RES-2609-017",
    "customerId": "cust-ind-006",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-018",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-18T08:00:00.000Z",
    "items": [
      {
        "id": "res-017-item-1",
        "bookingId": "res-017",
        "vehicleId": "veh-003",
        "rateType": "DAILY",
        "startDate": "2026-10-18T08:00:00.000Z",
        "endDate": "2026-10-20T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10003 GHI",
          "brand": "Mitsubishi",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Maya Sari",
      "type": "Individu",
      "phone": "081234567895",
      "email": "maya.sari@example.com",
      "address": "Jl. Gatot Subroto No. 60",
      "city": "Medan",
      "province": "Sumatera Utara"
    }
  },
  {
    "id": "res-018",
    "bookingNumber": "RES-2609-018",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-019",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-19T08:00:00.000Z",
    "items": [
      {
        "id": "res-018-item-1",
        "bookingId": "res-018",
        "vehicleId": "veh-004",
        "rateType": "DAILY",
        "startDate": "2026-10-19T08:00:00.000Z",
        "endDate": "2026-10-21T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10004 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Premium"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Budi Santoso",
      "type": "Individu",
      "phone": "081234567890",
      "email": "budi.santoso@example.com",
      "address": "Jl. Sudirman No. 10",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta"
    }
  },
  {
    "id": "res-019",
    "bookingNumber": "RES-2609-019",
    "customerId": "cust-ind-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-020",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-20T08:00:00.000Z",
    "items": [
      {
        "id": "res-019-item-1",
        "bookingId": "res-019",
        "vehicleId": "veh-005",
        "rateType": "DAILY",
        "startDate": "2026-10-20T08:00:00.000Z",
        "endDate": "2026-10-22T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10005 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Siti Aminah",
      "type": "Individu",
      "phone": "081234567891",
      "email": "siti.aminah@example.com",
      "address": "Jl. Asia Afrika No. 20",
      "city": "Bandung",
      "province": "Jawa Barat"
    }
  },
  {
    "id": "res-020",
    "bookingNumber": "RES-2609-020",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-021",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-21T08:00:00.000Z",
    "items": [
      {
        "id": "res-020-item-1",
        "bookingId": "res-020",
        "vehicleId": "veh-006",
        "rateType": "DAILY",
        "startDate": "2026-10-21T08:00:00.000Z",
        "endDate": "2026-10-23T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10006 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Andi Wijaya",
      "type": "Individu",
      "phone": "081234567892",
      "email": "andi.wijaya@example.com",
      "address": "Jl. Pemuda No. 30",
      "city": "Surabaya",
      "province": "Jawa Timur"
    }
  },
  {
    "id": "res-021",
    "bookingNumber": "RES-2609-021",
    "customerId": "cust-ind-004",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "BOOKED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-22T08:00:00.000Z",
    "items": [
      {
        "id": "res-021-item-1",
        "bookingId": "res-021",
        "vehicleId": "veh-007",
        "rateType": "DAILY",
        "startDate": "2026-10-22T08:00:00.000Z",
        "endDate": "2026-10-24T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10007 GHI",
          "brand": "Honda",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Dewi Lestari",
      "type": "Individu",
      "phone": "081234567893",
      "email": "dewi.lestari@example.com",
      "address": "Jl. Malioboro No. 40",
      "city": "Yogyakarta",
      "province": "DI Yogyakarta"
    }
  },
  {
    "id": "res-022",
    "bookingNumber": "RES-2609-022",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-022",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-23T08:00:00.000Z",
    "items": [
      {
        "id": "res-022-item-1",
        "bookingId": "res-022",
        "vehicleId": "veh-008",
        "rateType": "DAILY",
        "startDate": "2026-10-23T08:00:00.000Z",
        "endDate": "2026-10-25T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10008 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Rudi Hermawan",
      "type": "Individu",
      "phone": "081234567894",
      "email": "rudi.h@example.com",
      "address": "Jl. Pahlawan No. 50",
      "city": "Semarang",
      "province": "Jawa Tengah"
    }
  },
  {
    "id": "res-023",
    "bookingNumber": "RES-2609-023",
    "customerId": "cust-ind-006",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-023",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-24T08:00:00.000Z",
    "items": [
      {
        "id": "res-023-item-1",
        "bookingId": "res-023",
        "vehicleId": "veh-009",
        "rateType": "DAILY",
        "startDate": "2026-10-24T08:00:00.000Z",
        "endDate": "2026-10-26T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10009 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Maya Sari",
      "type": "Individu",
      "phone": "081234567895",
      "email": "maya.sari@example.com",
      "address": "Jl. Gatot Subroto No. 60",
      "city": "Medan",
      "province": "Sumatera Utara"
    }
  },
  {
    "id": "res-024",
    "bookingNumber": "RES-2609-024",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-024",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-25T08:00:00.000Z",
    "items": [
      {
        "id": "res-024-item-1",
        "bookingId": "res-024",
        "vehicleId": "veh-010",
        "rateType": "DAILY",
        "startDate": "2026-10-25T08:00:00.000Z",
        "endDate": "2026-10-27T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10010 GHI",
          "brand": "Mitsubishi",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Budi Santoso",
      "type": "Individu",
      "phone": "081234567890",
      "email": "budi.santoso@example.com",
      "address": "Jl. Sudirman No. 10",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta"
    }
  },
  {
    "id": "res-025",
    "bookingNumber": "RES-2609-025",
    "customerId": "cust-ind-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-025",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-26T08:00:00.000Z",
    "items": [
      {
        "id": "res-025-item-1",
        "bookingId": "res-025",
        "vehicleId": "veh-011",
        "rateType": "DAILY",
        "startDate": "2026-10-26T08:00:00.000Z",
        "endDate": "2026-10-28T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10011 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Siti Aminah",
      "type": "Individu",
      "phone": "081234567891",
      "email": "siti.aminah@example.com",
      "address": "Jl. Asia Afrika No. 20",
      "city": "Bandung",
      "province": "Jawa Barat"
    }
  },
  {
    "id": "res-026",
    "bookingNumber": "RES-2609-026",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-026",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-27T08:00:00.000Z",
    "items": [
      {
        "id": "res-026-item-1",
        "bookingId": "res-026",
        "vehicleId": "veh-012",
        "rateType": "DAILY",
        "startDate": "2026-10-27T08:00:00.000Z",
        "endDate": "2026-10-29T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10012 GHI",
          "brand": "Suzuki",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Andi Wijaya",
      "type": "Individu",
      "phone": "081234567892",
      "email": "andi.wijaya@example.com",
      "address": "Jl. Pemuda No. 30",
      "city": "Surabaya",
      "province": "Jawa Timur"
    }
  },
  {
    "id": "res-027",
    "bookingNumber": "RES-2609-027",
    "customerId": "cust-ind-004",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "BOOKED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-28T08:00:00.000Z",
    "items": [
      {
        "id": "res-027-item-1",
        "bookingId": "res-027",
        "vehicleId": "veh-013",
        "rateType": "DAILY",
        "startDate": "2026-10-28T08:00:00.000Z",
        "endDate": "2026-10-30T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10013 GHI",
          "brand": "Isuzu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Dewi Lestari",
      "type": "Individu",
      "phone": "081234567893",
      "email": "dewi.lestari@example.com",
      "address": "Jl. Malioboro No. 40",
      "city": "Yogyakarta",
      "province": "DI Yogyakarta"
    }
  },
  {
    "id": "res-028",
    "bookingNumber": "RES-2609-028",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-027",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-01T08:00:00.000Z",
    "items": [
      {
        "id": "res-028-item-1",
        "bookingId": "res-028",
        "vehicleId": "veh-014",
        "rateType": "DAILY",
        "startDate": "2026-10-01T08:00:00.000Z",
        "endDate": "2026-10-03T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10014 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Rudi Hermawan",
      "type": "Individu",
      "phone": "081234567894",
      "email": "rudi.h@example.com",
      "address": "Jl. Pahlawan No. 50",
      "city": "Semarang",
      "province": "Jawa Tengah"
    }
  },
  {
    "id": "res-029",
    "bookingNumber": "RES-2609-029",
    "customerId": "cust-ind-006",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-028",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-02T08:00:00.000Z",
    "items": [
      {
        "id": "res-029-item-1",
        "bookingId": "res-029",
        "vehicleId": "veh-015",
        "rateType": "DAILY",
        "startDate": "2026-10-02T08:00:00.000Z",
        "endDate": "2026-10-04T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10015 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Maya Sari",
      "type": "Individu",
      "phone": "081234567895",
      "email": "maya.sari@example.com",
      "address": "Jl. Gatot Subroto No. 60",
      "city": "Medan",
      "province": "Sumatera Utara"
    }
  },
  {
    "id": "res-030",
    "bookingNumber": "RES-2609-030",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-029",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-03T08:00:00.000Z",
    "items": [
      {
        "id": "res-030-item-1",
        "bookingId": "res-030",
        "vehicleId": "veh-001",
        "rateType": "DAILY",
        "startDate": "2026-10-03T08:00:00.000Z",
        "endDate": "2026-10-05T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10001 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Budi Santoso",
      "type": "Individu",
      "phone": "081234567890",
      "email": "budi.santoso@example.com",
      "address": "Jl. Sudirman No. 10",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta"
    }
  },
  {
    "id": "res-031",
    "bookingNumber": "RES-2609-031",
    "customerId": "cust-ind-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-030",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-04T08:00:00.000Z",
    "items": [
      {
        "id": "res-031-item-1",
        "bookingId": "res-031",
        "vehicleId": "veh-002",
        "rateType": "DAILY",
        "startDate": "2026-10-04T08:00:00.000Z",
        "endDate": "2026-10-06T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10002 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Siti Aminah",
      "type": "Individu",
      "phone": "081234567891",
      "email": "siti.aminah@example.com",
      "address": "Jl. Asia Afrika No. 20",
      "city": "Bandung",
      "province": "Jawa Barat"
    }
  },
  {
    "id": "res-032",
    "bookingNumber": "RES-2609-032",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-031",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-05T08:00:00.000Z",
    "items": [
      {
        "id": "res-032-item-1",
        "bookingId": "res-032",
        "vehicleId": "veh-003",
        "rateType": "DAILY",
        "startDate": "2026-10-05T08:00:00.000Z",
        "endDate": "2026-10-07T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10003 GHI",
          "brand": "Mitsubishi",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Andi Wijaya",
      "type": "Individu",
      "phone": "081234567892",
      "email": "andi.wijaya@example.com",
      "address": "Jl. Pemuda No. 30",
      "city": "Surabaya",
      "province": "Jawa Timur"
    }
  },
  {
    "id": "res-033",
    "bookingNumber": "RES-2609-033",
    "customerId": "cust-ind-004",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "BOOKED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-06T08:00:00.000Z",
    "items": [
      {
        "id": "res-033-item-1",
        "bookingId": "res-033",
        "vehicleId": "veh-004",
        "rateType": "DAILY",
        "startDate": "2026-10-06T08:00:00.000Z",
        "endDate": "2026-10-08T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10004 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Premium"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Dewi Lestari",
      "type": "Individu",
      "phone": "081234567893",
      "email": "dewi.lestari@example.com",
      "address": "Jl. Malioboro No. 40",
      "city": "Yogyakarta",
      "province": "DI Yogyakarta"
    }
  },
  {
    "id": "res-034",
    "bookingNumber": "RES-2609-034",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-032",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-07T08:00:00.000Z",
    "items": [
      {
        "id": "res-034-item-1",
        "bookingId": "res-034",
        "vehicleId": "veh-005",
        "rateType": "DAILY",
        "startDate": "2026-10-07T08:00:00.000Z",
        "endDate": "2026-10-09T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10005 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Rudi Hermawan",
      "type": "Individu",
      "phone": "081234567894",
      "email": "rudi.h@example.com",
      "address": "Jl. Pahlawan No. 50",
      "city": "Semarang",
      "province": "Jawa Tengah"
    }
  },
  {
    "id": "res-035",
    "bookingNumber": "RES-2609-035",
    "customerId": "cust-ind-006",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-033",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-08T08:00:00.000Z",
    "items": [
      {
        "id": "res-035-item-1",
        "bookingId": "res-035",
        "vehicleId": "veh-006",
        "rateType": "DAILY",
        "startDate": "2026-10-08T08:00:00.000Z",
        "endDate": "2026-10-10T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10006 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Maya Sari",
      "type": "Individu",
      "phone": "081234567895",
      "email": "maya.sari@example.com",
      "address": "Jl. Gatot Subroto No. 60",
      "city": "Medan",
      "province": "Sumatera Utara"
    }
  },
  {
    "id": "res-036",
    "bookingNumber": "RES-2609-036",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "ACTIVE",
    "contractNumber": "KTR-2410-034",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-09T08:00:00.000Z",
    "items": [
      {
        "id": "res-036-item-1",
        "bookingId": "res-036",
        "vehicleId": "veh-007",
        "rateType": "DAILY",
        "startDate": "2026-10-09T08:00:00.000Z",
        "endDate": "2026-10-11T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10007 GHI",
          "brand": "Honda",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Budi Santoso",
      "type": "Individu",
      "phone": "081234567890",
      "email": "budi.santoso@example.com",
      "address": "Jl. Sudirman No. 10",
      "city": "Jakarta Pusat",
      "province": "DKI Jakarta"
    }
  },
  {
    "id": "res-037",
    "bookingNumber": "RES-2609-037",
    "customerId": "cust-ind-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-035",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-10T08:00:00.000Z",
    "items": [
      {
        "id": "res-037-item-1",
        "bookingId": "res-037",
        "vehicleId": "veh-008",
        "rateType": "DAILY",
        "startDate": "2026-10-10T08:00:00.000Z",
        "endDate": "2026-10-12T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10008 GHI",
          "brand": "Toyota",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Siti Aminah",
      "type": "Individu",
      "phone": "081234567891",
      "email": "siti.aminah@example.com",
      "address": "Jl. Asia Afrika No. 20",
      "city": "Bandung",
      "province": "Jawa Barat"
    }
  },
  {
    "id": "res-038",
    "bookingNumber": "RES-2609-038",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "CONTRACTED",
    "contractNumber": "KTR-2410-036",
    "contractDate": "2024-10-15T09:00:00Z",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-11T08:00:00.000Z",
    "items": [
      {
        "id": "res-038-item-1",
        "bookingId": "res-038",
        "vehicleId": "veh-009",
        "rateType": "DAILY",
        "startDate": "2026-10-11T08:00:00.000Z",
        "endDate": "2026-10-13T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 750000,
        "depositSnapshot": 500000,
        "subtotal": 1500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10009 GHI",
          "brand": "Daihatsu",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Andi Wijaya",
      "type": "Individu",
      "phone": "081234567892",
      "email": "andi.wijaya@example.com",
      "address": "Jl. Pemuda No. 30",
      "city": "Surabaya",
      "province": "Jawa Timur"
    }
  },
  {
    "id": "res-039",
    "bookingNumber": "RES-2609-039",
    "customerId": "cust-ind-004",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2500000,
    "status": "BOOKED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-12T08:00:00.000Z",
    "items": [
      {
        "id": "res-039-item-1",
        "bookingId": "res-039",
        "vehicleId": "veh-010",
        "rateType": "DAILY",
        "startDate": "2026-10-12T08:00:00.000Z",
        "endDate": "2026-10-14T08:00:00.000Z",
        "duration": 2,
        "unitPrice": 1250000,
        "depositSnapshot": 500000,
        "subtotal": 2500000,
        "vehicleSnapshot": {
          "licensePlate": "B 10010 GHI",
          "brand": "Mitsubishi",
          "model": "Mobil",
          "categoryName": "MPV Standard"
        }
      }
    ],
    "customerSnapshot": {
      "name": "Dewi Lestari",
      "type": "Individu",
      "phone": "081234567893",
      "email": "dewi.lestari@example.com",
      "address": "Jl. Malioboro No. 40",
      "city": "Yogyakarta",
      "province": "DI Yogyakarta"
    }
  }
];
