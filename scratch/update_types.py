with open('apps/business/src/features/modules/rental/bookings/types/booking.ts', 'r') as f:
    content = f.read()

old_return_fields = """  returnDate?: string;
  returnBy?: string; // UUID of admin
  returnOdometer?: number;
  returnCondition?: Record<string, any>;
  extraCharges?: number;"""

new_return_fields = """  returnNumber?: string;
  returnDate?: string;
  returnBy?: string; // UUID of admin
  returnOdometer?: number;
  returnLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  returnCondition?: {
    fuelLevel: string;
    vehicleCondition: string;
    equipmentChecklist: Record<string, boolean>;
    notes?: string;
    damageNotes?: string;
    staffName?: string;
  };
  extraCharges?: number;
  lateFee?: number;
  damageFee?: number;"""

content = content.replace(old_return_fields, new_return_fields)

with open('apps/business/src/features/modules/rental/bookings/types/booking.ts', 'w') as f:
    f.write(content)
