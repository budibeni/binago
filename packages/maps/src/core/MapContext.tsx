import React from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

interface StyleLoadListener {
  callback: () => void;
}

interface MapContextValue {
  map: MapLibreMap | null;
  setMap: (map: MapLibreMap | null) => void;
  styleLoadListeners: React.MutableRefObject<StyleLoadListener[]>;
  isDefault?: boolean;
}

export const MapContext = React.createContext<MapContextValue>({
  map: null,
  setMap: () => {},
  styleLoadListeners: { current: [] },
  isDefault: true,
});

export function MapProvider({ children }: { children: React.ReactNode }) {
  const existingContext = React.useContext(MapContext);
  
  // Jika sudah berada di dalam MapProvider lain (bukan default), jangan buat state baru
  const [map, setMap] = React.useState<MapLibreMap | null>(null);
  const styleLoadListeners = React.useRef<StyleLoadListener[]>([]);

  if (!existingContext.isDefault) {
    return <>{children}</>;
  }

  return (
    <MapContext.Provider value={{ map, setMap, styleLoadListeners, isDefault: false }}>
      {children}
    </MapContext.Provider>
  );
}

// Hook internal untuk digunakan HANYA di dalam @adatrack/maps (misalnya oleh MapMarker, tools)
export function useInternalMap() {
  const context = React.useContext(MapContext);
  if (!context) {
    throw new Error('useInternalMap must be used within a MapProvider');
  }
  return context.map;
}

// Hook internal untuk mendaftarkan listener style.load (untuk tools yang perlu re-register setelah basemap switch)
export function useStyleLoadCallback(callback: (() => void) | null) {
  const context = React.useContext(MapContext);
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  React.useEffect(() => {
    if (!callback) return;

    const listener: StyleLoadListener = {
      callback: () => callbackRef.current?.(),
    };
    context.styleLoadListeners.current.push(listener);

    return () => {
      const idx = context.styleLoadListeners.current.indexOf(listener);
      if (idx !== -1) context.styleLoadListeners.current.splice(idx, 1);
    };
  }, []);
}

// Hook publik dengan minimal API - tipe maplibre tidak diekspos ke layer aplikasi
export interface MapActions {
  panTo: (coordinates: { lat: number; lng: number }) => void;
  fitBounds: (bounds: [[number, number], [number, number]], options?: { padding?: number }) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  getZoom: () => number;
  getCenter: () => { lat: number; lng: number } | null;
}

export function useMapActions(): MapActions {
  const { map } = React.useContext(MapContext);

  return React.useMemo(
    () => ({
      panTo: (coordinates) => {
        if (map) map.panTo([coordinates.lng, coordinates.lat]);
      },
      fitBounds: (bounds, options) => {
        if (map) map.fitBounds(bounds, { padding: options?.padding ?? 50, duration: 1000 });
      },
      zoomIn: () => {
        if (map) map.zoomIn();
      },
      zoomOut: () => {
        if (map) map.zoomOut();
      },
      getZoom: () => {
        return map ? Math.round(map.getZoom() * 10) / 10 : 0;
      },
      getCenter: () => {
        if (!map) return null;
        const center = map.getCenter();
        return { lat: center.lat, lng: center.lng };
      },
    }),
    [map],
  );
}
