'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  MapControlPanel,
  GeometryEditor,
  useMapActions,
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

  const getRouteLocations = () => {
    if (!selectedRoute) return [];
    return [
      { loc: selectedRoute.origin, role: 'origin' },
      ...selectedRoute.stops.map(s => ({ loc: s.location, role: 'stop' })),
      { loc: selectedRoute.destination, role: 'destination' }
    ];
  };

  const getRouteGeofences = () => {
    if (!selectedRoute) return geofences;
    
    const geofenceIds = new Set<string>();
    const routeLocs = getRouteLocations();
    routeLocs.forEach(({loc}) => {
      if (loc.type === 'geofence' && loc.geofenceId) {
        geofenceIds.add(loc.geofenceId);
      }
    });

    return geofences.filter(gf => geofenceIds.has(gf.id));
  };

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

  // Render geofences, coordinates and planned path
  useEffect(() => {
    if (!map) return;
    const gfSourceId = 'adatrack-route-geofences-source';
    const gfFillLayerId = 'adatrack-route-geofences-fill';
    const gfOutlineLayerId = 'adatrack-route-geofences-outline';
    
    const coordSourceId = 'adatrack-route-coord-source';
    const coordPointLayerId = 'adatrack-route-coord-point';

    const pathSourceId = 'adatrack-route-path-source';
    const pathLayerId = 'adatrack-route-path-line';

    const render = () => {
      const routeLocs = getRouteLocations();

      // 1. Render Geofences
      const targetGeofences = getRouteGeofences();
      const gfFeatures = targetGeofences.map((gf) => {
        const feature = geometryToGeoJSON(gf.geometry) as any;
        
        // Find role for this geofence
        let role = 'stop';
        if (routeLocs[0].loc.type === 'geofence' && routeLocs[0].loc.geofenceId === gf.id) role = 'origin';
        else if (routeLocs[routeLocs.length - 1].loc.type === 'geofence' && routeLocs[routeLocs.length - 1].loc.geofenceId === gf.id) role = 'destination';
        
        feature.properties = { 
          id: gf.id, 
          name: gf.name,
          role
        };
        return feature;
      });

      const gfData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: gfFeatures };

      if (!map.getSource(gfSourceId)) {
        map.addSource(gfSourceId, { type: 'geojson', data: gfData });
        map.addLayer({
          id: gfFillLayerId,
          type: 'fill',
          source: gfSourceId,
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
          id: gfOutlineLayerId,
          type: 'line',
          source: gfSourceId,
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
        (map.getSource(gfSourceId) as any).setData(gfData);
      }

      // 2. Render Coordinates (Markers) and Radius
      const coordFeatures: any[] = [];
      const coordRadiusFeatures: any[] = [];
      
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

      const radiusSourceId = 'route-radius-source';
      const radiusFillLayerId = 'route-radius-fill';
      const radiusOutlineLayerId = 'route-radius-outline';

      if (!map.getSource(radiusSourceId)) {
        map.addSource(radiusSourceId, { type: 'geojson', data: coordRadiusData });
        map.addLayer({
          id: radiusFillLayerId,
          type: 'fill',
          source: radiusSourceId,
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
          id: radiusOutlineLayerId,
          type: 'line',
          source: radiusSourceId,
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
        (map.getSource(radiusSourceId) as any).setData(coordRadiusData);
      }

      if (!map.getSource(coordSourceId)) {
        map.addSource(coordSourceId, { type: 'geojson', data: coordData });
        map.addLayer({
          id: coordPointLayerId,
          type: 'circle',
          source: coordSourceId,
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
        (map.getSource(coordSourceId) as any).setData(coordData);
      }

      // 3. Render Planned Path
      const pathData: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };
      if (selectedRoute?.plannedPath && editorMode === 'idle') {
        const pathFeature = geometryToGeoJSON(selectedRoute.plannedPath);
        pathData.features.push(pathFeature as any);
      }

      if (!map.getSource(pathSourceId)) {
        map.addSource(pathSourceId, { type: 'geojson', data: pathData });
        map.addLayer({
          id: pathLayerId,
          type: 'line',
          source: pathSourceId,
          paint: {
            'line-color': '#8b5cf6', // purple
            'line-width': 4,
            'line-dasharray': [2, 2]
          },
        });
      } else {
        (map.getSource(pathSourceId) as any).setData(pathData);
      }
    };

    if (map.isStyleLoaded()) {
      render();
    } else {
      map.once('styledata', render);
    }

    return () => {
      if (map?.getStyle()) {
        if (map.getLayer(gfFillLayerId)) map.removeLayer(gfFillLayerId);
        if (map.getLayer(gfOutlineLayerId)) map.removeLayer(gfOutlineLayerId);
        if (map.getSource(gfSourceId)) map.removeSource(gfSourceId);
        
        if (map.getLayer(coordPointLayerId)) map.removeLayer(coordPointLayerId);
        if (map.getSource(coordSourceId)) map.removeSource(coordSourceId);

        if (map.getLayer(pathLayerId)) map.removeLayer(pathLayerId);
        if (map.getSource(pathSourceId)) map.removeSource(pathSourceId);
      }
    };
  }, [map, geofences, selectedRoute, editorMode]);

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
