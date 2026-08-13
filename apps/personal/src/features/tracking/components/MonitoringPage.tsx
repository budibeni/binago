'use client';

import React, { useState, useMemo } from 'react';
import { VehicleList } from './VehicleList';
import { VehicleDetail } from './VehicleDetail';
import { LiveMap } from './LiveMap';
import { PlaybackPage } from './PlaybackPage';
import { mockVehicles, mockTripsByVehicleId, mockPlaybackData } from '../data/mockTrackingData';
import { VehicleStatus, Trip } from '../types';
import { cn } from '@binago/utils';

export function MonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
  const [isListVisible, setIsListVisible] = useState(true);
  const [playbackTripId, setPlaybackTripId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter((vehicle) => {
      if (statusFilter !== 'all' && vehicle.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchPlate = vehicle.plateNumber.toLowerCase().includes(query);
        const matchName = vehicle.name?.toLowerCase().includes(query) ?? false;
        if (!matchPlate && !matchName) return false;
      }
      return true;
    });
  }, [searchQuery, statusFilter]);

  const selectedVehicle = useMemo(() => {
    return mockVehicles.find(v => v.id === selectedVehicleId);
  }, [selectedVehicleId]);

  const selectedVehicleTrips = useMemo(() => {
    if (!selectedVehicleId) return [];
    return mockTripsByVehicleId[selectedVehicleId] || [];
  }, [selectedVehicleId]);

  const activePlaybackData = useMemo(() => {
    if (!playbackTripId) return null;
    return mockPlaybackData.find(d => d.tripId === playbackTripId) || null;
  }, [playbackTripId]);

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    setIsListVisible(true);
  };

  const handleBackToList = () => {
    setSelectedVehicleId(undefined);
  };

  const handleTripSelect = (trip: Trip) => {
    setPlaybackTripId(trip.id);
    setSelectedTrip(trip);
  };

  const handleBackFromPlayback = () => {
    setPlaybackTripId(null);
    setSelectedTrip(null);
  };

  // If in playback mode, render full-view PlaybackPage
  if (playbackTripId && activePlaybackData) {
    return (
      <PlaybackPage 
        playbackData={activePlaybackData} 
        trip={selectedTrip}
        vehicle={selectedVehicle}
        onBack={handleBackFromPlayback} 
      />
    );
  }

  // Otherwise, render normal monitoring view
  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-100 flex flex-col">
      {/* Map Area - Full Background */}
      <div className="absolute inset-0 z-0">
        <LiveMap
          vehicles={filteredVehicles}
          selectedVehicleId={selectedVehicleId}
        />
      </div>
      
      {/* Floating Panel for List / Detail */}
      <div 
        className={cn(
          "absolute z-10 bottom-0 left-0 right-0 top-auto md:top-4 md:bottom-4 md:left-4 md:right-auto md:w-[380px] pointer-events-none flex flex-col justify-end md:justify-start transition-all duration-300 ease-in-out",
          selectedVehicleId
            ? "h-[60vh] md:h-auto md:max-h-full"
            : isListVisible 
              ? "h-[55vh] md:h-auto md:max-h-full" 
              : "h-[56px] md:h-[56px]" // matches header height approx
        )}
      >
        <div className="pointer-events-auto bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-200/60 h-full flex flex-col rounded-t-3xl md:rounded-2xl overflow-hidden transition-all duration-300">
          {selectedVehicle ? (
            <VehicleDetail
              vehicle={selectedVehicle}
              trips={selectedVehicleTrips}
              onBack={handleBackToList}
              onTripSelect={handleTripSelect}
            />
          ) : (
            <VehicleList
              vehicles={filteredVehicles}
              selectedVehicleId={selectedVehicleId}
              onVehicleSelect={handleVehicleSelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              isListVisible={isListVisible}
              onToggleList={() => setIsListVisible(!isListVisible)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
