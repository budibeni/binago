import { Metadata } from 'next';
import { BookingsFeature } from '@/features/modules/rental/bookings/BookingsFeature';

export const metadata: Metadata = {
  title: 'Booking Rental - ADATRACK Business',
  description: 'Kelola pemesanan kendaraan dan reservasi rental Anda.',
};

export default function BookingsPage() {
  return <BookingsFeature />;
}
