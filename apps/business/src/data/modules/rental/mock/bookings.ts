import type { Booking } from '@/features/modules/rental/bookings/types/booking';

export const mockBookings: Booking[] = [
  {
    "id": "res-mega-001",
    "bookingNumber": "RES-2610-999",
    "customerId": "cust-corp-001",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 24000000,
    "deposit": 24000000,
    "remainingAmount": 0,
    "status": "ACTIVE",
    "createdAt": "2026-10-06T10:00:00.000Z",
    "updatedAt": "2026-10-06T10:00:00.000Z",
    "startDate": "2026-10-15T08:00:00.000Z",
    "endDate": "2026-10-20T18:00:00.000Z",
    "duration": 5,
    "rateType": "DAILY",
    "items": Array.from({ length: 12 }).map((_, i) => ({
      "id": `res-mega-001-item-${i+1}`,
      "bookingId": "res-mega-001",
      "vehicleId": `veh-${(i+1).toString().padStart(3, '0')}`,
      "startDate": "2026-10-15T08:00:00.000Z",
      "endDate": "2026-10-20T18:00:00.000Z",
      "duration": 5,
      "rateType": "DAILY" as any,
      "rateSnapshot": 400000,
      "subtotal": 2000000
    }))
  },
  {
    "id": "res-completed-001",
    "bookingNumber": "RES-2609-801",
    "customerId": "cust-ind-004",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 1200000,
    "remainingAmount": 0,
    "status": "COMPLETED",
    "createdAt": "2026-09-10T10:00:00.000Z",
    "updatedAt": "2026-09-15T18:00:00.000Z",
    "startDate": "2026-09-12T08:00:00.000Z",
    "endDate": "2026-09-15T18:00:00.000Z",
    "duration": 3,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-completed-001-item-1",
        "bookingId": "res-completed-001",
        "vehicleId": "veh-008",
        "startDate": "2026-09-12T08:00:00.000Z",
        "endDate": "2026-09-15T18:00:00.000Z",
        "duration": 3,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 1200000
      }
    ]
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
    "createdAt": "2026-10-01T10:00:00.000Z",
    "updatedAt": "2026-10-02T10:00:00.000Z",
    "startDate": "2026-10-05T08:00:00.000Z",
    "endDate": "2026-10-10T18:00:00.000Z",
    "duration": 5,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-cancelled-001-item-1",
        "bookingId": "res-cancelled-001",
        "vehicleId": "veh-009",
        "startDate": "2026-10-05T08:00:00.000Z",
        "endDate": "2026-10-10T18:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 500000,
        "subtotal": 2500000
      }
    ]
  },
  {
    "id": "res-001",
    "bookingNumber": "RES-2608-001",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 6000000,
    "deposit": 1000000,
    "remainingAmount": 5000000,
    "status": "ACTIVE",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "endDate": "2026-08-28T12:00:00.000Z",
    "duration": 5,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-001-item-1",
        "bookingId": "res-001",
        "vehicleId": "veh-001",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 2000000
      },
      {
        "id": "res-001-item-2",
        "bookingId": "res-001",
        "vehicleId": "veh-004",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 2000000
      },
      {
        "id": "res-001-item-3",
        "bookingId": "res-001",
        "vehicleId": "veh-005",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 2000000
      }
    ]
  },
  {
    "id": "res-002",
    "bookingNumber": "RES-2608-002",
    "customerId": "cust-ind-002",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 4000000,
    "deposit": 1000000,
    "remainingAmount": 3000000,
    "status": "ACTIVE",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "endDate": "2026-08-28T12:00:00.000Z",
    "duration": 5,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-002-item-1",
        "bookingId": "res-002",
        "vehicleId": "veh-002",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 2000000
      },
      {
        "id": "res-002-item-2",
        "bookingId": "res-002",
        "vehicleId": "veh-007",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 2000000
      }
    ]
  },
  {
    "id": "res-003",
    "bookingNumber": "RES-2608-003",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 2000000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "ACTIVE",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "endDate": "2026-08-28T12:00:00.000Z",
    "duration": 5,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-003-item-1",
        "bookingId": "res-003",
        "vehicleId": "veh-003",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 2000000
      }
    ]
  },
  {
    "id": "res-004",
    "bookingNumber": "RES-2608-004",
    "customerId": "cust-ind-004",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 2000000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "ACTIVE",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "endDate": "2026-08-28T12:00:00.000Z",
    "duration": 5,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-004-item-1",
        "bookingId": "res-004",
        "vehicleId": "veh-004",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 2000000
      }
    ]
  },
  {
    "id": "res-005",
    "bookingNumber": "RES-2608-005",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 2000000,
    "deposit": 500000,
    "remainingAmount": 1500000,
    "status": "ACTIVE",
    "createdAt": "2026-08-18T12:00:00.000Z",
    "updatedAt": "2026-08-21T12:00:00.000Z",
    "startDate": "2026-08-23T12:00:00.000Z",
    "endDate": "2026-08-28T12:00:00.000Z",
    "duration": 5,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-005-item-1",
        "bookingId": "res-005",
        "vehicleId": "veh-005",
        "startDate": "2026-08-23T12:00:00.000Z",
        "endDate": "2026-08-28T12:00:00.000Z",
        "duration": 5,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 2000000
      }
    ]
  },
  {
    "id": "res-006",
    "bookingNumber": "RES-2608-006",
    "customerId": "cust-com-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 700000,
    "status": "CONTRACTED",
    "createdAt": "2026-08-22T12:00:00.000Z",
    "updatedAt": "2026-08-25T12:00:00.000Z",
    "startDate": "2026-08-27T12:00:00.000Z",
    "endDate": "2026-08-30T12:00:00.000Z",
    "duration": 3,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-006-item-1",
        "bookingId": "res-006",
        "vehicleId": "veh-006",
        "startDate": "2026-08-27T12:00:00.000Z",
        "endDate": "2026-08-30T12:00:00.000Z",
        "duration": 3,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 1200000
      }
    ]
  },
  {
    "id": "res-007",
    "bookingNumber": "RES-2608-007",
    "customerId": "cust-com-002",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 700000,
    "status": "CONTRACTED",
    "createdAt": "2026-08-22T12:00:00.000Z",
    "updatedAt": "2026-08-25T12:00:00.000Z",
    "startDate": "2026-08-27T12:00:00.000Z",
    "endDate": "2026-08-30T12:00:00.000Z",
    "duration": 3,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-007-item-1",
        "bookingId": "res-007",
        "vehicleId": "veh-007",
        "startDate": "2026-08-27T12:00:00.000Z",
        "endDate": "2026-08-30T12:00:00.000Z",
        "duration": 3,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 1200000
      }
    ]
  },
  {
    "id": "res-008",
    "bookingNumber": "RES-2608-008",
    "customerId": "cust-com-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 700000,
    "status": "CONTRACTED",
    "createdAt": "2026-08-22T12:00:00.000Z",
    "updatedAt": "2026-08-25T12:00:00.000Z",
    "startDate": "2026-08-27T12:00:00.000Z",
    "endDate": "2026-08-30T12:00:00.000Z",
    "duration": 3,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-008-item-1",
        "bookingId": "res-008",
        "vehicleId": "veh-008",
        "startDate": "2026-08-27T12:00:00.000Z",
        "endDate": "2026-08-30T12:00:00.000Z",
        "duration": 3,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 1200000
      }
    ]
  },
  {
    "id": "res-009",
    "bookingNumber": "RES-2608-009",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 700000,
    "status": "COMPLETED",
    "createdAt": "2026-08-10T12:00:00.000Z",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "startDate": "2026-08-15T12:00:00.000Z",
    "endDate": "2026-08-18T12:00:00.000Z",
    "duration": 3,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-009-item-1",
        "bookingId": "res-009",
        "vehicleId": "veh-011",
        "startDate": "2026-08-15T12:00:00.000Z",
        "endDate": "2026-08-18T12:00:00.000Z",
        "duration": 3,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 1200000
      }
    ]
  },
  {
    "id": "res-010",
    "bookingNumber": "RES-2608-010",
    "customerId": "cust-ind-002",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 700000,
    "status": "COMPLETED",
    "createdAt": "2026-08-10T12:00:00.000Z",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "startDate": "2026-08-15T12:00:00.000Z",
    "endDate": "2026-08-18T12:00:00.000Z",
    "duration": 3,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-010-item-1",
        "bookingId": "res-010",
        "vehicleId": "veh-012",
        "startDate": "2026-08-15T12:00:00.000Z",
        "endDate": "2026-08-18T12:00:00.000Z",
        "duration": 3,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 1200000
      }
    ]
  },
  {
    "id": "res-011",
    "bookingNumber": "RES-2608-011",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1200000,
    "deposit": 500000,
    "remainingAmount": 700000,
    "status": "COMPLETED",
    "createdAt": "2026-08-10T12:00:00.000Z",
    "updatedAt": "2026-08-13T12:00:00.000Z",
    "startDate": "2026-08-15T12:00:00.000Z",
    "endDate": "2026-08-18T12:00:00.000Z",
    "duration": 3,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-011-item-1",
        "bookingId": "res-011",
        "vehicleId": "veh-013",
        "startDate": "2026-08-15T12:00:00.000Z",
        "endDate": "2026-08-18T12:00:00.000Z",
        "duration": 3,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 1200000
      }
    ]
  },
  {
    "id": "res-012",
    "bookingNumber": "RES-2608-012",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 800000,
    "deposit": 500000,
    "remainingAmount": 300000,
    "status": "CANCELLED",
    "createdAt": "2026-08-15T12:00:00.000Z",
    "updatedAt": "2026-08-18T12:00:00.000Z",
    "startDate": "2026-08-20T12:00:00.000Z",
    "endDate": "2026-08-22T12:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-012-item-1",
        "bookingId": "res-012",
        "vehicleId": "veh-014",
        "startDate": "2026-08-20T12:00:00.000Z",
        "endDate": "2026-08-22T12:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 800000
      }
    ]
  },
  {
    "id": "res-013",
    "bookingNumber": "RES-2608-013",
    "customerId": "cust-com-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 800000,
    "deposit": 500000,
    "remainingAmount": 300000,
    "status": "BOOKED",
    "createdAt": "2026-08-25T12:00:00.000Z",
    "updatedAt": "2026-08-28T12:00:00.000Z",
    "startDate": "2026-08-30T12:00:00.000Z",
    "endDate": "2026-09-01T12:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-013-item-1",
        "bookingId": "res-013",
        "vehicleId": "veh-015",
        "startDate": "2026-08-30T12:00:00.000Z",
        "endDate": "2026-09-01T12:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 400000,
        "subtotal": 800000
      }
    ]
  }
  ,
  {
    "id": "res-015",
    "bookingNumber": "RES-2608-015",
    "customerId": "cust-ind-006",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1000000,
    "deposit": 500000,
    "remainingAmount": 500000,
    "status": "CONTRACTED",
    "createdAt": "2026-08-25T12:00:00.000Z",
    "updatedAt": "2026-08-28T12:00:00.000Z",
    "startDate": "2026-08-30T12:00:00.000Z",
    "endDate": "2026-09-01T12:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-015-item-1",
        "bookingId": "res-015",
        "vehicleId": "veh-015",
        "startDate": "2026-08-30T12:00:00.000Z",
        "endDate": "2026-09-01T12:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 500000,
        "subtotal": 1000000
      }
    ]
  },
  {
    "id": "res-016",
    "bookingNumber": "RES-2609-016",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-17T08:00:00.000Z",
    "endDate": "2026-10-19T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-016-item-1",
        "bookingId": "res-016",
        "vehicleId": "veh-002",
        "startDate": "2026-10-17T08:00:00.000Z",
        "endDate": "2026-10-19T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-017",
    "bookingNumber": "RES-2609-017",
    "customerId": "cust-ind-006",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-18T08:00:00.000Z",
    "endDate": "2026-10-20T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-017-item-1",
        "bookingId": "res-017",
        "vehicleId": "veh-003",
        "startDate": "2026-10-18T08:00:00.000Z",
        "endDate": "2026-10-20T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-018",
    "bookingNumber": "RES-2609-018",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "ACTIVE",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-19T08:00:00.000Z",
    "endDate": "2026-10-21T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-018-item-1",
        "bookingId": "res-018",
        "vehicleId": "veh-004",
        "startDate": "2026-10-19T08:00:00.000Z",
        "endDate": "2026-10-21T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-019",
    "bookingNumber": "RES-2609-019",
    "customerId": "cust-ind-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-20T08:00:00.000Z",
    "endDate": "2026-10-22T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-019-item-1",
        "bookingId": "res-019",
        "vehicleId": "veh-005",
        "startDate": "2026-10-20T08:00:00.000Z",
        "endDate": "2026-10-22T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-020",
    "bookingNumber": "RES-2609-020",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-21T08:00:00.000Z",
    "endDate": "2026-10-23T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-020-item-1",
        "bookingId": "res-020",
        "vehicleId": "veh-006",
        "startDate": "2026-10-21T08:00:00.000Z",
        "endDate": "2026-10-23T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-021",
    "bookingNumber": "RES-2609-021",
    "customerId": "cust-ind-004",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "BOOKED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-22T08:00:00.000Z",
    "endDate": "2026-10-24T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-021-item-1",
        "bookingId": "res-021",
        "vehicleId": "veh-007",
        "startDate": "2026-10-22T08:00:00.000Z",
        "endDate": "2026-10-24T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-022",
    "bookingNumber": "RES-2609-022",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-23T08:00:00.000Z",
    "endDate": "2026-10-25T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-022-item-1",
        "bookingId": "res-022",
        "vehicleId": "veh-008",
        "startDate": "2026-10-23T08:00:00.000Z",
        "endDate": "2026-10-25T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-023",
    "bookingNumber": "RES-2609-023",
    "customerId": "cust-ind-006",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-24T08:00:00.000Z",
    "endDate": "2026-10-26T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-023-item-1",
        "bookingId": "res-023",
        "vehicleId": "veh-009",
        "startDate": "2026-10-24T08:00:00.000Z",
        "endDate": "2026-10-26T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-024",
    "bookingNumber": "RES-2609-024",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "ACTIVE",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-25T08:00:00.000Z",
    "endDate": "2026-10-27T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-024-item-1",
        "bookingId": "res-024",
        "vehicleId": "veh-010",
        "startDate": "2026-10-25T08:00:00.000Z",
        "endDate": "2026-10-27T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-025",
    "bookingNumber": "RES-2609-025",
    "customerId": "cust-ind-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-26T08:00:00.000Z",
    "endDate": "2026-10-28T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-025-item-1",
        "bookingId": "res-025",
        "vehicleId": "veh-011",
        "startDate": "2026-10-26T08:00:00.000Z",
        "endDate": "2026-10-28T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-026",
    "bookingNumber": "RES-2609-026",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-27T08:00:00.000Z",
    "endDate": "2026-10-29T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-026-item-1",
        "bookingId": "res-026",
        "vehicleId": "veh-012",
        "startDate": "2026-10-27T08:00:00.000Z",
        "endDate": "2026-10-29T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-027",
    "bookingNumber": "RES-2609-027",
    "customerId": "cust-ind-004",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "BOOKED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-28T08:00:00.000Z",
    "endDate": "2026-10-30T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-027-item-1",
        "bookingId": "res-027",
        "vehicleId": "veh-013",
        "startDate": "2026-10-28T08:00:00.000Z",
        "endDate": "2026-10-30T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-028",
    "bookingNumber": "RES-2609-028",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-01T08:00:00.000Z",
    "endDate": "2026-10-03T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-028-item-1",
        "bookingId": "res-028",
        "vehicleId": "veh-014",
        "startDate": "2026-10-01T08:00:00.000Z",
        "endDate": "2026-10-03T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-029",
    "bookingNumber": "RES-2609-029",
    "customerId": "cust-ind-006",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-02T08:00:00.000Z",
    "endDate": "2026-10-04T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-029-item-1",
        "bookingId": "res-029",
        "vehicleId": "veh-015",
        "startDate": "2026-10-02T08:00:00.000Z",
        "endDate": "2026-10-04T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-030",
    "bookingNumber": "RES-2609-030",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "ACTIVE",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-03T08:00:00.000Z",
    "endDate": "2026-10-05T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-030-item-1",
        "bookingId": "res-030",
        "vehicleId": "veh-001",
        "startDate": "2026-10-03T08:00:00.000Z",
        "endDate": "2026-10-05T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-031",
    "bookingNumber": "RES-2609-031",
    "customerId": "cust-ind-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-04T08:00:00.000Z",
    "endDate": "2026-10-06T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-031-item-1",
        "bookingId": "res-031",
        "vehicleId": "veh-002",
        "startDate": "2026-10-04T08:00:00.000Z",
        "endDate": "2026-10-06T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-032",
    "bookingNumber": "RES-2609-032",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-05T08:00:00.000Z",
    "endDate": "2026-10-07T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-032-item-1",
        "bookingId": "res-032",
        "vehicleId": "veh-003",
        "startDate": "2026-10-05T08:00:00.000Z",
        "endDate": "2026-10-07T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-033",
    "bookingNumber": "RES-2609-033",
    "customerId": "cust-ind-004",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "BOOKED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-06T08:00:00.000Z",
    "endDate": "2026-10-08T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-033-item-1",
        "bookingId": "res-033",
        "vehicleId": "veh-004",
        "startDate": "2026-10-06T08:00:00.000Z",
        "endDate": "2026-10-08T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-034",
    "bookingNumber": "RES-2609-034",
    "customerId": "cust-ind-005",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-07T08:00:00.000Z",
    "endDate": "2026-10-09T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-034-item-1",
        "bookingId": "res-034",
        "vehicleId": "veh-005",
        "startDate": "2026-10-07T08:00:00.000Z",
        "endDate": "2026-10-09T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-035",
    "bookingNumber": "RES-2609-035",
    "customerId": "cust-ind-006",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-08T08:00:00.000Z",
    "endDate": "2026-10-10T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-035-item-1",
        "bookingId": "res-035",
        "vehicleId": "veh-006",
        "startDate": "2026-10-08T08:00:00.000Z",
        "endDate": "2026-10-10T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-036",
    "bookingNumber": "RES-2609-036",
    "customerId": "cust-ind-001",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "ACTIVE",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-09T08:00:00.000Z",
    "endDate": "2026-10-11T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-036-item-1",
        "bookingId": "res-036",
        "vehicleId": "veh-007",
        "startDate": "2026-10-09T08:00:00.000Z",
        "endDate": "2026-10-11T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-037",
    "bookingNumber": "RES-2609-037",
    "customerId": "cust-ind-002",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-10T08:00:00.000Z",
    "endDate": "2026-10-12T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-037-item-1",
        "bookingId": "res-037",
        "vehicleId": "veh-008",
        "startDate": "2026-10-10T08:00:00.000Z",
        "endDate": "2026-10-12T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  },
    {
    "id": "res-038",
    "bookingNumber": "RES-2609-038",
    "customerId": "cust-ind-003",
    "rentalType": "SELF_DRIVE",
    "totalAmount": 1500000,
    "deposit": 500000,
    "remainingAmount": 1000000,
    "status": "CONTRACTED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-11T08:00:00.000Z",
    "endDate": "2026-10-13T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-038-item-1",
        "bookingId": "res-038",
        "vehicleId": "veh-009",
        "startDate": "2026-10-11T08:00:00.000Z",
        "endDate": "2026-10-13T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 750000,
        "subtotal": 1500000
      }
    ]
  },
    {
    "id": "res-039",
    "bookingNumber": "RES-2609-039",
    "customerId": "cust-ind-004",
    "rentalType": "WITH_DRIVER",
    "totalAmount": 2500000,
    "deposit": 500000,
    "remainingAmount": 2000000,
    "status": "BOOKED",
    "createdAt": "2026-09-01T12:00:00.000Z",
    "updatedAt": "2026-09-02T12:00:00.000Z",
    "startDate": "2026-10-12T08:00:00.000Z",
    "endDate": "2026-10-14T08:00:00.000Z",
    "duration": 2,
    "rateType": "DAILY",
    "items": [
      {
        "id": "res-039-item-1",
        "bookingId": "res-039",
        "vehicleId": "veh-010",
        "startDate": "2026-10-12T08:00:00.000Z",
        "endDate": "2026-10-14T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "rateSnapshot": 1250000,
        "subtotal": 2500000
      }
    ]
  }
];
