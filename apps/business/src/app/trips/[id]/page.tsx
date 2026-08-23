import React from 'react';
import { TripDetailFeature } from '@/features/trips/TripDetailFeature';

interface TripDetailPageProps {
  params: { id: string };
}

export default function TripDetailPage({ params }: TripDetailPageProps) {
  return <TripDetailFeature id={params.id} />;
}
