import React, { Suspense } from 'react';
import { MonitoringPage } from '../features/tracking/components/MonitoringPage';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-surface" />}>
      <MonitoringPage />
    </Suspense>
  );
}
