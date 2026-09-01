import type { Customer } from '../../customers/types/customer';
import type { RentalVehicle } from '../../vehicles/types/rentalVehicle';
import type { RentalContract } from '../../contracts/types/contract';


export interface RentalHandover {
  id: string;

  contractId: string;
  customerId: string;
  vehicleId: string; // CORE Vehicle ID (e.g. 'veh-001')

  contract?: RentalContract;
  customer?: Customer;
  vehicle?: RentalVehicle;

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
    stnk: boolean;
    spareTire: boolean;
    jack: boolean;
    toolkit: boolean;
    triangle: boolean;
    fireExtinguisher?: boolean;
    other?: boolean;
  };

  notes?: string;

  staffId?: string;
  staffName?: string;


  createdAt: string;
  updatedAt: string;
}
