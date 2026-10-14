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
  const isMinibus = vehicle.vehicleType?.toLowerCase().includes('minibus')
    || vehicle.vehicleType?.toLowerCase().includes('hiace')
    || vehicle.vehicleType?.toLowerCase().includes('bus');
  
  const heading = (vehicle as any).heading ?? 0;

  // Selection vs Status: Marker icon color ONLY reflects selection state like in Personal.
  const markerClasses = selected
    ? 'bg-accent text-accent-foreground border-white shadow-md shadow-accent/20 z-10'
    : 'bg-background text-foreground-muted border-border shadow-sm';

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
        className="relative flex flex-col items-center cursor-pointer pointer-events-auto"
        title={`${vehicle.plateNumber} · ${vehicle.speed} km/h · Heading ${heading}°`}
      >
        {/* Directional Moncong Arrow (rotates around the vehicle center) */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 pointer-events-none transition-transform duration-300 ease-out z-20"
          style={{ transform: `rotate(${heading}deg)`, transformOrigin: 'center 26px' }}
        >
          <svg viewBox="0 0 12 12" className="w-3.5 h-3.5 fill-red-500 drop-shadow-sm">
            <polygon points="6,0 12,12 6,9 0,12" />
          </svg>
        </div>

        <div
          className={cn(
            "flex items-center justify-center rounded-full border-2 transition-all duration-200",
            selected ? "scale-110 z-10 hover:scale-110" : "scale-90 hover:scale-100 hover:text-foreground",
            markerClasses,
            isMinibus ? "w-10 h-10" : "w-10 h-10"
          )}
        >
          {isMinibus ? (
            <Bus className="w-5 h-5" />
          ) : (
            <Truck className="w-5 h-5" />
          )}
        </div>
      </div>
    </MapMarker>
  );
}
