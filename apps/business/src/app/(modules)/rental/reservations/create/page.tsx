import { Metadata } from 'next';
import { ReservationCreateFeature } from '@/features/modules/rental/reservations/ReservationCreateFeature';

export const metadata: Metadata = {
  title: 'Buat Reservasi - ADATRACK Business',
  description: 'Buat reservasi kendaraan rental baru.',
};

export default function ReservationCreatePage() {
  return <ReservationCreateFeature />;
}
