'use client';

import React from 'react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import type { Trip, TripEvent } from '../types/trips';
import { Power, MapPin, Gauge, Pause, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@adatrack/utils';

export interface TripTimelineProps {
  trip: Trip;
}

function getEventIcon(type: TripEvent['type']) {
  switch (type) {
    case 'ignition_on':
    case 'ignition_off':
      return <Power className="w-3.5 h-3.5" />;
    case 'moving':
      return <Navigation className="w-3.5 h-3.5" />;
    case 'stop':
      return <Pause className="w-3.5 h-3.5" />;
    case 'geofence_in':
    case 'geofence_out':
      return <MapPin className="w-3.5 h-3.5" />;
    case 'overspeed':
      return <Gauge className="w-3.5 h-3.5" />;
    default:
      return <AlertCircle className="w-3.5 h-3.5" />;
  }
}

function getEventColor(type: TripEvent['type']) {
  switch (type) {
    case 'ignition_on': return 'bg-green-500 text-white border-green-500';
    case 'ignition_off': return 'bg-neutral-500 text-white border-neutral-500';
    case 'geofence_in': 
    case 'geofence_out': return 'bg-blue-500 text-white border-blue-500';
    case 'overspeed': return 'bg-danger text-white border-danger';
    case 'stop': return 'bg-orange-500 text-white border-orange-500';
    case 'moving': return 'bg-primary text-primary-foreground border-primary';
    default: return 'bg-neutral-300 text-neutral-700 border-neutral-300';
  }
}

import { Navigation } from 'lucide-react';

export function TripTimeline({ trip }: TripTimelineProps) {
  const locale = useBusinessLocale() || 'id';
  const tTrips = getTranslation(locale).trips;

  // Sorting events by time, though they should be already sorted
  const sortedEvents = [...trip.events].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-sm h-full flex flex-col max-h-[600px] overflow-y-auto">
      <h3 className="text-sm font-bold text-foreground mb-6 flex items-center gap-2">
        <Clock className="w-4 h-4 text-foreground-muted" />
        {tTrips.timeline}
      </h3>
      
      <div className="relative border-l-2 border-border ml-3 pb-4">
        {sortedEvents.map((ev, index) => {
          const d = new Date(ev.time);
          const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          const isLast = index === sortedEvents.length - 1;
          
          return (
            <div key={ev.id} className={cn("relative pl-6", isLast ? "" : "mb-6")}>
              {/* Timeline dot */}
              <div className={cn(
                "absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ring-4 ring-surface",
                getEventColor(ev.type)
              )}>
                {getEventIcon(ev.type)}
              </div>
              
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground-muted mb-0.5">{timeStr}</span>
                <span className="text-sm font-semibold text-foreground">{ev.title}</span>
                {ev.description && (
                  <span className="text-xs text-foreground-muted mt-0.5">{ev.description}</span>
                )}
              </div>
            </div>
          );
        })}

        {sortedEvents.length === 0 && (
          <div className="pl-6 text-sm text-foreground-muted">
            Belum ada kejadian tercatat.
          </div>
        )}
      </div>
    </div>
  );
}
