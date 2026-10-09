import type { BookingItem, Booking } from '../../bookings/types/booking';

export interface ReturnPayload {
  contractId: string;
  bookingItemId: string;
  vehicleId: string;
  
  returnDate: string;
  
  returnLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  returnOdometer: number;
  
  returnCondition: {
    fuelLevel: string;
    vehicleCondition: string;
    equipmentChecklist: Record<string, boolean>;
    notes?: string;
    damageNotes?: string;
    staffName?: string;
  };
  
  extraCharges?: number;
  lateFee?: number;
  damageFee?: number;
}
