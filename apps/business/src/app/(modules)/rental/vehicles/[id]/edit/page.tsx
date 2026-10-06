'use client';

import React from 'react';
import { RentalVehicleEditFeature } from '@/features/modules/rental/vehicles/RentalVehicleEditFeature';

interface EditRentalVehiclePageProps {
  params: {
    id: string;
  };
}

export default function EditRentalVehiclePage({ params }: EditRentalVehiclePageProps) {
  return <RentalVehicleEditFeature id={params.id} />;
}
