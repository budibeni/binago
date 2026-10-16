import type {
  GeofenceAttendanceRecord,
  GeofenceAttendanceStats,
} from '@/features/modules/activity/driver/geofence-attendance/types/geofenceAttendance';
import { geofenceAttendanceRepository } from '../../repositories/driver/geofenceAttendanceRepository';

class GeofenceAttendanceService {
  /** Ambil semua data absensi geofence (sorted terbaru lebih dulu) */
  getAll(): GeofenceAttendanceRecord[] {
    return geofenceAttendanceRepository.getAll().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /** Ambil rekap spesifik berdasarkan ID */
  getById(id: string): GeofenceAttendanceRecord | undefined {
    return geofenceAttendanceRepository.getById(id);
  }

  /** Ambil statistik rekap untuk ringkasan di atas tabel */
  getStats(): GeofenceAttendanceStats {
    const records = geofenceAttendanceRepository.getAll();
    const total = records.length;
    const todayStr = '2026-10-16'; // Tanggal aktif sistem
    const today = records.filter((r) => r.date === todayStr).length;
    const verifiedInside = records.filter((r) => r.isWithinGeofence).length;
    const outsideWarning = records.filter((r) => !r.isWithinGeofence).length;

    const uniqueGeofences = new Set(records.map((r) => r.geofenceId)).size;

    return {
      total,
      today,
      verifiedInside,
      outsideWarning,
      uniqueGeofences,
    };
  }

  /** Catat presensi Geofence baru dari driver portal */
  recordAttendance(data: {
    driverId?: string;
    driverName: string;
    driverPhone?: string;
    vehiclePlate: string;
    vehicleModel?: string;
    geofenceId?: string;
    geofenceName: string;
    geofenceCategory?: string;
    locationAddress: string;
    coordinates: { lat: number; lng: number };
    distanceMeters: number;
    photoDataUri: string;
    notes?: string;
  }): GeofenceAttendanceRecord {
    const now = new Date();
    const count = geofenceAttendanceRepository.count();
    const id = `GA-${now.getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const newRecord: GeofenceAttendanceRecord = {
      id,
      driverId: data.driverId || `DRV-${String(count + 1).padStart(3, '0')}`,
      driverName: data.driverName,
      driverPhone: data.driverPhone || '0812-0000-2222',
      vehiclePlate: data.vehiclePlate,
      vehicleModel: data.vehicleModel || 'Armada Operasional',
      geofenceId: data.geofenceId || 'geo-custom',
      geofenceName: data.geofenceName,
      geofenceCategory: data.geofenceCategory || 'Geofence',
      date: dateStr,
      timestamp: now.toISOString(),
      locationAddress: data.locationAddress,
      coordinates: data.coordinates,
      distanceMeters: data.distanceMeters,
      isWithinGeofence: data.distanceMeters <= 100,
      photo: data.photoDataUri,
      notes: data.notes,
    };

    return geofenceAttendanceRepository.add(newRecord);
  }

  /** Subscribe ke perubahan data */
  subscribe(listener: () => void): () => void {
    return geofenceAttendanceRepository.subscribe(listener);
  }
}

export const geofenceAttendanceService = new GeofenceAttendanceService();
