import React from 'react';
import { MapMarker } from '@adatrack/maps';
import { TrackingVehicle } from '../../types/tracking';
import { Truck, Bus } from 'lucide-react';
import { cn } from '@adatrack/utils';

export interface VehicleMarkerProps {
  vehicle: TrackingVehicle;
  selected: boolean;
  onClick?: (id: string) => void;
}

export function VehicleMarker({ vehicle, selected, onClick }: VehicleMarkerProps) {
  const typeStr = vehicle.vehicleType?.toLowerCase() || '';
  const isMinibus = typeStr.includes('minibus')
    || typeStr.includes('hiace')
    || typeStr.includes('bus');
  
  // Make it highly visible for debugging
  const markerClasses = selected
    ? 'bg-red-500 text-white border-2 border-red-700 shadow-lg shadow-red-500/50 z-50'
    : 'bg-blue-500 text-white border-2 border-blue-700 shadow-md z-40';

  return (
    <MapMarker
      id={vehicle.id}
      position={vehicle.location}
      heading={0}
    >
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(vehicle.id);
        }}
        className={cn(
          "flex items-center justify-center rounded-full border-2 cursor-pointer transition-all duration-200 pointer-events-auto",
          selected ? "scale-110 z-10 hover:scale-110" : "scale-90 hover:scale-100 hover:text-foreground",
          markerClasses,
          isMinibus ? "w-10 h-10" : "w-10 h-10"
        )}
        title={vehicle.plateNumber}
      >
        {isMinibus ? (
          <Bus className="w-5 h-5" />
        ) : (
          <Truck className="w-5 h-5" />
        )}
      </div>
    </MapMarker>
  );
}
