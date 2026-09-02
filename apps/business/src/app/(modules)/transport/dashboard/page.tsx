import { TransportDashboardFeature } from '@/features/modules/transport/dashboard/TransportDashboardFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transport Dashboard - ADATRACK',
  description: 'Transport operational dashboard and analytics',
};

export default function TransportDashboardPage() {
  return <TransportDashboardFeature />;
}
