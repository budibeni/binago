import type {
  ArrivalReportRecord,
  ArrivalStatus,
} from '@/features/modules/activity/driver/arrival-reports/types/arrivalReport';
import { SEED_ARRIVAL_REPORTS } from '../../mock/driver/arrivalReportsMock';

class ArrivalReportRepository {
  private records: ArrivalReportRecord[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.records = [...SEED_ARRIVAL_REPORTS];
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  getAll(): ArrivalReportRecord[] {
    return [...this.records];
  }

  getById(id: string): ArrivalReportRecord | undefined {
    return this.records.find((r) => r.id === id);
  }

  add(record: ArrivalReportRecord): ArrivalReportRecord {
    this.records = [record, ...this.records];
    this.notify();
    return record;
  }

  updateStatus(id: string, status: ArrivalStatus): ArrivalReportRecord | undefined {
    const index = this.records.findIndex((r) => r.id === id);
    if (index === -1) return undefined;

    this.records[index] = { ...this.records[index], status };
    this.notify();
    return this.records[index];
  }

  update(id: string, updates: Partial<ArrivalReportRecord>): ArrivalReportRecord | undefined {
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

export const arrivalReportRepository = new ArrivalReportRepository();
