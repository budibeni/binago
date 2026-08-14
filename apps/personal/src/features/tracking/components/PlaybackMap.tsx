'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer } from '@adatrack/maps';
import { PlaybackData } from '../types';

export interface PlaybackMapProps {
  data: PlaybackData;
  currentIndex: number;
}

export function PlaybackMap({ data, currentIndex }: PlaybackMapProps) {
  const currentPoint = data.points[currentIndex];
  const allPoints = data.points;

  const [viewport, setViewport] = useState({
    center: {
      lat: currentPoint?.lat ?? -6.200000,
      lng: currentPoint?.lng ?? 106.816666,
    },
    zoom: 15,
  });

  // Re-center map when point changes
  useEffect(() => {
    if (currentPoint) {
      setViewport(prev => ({
        ...prev,
        center: {
          lat: currentPoint.lat,
          lng: currentPoint.lng,
        }
      }));
    }
  }, [currentPoint]);

  // Calculate heading angle for vehicle marker rotation
  const getHeading = () => {
    if (currentPoint?.heading !== undefined) return currentPoint.heading;
    if (currentIndex > 0) {
      const prev = allPoints[currentIndex - 1];
      const curr = currentPoint;
      if (prev && curr) {
        const dLng = curr.lng - prev.lng;
        const dLat = curr.lat - prev.lat;
        return (Math.atan2(dLng, dLat) * 180) / Math.PI;
      }
    }
    return 0;
  };

  const heading = getHeading();

  return (
    <MapContainer
      viewport={viewport}
      onViewportChange={setViewport}
      placeholderText=""
      className="w-full h-full border-0 rounded-none min-h-0"
    >
      {currentPoint && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          {/* Outer pulse ring */}
          <div className="absolute inset-0 -m-3 w-[calc(100%+24px)] h-[calc(100%+24px)] rounded-full bg-red-500/20 animate-ping" />
          {/* Vehicle icon container */}
          <div
            className="relative w-10 h-10 flex items-center justify-center"
            style={{ transform: `rotate(${heading}deg)` }}
            aria-hidden="true"
          >
            {/* Marker body */}
            <div className="w-9 h-9 bg-red-600 rounded-full border-2 border-white shadow-[0_4px_16px_rgba(220,38,38,0.5)] flex items-center justify-center">
              {/* Car icon using SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
          </div>
        </div>
      )}
    </MapContainer>
  );
}
