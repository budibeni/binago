'use client';

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Route,
  Calendar,
  Clock,
  History,
  ChevronDown,
  Search,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Spinner, Dialog } from '@adatrack/ui';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import type {
  TrackingVehicle,
  DateRange,
  PlaybackState,
} from '../types/tracking';

// â”€â”€â”€ Helper: format seconds to HH:MM:SS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function calcProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

// â”€â”€â”€ PlaybackPanel Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface PlaybackPanelProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId: string | null;
  dateRange: DateRange;
  playbackState: PlaybackState;
  onVehicleChange: (vehicleId: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onLoad: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek?: (progress: number) => void;
  speed?: number;
  onSpeedChange?: (speed: number) => void;
  className?: string;
}

export function PlaybackPanel({
  vehicles,
  selectedVehicleId,
  dateRange,
  playbackState,
  onVehicleChange,
  onDateRangeChange,
  onLoad,
  onPlay,
  onPause,
  onStop,
  onSeek,
  speed = 1,
  onSpeedChange,
  className,
}: PlaybackPanelProps) {
  const locale = useBusinessLocale();
  const tTracking = getTranslation(locale).tracking;

  const { status, totalDuration, currentTime, errorMessage } = playbackState;
  const progress = calcProgress(currentTime, totalDuration);

  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = React.useState(false);
  const [vehicleSearch, setVehicleSearch] = React.useState('');

  const isLoading = status === 'loading';
  const hasData = status === 'ready' || status === 'playing' || status === 'paused';
  const isPlaying = status === 'playing';
  const isIdle = status === 'idle';
  const isError = status === 'error';
  const canLoad = !!selectedVehicleId && !!dateRange.startDate && !!dateRange.endDate && !isLoading;

  const trackRef = React.useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasData || !onSeek || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * 100);
  };

  return (
    <div className={cn('flex flex-col h-full w-full bg-white shadow-[-4px_-4px_15px_-3px_rgba(0,0,0,0.02)]', className)}>
      
      {/* â”€â”€ Top Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border shrink-0 h-[48px]">
        {/* Logo */}
        <div className="flex items-center gap-2 pr-3 border-border shrink-0">
          <History className="h-4 w-4 text-danger" strokeWidth={2.5} />
          <h2 className="text-[12px] font-bold text-foreground tracking-widest">
            PLAYBACK
          </h2>
        </div>

        {/* Inputs */}
        <div className="flex items-center gap-2 flex-1">
          {/* Vehicle Selector (Dialog Trigger) */}
          <button
            type="button"
            className="flex items-center justify-between w-40 h-8 rounded-md border border-neutral-200 bg-white px-2.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 transition-colors hover:bg-neutral-50"
            disabled={isLoading || isPlaying}
            onClick={() => setIsVehicleDialogOpen(true)}
          >
            <span className="truncate pr-2 font-medium">
              {selectedVehicleId 
                ? vehicles.find(v => v.id === selectedVehicleId)?.plateNumber 
                : tTracking.playbackSelectVehicle}
            </span>
            <ChevronDown className="h-3 w-3 text-foreground-muted shrink-0" />
          </button>

          {/* Start Date */}
          <div className="relative w-32 shrink-0">
            <input
              type="date"
              className="w-full h-8 rounded-md border border-neutral-200 bg-white px-2.5 pr-8 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              value={dateRange.startDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
              disabled={isLoading || isPlaying}
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" strokeWidth={2} />
          </div>

          {/* Start Time */}
          <div className="relative w-20 shrink-0">
            <input
              type="time"
              className="w-full h-8 rounded-md border border-neutral-200 bg-white px-2.5 pr-7 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              value={dateRange.startTime}
              onChange={(e) => onDateRangeChange({ ...dateRange, startTime: e.target.value })}
              disabled={isLoading || isPlaying}
            />
            <Clock className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" strokeWidth={2} />
          </div>
          
          <span className="text-foreground-muted text-[11px] shrink-0">-</span>
          
          {/* End Date */}
          <div className="relative w-32 shrink-0">
            <input
              type="date"
              className="w-full h-8 rounded-md border border-neutral-200 bg-white px-2.5 pr-8 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              value={dateRange.endDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
              disabled={isLoading || isPlaying}
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" strokeWidth={2} />
          </div>

          {/* End Time */}
          <div className="relative w-20 shrink-0">
            <input
              type="time"
              className="w-full h-8 rounded-md border border-neutral-200 bg-white px-2.5 pr-7 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              value={dateRange.endTime}
              onChange={(e) => onDateRangeChange({ ...dateRange, endTime: e.target.value })}
              disabled={isLoading || isPlaying}
            />
            <Clock className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" strokeWidth={2} />
          </div>
        </div>

        {/* Load Button */}
        <Button
          className="bg-danger hover:bg-danger/90 text-white font-medium h-8 px-3 text-[11px] rounded-md transition-colors"
          disabled={!canLoad}
          onClick={onLoad}
        >
          {isLoading ? <Spinner size="sm" className="mr-1.5 text-white" /> : <Route className="h-3.5 w-3.5 mr-1.5" />}
          {isLoading ? tTracking.playbackLoading : tTracking.playbackLoadHistory}
        </Button>
      </div>

      {/* â”€â”€ Bottom Row (Controls & Timeline) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center px-4 py-3 gap-4">
          
          {/* Media Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={isPlaying ? onPause : onPlay}
              disabled={!hasData}
              className="flex items-center justify-center h-7 w-7 rounded-full border border-neutral-200 bg-white text-foreground hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              {isPlaying ? <Pause className="h-3 w-3" fill="currentColor" /> : <Play className="h-3 w-3 ml-0.5" fill="currentColor" />}
            </button>
            <button
              onClick={onStop}
              disabled={!hasData}
              className="flex items-center justify-center h-7 w-7 rounded-full border border-neutral-200 bg-white text-foreground hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              <SkipBack className="h-3 w-3" fill="currentColor" />
            </button>
            <button
              disabled={!hasData}
              className="flex items-center justify-center h-7 w-7 rounded-full border border-neutral-200 bg-white text-foreground hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              <SkipForward className="h-3 w-3" fill="currentColor" />
            </button>

            {/* Speed Dropdown */}
            <div className="relative w-[48px] ml-1">
              <select
                disabled={!hasData}
                value={speed}
                onChange={(e) => onSpeedChange?.(Number(e.target.value))}
                className="w-full h-7 rounded-md border border-neutral-200 bg-white px-2 text-[11px] text-foreground font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-danger disabled:opacity-50"
              >
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={5}>5x</option>
              </select>
              <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-foreground-muted">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 relative pt-3 pb-1">
            
            {/* Tooltip */}
            {hasData && (
              <div 
                className="absolute top-0 -translate-x-1/2 -mt-1 bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 transition-all duration-100 ease-linear"
                style={{ left: `${progress}%` }}
              >
                {formatDuration(currentTime)}
                <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-danger" />
              </div>
            )}

            {/* Track */}
            <div 
              ref={trackRef}
              className={cn("relative w-full h-1 bg-neutral-200 rounded-full", hasData ? "cursor-pointer" : "")}
              onClick={handleTimelineClick}
            >
              {hasData && (
                <>
                  <div className="absolute top-0 left-0 h-full bg-danger rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-[2px] border-danger rounded-full shadow-sm transition-all duration-100 ease-linear" style={{ left: `calc(${progress}% - 5px)` }} />
                </>
              )}
            </div>

            {/* Ticks */}
            <div className="flex justify-between items-center text-[10px] text-foreground-muted font-medium mt-2">
              <span>06:00</span>
              <span>08:00</span>
              <span>10:00</span>
              <span>12:00</span>
              <span>14:00</span>
              <span>16:00</span>
              <span>18:00</span>
            </div>
          </div>

        </div>

        {/* Footer State Message */}
        <div className="h-6 bg-neutral-50/80 flex items-center justify-center text-[10px] text-foreground-muted font-medium border-t border-border/50">
          {isError ? (
            <span className="text-danger">{errorMessage || tTracking.playbackErrorLoad}</span>
          ) : (
            <>
              <History className="h-3 w-3 mr-1.5" />
              {tTracking.playbackInstructions}
            </>
          )}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────── */}
      <Dialog
        open={isVehicleDialogOpen}
        onOpenChange={(open) => {
          setIsVehicleDialogOpen(open);
          if (!open) setVehicleSearch('');
        }}
        title={tTracking.playbackSelectVehicleTitle}
        description={tTracking.playbackSelectVehicleDesc}
      >
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <input
              type="search"
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              placeholder={tTracking.playbackSearchPlaceholder}
              className="w-full h-10 rounded-md border border-neutral-200 bg-white pl-9 pr-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
          <div className="flex flex-col max-h-[300px] overflow-y-auto border border-neutral-100 rounded-md">
            {vehicles.filter(v => 
                v.plateNumber.toLowerCase().includes(vehicleSearch.toLowerCase()) || 
                (v.driverName?.toLowerCase() || '').includes(vehicleSearch.toLowerCase())
              ).length === 0 ? (
                <div className="px-4 py-8 text-center text-[13px] text-foreground-muted">
                  {tTracking.playbackNoVehicle}
                </div>
              ) : (
                vehicles.filter(v => 
                  v.plateNumber.toLowerCase().includes(vehicleSearch.toLowerCase()) || 
                  (v.driverName?.toLowerCase() || '').includes(vehicleSearch.toLowerCase())
                ).map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      onVehicleChange(v.id);
                      setIsVehicleDialogOpen(false);
                      setVehicleSearch('');
                    }}
                    className={cn(
                      "flex flex-col items-start px-4 py-2.5 text-left border-b border-neutral-100 hover:bg-neutral-50 last:border-b-0 transition-colors focus:outline-none focus:bg-neutral-50",
                      v.id === selectedVehicleId && "bg-primary/5 hover:bg-primary/10"
                    )}
                  >
                    <span className="text-[14px] font-semibold text-foreground">{v.plateNumber}</span>
                    <span className="text-[12px] text-foreground-muted">{v.driverName || tTracking.noDriver}</span>
                  </button>
                ))
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
