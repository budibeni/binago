import React from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

interface MapContextValue {
  map: MapLibreMap | null;
  setMap: (map: MapLibreMap | null) => void;
}

export const MapContext = React.createContext<MapContextValue>({
  map: null,
  setMap: () => {},
});

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = React.useState<MapLibreMap | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
}

// Hook internal untuk digunakan HANYA di dalam @adatrack/maps (misalnya oleh MapMarker)
export function useInternalMap() {
  const context = React.useContext(MapContext);
  if (!context) {
    throw new Error('useInternalMap must be used within a MapProvider');
  }
  return context.map;
}

// Hook publik dengan minimal API, tipe maplibre tidak diekspos ke layer aplikasi pengguna
export interface MapActions {
  panTo: (coordinates: { lat: number; lng: number }) => void;
  fitBounds: (bounds: [[number, number], [number, number]], options?: { padding?: number }) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export function useMapActions(): MapActions {
  const map = useInternalMap();

  return React.useMemo(() => ({
    panTo: (coordinates) => {
      if (map) {
        map.panTo(coordinates);
      }
    },
    fitBounds: (bounds, options) => {
      if (map) {
        map.fitBounds(bounds, { padding: options?.padding ?? 50, duration: 1000 });
      }
    },
    zoomIn: () => {
      if (map) {
        map.zoomIn();
      }
    },
    zoomOut: () => {
      if (map) {
        map.zoomOut();
      }
    },
  }), [map]);
}
