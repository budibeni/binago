'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  MapContainer,
  MapControlPanel,
  GeometryEditor,
  useMapActions,
  MapContext,
  useStyleLoadCallback,
  type MapGeometry,
  type BasemapId,
  geometryToGeoJSON,
  calcEntityBounds,
  defaultNominatimSearch,
  MapProvider,
  haversineMeters,
  ActiveSearchAreaRenderer,
  type ActiveSearchAreaHighlight,
  type SearchAreaRouteResult,
} from '@adatrack/maps';
import type { Route, RouteLocation, MapInteractionMode, RouteStop } from '../types';
import type { Geofence } from '../../geofences/types';

interface GeoJSONSourceLike {
  setData(data: GeoJSON.FeatureCollection | GeoJSON.Feature): void;
}

function createCirclePolygon(lat: number, lng: number, radiusInMeters: number, points = 64): GeoJSON.Polygon {
  const coords = [];
  const earthRadius = 6378137; // meters
  for (let i = 0; i < points; i++) {
    const angle = (i * 360) / points;
    const dx = radiusInMeters * Math.cos((angle * Math.PI) / 180);
    const dy = radiusInMeters * Math.sin((angle * Math.PI) / 180);
    const lat_i = lat + (dy / earthRadius) * (180 / Math.PI);
    const lng_i = lng + (dx / earthRadius) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);
    coords.push([lng_i, lat_i]);
  }
  coords.push(coords[0]); // close polygon
  return {
    type: 'Polygon',
    coordinates: [coords]
  };
}

function getRouteDistance(
  center: { lat: number; lng: number },
  route: Route,
  geofences: Geofence[]
): { minDistance: number; coordinates: { lat: number; lng: number }[] } {
  const allCoords: { lat: number; lng: number }[] = [];

  // Planned Path
  if (route.plannedPath?.coordinates && route.plannedPath.coordinates.length > 0) {
    allCoords.push(...route.plannedPath.coordinates);
  }

  // Helper for RouteLocation
  const collectLocationCoords = (loc: RouteLocation) => {
    if (loc.type === 'coordinate' && loc.latitude !== undefined && loc.longitude !== undefined) {
      allCoords.push({ lat: loc.latitude, lng: loc.longitude });
    } else if (loc.type === 'geofence' && loc.geofenceId) {
      const gf = geofences.find((g) => g.id === loc.geofenceId);
      if (gf?.geometry?.coordinates) {
        allCoords.push(...gf.geometry.coordinates);
      }
    }
  };

  collectLocationCoords(route.origin);
  if (route.stops) {
    for (const stop of route.stops) {
      collectLocationCoords(stop.location);
    }
  }
  collectLocationCoords(route.destination);

  if (allCoords.length === 0) {
    return { minDistance: Infinity, coordinates: [] };
  }

  const dists = allCoords.map((c) => haversineMeters(center.lat, center.lng, c.lat, c.lng));
  const minDistance = Math.min(...dists);

  return { minDistance, coordinates: allCoords };
}

interface RouteMapProps {
  geofences: Geofence[];
  selectedRoute: Route | null;
  editorMode: MapInteractionMode;
  editorGeometry: MapGeometry | null;
  onEditorGeometryChange: (geometry: MapGeometry | null) => void;
  onMapClick?: (lat: number, lng: number) => void;
  routes?: Route[];
  groups?: Array<{ id: string; name: string }>;
  onSelectRoute?: (routeId: string | undefined) => void;
}

