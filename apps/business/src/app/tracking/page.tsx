import type { Metadata } from 'next';
import { TrackingFeature } from '../../features/tracking/TrackingFeature';

export const metadata: Metadata = {
  title: 'Pemantauan - ADATRACK Business',
  description: 'Pantau armada kendaraan Anda secara real-time di satu layar.',
};

export default function TrackingPage() {
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <TrackingFeature />
    </div>
  );
}
