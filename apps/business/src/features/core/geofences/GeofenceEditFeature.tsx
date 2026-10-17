'use client';

import React from 'react';
import { GeofenceFeature } from './GeofenceFeature';
import { useBusinessLocale } from '@/components/BusinessShellLayout';

interface GeofenceEditFeatureProps {
  id: string;
}

export function GeofenceEditFeature({ id }: GeofenceEditFeatureProps) {
  const locale = useBusinessLocale();
  return (
    <GeofenceFeature
      locale={locale as 'id' | 'en'}
      initialView="edit"
      initialGeofenceId={id}
    />
  );
}
