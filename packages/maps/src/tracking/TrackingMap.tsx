'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { MapContainer } from '../core/MapContainer';
import { MapProvider, useMapActions, useInternalMap } from '../core/MapContext';
import { MapControlPanel } from '../controls/MapControlPanel';
import type { BasemapId } from '../basemaps/types';
import type { Locale } from '../i18n';
import type {
  LocationSearchResult,
  MapEntityOption,
  MapGeofenceOption,
  GeofenceCheckRequest,
  GeofenceCheckResult,
} from '../tools/types';
import { defaultNominatimSearch, calcEntityBounds } from './utils';

export interface TrackingMapProps<T> {
  /** Data seluruh entitas (kendaraan, device, dll) yang tersedia */
  entities: T[];
  /** Array ID entitas yang sedang terpilih (dikendalikan oleh consumer state) */
  selectedIds: string[];
  
  /** Resolver: Mendapatkan unik ID dari entitas */
  getId: (entity: T) => string;
  /** Resolver: Mendapatkan koordinat terkini dari entitas */
  getPosition: (entity: T) => { lat: number; lng: number };
  /** Resolver: Mendapatkan arah pergerakan entitas (0-360) (opsional) */
  getHeading?: (entity: T) => number;
  
  /** Renderer: Komponen marker untuk entitas */
  renderMarker: (entity: T, state: { selected: boolean; focused: boolean; onClick: () => void }) => React.ReactNode;
  /** Renderer: Komponen popup untuk entitas ketika difokuskan (opsional) */
  renderPopup?: (entity: T, onClose: () => void) => React.ReactNode;

  /** Callback abstrak pencarian alamat (bisa default public API atau backend custom) */
  searchAddressFn?: (query: string) => Promise<LocationSearchResult[]>;
  /** Daftar geofence untuk GeofenceCheckTool */
  geofences?: MapGeofenceOption[];
  /** Opsi entitas map-based (disuplai consumer untuk form/pilihan) */
  entityOptions?: MapEntityOption[];
  /** Fungsi untuk validasi geofence (mock atau real API) */
  checkGeofenceFn?: (req: GeofenceCheckRequest) => Promise<GeofenceCheckResult>;
  
  /** Label UI untuk entitas (misal: "Kendaraan", "Perangkat") */
  entityLabel?: string;
  /** Bahasa interface map */
  locale?: Locale;
  /** Custom class untuk container */
  className?: string;
}

function TrackingMapInner<T>({
  entities,
  selectedIds,
  getId,
  getPosition,
  getHeading,
  renderMarker,
  renderPopup,
  searchAddressFn = defaultNominatimSearch,
  geofences,
  entityOptions,
  checkGeofenceFn,
  entityLabel,
  locale = 'id',
  className,
}: TrackingMapProps<T>) {
  const [basemap, setBasemap] = useState<BasemapId>('standard');
  const [viewport, setViewport] = useState({ center: { lat: -6.2, lng: 106.816667 }, zoom: 12 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { fitBounds, panTo } = useMapActions();

  const map = useInternalMap();

  // Internal state: entitas mana yang sedang diklik (ditampilkan popup)
  const [focusedEntityId, setFocusedEntityId] = useState<string | null>(null);

  const hasInitializedBounds = useRef(false);

  const visibleEntities = useMemo(() => {
    return entities.filter((e) => selectedIds.includes(getId(e)));
  }, [entities, selectedIds, getId]);

  const focusedEntity = useMemo(() => {
    return focusedEntityId ? entities.find((e) => getId(e) === focusedEntityId) : null;
  }, [focusedEntityId, entities, getId]);

  const handleFitSelected = useCallback(() => {
    const positions = visibleEntities.map(getPosition);
    const bounds = calcEntityBounds(positions);
    if (bounds) {
      fitBounds(bounds, { padding: 50 });
    }
  }, [visibleEntities, getPosition, fitBounds]);

  const handleResetNorth = useCallback(() => {
    if (map) {
      map.resetNorthPitch({ duration: 1000 });
    }
  }, [map]);

  // Efek: Initial Fit hanya SEKALI saat ada entitas yang dipilih pertama kali
  useEffect(() => {
    if (visibleEntities.length > 0 && !hasInitializedBounds.current) {
      const positions = visibleEntities.map(getPosition);
      const bounds = calcEntityBounds(positions);
      if (bounds) {
        fitBounds(bounds, { padding: 50 });
        hasInitializedBounds.current = true;
      }
    }
  }, [visibleEntities, getPosition, fitBounds]);

  return (
    <div className={className} style={{ width: '100%', height: '100%', display: 'flex' }}>
      <MapContainer
        ref={mapContainerRef}
        basemap={basemap}
        viewport={viewport}
        onViewportChange={setViewport}
        toolbarSlot={
          <MapControlPanel
            basemap={basemap}
            onBasemapChange={setBasemap}
            mapContainerRef={mapContainerRef}
            onFitSelected={handleFitSelected}
            onResetNorth={handleResetNorth}
            onSearchAddress={searchAddressFn}
            entities={entityOptions}
            geofences={geofences}
            onCheckEntityGeofence={checkGeofenceFn}
            entityLabel={entityLabel}
            locale={locale}
          />
        }
      >
        {/* Render entitas yang visible (sesuai selectedIds atau semua jika kosong) */}
        {visibleEntities.map((entity) => {
          const id = getId(entity);
          const selected = selectedIds.includes(id);
          const focused = focusedEntityId === id;
          
          return (
            <React.Fragment key={id}>
              {renderMarker(entity, {
                selected,
                focused,
                onClick: () => {
                  setFocusedEntityId(id);
                  const pos = getPosition(entity);
                  panTo({ lat: pos.lat, lng: pos.lng });
                }
              })}
            </React.Fragment>
          );
        })}

        {/* Render popup untuk entitas yang sedang difokuskan */}
        {focusedEntity && renderPopup && renderPopup(
          focusedEntity,
          () => setFocusedEntityId(null)
        )}
      </MapContainer>
    </div>
  );
}

export function TrackingMap<T>(props: TrackingMapProps<T>) {
  return (
    <MapProvider>
      <TrackingMapInner {...props} />
    </MapProvider>
  );
}
