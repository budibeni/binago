import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { useInternalMap } from './MapContext';

export interface MapPopupProps {
  position: { lat: number; lng: number };
  children: React.ReactNode;
  onClose?: () => void;
  offset?: number | [number, number];
  className?: string;
}

export function MapPopup({ position, children, onClose, offset = 15, className }: MapPopupProps) {
  const map = useInternalMap();
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  // Keep the ref up-to-date without triggering the effect
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Create popup once — only re-run when map/offset change (not onClose)
  useEffect(() => {
    if (!map || !containerRef.current) return;

    const handleClose = () => {
      onCloseRef.current?.();
    };

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset,
      className,
    })
      .setDOMContent(containerRef.current)
      .setLngLat([position.lng, position.lat])
      .addTo(map);

    popup.on('close', handleClose);
    popupRef.current = popup;

    return () => {
      popup.off('close', handleClose);
      popup.remove();
      popupRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, offset]);

  // Update position without recreating popup
  useEffect(() => {
    if (popupRef.current) {
      popupRef.current.setLngLat([position.lng, position.lat]);
    }
  }, [position.lat, position.lng]);

  return (
    <div style={{ display: 'none' }}>
      <div ref={containerRef} className="map-popup-container">
        {children}
      </div>
    </div>
  );
}
