'use client';

import React, { useMemo } from 'react';
import { TripDetailHeader } from './components/TripDetailHeader';
import { TripDetailSummary } from './components/TripDetailSummary';
import { TripMap } from './components/TripMap';
import { TripTimeline } from './components/TripTimeline';
import { tripService, vehicleService, driverService } from '@/data/services';
import type { Trip } from './types/trips';

export interface TripDetailFeatureProps {
  id: string;
}

export function TripDetailFeature({ id }: TripDetailFeatureProps) {
  const trip = useMemo(() => {
    const r = tripService.getTrips().find(t => t.id === id);
    if (!r) return undefined;
    return {
      id: r.id,
      vehicleId: r.vehicleId,
      vehicleName: vehicleService.getVehicles().find(v => v.id === r.vehicleId)?.plateNumber || 'Unknown',
      driverId: r.driverId || undefined,
      driverName: driverService.getDrivers().find(d => d.id === r.driverId)?.name,
      startTime: r.startTime,
      endTime: r.endTime || null,
      origin: r.startAddress,
      destination: r.endAddress,
      distance: r.distance,
      duration: r.duration,
      movingDuration: r.duration,
      stoppedDuration: 0,
      stopCount: 0,
      averageSpeed: r.avgSpeed,
      maxSpeed: r.maxSpeed,
      status: r.status === 'completed' ? 'completed' : 'ongoing',
      routeId: r.routeId || undefined,
      events: r.events.map(e => ({
        id: e.id,
        time: e.timestamp,
        type: e.type as any,
        title: e.description,
        location: [e.longitude, e.latitude] as [number, number],
      })),
      track: r.track
    } as Trip;
  }, [id]);

  if (!trip) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-8">
        <h1 className="text-xl font-bold text-foreground mb-2">Trip Not Found</h1>
        <p className="text-sm text-foreground-muted">The requested trip data could not be found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col">
        <TripDetailHeader trip={trip} />
        <TripDetailSummary trip={trip} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-2 flex flex-col min-h-[400px]">
            <TripMap trip={trip} />
          </div>
          <div className="lg:col-span-1 flex flex-col max-h-[600px]">
            <TripTimeline trip={trip} />
          </div>
        </div>
      </div>
    </div>
  );
}
