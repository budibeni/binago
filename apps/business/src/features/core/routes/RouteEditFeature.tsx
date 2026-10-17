'use client';

import React from 'react';
import { RouteFeature } from './RouteFeature';
import { useBusinessLocale } from '@/components/BusinessShellLayout';

interface RouteEditFeatureProps {
  id: string;
}

export function RouteEditFeature({ id }: RouteEditFeatureProps) {
  const locale = useBusinessLocale();
  return (
    <RouteFeature
      locale={locale}
      initialView="edit"
      initialRouteId={id}
    />
  );
}
