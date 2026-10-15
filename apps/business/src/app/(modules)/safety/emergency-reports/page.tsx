import { Metadata } from 'next';
import { EmergencyReportsFeature } from '@/features/modules/safety/emergency-reports/EmergencyReportsFeature';

export const metadata: Metadata = {
  title: 'Laporan Darurat - ADATRACK Business',
  description: 'Pantau dan tangani laporan darurat dari pengemudi secara real-time.',
};

export default function EmergencyReportsPage() {
  return <EmergencyReportsFeature />;
}
