import type { Metadata } from 'next';
import { DevicesFeature } from '../../../features/core/devices/DevicesFeature';

export const metadata: Metadata = {
  title: 'Perangkat GPS & Smartphone - ADATRACK Business',
  description: 'Kelola perangkat pelacak GPS fisik dan aplikasi tracking smartphone driver.',
};

export default function GPSDevicesPage() {
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <DevicesFeature />
    </div>
  );
}
