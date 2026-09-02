import type { OperationalSchedule } from '@/features/modules/transport/schedules/types/schedule';
import { mockOperationalSchedules } from '../mock/schedules';

export interface OperationalScheduleRepository {
  getAll(): OperationalSchedule[];
  getById(id: string): OperationalSchedule | undefined;
  add(schedule: OperationalSchedule): void;
  update(id: string, updates: Partial<OperationalSchedule>): void;
  remove(id: string): void;
}

class MockOperationalScheduleRepository implements OperationalScheduleRepository {
  private schedules: OperationalSchedule[];

  constructor() {
    this.schedules = [...mockOperationalSchedules];
  }

  getAll(): OperationalSchedule[] {
    return this.schedules;
  }

  getById(id: string): OperationalSchedule | undefined {
    return this.schedules.find((s) => s.id === id);
  }

  add(schedule: OperationalSchedule): void {
    this.schedules.push(schedule);
  }

  update(id: string, updates: Partial<OperationalSchedule>): void {
    const index = this.schedules.findIndex(s => s.id === id);
    if (index !== -1) {
      this.schedules[index] = { ...this.schedules[index], ...updates };
    }
  }

  remove(id: string): void {
    this.schedules = this.schedules.filter(s => s.id !== id);
  }
}

export const operationalScheduleRepository: OperationalScheduleRepository = new MockOperationalScheduleRepository();
