import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as maplibregl from 'maplibre-gl';
import { useInternalMap } from './MapContext';

export interface MapMarkerProps {
  /**
   * Unique ID of the marker (e.g. entity id)
   */
  id: string;
  /**
   * Coordinate of the marker
   */
  position: { lat: number; lng: number };
  /**
   * Heading/rotation of the marker in degrees (0-360)
   */
  heading?: number;
  /**
   * Custom marker element
   */
  children?: React.ReactNode;
}

export function MapMarker({
  id,
  position,
  heading = 0,
  children,
}: MapMarkerProps) {
  const map = useInternalMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lazy initialize DOM element once
  if (!containerRef.current && typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.className = 'map-marker-container';
    containerRef.current = el;
  }

  // Manage Marker lifecycle on map
  useEffect(() => {
    if (!map || !containerRef.current || !position || isNaN(position.lat) || isNaN(position.lng)) {
      return;
    }

    const el = containerRef.current;
    el.setAttribute('data-marker-id', id);

    // If marker doesn't exist, create and add it
    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({
        element: el,
        rotation: heading,
      })
        .setLngLat([position.lng, position.lat])
        .addTo(map);
    } else {
      // If marker exists, update coordinate and rotation
      markerRef.current.setLngLat([position.lng, position.lat]);
      markerRef.current.setRotation(heading);

      // Verify DOM attachment in MapLibre canvas container
      if (!el.parentNode) {
        markerRef.current.addTo(map);
      }
    }
  }, [map, id, position?.lat, position?.lng, heading]);

  // Robust re-attachment listener for style changes, basemap switches, styledata, and window resize
  useEffect(() => {
    if (!map) return;

    const handleReattach = () => {
      if (markerRef.current && containerRef.current) {
        if (!containerRef.current.parentNode) {
          markerRef.current.addTo(map);
        }
      }
    };

    map.on('style.load', handleReattach);
    map.on('styledata', handleReattach);
    map.on('load', handleReattach);
    map.on('resize', handleReattach);

    return () => {
      map.off('style.load', handleReattach);
      map.off('styledata', handleReattach);
      map.off('load', handleReattach);
      map.off('resize', handleReattach);
    };
  }, [map]);

  // Cleanup on unmount or id change
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [id]);

  if (!containerRef.current) return null;

  // Render children into the DOM element controlled by MapLibre
  return createPortal(children, containerRef.current);
}
