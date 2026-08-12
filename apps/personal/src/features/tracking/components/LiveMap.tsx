'use client';

import React from 'react';
import { MapContainer, MapViewport } from '@binago/maps';
import { Vehicle } from '../types';

export interface LiveMapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
}

export function LiveMap({ vehicles, selectedVehicleId }: LiveMapProps) {
  const [viewport, setViewport] = React.useState<MapViewport>({
    center: { lat: -6.2146, lng: 106.8451 }, // Default to Jakarta
    zoom: 12,
  });

  // Effect to re-center when a vehicle is selected
  React.useEffect(() => {
    if (selectedVehicleId) {
      const selected = vehicles.find((v) => v.id === selectedVehicleId);
      if (selected) {
        setViewport({
          center: selected.location,
          zoom: 15,
        });
      }
    }
  }, [selectedVehicleId, vehicles]);

  // In a real implementation, we would map over vehicles and render Markers.
  // For this frontend-only scope with MapContainer placeholder, we just show the container.
  
  return (
    <div className="w-full h-full relative">
      <MapContainer
        viewport={viewport}
        onViewportChange={setViewport}
        placeholderText={
          selectedVehicleId 
            ? `Memantau kendaraan terpilih: ${vehicles.find(v => v.id === selectedVehicleId)?.plateNumber}`
            : `Memantau ${vehicles.length} kendaraan aktif`
        }
        className="w-full h-full border-0 rounded-none min-h-0"
      >
        {/* Vehicles Markers would go here using a hypothetical Marker component */}
      </MapContainer>
    </div>
  );
}
