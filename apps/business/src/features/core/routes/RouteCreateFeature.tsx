'use client';

import React from 'react';
import { RouteFeature } from './RouteFeature';
import { useBusinessLocale } from '@/components/BusinessShellLayout';

export function RouteCreateFeature() {
  const locale = useBusinessLocale();
  return <RouteFeature locale={locale} initialView="create" />;
}
