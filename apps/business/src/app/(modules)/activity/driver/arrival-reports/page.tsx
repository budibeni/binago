import type { Metadata } from 'next';
import { ArrivalReportsFeature } from '@/features/modules/activity/driver/arrival-reports/ArrivalReportsFeature';

export const metadata: Metadata = {
  title: 'Laporan Tiba di Tujuan - Aktivitas Pengemudi | ADATRACK Business',
  description: 'Rekapitulasi dan pemantauan laporan kedatangan armada di lokasi tujuan pengiriman, bukti foto selfie watermark dan koordinat GPS.',
};

export default function ArrivalReportsPage() {
  return <ArrivalReportsFeature />;
}
