'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const GeofenceEdit = dynamic(
  () =>
    import('../../../../../features/core/geofences/GeofenceEditFeature').then(
      (mod) => mod.GeofenceEditFeature,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100dvh-52px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-foreground-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm">Memuat editor geofence...</p>
        </div>
      </div>
    ),
  },
);

export default function EditGeofencePage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  return <GeofenceEdit id={id} />;
}
