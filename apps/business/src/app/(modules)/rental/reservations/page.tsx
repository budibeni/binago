import { Metadata } from 'next';
import { ReservationsFeature } from '@/features/modules/rental/reservations/ReservationsFeature';

export const metadata: Metadata = {
  title: 'Reservasi Rental - ADATRACK Business',
  description: 'Kelola pemesanan kendaraan dan reservasi rental Anda.',
};

export default function ReservationsPage() {
  return <ReservationsFeature />;
}
