import type { Metadata } from 'next';
import { DriverCreateFeature } from '../../../../features/core/drivers/DriverCreateFeature';

export const metadata: Metadata = {
  title: 'Tambah Pengemudi - ADATRACK Business',
  description: 'Daftarkan pengemudi baru ke dalam sistem telemetri bisnis Anda.',
};

export default function CreateDriverPage() {
  return <DriverCreateFeature />;
}
