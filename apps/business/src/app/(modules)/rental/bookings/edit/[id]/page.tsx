'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="p-8 text-center text-muted-foreground">
      Halaman Edit Booking (ID: {params.id}) belum diimplementasikan sepenuhnya.
      <br />
      <button 
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => router.push('/rental/bookings')}
      >
        Kembali
      </button>
    </div>
  );
}
