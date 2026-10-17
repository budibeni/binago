'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const RouteEdit = dynamic(
  () =>
    import('../../../../../features/core/routes/RouteEditFeature').then(
      (mod) => mod.RouteEditFeature,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100dvh-52px)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-foreground-muted">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm">Memuat visual route builder...</p>
        </div>
      </div>
    ),
  },
);

export default function EditRoutePage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  return <RouteEdit id={id} />;
}
