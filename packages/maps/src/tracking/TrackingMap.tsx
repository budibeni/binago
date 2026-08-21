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

import useSupercluster from 'use-supercluster';
import { ClusterMarker } from './ClusterMarker';
import { EntityMarker } from './EntityMarker';
import { PlaybackRouteRenderer } from './PlaybackRouteRenderer';
import { MapMarker } from '../core/MapMarker';

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
  
  /** Renderer opsional: Jika disuplai, consumer bisa membuat UI marker kustom (Marker Style: Custom) */
  renderMarker?: (entity: T, state: { selected: boolean; focused: boolean; onClick: () => void }) => React.ReactNode;
  /** Resolver: Mendapatkan teks label untuk EntityMarker bawaan */
  getLabel?: (entity: T) => string | undefined;
  /** Resolver: Mendapatkan ikon untuk EntityMarker bawaan */
  getIcon?: (entity: T) => React.ReactNode;
  /** Resolver: Mendapatkan warna marker untuk EntityMarker bawaan */
  getColor?: (entity: T) => string | undefined;

  /** Renderer: Komponen popup untuk entitas ketika difokuskan (opsional) */
  renderPopup?: (entity: T, onClose: () => void) => React.ReactNode;

  /** Mengaktifkan fitur clustering (default: true) */
  enableClustering?: boolean;

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

  /** Koordinat rute playback untuk digambar di peta (opsional) */
  playbackTrack?: { lat: number; lng: number }[];
  /** Koordinat rute playback yang sudah dilewati (opsional) */
  playbackPassedTrack?: { lat: number; lng: number }[];
  /** Lokasi parkir/berhenti di histori rute playback (opsional) */
  playbackParkingEvents?: { lat: number; lng: number }[];
  /** Optional children rendered inside MapProvider for accessing map context */
  children?: React.ReactNode;
}

function TrackingMapInner<T>({
  entities,
  selectedIds,
  getId,
  getPosition,
  getHeading,
  renderMarker,
  getLabel,
  getIcon,
  getColor,
  renderPopup,
  enableClustering = true,
  searchAddressFn = defaultNominatimSearch,
  geofences,
  entityOptions,
  checkGeofenceFn,
  entityLabel,
  locale = 'id',
  className,
  playbackTrack,
  playbackPassedTrack,
  playbackParkingEvents,
  children,
}: TrackingMapProps<T>) {
  const [basemap, setBasemap] = useState<BasemapId>('standard');
  const [viewport, setViewport] = useState({ center: { lat: -6.2, lng: 106.816667 }, zoom: 12 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { fitBounds, panTo } = useMapActions();

  const map = useInternalMap();

  // Internal state: entitas mana yang sedang diklik (ditampilkan popup)
  const [focusedEntityId, setFocusedEntityId] = useState<string | null>(null);

  // Marker style state
  const [markerStyle, setMarkerStyle] = useState<'default' | 'custom'>('default');

  // Clustering states
  const [bounds, setBounds] = useState<[number, number, number, number] | undefined>(undefined);
  const [zoom, setZoom] = useState<number>(12);

  useEffect(() => {
    if (!map) return;
    const update = () => {
      const b = map.getBounds();
      setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
      setZoom(map.getZoom());
    };
    update();
    map.on('move', update);
    map.on('zoom', update);
    return () => {
      map.off('move', update);
      map.off('zoom', update);
    };
  }, [map]);

  const hasInitializedBounds = useRef(false);

  const visibleEntities = useMemo(() => {
    return entities.filter((e) => selectedIds.includes(getId(e)));
  }, [entities, selectedIds, getId]);

  const points = useMemo(() => {
    return visibleEntities.map((entity) => {
      const pos = getPosition(entity);
      return {
        type: 'Feature' as const,
        properties: {
          cluster: false,
          entityId: getId(entity),
          entity,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [Math.min(Math.max(pos.lng, -180), 180), Math.min(Math.max(pos.lat, -90), 90)],
        },
      };
    });
  }, [visibleEntities, getPosition, getId]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  const focusedEntity = useMemo(() => {
    return focusedEntityId ? entities.find((e) => getId(e) === focusedEntityId) : null;
  }, [focusedEntityId, entities, getId]);

  const handleFitSelected = useCallback(() => {
    const positions = visibleEntities.map(getPosition);
    const boundsObj = calcEntityBounds(positions);
    if (boundsObj) {
      fitBounds(boundsObj, { padding: 50 });
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
      const boundsObj = calcEntityBounds(positions);
      if (boundsObj) {
        fitBounds(boundsObj, { padding: 50 });
        hasInitializedBounds.current = true;
      }
    }
  }, [visibleEntities, getPosition, fitBounds]);

  const markersToRender = enableClustering && bounds ? clusters : points;

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
            hasCustomMarker={!!renderMarker}
            markerStyle={markerStyle}
            onMarkerStyleChange={setMarkerStyle}
          />
        }
      >
        {/* Render entitas yang visible (sesuai selectedIds atau semua jika kosong) atau clusters */}
        {markersToRender.map((cluster) => {
          const [lng, lat] = cluster.geometry.coordinates;
          const props = cluster.properties as any;
          const isCluster = props.cluster;
          const pointCount = props.point_count;
          const clusterId = (cluster as any).id as number;

          if (isCluster) {
            return (
              <ClusterMarker
                key={`cluster-${clusterId}`}
                id={clusterId.toString()}
                position={{ lat, lng }}
                count={pointCount}
                onClick={() => {
                  if (!supercluster || !map) return;
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(clusterId),
                    20
                  );
                  map.flyTo({
                    center: [lng, lat],
                    zoom: expansionZoom,
                    speed: 1.2
                  });
                }}
              />
            );
          }

          const entity = props.entity as T;
          const id = props.entityId;
          const selected = selectedIds.includes(id);
          const focused = focusedEntityId === id;
          
          const onClickEntity = () => {
            setFocusedEntityId(id);
            const pos = getPosition(entity);
            panTo({ lat: pos.lat, lng: pos.lng });
          };
          
          return (
            <React.Fragment key={id}>
              {markerStyle === 'custom' && renderMarker ? (
                renderMarker(entity, {
                  selected,
                  focused,
                  onClick: onClickEntity
                })
              ) : (
                <EntityMarker
                  id={id}
                  position={getPosition(entity)}
                  heading={getHeading?.(entity)}
                  label={getLabel?.(entity)}
                  icon={getIcon?.(entity)}
                  color={getColor?.(entity)}
                  selected={selected}
                  focused={focused}
                  onClick={onClickEntity}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Render popup untuk entitas yang sedang difokuskan */}
        {focusedEntity && renderPopup && renderPopup(
          focusedEntity,
          () => setFocusedEntityId(null)
        )}

        {/* Playback route polyline */}
        {playbackTrack && playbackTrack.length > 1 && (
          <PlaybackRouteRenderer track={playbackTrack} passedTrack={playbackPassedTrack} />
        )}

        {/* Playback parking spots */}
        {playbackParkingEvents && playbackParkingEvents.map((p, idx) => (
          <MapMarker key={`park-${idx}`} id={`park-${idx}`} position={p}>
            <div 
              className="bg-indigo-600 text-white border-2 border-white rounded-full shadow-md flex items-center justify-center font-bold text-xs" 
              style={{ width: '24px', height: '24px' }}
              title="Posisi Berhenti/Parkir"
            >
              P
            </div>
          </MapMarker>
        ))}
      </MapContainer>
      {/* Children rendered inside MapProvider for context access */}
      {children}
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