function RouteMapInner({
  geofences,
  selectedRoute,
  editorMode,
  editorGeometry,
  onEditorGeometryChange,
  onMapClick,
  routes,
  groups,
  onSelectRoute,
}: RouteMapProps) {
  const { map } = React.useContext(MapContext);
  const actions = useMapActions();
  const [basemap, setBasemap] = useState<BasemapId>('standard');
  const [viewport, setViewport] = useState({ center: { lng: 106.8271, lat: -6.1751 }, zoom: 11 });
  const [highlightedArea, setHighlightedArea] = useState<ActiveSearchAreaHighlight | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getRouteLocations = useCallback(() => {
    if (!selectedRoute) return [];
    return [
      { loc: selectedRoute.origin, role: 'origin' },
      ...selectedRoute.stops.map((s: RouteStop) => ({ loc: s.location, role: 'stop' })),
      { loc: selectedRoute.destination, role: 'destination' }
    ];
  }, [selectedRoute]);

  const getRouteGeofences = useCallback(() => {
    if (!selectedRoute) return geofences;
    
    const geofenceIds = new Set<string>();
    const routeLocs = getRouteLocations();
    routeLocs.forEach(({loc}) => {
      if (loc.type === 'geofence' && loc.geofenceId) {
        geofenceIds.add(loc.geofenceId);
      }
    });

    return geofences.filter(gf => geofenceIds.has(gf.id));
  }, [selectedRoute, geofences, getRouteLocations]);

  const handleFit = () => {
    const allCoords: {lat: number, lng: number}[] = [];
    
    // Fit Geofences
    const targetGeofences = getRouteGeofences();
    targetGeofences.forEach(gf => {
       if (gf.geometry?.coordinates) {
          allCoords.push(...gf.geometry.coordinates);
       }
    });

    // Fit Coordinates
    const routeLocs = getRouteLocations();
    routeLocs.forEach(({loc}) => {
      if (loc.type === 'coordinate' && loc.latitude !== undefined && loc.longitude !== undefined) {
        allCoords.push({ lat: loc.latitude, lng: loc.longitude });
      }
    });

    // Fit Planned Path
    if (selectedRoute?.plannedPath?.coordinates) {
      allCoords.push(...selectedRoute.plannedPath.coordinates);
    }

    if (allCoords.length === 0) return;

    const bounds = calcEntityBounds(allCoords);
    if (bounds) {
       actions.fitBounds(bounds, { padding: 50 });
    }
  };

  // Pan to selected route when it changes
  useEffect(() => {
    if (!map || !selectedRoute) return;
    handleFit();
  }, [map, selectedRoute, geofences]);

  // Handle map clicks for selecting coordinate location
  useEffect(() => {
    if (!map || editorMode !== 'select-location' || !onMapClick) return;

    // Change cursor
    map.getCanvas().style.cursor = 'crosshair';

    const handleMapClick = (e: maplibregl.MapMouseEvent) => {
      onMapClick(e.lngLat.lat, e.lngLat.lng);
    };

    map.on('click', handleMapClick);

    return () => {
      map.getCanvas().style.cursor = '';
      map.off('click', handleMapClick);
    };
  }, [map, editorMode, onMapClick]);

  const GF_SOURCE_ID = 'adatrack-route-geofences-source';
  const GF_FILL_LAYER_ID = 'adatrack-route-geofences-fill';
  const GF_OUTLINE_LAYER_ID = 'adatrack-route-geofences-outline';
  
  const COORD_SOURCE_ID = 'adatrack-route-coord-source';
  const COORD_POINT_LAYER_ID = 'adatrack-route-coord-point';

  const RADIUS_SOURCE_ID = 'route-radius-source';
  const RADIUS_FILL_LAYER_ID = 'route-radius-fill';
  const RADIUS_OUTLINE_LAYER_ID = 'route-radius-outline';

  const PATH_SOURCE_ID = 'adatrack-route-path-source';
  const PATH_LAYER_ID = 'adatrack-route-path-line';

  // Render geofences, coordinates and planned path
  const renderRouteLayers = useCallback(() => {
    if (!map) return;
    try {
      if (!map.getStyle()) return;
    } catch {
      return;
    }

    try {
      const routeLocs = getRouteLocations();

      // 1. Render Geofences
      const targetGeofences = getRouteGeofences();
      const gfFeatures: GeoJSON.Feature[] = targetGeofences
        .map((gf) => {
          const feature = geometryToGeoJSON(gf.geometry);
          if (!feature) return null;

          // Find role for this geofence
          let role = 'stop';
          if (routeLocs[0]?.loc.type === 'geofence' && routeLocs[0]?.loc.geofenceId === gf.id) role = 'origin';
          else if (routeLocs[routeLocs.length - 1]?.loc.type === 'geofence' && routeLocs[routeLocs.length - 1]?.loc.geofenceId === gf.id) role = 'destination';

          return {
            ...feature,
            properties: {
              id: gf.id,
              name: gf.name,
              role,
            },
          } as GeoJSON.Feature;
        })
        .filter((f): f is GeoJSON.Feature => f !== null);

      const gfData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: gfFeatures };

      const existingGfSource = map.getSource(GF_SOURCE_ID) as unknown as GeoJSONSourceLike | undefined;
      if (!existingGfSource) {
        map.addSource(GF_SOURCE_ID, { type: 'geojson', data: gfData });
      } else {
        existingGfSource.setData(gfData);
      }

      if (!map.getLayer(GF_FILL_LAYER_ID)) {
        map.addLayer({
          id: GF_FILL_LAYER_ID,
          type: 'fill',
          source: GF_SOURCE_ID,
          paint: {
            'fill-color': [
              'match', ['get', 'role'], 
              'origin', '#3b82f6', // blue
              'destination', '#10b981', // green
              '#f59e0b' // yellow for stops
            ],
            'fill-opacity': 0.3,
          },
        });
      }

      if (!map.getLayer(GF_OUTLINE_LAYER_ID)) {
        map.addLayer({
          id: GF_OUTLINE_LAYER_ID,
          type: 'line',
          source: GF_SOURCE_ID,
          paint: {
            'line-color': [
              'match', ['get', 'role'], 
              'origin', '#2563eb', 
              'destination', '#059669',
              '#d97706'
            ],
            'line-width': 2,
          },
        });
      }

      // 2. Render Coordinates (Markers) and Radius
      const coordFeatures: GeoJSON.Feature[] = [];
      const coordRadiusFeatures: GeoJSON.Feature[] = [];
      
      routeLocs.forEach(({loc, role}) => {
        if (loc.type === 'coordinate' && loc.latitude !== undefined && loc.longitude !== undefined) {
          coordFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [loc.longitude, loc.latitude]
            },
            properties: {
              role,
              address: loc.address || 'Unknown'
            }
          });

          if (loc.radius) {
            coordRadiusFeatures.push({
              type: 'Feature',
              geometry: createCirclePolygon(loc.latitude, loc.longitude, loc.radius),
              properties: { role }
            });
          }
        }
      });

      const coordData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: coordFeatures };
      const coordRadiusData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: coordRadiusFeatures };

      const existingRadiusSource = map.getSource(RADIUS_SOURCE_ID) as unknown as GeoJSONSourceLike | undefined;
      if (!existingRadiusSource) {
        map.addSource(RADIUS_SOURCE_ID, { type: 'geojson', data: coordRadiusData });
      } else {
        existingRadiusSource.setData(coordRadiusData);
      }

      if (!map.getLayer(RADIUS_FILL_LAYER_ID)) {
        map.addLayer({
          id: RADIUS_FILL_LAYER_ID,
          type: 'fill',
          source: RADIUS_SOURCE_ID,
          paint: {
            'fill-color': [
              'match', ['get', 'role'], 
              'origin', '#3b82f6', // blue
              'destination', '#10b981', // green
              '#f59e0b' // yellow
            ],
            'fill-opacity': 0.15,
          },
        });
      }

      if (!map.getLayer(RADIUS_OUTLINE_LAYER_ID)) {
        map.addLayer({
          id: RADIUS_OUTLINE_LAYER_ID,
          type: 'line',
          source: RADIUS_SOURCE_ID,
          paint: {
            'line-color': [
              'match', ['get', 'role'], 
              'origin', '#2563eb', 
              'destination', '#059669',
              '#d97706'
            ],
            'line-width': 1,
            'line-dasharray': [4, 4],
          },
        });
      }

      const existingCoordSource = map.getSource(COORD_SOURCE_ID) as unknown as GeoJSONSourceLike | undefined;
      if (!existingCoordSource) {
        map.addSource(COORD_SOURCE_ID, { type: 'geojson', data: coordData });
      } else {
        existingCoordSource.setData(coordData);
      }

      if (!map.getLayer(COORD_POINT_LAYER_ID)) {
        map.addLayer({
          id: COORD_POINT_LAYER_ID,
          type: 'circle',
          source: COORD_SOURCE_ID,
          paint: {
            'circle-radius': 8,
            'circle-color': [
              'match', ['get', 'role'], 
              'origin', '#2563eb', 
              'destination', '#059669',
              '#d97706'
            ],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          },
        });
      }

      // 3. Render Planned Path
      const pathData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      if (selectedRoute?.plannedPath && editorMode === 'idle') {
        const pathFeature = geometryToGeoJSON(selectedRoute.plannedPath);
        if (pathFeature) {
          pathData.features.push(pathFeature as GeoJSON.Feature);
        }
      }

      const existingPathSource = map.getSource(PATH_SOURCE_ID) as unknown as GeoJSONSourceLike | undefined;
      if (!existingPathSource) {
        map.addSource(PATH_SOURCE_ID, { type: 'geojson', data: pathData });
      } else {
        existingPathSource.setData(pathData);
      }

      if (!map.getLayer(PATH_LAYER_ID)) {
        map.addLayer({
          id: PATH_LAYER_ID,
          type: 'line',
          source: PATH_SOURCE_ID,
          paint: {
            'line-color': '#F59E0B', // Gold / Amber
            'line-width': 4,
            'line-dasharray': [2, 2]
          },
        });
      }
    } catch {
      // Style might be reloading
    }
  }, [map, getRouteLocations, getRouteGeofences, selectedRoute, editorMode]);

  // Hook context untuk re-render saat MapContainer dispatch style.load (basemap switch)
  useStyleLoadCallback(renderRouteLayers);

  // Direct listeners untuk style.load dan styledata pada MapLibre instance
  useEffect(() => {
    if (!map) return;

    if (map.isStyleLoaded()) {
      renderRouteLayers();
    }

    const handleStyleEvent = () => {
      if (map.isStyleLoaded()) {
        renderRouteLayers();
      }
    };

    map.on('style.load', handleStyleEvent);
    map.on('styledata', handleStyleEvent);

    return () => {
      try {
        map.off('style.load', handleStyleEvent);
        map.off('styledata', handleStyleEvent);
      } catch {
        // ignore
      }
    };
  }, [map, renderRouteLayers]);

  // Re-render saat basemap state atau selectedRoute berubah
  useEffect(() => {
    if (!map) return;
    if (map.isStyleLoaded()) {
      renderRouteLayers();
    }
  }, [map, basemap, renderRouteLayers]);

  // Cleanup layer saat unmount
  useEffect(() => {
    return () => {
      try {
        if (!map || !map.getStyle()) return;
        if (map.getLayer(GF_FILL_LAYER_ID)) map.removeLayer(GF_FILL_LAYER_ID);
        if (map.getLayer(GF_OUTLINE_LAYER_ID)) map.removeLayer(GF_OUTLINE_LAYER_ID);
        if (map.getSource(GF_SOURCE_ID)) map.removeSource(GF_SOURCE_ID);
        
        if (map.getLayer(COORD_POINT_LAYER_ID)) map.removeLayer(COORD_POINT_LAYER_ID);
        if (map.getSource(COORD_SOURCE_ID)) map.removeSource(COORD_SOURCE_ID);

        if (map.getLayer(RADIUS_FILL_LAYER_ID)) map.removeLayer(RADIUS_FILL_LAYER_ID);
        if (map.getLayer(RADIUS_OUTLINE_LAYER_ID)) map.removeLayer(RADIUS_OUTLINE_LAYER_ID);
        if (map.getSource(RADIUS_SOURCE_ID)) map.removeSource(RADIUS_SOURCE_ID);

        if (map.getLayer(PATH_LAYER_ID)) map.removeLayer(PATH_LAYER_ID);
        if (map.getSource(PATH_SOURCE_ID)) map.removeSource(PATH_SOURCE_ID);
      } catch {
        // ignore
      }
    };
  }, [map]);

  const handleResetNorth = () => {
    if (map) {
      map.resetNorthPitch({ duration: 1000 });
    }
  };

  const handleFindRoutesInRadius = (
    center: { lat: number; lng: number },
    radiusMeters: number
  ): SearchAreaRouteResult[] => {
    if (!routes || routes.length === 0) return [];

    const results: SearchAreaRouteResult[] = [];

    for (const rt of routes) {
      const { minDistance, coordinates } = getRouteDistance(center, rt, geofences);
      if (minDistance <= radiusMeters) {
        const group = groups?.find((g) => g.id === rt.groupId);
        results.push({
          id: rt.id,
          name: rt.name,
          groupName: group?.name,
          distance: Math.round(minDistance),
          status: rt.status,
          plannedDistance: rt.plannedDistance,
          estimatedDuration: rt.estimatedDuration,
          coordinates,
        });
      }
    }

    return results.sort((a, b) => a.distance - b.distance);
  };

  return (
    <div id="route-map-container" className="h-full w-full relative">
      <MapContainer
      ref={mapContainerRef}
      viewport={viewport}
      onViewportChange={setViewport}
      basemap={basemap}
      className="h-full w-full"
      toolbarSlot={
        <MapControlPanel
          isLiveTracking={false}
          basemap={basemap}
          onBasemapChange={setBasemap}
          mapContainerRef={mapContainerRef}
          onFitSelected={handleFit}
          onResetNorth={handleResetNorth}
          onSearchAddress={defaultNominatimSearch}
          showMeasureTool={false}
          onFindRoutesInRadius={routes ? handleFindRoutesInRadius : undefined}
          onSelectSearchRoute={onSelectRoute}
          onHighlightArea={setHighlightedArea}
        />
      }
    >
      <ActiveSearchAreaRenderer highlight={highlightedArea} />
      <GeometryEditor
        mode={editorMode === 'select-location' ? 'idle' : editorMode}
        initialGeometry={editorGeometry}
        onChange={onEditorGeometryChange}
      />
    </MapContainer>
    </div>
  );
}

export function RouteMap(props: RouteMapProps) {
  return (
    <div className="h-full w-full relative">
      <MapProvider>
        <RouteMapInner {...props} />
      </MapProvider>
    </div>
  );
}
