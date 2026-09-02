import type { PassengerEvent } from '@/features/modules/transport/passenger-events/types/passengerEvent';
import { mockPassengerEvents } from '../mock/passengerEvents';

class PassengerEventRepository {
  private events: PassengerEvent[];

  constructor() {
    this.events = [...mockPassengerEvents];
  }

  getAll(): PassengerEvent[] {
    return this.events;
  }

  getByDepartureId(departureId: string): PassengerEvent[] {
    return this.events.filter(e => e.departureId === departureId);
  }
  
  getByVehicleId(vehicleId: string): PassengerEvent[] {
    return this.events.filter(e => e.vehicleId === vehicleId);
  }

  add(event: PassengerEvent): void {
    this.events.push(event);
  }
}

export const passengerEventRepository = new PassengerEventRepository();
