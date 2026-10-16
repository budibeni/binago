import type {
  ArrivalReportRecord,
  ArrivalReportStats,
  DestinationType,
  ArrivalStatus,
} from '@/features/modules/activity/driver/arrival-reports/types/arrivalReport';
import { arrivalReportRepository } from '../../repositories/driver/arrivalReportRepository';

class ArrivalReportService {
  /** Ambil semua laporan tiba (sorted terbaru lebih dulu) */
  getAll(): ArrivalReportRecord[] {
    return arrivalReportRepository.getAll().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /** Ambil rekap laporan tiba berdasarkan ID */
  getById(id: string): ArrivalReportRecord | undefined {
    return arrivalReportRepository.getById(id);
  }

  /** Ambil statistik rekap untuk ringkasan di atas tabel */
  getStats(): ArrivalReportStats {
    const records = arrivalReportRepository.getAll();
    const total = records.length;
    const todayStr = '2026-10-16'; // Tanggal aktif sistem
    const today = records.filter((r) => r.date === todayStr).length;
    const verified = records.filter((r) => r.status === 'verified').length;
    const pendingReview = records.filter((r) => r.status === 'pending_review').length;

    const uniqueDestinations = new Set(records.map((r) => r.destinationName)).size;

    return {
      total,
      today,
      verified,
      pendingReview,
      uniqueDestinations,
    };
  }

  /** Catat laporan tiba baru dari driver portal */
  recordArrival(data: {
    driverId?: string;
    driverName: string;
    driverPhone?: string;
    vehiclePlate: string;
    vehicleModel?: string;
    destinationName?: string;
    destinationType?: DestinationType;
    address: string;
    coordinates: { lat: number; lng: number };
    photoDataUri: string;
    recipientName?: string;
    notes?: string;
  }): ArrivalReportRecord {
    const now = new Date();
    const count = arrivalReportRepository.count();
    const id = `AR-${now.getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const newRecord: ArrivalReportRecord = {
      id,
      driverId: data.driverId || `DRV-${String(count + 1).padStart(3, '0')}`,
      driverName: data.driverName,
      driverPhone: data.driverPhone || '0812-0000-3333',
      vehiclePlate: data.vehiclePlate,
      vehicleModel: data.vehicleModel || 'Armada Logistik',
      destinationName: data.destinationName || 'Lokasi Tujuan Pengiriman',
      destinationType: data.destinationType || 'Gudang Klien',
      date: dateStr,
      timestamp: now.toISOString(),
      address: data.address,
      coordinates: data.coordinates,
      photo: data.photoDataUri,
      recipientName: data.recipientName || 'Petugas Penerima Lokasi',
      status: 'verified',
      notes: data.notes,
    };

    return arrivalReportRepository.add(newRecord);
  }

  /** Update status verifikasi laporan */
  updateStatus(id: string, status: ArrivalStatus): void {
    arrivalReportRepository.updateStatus(id, status);
  }

  /** Subscribe ke perubahan data */
  subscribe(listener: () => void): () => void {
    return arrivalReportRepository.subscribe(listener);
  }
}

export const arrivalReportService = new ArrivalReportService();
