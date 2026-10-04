import { MonitoringFeature } from '@/features/modules/rental/monitoring/MonitoringFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monitoring Armada',
  description: 'Pantau sisa waktu sewa dan armada yang terlambat kembali',
};

export default function MonitoringPage() {
  return <MonitoringFeature />;
}
