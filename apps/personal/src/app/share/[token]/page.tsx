import React from 'react';
import type { Metadata } from 'next';
import { PublicLocationPage } from '@/features/sharing/components/PublicLocationPage';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Berbagi Lokasi - ADATRACK',
    description: 'Lihat lokasi kendaraan yang dibagikan secara langsung.',
    robots: { index: false, follow: false },
  };
}

export default function ShareTokenPage({ params }: { params: { token: string } }) {
  return <PublicLocationPage token={params.token} />;
}
