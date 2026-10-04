import { ReportsFeature } from '@/features/modules/rental/productivity/ProductivityReportFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laporan Rental',
  description: 'Laporan utilisasi dan produktivitas armada rental',
};

export default function ReportsPage() {
  return <ReportsFeature />;
}
