import type { Customer } from '../../customers/types/customer';
import type { RentalVehicle } from '../../vehicles/types/rentalVehicle';
import type { RentalContract } from '../../contracts/types/contract';

export interface RentalHandover {
  id: string;
  handoverNumber: string;

  contractId: string;
  bookingItemId: string;
  customerId: string;
  vehicleId: string; // CORE Vehicle ID (e.g. 'veh-001')

  contract?: RentalContract;
  customer?: Customer;
  vehicle?: RentalVehicle;

  itemStatus?: 'PENDING' | 'IN_USE' | 'RETURNED' | 'CANCELLED';

  handoverAt: string;

  handoverLatitude: number;
  handoverLongitude: number;
  handoverAddress?: string;

  odometerStart: number;
  odometerSource?: 'VEHICLE' | 'TRACKING' | 'MANUAL';

  fuelLevel:
    | 'EMPTY'
    | 'QUARTER'
    | 'HALF'
    | 'THREE_QUARTER'
    | 'FULL';

  vehicleCondition:
    | 'GOOD'
    | 'MINOR_DAMAGE'
    | 'NEEDS_REPAIR';

  equipmentChecklist: {
    stnkOriginal?: boolean;
    spareKey?: boolean;
    jackAndTools?: boolean;
    spareTire?: boolean;
    firstAidKit?: boolean;
  };

  notes?: string;

  staffId: string;
  staffName?: string;
  createdAt?: string;
  updatedAt?: string;

  vehicleSnapshot?: any;
}
