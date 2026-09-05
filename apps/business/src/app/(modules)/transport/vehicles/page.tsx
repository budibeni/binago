import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const VehiclesFeature = dynamic(
  () => import('../../../../features/core/vehicles/VehiclesFeature').then((mod) => mod.VehiclesFeature),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Armada Transport - ADATRACK Business',
  description: 'Kelola armada kendaraan untuk modul Transport.',
};

export default function TransportVehiclesPage() {
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <VehiclesFeature />
    </div>
  );
}
