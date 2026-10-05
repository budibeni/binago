'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookingCreateFeature } from '@/features/modules/rental/bookings/BookingCreateFeature';

export default function CreateBookingPage() {
  const router = useRouter();

  return (
    <BookingCreateFeature
      open={true}
      onOpenChange={(open) => {
        if (!open) router.push('/rental/bookings');
      }}
      onSuccess={() => {
        router.push('/rental/bookings');
      }}
    />
  );
}
