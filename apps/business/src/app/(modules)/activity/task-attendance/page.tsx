import type { Metadata } from 'next';
import { TaskAttendanceFeature } from '@/features/modules/activity/task-attendance/TaskAttendanceFeature';

export const metadata: Metadata = {
  title: 'Absensi Tugas - Aktivitas Pengemudi | ADATRACK Business',
  description: 'Rekapitulasi pasangan presensi Mulai dan Selesai Tugas pengemudi, verifikasi foto selfie watermark dan lokasi.',
};

export default function TaskAttendancePage() {
  return <TaskAttendanceFeature />;
}
