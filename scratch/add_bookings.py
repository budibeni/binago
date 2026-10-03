import json

new_bookings = []
for i in range(16, 40):
    status = "CONFIRMED" if i % 3 != 0 else ("ACTIVE" if i % 2 == 0 else "PENDING")
    
    booking = {
        "id": f"res-{str(i).zfill(3)}",
        "bookingNumber": f"RES-2609-{str(i).zfill(3)}",
        "customerId": f"cust-ind-{str((i%6)+1).zfill(3)}",
        "rentalType": "SELF_DRIVE" if i % 2 == 0 else "WITH_DRIVER",
        "totalAmount": 1500000 if i % 2 == 0 else 2500000,
        "deposit": 500000,
        "remainingAmount": 1000000 if i % 2 == 0 else 2000000,
        "status": status,
        "createdAt": "2026-09-01T12:00:00.000Z",
        "updatedAt": "2026-09-02T12:00:00.000Z",
        "startDate": f"2026-10-{str((i%28)+1).zfill(2)}T08:00:00.000Z",
        "endDate": f"2026-10-{str((i%28)+3).zfill(2)}T08:00:00.000Z",
        "duration": 2,
        "rateType": "DAILY",
        "items": [
            {
                "id": f"res-{str(i).zfill(3)}-item-1",
                "bookingId": f"res-{str(i).zfill(3)}",
                "vehicleId": f"veh-{str((i%15)+1).zfill(3)}",
                "startDate": f"2026-10-{str((i%28)+1).zfill(2)}T08:00:00.000Z",
                "endDate": f"2026-10-{str((i%28)+3).zfill(2)}T08:00:00.000Z",
                "duration": 2,
                "rateType": "DAILY",
                "rateSnapshot": 750000 if i % 2 == 0 else 1250000,
                "subtotal": 1500000 if i % 2 == 0 else 2500000
            }
        ]
    }
    new_bookings.append(booking)

with open('apps/business/src/data/modules/rental/mock/bookings.ts', 'r') as f:
    content = f.read()

# Replace the last ]; with the new data + ];
json_str = ",\n  " + ",\n  ".join([json.dumps(b, indent=2) for b in new_bookings]).replace('\n', '\n  ')
content = content.replace('\n];\n', f'{json_str}\n];\n')

with open('apps/business/src/data/modules/rental/mock/bookings.ts', 'w') as f:
    f.write(content)

