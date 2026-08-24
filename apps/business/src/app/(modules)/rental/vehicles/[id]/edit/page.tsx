'use client';

import React from 'react';
import { EditRentalVehicleFeature } from '@/features/modules/rental/vehicles/EditRentalVehicleFeature';

interface EditRentalVehiclePageProps {
  params: {
    id: string;
  };
}

export default function EditRentalVehiclePage({ params }: EditRentalVehiclePageProps) {
  return <EditRentalVehicleFeature id={params.id} />;
}
