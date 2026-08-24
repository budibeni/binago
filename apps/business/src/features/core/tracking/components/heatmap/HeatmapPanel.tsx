'use client';

import React from 'react';
import {
  MapPin,
  Calendar,
  ChevronDown,
  Flame,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Spinner } from '@adatrack/ui';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import type { TrackingVehicle, DateRange } from '../../types/tracking';

export interface HeatmapPanelProps {
  dateRange: DateRange;
  statusFilter: 'driving' | 'idle' | 'parking';
  onDateRangeChange: (range: DateRange) => void;
  onStatusFilterChange: (status: 'driving' | 'idle' | 'parking') => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  className?: string;
}

export function HeatmapPanel({
  dateRange,
  statusFilter,
  onDateRangeChange,
  onStatusFilterChange,
  onGenerate,
  isGenerating = false,
  className,
}: HeatmapPanelProps) {
  const locale = useBusinessLocale();
  const tTracking = getTranslation(locale).tracking;

  const canGenerate = !!dateRange.startDate && !!dateRange.endDate && !isGenerating;

  return (
    <>
      <div className={cn('flex items-center w-full h-full px-2 sm:px-4 bg-background shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-x-auto overflow-y-hidden', className)}>
        {/* Logo */}
        <div className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-border shrink-0">
          <MapPin className="h-4 w-4 text-danger" strokeWidth={2.5} />
          <h2 className="text-[11px] font-bold text-foreground tracking-widest hidden md:block">
            {tTracking.heatmapTitle}
          </h2>
        </div>

        {/* Form */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 px-2 sm:px-3 justify-start min-w-max">
          <div className="flex items-center gap-1 sm:gap-1.5">

            {/* Start */}
            <div className="relative w-[110px] sm:w-[130px] shrink-0">
              <input
                type="date"
                className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-1.5 sm:px-2 pr-6 sm:pr-7 text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                value={dateRange.startDate}
                onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
                disabled={isGenerating}
              />
              <Calendar className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground-muted" strokeWidth={2} />
            </div>

            <span className="text-foreground-muted text-[9px] sm:text-[10px] font-bold mx-0.5 sm:mx-1">{tTracking.playbackTo}</span>

            {/* End */}
            <div className="relative w-[110px] sm:w-[130px] shrink-0">
              <input
                type="date"
                className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-1.5 sm:px-2 pr-6 sm:pr-7 text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                value={dateRange.endDate}
                onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
                disabled={isGenerating}
              />
              <Calendar className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground-muted" strokeWidth={2} />
            </div>

            <div className="w-px h-5 bg-border mx-0.5 sm:mx-1" />

            {/* Status Filter */}
            <div className="relative w-[100px] shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as any)}
                disabled={isGenerating}
                className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-1.5 sm:px-2 text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all appearance-none cursor-pointer"
              >
                <option value="driving">{tTracking.statusDriving}</option>
                <option value="idle">{tTracking.statusIdle}</option>
                <option value="parking">{tTracking.statusParking}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-foreground-muted" strokeWidth={2} />
            </div>

          </div>
        </div>

        {/* Generate Button */}
        <Button
          className="bg-danger hover:bg-danger/90 text-white font-semibold h-8 px-3 sm:px-4 text-[11px] rounded-lg shadow-sm shadow-danger/20 transition-all shrink-0"
          disabled={!canGenerate || isGenerating}
          onClick={onGenerate}
        >
          {isGenerating ? <Spinner size="sm" className="mr-1 sm:mr-1.5 text-white" /> : <Flame className="h-3 w-3 mr-1 sm:mr-1.5" strokeWidth={2.5} />}
          {tTracking.heatmapGenerate}
        </Button>
      </div>

    </>
  );
}
