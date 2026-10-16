import type { GeofenceAttendanceRecord } from '@/features/modules/activity/driver/geofence-attendance/types/geofenceAttendance';
import { SEED_GEOFENCE_ATTENDANCE } from '../../mock/driver/geofenceAttendanceMock';

class GeofenceAttendanceRepository {
  private records: GeofenceAttendanceRecord[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.records = [...SEED_GEOFENCE_ATTENDANCE];
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  getAll(): GeofenceAttendanceRecord[] {
    return [...this.records];
  }

  getById(id: string): GeofenceAttendanceRecord | undefined {
    return this.records.find((r) => r.id === id);
  }

  add(record: GeofenceAttendanceRecord): GeofenceAttendanceRecord {
    this.records = [record, ...this.records];
    this.notify();
    return record;
  }

  update(id: string, updates: Partial<GeofenceAttendanceRecord>): GeofenceAttendanceRecord | undefined {
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

export const geofenceAttendanceRepository = new GeofenceAttendanceRepository();
