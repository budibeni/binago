import React, { useEffect, useRef, useState } from 'react';
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
  const [markerElement, setMarkerElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log(`[MapMarker ${id}] map:`, !!map, 'markerElement:', !!markerElement);
  }, [map, markerElement, id]);

  // Initialize the DOM element exactly once
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'map-marker-container';
    el.setAttribute('data-marker-id', id);
    setMarkerElement(el);
    
    return () => {
      // Cleanup happens via markerRef.current.remove()
    };
  }, [id]);

  // Add/update/remove marker from map
  useEffect(() => {
    if (!map || !markerElement) return;

    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({
        element: markerElement,
        rotation: heading,
      })
        .setLngLat([position.lng, position.lat])
        .addTo(map);
      
      console.log(`[MapMarker ${id}] addTo(map) called! parentNode:`, markerElement.parentNode?.nodeName, 'in DOM?', document.body.contains(markerElement));
    } else {
      markerRef.current.setLngLat([position.lng, position.lat]);
      markerRef.current.setRotation(heading);
      
      // Ensure it is on map if it was previously removed
      const currentEl = markerRef.current.getElement();
      if (!currentEl.parentNode) {
        markerRef.current.addTo(map);
      }
    }
  }, [map, markerElement, position.lat, position.lng, heading]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []);

  if (!markerElement) return null;

  // Render children into the DOM element controlled by MapLibre
  return createPortal(children, markerElement);
}
