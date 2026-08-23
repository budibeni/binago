'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import { TripFilter, type TripFilterState } from './components/TripFilter';
import { TripSummary } from './components/TripSummary';
import { TripTable } from './components/TripTable';
import { mockTrips } from './data/mockTrips';
import { mockVehicles } from '../vehicles/data/mockVehicles';
import { mockDrivers } from '../drivers/data/mockDrivers';
import type { Trip } from './types/trips';

export function TripsFeature() {
  const router = useRouter();
  const locale = useBusinessLocale() || 'id';
  const tTrips = getTranslation(locale).trips;

  const [filter, setFilter] = useState<TripFilterState>({
    startDate: '',
    endDate: '',
    vehicleId: 'all',
    driverId: 'all',
    status: 'all',
    search: '',
  });

  const handleReset = () => {
    setFilter({
      startDate: '',
      endDate: '',
      vehicleId: 'all',
      driverId: 'all',
      status: 'all',
      search: '',
    });
  };

  const filteredTrips = useMemo(() => {
    return mockTrips.filter(t => {
      // Date filtering
      if (filter.startDate) {
        const tDate = new Date(t.startTime).toISOString().split('T')[0];
        if (tDate < filter.startDate) return false;
      }
      if (filter.endDate) {
        const tDate = new Date(t.startTime).toISOString().split('T')[0];
        if (tDate > filter.endDate) return false;
      }
      // Vehicle filtering
      if (filter.vehicleId !== 'all' && t.vehicleId !== filter.vehicleId) return false;
      // Driver filtering
      if (filter.driverId !== 'all' && t.driverId !== filter.driverId) return false;
      // Status filtering
      if (filter.status !== 'all' && t.status !== filter.status) return false;
      
      // Search filtering
      if (filter.search) {
        const q = filter.search.toLowerCase();
        if (
          !t.vehicleName.toLowerCase().includes(q) &&
          !(t.driverName && t.driverName.toLowerCase().includes(q)) &&
          !t.origin.toLowerCase().includes(q) &&
          !t.destination.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filter]);

  const ongoingCount = filteredTrips.filter(t => t.status === 'ongoing').length;
  const completedCount = filteredTrips.filter(t => t.status === 'completed').length;
  const totalDistance = filteredTrips.reduce((acc, t) => acc + t.distance, 0);

  const handleViewDetail = (trip: Trip) => {
    router.push(`/trips/${trip.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {tTrips.title}
          </h1>
          <p className="text-[13px] text-foreground-muted">
            {tTrips.pageSubtitle}
          </p>
        </div>

        {/* Filter */}
        <TripFilter 
          filter={filter}
          onFilterChange={setFilter}
          onReset={handleReset}
          vehicles={mockVehicles}
          drivers={mockDrivers}
        />

        {/* Summary */}
        <TripSummary 
          total={filteredTrips.length}
          ongoing={ongoingCount}
          completed={completedCount}
          totalDistance={totalDistance}
        />

        {/* Table */}
        <TripTable 
          data={filteredTrips}
          onViewDetail={handleViewDetail}
        />
      </div>
    </div>
  );
}
