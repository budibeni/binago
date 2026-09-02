import type { Departure } from '@/features/modules/transport/departures/types/departure';
import { mockDepartures } from '../mock/departures';

export interface DepartureRepository {
  getAll(): Departure[];
  getById(id: string): Departure | undefined;
  getByScheduleId(scheduleId: string): Departure[];
  add(departure: Departure): void;
  update(id: string, updates: Partial<Departure>): void;
}

class MockDepartureRepository implements DepartureRepository {
  private departures: Departure[];

  constructor() {
    this.departures = [...mockDepartures];
  }

  getAll(): Departure[] {
    return this.departures;
  }

  getById(id: string): Departure | undefined {
    return this.departures.find((d) => d.id === id);
  }

  getByScheduleId(scheduleId: string): Departure[] {
    return this.departures.filter((d) => d.scheduleId === scheduleId);
  }

  add(departure: Departure): void {
    this.departures.push(departure);
  }

  update(id: string, updates: Partial<Departure>): void {
    const index = this.departures.findIndex(d => d.id === id);
    if (index !== -1) {
      this.departures[index] = { ...this.departures[index], ...updates };
    }
  }
}

export const departureRepository: DepartureRepository = new MockDepartureRepository();
