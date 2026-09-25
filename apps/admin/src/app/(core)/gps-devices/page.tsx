import { GpsDevicesFeature } from '@/features/core/gps/GpsDevicesFeature';

export default function GpsDevicesPage() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <GpsDevicesFeature locale="id" />
    </div>
  );
}
