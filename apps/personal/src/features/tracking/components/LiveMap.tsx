'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, MapViewport, useMapActions, MapPopup, MapControls } from '@adatrack/maps';
import { Vehicle } from '../types';
import { VehicleMarker } from './VehicleMarker';
import { useCurrentTheme } from '../../../hooks/useCurrentTheme';

export interface LiveMapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
}

// Inner component that has access to map context
function LiveMapInner({ vehicles, selectedVehicleId }: LiveMapProps) {
  const { fitBounds, panTo, zoomIn, zoomOut } = useMapActions();
  const hasInitializedBounds = useRef(false);
  const [focusedVehicleId, setFocusedVehicleId] = useState<string | null>(null);

  // Active vehicles are those that are "selected" globally
  const activeVehicles = useMemo(() => {
    return selectedVehicleId 
      ? vehicles.filter(v => v.id === selectedVehicleId)
      : vehicles;
  }, [vehicles, selectedVehicleId]);

  const focusedVehicle = useMemo(() => {
    return focusedVehicleId ? activeVehicles.find(v => v.id === focusedVehicleId) : null;
  }, [focusedVehicleId, activeVehicles]);

  const fitToActiveVehicles = React.useCallback(() => {
    if (activeVehicles.length === 0) return;

    if (activeVehicles.length === 1) {
      panTo({ lat: activeVehicles[0].location.lat, lng: activeVehicles[0].location.lng });
    } else {
      let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
      activeVehicles.forEach(v => {
        if (v.location.lat < minLat) minLat = v.location.lat;
        if (v.location.lat > maxLat) maxLat = v.location.lat;
        if (v.location.lng < minLng) minLng = v.location.lng;
        if (v.location.lng > maxLng) maxLng = v.location.lng;
      });

      if (minLat !== 90 && maxLat !== -90 && minLng !== 180 && maxLng !== -180) {
        if (minLat !== maxLat || minLng !== maxLng) {
          fitBounds(
            [[minLng, minLat], [maxLng, maxLat]],
            { padding: 50 }
          );
        } else {
          panTo({ lat: minLat, lng: minLng });
        }
      }
    }
  }, [activeVehicles, fitBounds, panTo]);

  useEffect(() => {
    // Only run this once for initial fit bounds
    if (hasInitializedBounds.current) return;
    if (activeVehicles.length > 0) {
      fitToActiveVehicles();
      hasInitializedBounds.current = true;
    }
  }, [activeVehicles, fitToActiveVehicles]);

  // Handle global selection changes (e.g. from VehicleList)
  const prevSelectedId = useRef<string | undefined>(selectedVehicleId);
  useEffect(() => {
    if (hasInitializedBounds.current && selectedVehicleId && selectedVehicleId !== prevSelectedId.current) {
      // When selection changes to a specific vehicle, auto-focus it
      setFocusedVehicleId(selectedVehicleId);
      const selected = vehicles.find((v) => v.id === selectedVehicleId);
      if (selected) {
        panTo(selected.location);
      }
    } else if (hasInitializedBounds.current && !selectedVehicleId && prevSelectedId.current) {
      // Selection changed to "All"
      setFocusedVehicleId(null);
      fitToActiveVehicles();
    }
    prevSelectedId.current = selectedVehicleId;
  }, [selectedVehicleId, vehicles, panTo, fitToActiveVehicles]);

  const handleMarkerClick = (id: string) => {
    setFocusedVehicleId(id);
    const v = activeVehicles.find(v => v.id === id);
    if (v) {
      panTo(v.location);
    }
  };

  const handleClosePopup = () => {
    setFocusedVehicleId(null);
  };

  return (
    <>
      {vehicles.map((vehicle) => {
        // Selection state: if selectedVehicleId exists, only that vehicle is selected (visible).
        // If not, all are selected (visible)
        const isSelected = selectedVehicleId ? vehicle.id === selectedVehicleId : true;
        
        return (
          <VehicleMarker 
            key={vehicle.id} 
            vehicle={vehicle} 
            selected={isSelected}
            onClick={handleMarkerClick}
          />
        );
      })}

      {focusedVehicle && (
        <MapPopup 
          position={focusedVehicle.location} 
          onClose={handleClosePopup}
          offset={[0, -20]}
        >
          <div className="p-3 bg-white text-neutral-900 rounded-lg shadow-sm w-48 font-sans">
            <h4 className="font-bold text-sm truncate">{focusedVehicle.type || focusedVehicle.name}</h4>
            <p className="text-xs text-neutral-500 mb-2">{focusedVehicle.plateNumber}</p>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${
                focusedVehicle.status === 'driving' ? 'bg-green-500' :
                focusedVehicle.status === 'idle' ? 'bg-amber-500' :
                focusedVehicle.status === 'parking' ? 'bg-blue-500' : 'bg-neutral-500'
              }`} />
              <span className="text-xs capitalize font-medium">{focusedVehicle.status}</span>
            </div>
            
            {focusedVehicle.speed !== undefined && focusedVehicle.status !== 'offline' && (
              <p className="text-xs font-medium">
                {focusedVehicle.speed} km/j
              </p>
            )}

            <button 
              className="mt-3 w-full py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded transition-colors"
              onClick={() => {
                // In real app, might dispatch an event or call a context to open detail panel.
              }}
            >
              Lihat Detail
            </button>
          </div>
        </MapPopup>
      )}

      {/* MapControls placed directly over the map */}
      <div className="absolute bottom-6 right-4 z-10 pointer-events-auto">
        <MapControls 
          onZoomIn={zoomIn} 
          onZoomOut={zoomOut} 
          onResetView={fitToActiveVehicles} 
          showLayerControl={false}
        />
      </div>
    </>
  );
}

export function LiveMap({ vehicles, selectedVehicleId }: LiveMapProps) {
  const [viewport, setViewport] = React.useState<MapViewport>({
    center: { lat: -6.2146, lng: 106.8451 },
    zoom: 12,
  });

  const theme = useCurrentTheme();

  // Configurable Map Style
  const mapStyleUrl = theme === 'dark'
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

  return (
    <div className="w-full h-full relative">
      <MapContainer
        viewport={viewport}
        onViewportChange={setViewport}
        mapStyleUrl={mapStyleUrl}
        className="w-full h-full border-0 rounded-none min-h-0"
      >
        <LiveMapInner vehicles={vehicles} selectedVehicleId={selectedVehicleId} />
      </MapContainer>
    </div>
  );
}
