import type {
  EmergencyReport,
  EmergencyStatus,
} from '@/features/modules/activity/emergency-reports/types/emergencyReport';
import { emergencyReportRepository } from '../repositories/emergencyReportRepository';

class EmergencyReportService {
  /** Ambil semua laporan (sorted terbaru dulu) */
  getAll(): EmergencyReport[] {
    return emergencyReportRepository.getAll().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /** Ambil laporan berdasarkan ID */
  getById(id: string): EmergencyReport | undefined {
    return emergencyReportRepository.getById(id);
  }

  /** Hitung laporan dengan status 'baru' */
  countNew(): number {
    return emergencyReportRepository.getAll().filter((r) => r.status === 'baru').length;
  }

  /** Tambah laporan baru dari driver portal */
  add(report: Omit<EmergencyReport, 'id' | 'status'>): EmergencyReport {
    const count = emergencyReportRepository.count();
    const newReport: EmergencyReport = {
      ...report,
      id: `ER-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`,
      status: 'baru',
    };
    return emergencyReportRepository.add(newReport);
  }

  /** Update status laporan & append catatan ke activity log */
  updateStatus(
    id: string,
    status: EmergencyStatus,
    meta?: { handledBy?: string; note?: string; notes?: string }
  ): void {
    emergencyReportRepository.updateStatus(id, status, meta);
  }

  /** Subscribe ke perubahan store */
  subscribe(listener: () => void): () => void {
    return emergencyReportRepository.subscribe(listener);
  }
}

export const emergencyReportService = new EmergencyReportService();
