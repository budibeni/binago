import type { Metadata } from 'next';
import { VehiclesFeature } from '../../features/vehicles/VehiclesFeature';

export const metadata: Metadata = {
  title: 'Armada â€” ADATRACK Business',
  description: 'Kelola armada kendaraan, grup, dan operasional bisnis Anda.',
};

export default function VehiclesPage() {
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <VehiclesFeature />
    </div>
  );
}
