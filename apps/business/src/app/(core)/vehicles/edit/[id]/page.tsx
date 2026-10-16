'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { VehicleEditFeature } from '../../../../../features/core/vehicles/VehicleEditFeature';

export default function EditVehiclePage() {
  const params = useParams();
  const id = params.id as string;

  return <VehicleEditFeature id={id} />;
}
