'use client';

import React from 'react';
import { ChevronLeft, Play } from 'lucide-react';
import { Button, Badge } from '@adatrack/ui';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import type { Trip } from '../types/trips';
import { useRouter } from 'next/navigation';

export interface TripDetailHeaderProps {
  trip: Trip;
}

export function TripDetailHeader({ trip }: TripDetailHeaderProps) {
  const router = useRouter();
  const locale = useBusinessLocale() || 'id';
  const tTrips = getTranslation(locale).trips;

  const dStart = new Date(trip.startTime);
  const dateStr = dStart.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStart = dStart.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const timeEnd = trip.endTime ? new Date(trip.endTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '...';

  const handlePlayback = () => {
    // Navigate to playback with parameters
    const searchParams = new URLSearchParams();
    searchParams.set('vehicleId', trip.vehicleId);
    searchParams.set('start', trip.startTime);
    if (trip.endTime) {
      searchParams.set('end', trip.endTime);
    } else {
      // If ongoing, set end to now
      searchParams.set('end', new Date().toISOString());
    }
    router.push(`/tracking?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div className="flex items-start gap-4">
        <Button 
          variant="outline" 
          className="h-8 w-8 p-1 mt-1 shrink-0" 
          onClick={() => router.push('/trips')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {tTrips.detailTitle}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-foreground-muted">
            <span className="font-semibold text-foreground">{trip.vehicleName}</span>
            <span className="hidden sm:inline">•</span>
            <span>{dateStr}</span>
            <span className="hidden sm:inline">•</span>
            <span>{timeStart} - {timeEnd}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {trip.status === 'ongoing' ? (
          <Badge className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 text-xs px-2.5 py-0.5 font-semibold uppercase tracking-wider">
            {tTrips.statusOngoing}
          </Badge>
        ) : (
          <Badge className="bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 text-xs px-2.5 py-0.5 font-semibold uppercase tracking-wider">
            {tTrips.statusCompleted}
          </Badge>
        )}

        <Button 
          variant="primary"
          className="h-8 text-xs bg-danger hover:bg-danger/90 text-white font-semibold shadow-sm"
          onClick={handlePlayback}
        >
          <Play className="w-3.5 h-3.5 mr-2" />
          {tTrips.btnPlayback}
        </Button>
      </div>
    </div>
  );
}
