import type {
  TaskAttendanceRecord,
  TaskAttendanceStats,
} from '@/features/modules/activity/task-attendance/types/taskAttendance';
import { taskAttendanceRepository } from '../repositories/taskAttendanceRepository';

class TaskAttendanceService {
  /** Ambil semua rekap absensi tugas (sorted terbaru lebih dulu) */
  getAll(): TaskAttendanceRecord[] {
    return taskAttendanceRepository.getAll().sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  /** Ambil record spesifik berdasarkan ID */
  getById(id: string): TaskAttendanceRecord | undefined {
    return taskAttendanceRepository.getById(id);
  }

  /** Ambil statistik rekap untuk ringkasan di atas tabel */
  getStats(): TaskAttendanceStats {
    const records = taskAttendanceRepository.getAll();
    const total = records.length;
    const completed = records.filter((r) => r.status === 'completed').length;
    const inProgress = records.filter((r) => r.status === 'in_progress').length;

    const completedRecords = records.filter(
      (r) => r.status === 'completed' && r.durationMinutes
    );
    const avgDurationMinutes =
      completedRecords.length > 0
        ? Math.round(
            completedRecords.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0) /
              completedRecords.length
          )
        : 0;

    return {
      total,
      completed,
      inProgress,
      avgDurationMinutes,
    };
  }

  /** Tambah presensi Mulai Tugas (Check-in) baru */
  recordCheckIn(data: {
    driverId?: string;
    driverName: string;
    driverPhone?: string;
    vehiclePlate: string;
    vehicleModel?: string;
    address: string;
    coordinates: { lat: number; lng: number };
    distanceMeters: number;
    photoDataUri: string;
    notes?: string;
  }): TaskAttendanceRecord {
    const now = new Date();
    const count = taskAttendanceRepository.count();
    const id = `TA-${now.getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const newRecord: TaskAttendanceRecord = {
      id,
      driverId: data.driverId || `DRV-${String(count + 1).padStart(3, '0')}`,
      driverName: data.driverName,
      driverPhone: data.driverPhone || '0812-0000-1111',
      vehiclePlate: data.vehiclePlate,
      vehicleModel: data.vehicleModel || 'Armada Operasional',
      date: dateStr,
      startTime: now.toISOString(),
      startLocation: {
        address: data.address,
        coordinates: data.coordinates,
        distanceMeters: data.distanceMeters,
        isNearVehicle: data.distanceMeters <= 200,
      },
      startPhoto: data.photoDataUri,
      status: 'in_progress',
      notes: data.notes,
    };

    return taskAttendanceRepository.add(newRecord);
  }

  /** Catat presensi Selesai Tugas (Check-out) untuk driver */
  recordCheckOut(
    id: string,
    data: {
      address: string;
      coordinates: { lat: number; lng: number };
      distanceMeters: number;
      photoDataUri: string;
      notes?: string;
    }
  ): TaskAttendanceRecord | undefined {
    const existing = taskAttendanceRepository.getById(id);
    if (!existing) return undefined;

    const now = new Date();
    const startTimeMs = new Date(existing.startTime).getTime();
    const endTimeMs = now.getTime();
    const durationMinutes = Math.max(1, Math.round((endTimeMs - startTimeMs) / (1000 * 60)));

    return taskAttendanceRepository.update(id, {
      endTime: now.toISOString(),
      durationMinutes,
      endLocation: {
        address: data.address,
        coordinates: data.coordinates,
        distanceMeters: data.distanceMeters,
        isNearVehicle: data.distanceMeters <= 200,
      },
      endPhoto: data.photoDataUri,
      status: 'completed',
      notes: data.notes || existing.notes,
    });
  }

  /** Subscribe ke perubahan data */
  subscribe(listener: () => void): () => void {
    return taskAttendanceRepository.subscribe(listener);
  }
}

export const taskAttendanceService = new TaskAttendanceService();
