'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DriverEditFeature } from '../../../../../features/core/drivers/DriverEditFeature';

export default function EditDriverPage() {
  const params = useParams();
  const id = params.id as string;

  return <DriverEditFeature id={id} />;
}
