import type {
  EmergencyReport,
  EmergencyStatus,
} from '@/features/modules/activity/emergency-reports/types/emergencyReport';
import { SEED_EMERGENCY_REPORTS } from '../mock/emergencyReportsMock';

class EmergencyReportRepository {
  private reports: EmergencyReport[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.reports = [...SEED_EMERGENCY_REPORTS];
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  getAll(): EmergencyReport[] {
    return [...this.reports];
  }

  getById(id: string): EmergencyReport | undefined {
    return this.reports.find((r) => r.id === id);
  }

  add(report: EmergencyReport): EmergencyReport {
    this.reports = [report, ...this.reports];
    this.notify();
    return report;
  }

  update(id: string, updates: Partial<EmergencyReport>): EmergencyReport | undefined {
    const index = this.reports.findIndex((r) => r.id === id);
    if (index === -1) return undefined;

    this.reports[index] = { ...this.reports[index], ...updates };
    this.notify();
    return this.reports[index];
  }

  updateStatus(
    id: string,
    status: EmergencyStatus,
    meta?: { handledBy?: string; note?: string; notes?: string }
  ): EmergencyReport | undefined {
    const index = this.reports.findIndex((r) => r.id === id);
    if (index === -1) return undefined;

    const r = this.reports[index];
    const now = new Date().toISOString();
    const author = meta?.handledBy || 'Super Admin';
    const noteContent = (meta?.note || meta?.notes || '').trim();

    const newActivityLog = [...(r.activityLog || [])];
    if (noteContent) {
      newActivityLog.push({
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        author,
        content: noteContent,
      });
    }

    let handledAt = r.handledAt;
    if (status === 'ditangani' && !handledAt) {
      handledAt = now;
    }

    let resolvedAt = r.resolvedAt;
    if (status === 'selesai' && !resolvedAt) {
      resolvedAt = now;
    } else if (status !== 'selesai' && r.status === 'selesai') {
      resolvedAt = undefined;
    }

    const updated: EmergencyReport = {
      ...r,
      status,
      handledBy: author,
      activityLog: newActivityLog,
      notes: noteContent || r.notes,
      handledAt,
      resolvedAt,
    };

    this.reports[index] = updated;
    this.notify();
    return updated;
  }

  count(): number {
    return this.reports.length;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const emergencyReportRepository = new EmergencyReportRepository();
