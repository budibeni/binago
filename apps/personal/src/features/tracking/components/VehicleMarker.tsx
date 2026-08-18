import React from 'react';
import { MapMarker } from '@adatrack/maps';
import { Vehicle } from '../types';
import { Car, Bike } from 'lucide-react';
import { cn } from '@adatrack/utils';

export interface VehicleMarkerProps {
  vehicle: Vehicle;
  selected: boolean;
  onClick?: (id: string) => void;
}

export function VehicleMarker({ vehicle, selected, onClick }: VehicleMarkerProps) {
  const heading = 0; 
  const isMotorcycle = vehicle.category === 'motorcycle';
  
  // Selection vs Status: Marker icon color ONLY reflects selection state.
  const bgColor = selected ? 'bg-blue-600 text-white border-white' : 'bg-neutral-500 text-white border-white opacity-80';

  return (
    <MapMarker
      id={vehicle.id}
      position={vehicle.location}
      heading={heading}
      selected={true} // In this architecture, MapMarker always renders if returned, LiveMap controls visibility
    >
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(vehicle.id);
        }}
        className={cn(
          "flex items-center justify-center rounded-full shadow-md border-2 cursor-pointer transition-transform",
          selected ? "scale-110 z-10 hover:scale-125" : "scale-90 hover:scale-100",
          bgColor,
          isMotorcycle ? "w-8 h-8" : "w-10 h-10"
        )}
        title={`${vehicle.plateNumber}`}
      >
        {isMotorcycle ? (
          <Bike className="w-5 h-5" />
        ) : (
          <Car className="w-6 h-6" />
        )}
      </div>
    </MapMarker>
  );
}
