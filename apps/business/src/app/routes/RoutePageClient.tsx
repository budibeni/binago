'use client';

import React from 'react';
import { RouteFeature } from '../../features/routes/RouteFeature';
import { useBusinessLocale } from '../../components/BusinessShellLayout';

export function RoutePageClient() {
  const locale = useBusinessLocale();
  return <RouteFeature locale={locale as 'id' | 'en'} />;
}
