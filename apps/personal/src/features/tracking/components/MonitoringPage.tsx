'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { VehicleList } from './VehicleList';
import { VehicleDetail } from './VehicleDetail';
import { LiveMap } from './LiveMap';
import { PlaybackPage } from './PlaybackPage';
import { mockVehicles, mockTripsByVehicleId, mockPlaybackData } from '../data/mockTrackingData';
import { VehicleStatus, Trip } from '../types';
import { cn } from '@adatrack/utils';

export function MonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [isListVisible, setIsListVisible] = useState(true);
  const [isDetailVisible, setIsDetailVisible] = useState(() => mockVehicles.length !== 1);
  const [hiddenVehicleIds, setHiddenVehicleIds] = useState<Set<string>>(new Set());
  const [playbackTripId, setPlaybackTripId] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const vid = searchParams.get('vehicleId');
    if (vid && mockVehicles.some(v => v.id === vid)) {
      setSelectedVehicleId(vid);
      setIsListVisible(true);
      // Clean up URL without reloading
      window.history.replaceState(null, '', '/');
    }
  }, [searchParams]);

  useEffect(() => {
    // Auto-select if there is exactly 1 vehicle in the system
    if (mockVehicles.length === 1 && !selectedVehicleId) {
      setSelectedVehicleId(mockVehicles[0].id);
      setIsListVisible(true);
    }
  }, [selectedVehicleId]);

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

  const mapVehicles = useMemo(() => {
    return filteredVehicles.filter(v => !hiddenVehicleIds.has(v.id));
  }, [filteredVehicles, hiddenVehicleIds]);

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
    const d = new Date();
    setSelectedDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    setIsListVisible(true);
    setIsDetailVisible(true);
  };

  const toggleVehicleVisibility = (id: string) => {
    setHiddenVehicleIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
          visibleVehicleIds={filteredVehicles.filter(v => !hiddenVehicleIds.has(v.id)).map(v => v.id)}
        />
      </div>
      
      {/* Floating Panel for List / Detail */}
      <div 
        className={cn(
          "absolute z-10 bottom-0 left-0 right-0 top-auto md:top-4 md:bottom-4 md:left-4 md:right-auto md:w-[380px] pointer-events-none flex flex-col justify-end md:justify-start transition-all duration-300 ease-in-out",
          selectedVehicleId
            ? (isDetailVisible ? "h-[60vh] md:h-auto md:max-h-full" : "h-[56px] md:h-[56px]")
            : isListVisible 
              ? "h-[55vh] md:h-auto md:max-h-full" 
              : "h-[56px] md:h-[56px]" // matches header height approx
        )}
      >
        <div className="pointer-events-auto bg-surface shadow-2xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] border border-neutral-200 dark:border-neutral-800 h-full flex flex-col rounded-t-3xl md:rounded-2xl overflow-hidden transition-all duration-300">
          {selectedVehicle ? (
              <VehicleDetail
                vehicle={selectedVehicle}
                trips={selectedVehicleTrips}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onBack={handleBackToList}
                onTripSelect={handleTripSelect}
                showBackButton={mockVehicles.length > 1}
                isDetailVisible={isDetailVisible}
                onToggleDetail={() => setIsDetailVisible(!isDetailVisible)}
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
              hiddenVehicleIds={hiddenVehicleIds}
              onToggleVehicleVisibility={toggleVehicleVisibility}
            />
          )}
        </div>
      </div>
    </div>
  );
}
