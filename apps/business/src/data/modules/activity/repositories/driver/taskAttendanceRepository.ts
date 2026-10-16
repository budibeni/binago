import type { TaskAttendanceRecord } from '@/features/modules/activity/driver/task-attendance/types/taskAttendance';
import { SEED_TASK_ATTENDANCE } from '../../mock/driver/taskAttendanceMock';

class TaskAttendanceRepository {
  private records: TaskAttendanceRecord[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.records = [...SEED_TASK_ATTENDANCE];
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  getAll(): TaskAttendanceRecord[] {
    return [...this.records];
  }

  getById(id: string): TaskAttendanceRecord | undefined {
    return this.records.find((r) => r.id === id);
  }

  add(record: TaskAttendanceRecord): TaskAttendanceRecord {
    this.records = [record, ...this.records];
    this.notify();
    return record;
  }

  update(id: string, updates: Partial<TaskAttendanceRecord>): TaskAttendanceRecord | undefined {
    const index = this.records.findIndex((r) => r.id === id);
    if (index === -1) return undefined;

    this.records[index] = { ...this.records[index], ...updates };
    this.notify();
    return this.records[index];
  }

  count(): number {
    return this.records.length;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const taskAttendanceRepository = new TaskAttendanceRepository();
