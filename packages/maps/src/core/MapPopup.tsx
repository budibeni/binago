import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useInternalMap } from './MapContext';

export interface MapPopupProps {
  position: { lat: number; lng: number };
  children: React.ReactNode;
  onClose?: () => void;
  offset?: number | [number, number];
}

export function MapPopup({ position, children, onClose, offset = 15 }: MapPopupProps) {
  const map = useInternalMap();
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !containerRef.current) return;

    if (!popupRef.current) {
      popupRef.current = new maplibregl.Popup({
        closeButton: !!onClose,
        closeOnClick: false,
        offset,
      })
        .setDOMContent(containerRef.current)
        .setLngLat([position.lng, position.lat])
        .addTo(map);

      if (onClose) {
        popupRef.current.on('close', onClose);
      }
    } else {
      popupRef.current.setLngLat([position.lng, position.lat]);
    }
  }, [map, position.lat, position.lng, offset, onClose]);

  useEffect(() => {
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ display: 'none' }}>
      <div ref={containerRef} className="map-popup-container">
        {children}
      </div>
    </div>
  );
}
