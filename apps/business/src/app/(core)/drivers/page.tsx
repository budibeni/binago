import type { Metadata } from 'next';
import { DriversFeature } from '../../../features/core/drivers/DriversFeature';

export const metadata: Metadata = {
  title: 'Pengemudi - ADATRACK Business',
  description: 'Kelola data pengemudi, lisensi berkendara, performa, dan riwayat penugasan kendaraan Anda.',
};

export default function DriversPage() {
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <DriversFeature />
    </div>
  );
}
