'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer } from '@binago/maps';
import { PlaybackData } from '../types';

export interface PlaybackMapProps {
  data: PlaybackData;
  currentIndex: number;
}

export function PlaybackMap({ data, currentIndex }: PlaybackMapProps) {
  const currentPoint = data.points[currentIndex];
  
  const [viewport, setViewport] = useState({
    center: {
      lat: currentPoint?.lat || -6.200000,
      lng: currentPoint?.lng || 106.816666,
    },
    zoom: 14,
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

  return (
    <MapContainer
      viewport={viewport}
      onViewportChange={setViewport}
      placeholderText={`Memutar perjalanan ${data.tripId} | Lokasi: ${currentPoint?.lat.toFixed(4)}, ${currentPoint?.lng.toFixed(4)}`}
      className="w-full h-full border-0 rounded-none min-h-0"
    >
      {/* 
        Ideally, we would render a Polyline for the path and a Marker for the vehicle here.
        Since we are using a mock MapContainer foundation, we will visually represent this 
        via the placeholder text and viewport re-centering.
      */}
      {currentPoint && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md z-10" />
          <div className="bg-white px-2 py-1 rounded shadow text-xs mt-1 font-semibold whitespace-nowrap z-20">
            {currentPoint.speed} km/h
          </div>
        </div>
      )}
    </MapContainer>
  );
}
