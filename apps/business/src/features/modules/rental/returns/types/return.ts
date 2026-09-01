import type { RentalContract } from '../../contracts/types/contract';
import type { Customer } from '../../customers/types/customer';
import type { RentalVehicle } from '../../vehicles/types/rentalVehicle';
import type { RentalHandover } from '../../handover/types/handover';

export interface RentalReturn {
  id: string;
  contractId: string;
  customerId: string;
  vehicleId: string; // CORE Vehicle ID (e.g. 'veh-001')
  
  returnedAt: string;
  
  returnLatitude?: number;
  returnLongitude?: number;
  returnAddress?: string;

  odometerEnd: number;
  fuelLevelEnd: RentalHandover['fuelLevel'];
  vehicleConditionEnd: RentalHandover['vehicleCondition'];
  
  equipmentChecklistEnd: RentalHandover['equipmentChecklist'];

  damageNotes?: string;
  
  additionalCharges?: number;
  lateFee?: number;
  damageFee?: number;

  notes?: string;

  staffId: string;
  staffName: string;

  createdAt: string;
  updatedAt: string;

  // Populated relations
  contract?: RentalContract;
  customer?: Customer;
  vehicle?: RentalVehicle;
  handover?: RentalHandover;
}
