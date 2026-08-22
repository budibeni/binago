'use client';

import React from 'react';
import { GeofenceFeature } from '../../features/geofences/GeofenceFeature';
import { useBusinessLocale } from '../../components/BusinessShellLayout';

export function GeofencePageClient() {
  const locale = useBusinessLocale();
  // Map app-level Locale ('id'|'en') → GeofenceLocale ('id'|'en') – same values, cast safe
  return <GeofenceFeature locale={locale as 'id' | 'en'} />;
}
