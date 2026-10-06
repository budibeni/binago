import React from 'react';
import { RentalVehicleEditFeature } from '../../../../../../features/modules/rental/vehicles/RentalVehicleEditFeature';

export default function RentalVehicleEditPage({ params }: { params: { id: string } }) {
  return <RentalVehicleEditFeature id={params.id} />;
}
