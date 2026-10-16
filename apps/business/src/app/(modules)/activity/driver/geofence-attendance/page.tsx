import type { Metadata } from 'next';
import { GeofenceAttendanceFeature } from '@/features/modules/activity/driver/geofence-attendance/GeofenceAttendanceFeature';

export const metadata: Metadata = {
  title: 'Absen Geofence - Aktivitas Pengemudi | ADATRACK Business',
  description: 'Rekapitulasi dan verifikasi presensi lokasi titik geofence pengemudi, selfie watermark, dan validasi radius koordinat.',
};

export default function GeofenceAttendancePage() {
  return <GeofenceAttendanceFeature />;
}
