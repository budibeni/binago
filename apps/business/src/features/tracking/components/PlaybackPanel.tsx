'use client';

import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Download,
  Calendar,
  Clock,
  History,
} from 'lucide-react';
import { cn } from '@binago/utils';
import { Button, Spinner } from '@binago/ui';
import type {
  TrackingVehicle,
  DateRange,
  PlaybackState,
} from '../types/tracking';

// ─── Helper: format seconds to HH:MM:SS ──────────────────────────────────────
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

// ─── PlaybackPanel Props ───────────────────────────────────────────────────────
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
  className,
}: PlaybackPanelProps) {
  const { status, totalDuration, currentTime, errorMessage } = playbackState;
  const progress = calcProgress(currentTime, totalDuration);

  const isLoading = status === 'loading';
  const hasData = status === 'ready' || status === 'playing' || status === 'paused';
  const isPlaying = status === 'playing';
  const isIdle = status === 'idle';
  const isError = status === 'error';
  const canLoad = !!selectedVehicleId && !!dateRange.date && !isLoading;

  const trackRef = React.useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasData || !onSeek || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * 100);
  };

  return (
    <div className={cn('flex flex-col h-full w-full bg-white shadow-[-4px_-4px_15px_-3px_rgba(0,0,0,0.02)]', className)}>
      
      {/* ── Top Row ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border shrink-0 h-[64px]">
        {/* Logo */}
        <div className="flex items-center gap-2 pr-4 border-border shrink-0">
          <History className="h-5 w-5 text-danger" strokeWidth={2.5} />
          <h2 className="text-[13px] font-bold text-foreground tracking-widest">
            PLAYBACK
          </h2>
        </div>

        {/* Inputs */}
        <div className="flex items-center gap-3 flex-1">
          {/* Vehicle Selector */}
          <div className="relative w-48">
            <select
              className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 text-[12px] text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50"
              value={selectedVehicleId ?? ''}
              onChange={(e) => onVehicleChange(e.target.value)}
              disabled={isLoading || isPlaying}
            >
              <option value="" disabled>Pilih kendaraan</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} {v.driverName ? `— ${v.driverName}` : ''}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>

          {/* Date Picker */}
          <div className="relative w-36">
            <input
              type="date"
              className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 pr-8 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              value={dateRange.date}
              onChange={(e) => onDateRangeChange({ ...dateRange, date: e.target.value })}
              disabled={isLoading || isPlaying}
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" strokeWidth={2} />
          </div>

          {/* Start Time */}
          <div className="relative w-24">
            <input
              type="time"
              className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 pr-8 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              value={dateRange.startTime}
              onChange={(e) => onDateRangeChange({ ...dateRange, startTime: e.target.value })}
              disabled={isLoading || isPlaying}
            />
            <Clock className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" strokeWidth={2} />
          </div>
          
          <span className="text-foreground-muted text-[12px]">-</span>
          
          {/* End Time */}
          <div className="relative w-24">
            <input
              type="time"
              className="w-full h-9 rounded-md border border-neutral-200 bg-white px-3 pr-8 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
              value={dateRange.endTime}
              onChange={(e) => onDateRangeChange({ ...dateRange, endTime: e.target.value })}
              disabled={isLoading || isPlaying}
            />
            <Clock className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" strokeWidth={2} />
          </div>
        </div>

        {/* Load Button */}
        <Button
          className="bg-danger hover:bg-danger/90 text-white font-medium h-9 px-4 text-[12px] rounded-md transition-colors"
          disabled={!canLoad}
          onClick={onLoad}
        >
          {isLoading ? <Spinner size="sm" className="mr-2 text-white" /> : <Download className="h-4 w-4 mr-2" />}
          {isLoading ? 'Memuat...' : 'Muat Histori'}
        </Button>
      </div>

      {/* ── Bottom Row (Controls & Timeline) ──────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-center px-6 py-5 gap-6">
          
          {/* Media Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={isPlaying ? onPause : onPlay}
              disabled={!hasData}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-neutral-200 bg-white text-foreground hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" fill="currentColor" /> : <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" />}
            </button>
            <button
              onClick={onStop}
              disabled={!hasData}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-neutral-200 bg-white text-foreground hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              <SkipBack className="h-3.5 w-3.5" fill="currentColor" />
            </button>
            <button
              disabled={!hasData}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-neutral-200 bg-white text-foreground hover:bg-neutral-50 disabled:opacity-50 transition-colors"
            >
              <SkipForward className="h-3.5 w-3.5" fill="currentColor" />
            </button>

            {/* Speed Dropdown */}
            <div className="relative w-[50px] ml-1">
              <select
                disabled={!hasData}
                className="w-full h-8 rounded-md border border-neutral-200 bg-white px-2 text-[12px] text-foreground font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-danger disabled:opacity-50"
              >
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="5">5x</option>
              </select>
              <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-foreground-muted">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 relative pt-4 pb-2">
            
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
        <div className="h-8 bg-neutral-50/80 flex items-center justify-center text-[11px] text-foreground-muted font-medium border-t border-border/50">
          {isError ? (
            <span className="text-danger">{errorMessage || 'Gagal memuat histori'}</span>
          ) : (
            <>
              <History className="h-3 w-3 mr-1.5" />
              Pilih kendaraan dan tentukan rentang waktu untuk memuat histori perjalanan.
            </>
          )}
        </div>
      </div>

    </div>
  );
}
