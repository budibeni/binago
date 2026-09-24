import type { Metadata } from 'next';
import { GpsDevicesFeature } from '../../../features/core/gps/GpsDevicesFeature';

export const metadata: Metadata = {
  title: 'GPS Devices - ADATRACK Admin',
  description: 'Manage Enterprise GPS Inventory',
};

export default function GpsDevicesPage() {
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <GpsDevicesFeature />
    </div>
  );
}
