import type { Metadata } from 'next';
import { VehicleCreateFeature } from '../../../../features/core/vehicles/VehicleCreateFeature';

export const metadata: Metadata = {
  title: 'Tambah Kendaraan - ADATRACK Business',
  description: 'Daftarkan kendaraan baru ke dalam sistem telemetri bisnis Anda.',
};

export default function CreateVehiclePage() {
  return <VehicleCreateFeature />;
}
