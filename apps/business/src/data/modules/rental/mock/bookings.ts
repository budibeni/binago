import type { Booking } from '@/features/modules/rental/bookings/types/booking';

export const mockBookings: Booking[] = [
  {
    "id": "res-001",
    "bookingNumber": "RES-2608-001",
    "customerId": "cust-ind-001",
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
        "id": "res-001-item-1",
        "bookingId": "res-001",
        "vehicleId": "veh-001",
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
        "id": "res-002-item-1",
        "bookingId": "res-002",
        "vehicleId": "veh-002",
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
    "status": "CONFIRMED",
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
    "status": "CONFIRMED",
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
    "status": "CONFIRMED",
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
    "status": "PENDING",
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
    "status": "CONFIRMED",
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
  }
];
