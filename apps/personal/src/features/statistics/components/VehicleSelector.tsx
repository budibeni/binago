'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Car } from 'lucide-react';
import { Vehicle } from '../../tracking/types';

export interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onSelect: (id: string) => void;
}

export function VehicleSelector({ vehicles, selectedVehicleId, onSelect }: VehicleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedVehicle) return null;

  return (
    <div className="relative w-full md:w-64" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-2 hover:bg-surface-elevated transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Car Thumbnail Placeholder */}
          <div className="w-10 h-6 bg-surface-elevated border border-border text-foreground-subtle rounded flex items-center justify-center shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div className="text-left flex flex-col justify-center h-10">
            <h3 className="text-sm font-bold text-foreground leading-tight">{selectedVehicle.plateNumber}</h3>
            <p className="text-xs text-foreground-muted leading-tight">{selectedVehicle.name || 'Kendaraan Pribadi'}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-foreground-subtle transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {vehicles.map(vehicle => (
            <button
              key={vehicle.id}
              onClick={() => {
                onSelect(vehicle.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-elevated transition-colors ${selectedVehicle.id === vehicle.id ? 'bg-surface-elevated' : ''}`}
            >
              <div className="w-10 h-6 bg-surface-elevated border border-border text-foreground-subtle rounded flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div className="flex flex-col justify-center h-10">
                <h3 className="text-sm font-bold text-foreground leading-tight">{vehicle.plateNumber}</h3>
                <p className="text-xs text-foreground-muted leading-tight">{vehicle.name || 'Kendaraan Pribadi'}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
