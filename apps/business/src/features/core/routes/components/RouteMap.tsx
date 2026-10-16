'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  MapContainer,
  MapControlPanel,
  GeometryEditor,
  useMapActions,
  useStyleLoadCallback,
  MapContext,
  type MapGeometry,
  type BasemapId,
  geometryToGeoJSON,
  calcEntityBounds,
  defaultNominatimSearch,
  MapProvider,
} from '@adatrack/maps';
import type { Route, RouteLocation, MapInteractionMode } from '../types';
import type { Geofence } from '../../geofences/types';
import { extractRouteCoordinates } from '../utils/routeGeometry';

function createCirclePolygon(lat: number, lng: number, radiusInMeters: number, points = 64): any {
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

const GF_SOURCE_ID = 'adatrack-route-geofences-source';
const GF_FILL_LAYER_ID = 'adatrack-route-geofences-fill';
const GF_OUTLINE_LAYER_ID = 'adatrack-route-geofences-outline';

const RADIUS_SOURCE_ID = 'route-radius-source';
const RADIUS_FILL_LAYER_ID = 'route-radius-fill';
const RADIUS_OUTLINE_LAYER_ID = 'route-radius-outline';

const COORD_SOURCE_ID = 'adatrack-route-coord-source';
const COORD_POINT_LAYER_ID = 'adatrack-route-coord-point';

const PATH_SOURCE_ID = 'adatrack-route-path-source';
const PATH_CASING_LAYER_ID = 'adatrack-route-path-casing';
const PATH_LAYER_SOLID_ID = 'adatrack-route-path-line-solid';
const PATH_LAYER_DASHED_ID = 'adatrack-route-path-line-dashed';

interface RouteMapProps {
  geofences: Geofence[];
  selectedRoute: Route | null;
  editorMode: MapInteractionMode;
  editorGeometry: MapGeometry | null;
  onEditorGeometryChange: (geometry: MapGeometry | null) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

function RouteMapInner({
  geofences,
  selectedRoute,
  editorMode,
  editorGeometry,
  onEditorGeometryChange,
  onMapClick,
}: RouteMapProps) {
  const { map } = React.useContext(MapContext);
  const actions = useMapActions();
  const [basemap, setBasemap] = useState<BasemapId>('standard');
  const [viewport, setViewport] = useState({ center: { lng: 106.8271, lat: -6.1751 }, zoom: 11 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getRouteLocations = useCallback(() => {
    if (!selectedRoute) return [];
    return [
      { loc: selectedRoute.origin, role: 'origin' },
      ...selectedRoute.stops.map(s => ({ loc: s.location, role: 'stop' })),
      { loc: selectedRoute.destination, role: 'destination' }
    ];
  }, [selectedRoute]);

  const getRouteGeofences = useCallback(() => {
    if (!selectedRoute) return geofences;
    
    const geofenceIds = new Set<string>();
    const routeLocs = getRouteLocations();
    routeLocs.forEach(({loc}) => {
      if (loc && loc.type === 'geofence' && loc.geofenceId) {
        geofenceIds.add(String(loc.geofenceId));
      }
    });

    return geofences.filter(gf => geofenceIds.has(String(gf.id)));
  }, [selectedRoute, geofences, getRouteLocations]);

  const handleFit = useCallback(() => {
    if (!map) return;
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
      if (loc && loc.type === 'coordinate' && loc.latitude !== undefined && loc.longitude !== undefined) {
        allCoords.push({ lat: loc.latitude, lng: loc.longitude });
      }
    });

    // Fit Route Coordinates
    if (selectedRoute) {
      const effectiveRoute = editorGeometry
        ? { ...selectedRoute, plannedPath: editorGeometry }
        : selectedRoute;
      const coords = extractRouteCoordinates(effectiveRoute, targetGeofences);
      coords.forEach(([lng, lat]) => {
        allCoords.push({ lat, lng });
      });
    }

    if (allCoords.length === 0) return;

    const bounds = calcEntityBounds(allCoords);
    if (bounds) {
       actions.fitBounds(bounds, { padding: 50 });
    }
  }, [map, selectedRoute, geofences, editorGeometry, actions, getRouteGeofences, getRouteLocations]);

  // Pan to selected route when it changes (only on route ID change, not on basemap switch)
  const lastRouteIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!map || !selectedRoute) return;
    const routeId = selectedRoute.id;
    if (lastRouteIdRef.current !== routeId) {
      lastRouteIdRef.current = routeId;
      handleFit();
    }
  }, [map, selectedRoute, handleFit]);

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

  // Render geofences, coordinates and planned path
  const render = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    const routeLocs = getRouteLocations();

    // 1. Render Geofences
    const targetGeofences = getRouteGeofences();
    const gfFeatures = targetGeofences
      .map((gf) => {
        try {
          if (!gf?.geometry) return null;
          const feature = geometryToGeoJSON(gf.geometry) as any;
          if (!feature || !feature.geometry) return null;
          
          // Find role for this geofence
          let role = 'stop';
          if (routeLocs[0]?.loc?.type === 'geofence' && String(routeLocs[0]?.loc?.geofenceId) === String(gf.id)) role = 'origin';
          else if (routeLocs[routeLocs.length - 1]?.loc?.type === 'geofence' && String(routeLocs[routeLocs.length - 1]?.loc?.geofenceId) === String(gf.id)) role = 'destination';
          
          feature.properties = { 
            id: gf.id, 
            name: gf.name,
            role
          };
          return feature;
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    const gfData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: gfFeatures };

    try {
      if (!map.getSource(GF_SOURCE_ID)) {
        map.addSource(GF_SOURCE_ID, { type: 'geojson', data: gfData });
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
      } else {
        (map.getSource(GF_SOURCE_ID) as any).setData(gfData);
      }
    } catch (err) {
      console.warn('Failed to update geofence layers in RouteMap:', err);
    }

    // 2. Render Coordinates (Markers) and Radius
    const coordFeatures: any[] = [];
    const coordRadiusFeatures: any[] = [];
    
    routeLocs.forEach(({loc, role}) => {
      if (loc && loc.type === 'coordinate' && loc.latitude !== undefined && loc.longitude !== undefined) {
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

    try {
      if (!map.getSource(RADIUS_SOURCE_ID)) {
        map.addSource(RADIUS_SOURCE_ID, { type: 'geojson', data: coordRadiusData });
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
      } else {
        (map.getSource(RADIUS_SOURCE_ID) as any).setData(coordRadiusData);
      }

      if (!map.getSource(COORD_SOURCE_ID)) {
        map.addSource(COORD_SOURCE_ID, { type: 'geojson', data: coordData });
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
      } else {
        (map.getSource(COORD_SOURCE_ID) as any).setData(coordData);
      }
    } catch (err) {
      console.warn('Failed to update coordinate layers in RouteMap:', err);
    }

    // 3. Render Planned Path
    try {
      const pathData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      const effectiveRoute = selectedRoute
        ? {
            ...selectedRoute,
            plannedPath: editorGeometry || selectedRoute.plannedPath,
          }
        : null;

      // Do NOT hide route when in 'select-location' mode; only hide if manually drawing new multiline
      if (effectiveRoute && editorMode !== 'draw_multiline') {
        const coords = extractRouteCoordinates(effectiveRoute, geofences);
        if (coords.length > 1) {
          pathData.features.push({
            type: 'Feature',
            properties: { isPlanned: !!effectiveRoute.plannedPath },
            geometry: { type: 'LineString', coordinates: coords }
          });
        }
      }

      if (!map.getSource(PATH_SOURCE_ID)) {
        map.addSource(PATH_SOURCE_ID, { type: 'geojson', data: pathData });
        
        // Contrast casing layer for clear visibility across all basemaps (satellite, dark, etc.)
        map.addLayer({
          id: PATH_CASING_LAYER_ID,
          type: 'line',
          source: PATH_SOURCE_ID,
          filter: ['==', ['geometry-type'], 'LineString'],
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b0764',
            'line-width': 6,
            'line-opacity': 0.5,
          },
        });

        // Main route line layer (solid if planned, dashed if fallback straight line)
        map.addLayer({
          id: PATH_LAYER_SOLID_ID,
          type: 'line',
          source: PATH_SOURCE_ID,
          filter: ['==', ['geometry-type'], 'LineString'],
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#8b5cf6',
            'line-width': 4,
            'line-dasharray': [
              'case',
              ['boolean', ['get', 'isPlanned'], false],
              ['literal', [1, 0]],
              ['literal', [2, 2]]
            ],
          },
        });
      } else {
        (map.getSource(PATH_SOURCE_ID) as any).setData(pathData);
      }
    } catch (err) {
      console.warn('Failed to update path layers in RouteMap:', err);
    }
  }, [map, geofences, selectedRoute, editorMode, editorGeometry, getRouteLocations, getRouteGeofences]);


  // Hook for style reload / basemap switch: automatic re-registration of layers
  useStyleLoadCallback(render);

  // Map effect on mount, style ready, or data change
  useEffect(() => {
    if (!map) return;
    if (map.isStyleLoaded()) {
      render();
    } else {
      map.once('styledata', render);
    }
  }, [map, render]);

  // Clean up layers when component unmounts
  useEffect(() => {
    return () => {
      if (map && map.getStyle()) {
        try {
          if (map.getLayer(GF_FILL_LAYER_ID)) map.removeLayer(GF_FILL_LAYER_ID);
          if (map.getLayer(GF_OUTLINE_LAYER_ID)) map.removeLayer(GF_OUTLINE_LAYER_ID);
          if (map.getSource(GF_SOURCE_ID)) map.removeSource(GF_SOURCE_ID);
          
          if (map.getLayer(RADIUS_FILL_LAYER_ID)) map.removeLayer(RADIUS_FILL_LAYER_ID);
          if (map.getLayer(RADIUS_OUTLINE_LAYER_ID)) map.removeLayer(RADIUS_OUTLINE_LAYER_ID);
          if (map.getSource(RADIUS_SOURCE_ID)) map.removeSource(RADIUS_SOURCE_ID);

          if (map.getLayer(COORD_POINT_LAYER_ID)) map.removeLayer(COORD_POINT_LAYER_ID);
          if (map.getSource(COORD_SOURCE_ID)) map.removeSource(COORD_SOURCE_ID);

          if (map.getLayer(PATH_LAYER_SOLID_ID)) map.removeLayer(PATH_LAYER_SOLID_ID);
          if (map.getLayer(PATH_LAYER_DASHED_ID)) map.removeLayer(PATH_LAYER_DASHED_ID);
          if (map.getLayer(PATH_CASING_LAYER_ID)) map.removeLayer(PATH_CASING_LAYER_ID);
          if (map.getSource(PATH_SOURCE_ID)) map.removeSource(PATH_SOURCE_ID);
        } catch (e) {
          // ignore unmount errors
        }
      }
    };
  }, [map]);


  const handleResetNorth = () => {
    if (map) {
      map.resetNorthPitch({ duration: 1000 });
    }
  };

  return (
    <MapContainer
      ref={mapContainerRef}
      viewport={viewport}
      onViewportChange={setViewport}
      basemap={basemap}
      className="h-full w-full"
      toolbarSlot={
        <MapControlPanel
          basemap={basemap}
          onBasemapChange={setBasemap}
          mapContainerRef={mapContainerRef}
          onFitSelected={handleFit}
          onResetNorth={handleResetNorth}
          onSearchAddress={defaultNominatimSearch}
          showGeofenceTool={false}
          showMeasureTool={false}
        />
      }
    >
      <GeometryEditor
        mode={editorMode === 'select-location' ? 'idle' : editorMode}
        initialGeometry={editorGeometry}
        onChange={onEditorGeometryChange}
      />
    </MapContainer>
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
