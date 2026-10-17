'use client';

import React from 'react';
import { GeofenceFeature } from './GeofenceFeature';
import { useBusinessLocale } from '@/components/BusinessShellLayout';

export function GeofenceCreateFeature() {
  const locale = useBusinessLocale();
  return <GeofenceFeature locale={locale as 'id' | 'en'} initialView="create" />;
}
