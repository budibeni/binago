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
  ChevronUp,
  Search,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, Spinner, Dialog } from '@adatrack/ui';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';
import type {
  TrackingVehicle,
  DateRange,
  PlaybackState,
} from '../../types/tracking';

// â"€â"€â"€ Helper: format seconds to HH:MM:SS â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatAbsoluteTime(dateStr: string, timeStr: string, progressSeconds: number, showDate: boolean = false): string {
  if (!dateStr || !timeStr) return formatDuration(progressSeconds);
  const d = new Date(`${dateStr}T${timeStr}`);
  if (isNaN(d.getTime())) return formatDuration(progressSeconds);

  d.setSeconds(d.getSeconds() + progressSeconds);

  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  const s = d.getSeconds().toString().padStart(2, '0');
  const timeFormatted = `${h}:${m}:${s}`;

  if (showDate) {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month} ${timeFormatted}`;
  }
  return timeFormatted;
}

function calcProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

// â"€â"€â"€ PlaybackPanel Props â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
export interface PlaybackPanelProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId: string | null;
  dateRange: DateRange;
  playbackState: PlaybackState;
  onVehicleChange: (vehicleId: string) => void;
  onDateRangeChange: (range: DateRange) => void;
  onLoad: () => void;
  onClear?: () => void;
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
  onClear,
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
  const [isExpanded, setIsExpanded] = React.useState(true);

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

  const ticks = React.useMemo(() => {
    if (!dateRange.startDate || !dateRange.startTime || !dateRange.endDate || !dateRange.endTime) {
      return ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    }
    const start = new Date(`${dateRange.startDate}T${dateRange.startTime}`).getTime();
    const end = new Date(`${dateRange.endDate}T${dateRange.endTime}`).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) {
      return ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    }

    const showDate = dateRange.startDate !== dateRange.endDate;

    const generatedTicks = [];
    const step = (end - start) / 6;
    for (let i = 0; i <= 6; i++) {
      const d = new Date(start + step * i);
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      const timeStr = `${h}:${m}`;

      if (showDate) {
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        generatedTicks.push(`${day}/${month} ${timeStr}`);
      } else {
        generatedTicks.push(timeStr);
      }
    }
    return generatedTicks;
  }, [dateRange]);

  return (
    <>
      <div className={cn('flex items-center w-full h-full px-2 sm:px-4 bg-white dark:bg-surface shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-x-auto overflow-y-hidden', className)}>

        {!hasData ? (
          /* ==========================================
             MODE 1: SETUP (Inputs)
             ========================================== */
          <>
            {/* Logo */}
            <div className="flex items-center gap-2 pr-2 sm:pr-3 border-r border-border shrink-0">
              <History className="h-4 w-4 text-danger" strokeWidth={2.5} />
              <h2 className="text-[11px] font-bold text-foreground tracking-widest hidden md:block">
                {tTracking.playbackTitle}
              </h2>
            </div>

            {/* Form */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 px-2 sm:px-3 justify-start min-w-max">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* Vehicle */}
                <button
                  type="button"
                  className="flex items-center justify-between w-[110px] sm:w-[140px] h-8 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-border px-2 sm:px-2.5 text-[10px] sm:text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 shadow-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0"
                  disabled={isLoading}
                  onClick={() => setIsVehicleDialogOpen(true)}
                >
                  <span className="truncate pr-2 font-medium">
                    {selectedVehicleId
                      ? vehicles.find(v => v.id === selectedVehicleId)?.plateNumber
                      : tTracking.playbackSelectVehicle}
                  </span>
                  <ChevronDown className="h-3 w-3 text-foreground-muted shrink-0" />
                </button>

                <div className="w-px h-5 bg-border mx-0.5 sm:mx-1" />

                {/* Start */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <div className="relative w-[90px] sm:w-[110px] shrink-0">
                    <input
                      type="date"
                      className="w-full h-8 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-border hover:border-neutral-400 dark:hover:border-neutral-500 px-1.5 sm:px-2 pr-6 sm:pr-7 text-[10px] sm:text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                      value={dateRange.startDate}
                      onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
                      disabled={isLoading}
                    />
                    <Calendar className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground-muted" strokeWidth={2} />
                  </div>
                  <div className="relative w-[60px] sm:w-[75px] shrink-0">
                    <input
                      type="time"
                      className="w-full h-8 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-border hover:border-neutral-400 dark:hover:border-neutral-500 px-1.5 sm:px-2 pr-6 sm:pr-7 text-[10px] sm:text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                      value={dateRange.startTime}
                      onChange={(e) => onDateRangeChange({ ...dateRange, startTime: e.target.value })}
                      disabled={isLoading}
                    />
                    <Clock className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground-muted" strokeWidth={2} />
                  </div>
                </div>

                <span className="text-foreground-muted text-[9px] sm:text-[10px] font-bold mx-0.5 sm:mx-1">{tTracking.playbackTo}</span>

                {/* End */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <div className="relative w-[90px] sm:w-[110px] shrink-0">
                    <input
                      type="date"
                      className="w-full h-8 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-border hover:border-neutral-400 dark:hover:border-neutral-500 px-1.5 sm:px-2 pr-6 sm:pr-7 text-[10px] sm:text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                      value={dateRange.endDate}
                      onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
                      disabled={isLoading}
                    />
                    <Calendar className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground-muted" strokeWidth={2} />
                  </div>
                  <div className="relative w-[60px] sm:w-[75px] shrink-0">
                    <input
                      type="time"
                      className="w-full h-8 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-border hover:border-neutral-400 dark:hover:border-neutral-500 px-1.5 sm:px-2 pr-6 sm:pr-7 text-[10px] sm:text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                      value={dateRange.endTime}
                      onChange={(e) => onDateRangeChange({ ...dateRange, endTime: e.target.value })}
                      disabled={isLoading}
                    />
                    <Clock className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground-muted" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>

            {/* Load Button */}
            <Button
              className="bg-danger hover:bg-danger/90 text-white font-semibold h-8 px-3 sm:px-4 text-[10px] sm:text-[11px] rounded-lg shadow-sm shadow-danger/20 transition-all shrink-0"
              disabled={!canLoad || isLoading}
              onClick={onLoad}
            >
              {isLoading ? <Spinner size="sm" className="mr-1 sm:mr-1.5 text-white" /> : <Search className="h-3 w-3 mr-1 sm:mr-1.5" strokeWidth={2.5} />}
              {isLoading ? tTracking.playbackSearching : tTracking.playbackSearchHistory}
            </Button>
          </>
        ) : (
          /* ==========================================
             MODE 2: PLAYER (Media Controls & Timeline)
             ========================================== */
          <>
            {/* Info Badge */}
            <div className="flex items-center gap-3 pr-3 border-r border-border shrink-0">
              <History className="h-4 w-4 text-danger hidden sm:block" strokeWidth={2.5} />
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-foreground truncate max-w-[120px]">
                  {selectedVehicleId ? vehicles.find(v => v.id === selectedVehicleId)?.plateNumber : tTracking.playbackSelectVehicle}
                </span>
                <span className="text-[9px] text-foreground-muted font-medium">
                  {dateRange.startDate} {dateRange.startTime}
                </span>
              </div>
            </div>

            {/* Media Controls */}
            <div className="flex items-center gap-1.5 pl-3 shrink-0">
              <button
                onClick={onStop}
                className="flex items-center justify-center h-8 w-8 rounded-full text-foreground-muted hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <SkipBack className="h-3.5 w-3.5" fill="currentColor" />
              </button>

              <button
                onClick={isPlaying ? onPause : onPlay}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-danger hover:bg-red-600 text-white shadow-md shadow-danger/30 hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 ml-0.5" fill="currentColor" />}
              </button>

              <button
                disabled
                className="flex items-center justify-center h-8 w-8 rounded-full text-foreground-muted opacity-50 transition-colors"
              >
                <SkipForward className="h-3.5 w-3.5" fill="currentColor" />
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 relative mx-5 h-full flex flex-col justify-center">
              {/* Tooltip (Current Time) */}
              <div
                className="absolute top-1 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 transition-all duration-100 ease-linear whitespace-nowrap"
                style={{ left: `${progress}%` }}
              >
                {formatAbsoluteTime(dateRange.startDate, dateRange.startTime, currentTime, false)}
                <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-neutral-900 dark:border-t-white" />
              </div>

              {/* Track */}
              <div
                ref={trackRef}
                className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-700/50 rounded-full cursor-pointer group hover:h-2 transition-all mt-3"
                onClick={handleTimelineClick}
              >
                <div className="absolute top-0 left-0 h-full bg-danger rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-[3px] border-danger rounded-full shadow-[0_0_8px_rgba(222,53,49,0.5)] transition-all duration-100 ease-linear group-hover:scale-110"
                  style={{ left: `calc(${progress}% - 7px)` }}
                />
              </div>
            </div>

            {/* Speed & Close */}
            <div className="flex items-center gap-3 pl-3 border-l border-border shrink-0">
              <div className="relative w-[56px]">
                <select
                  value={speed}
                  onChange={(e) => onSpeedChange?.(Number(e.target.value))}
                  className="w-full h-8 rounded-lg bg-[#f7f7f7] dark:bg-neutral-800/80 px-2 text-[11px] text-foreground font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-danger transition-colors cursor-pointer"
                >
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={5}>5x</option>
                </select>
                <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-foreground-muted">
                  <ChevronDown className="h-3 w-3" />
                </span>
              </div>

              <button
                type="button"
                onClick={onClear}
                title={tTracking.playbackCancelTime}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>


      {/* ---------------------------------------------------------------------------- */}
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
              className="w-full h-10 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-9 pr-3 text-[13px] focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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
                    "flex flex-col items-start px-4 py-2.5 text-left border-b border-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 last:border-b-0 transition-colors focus:outline-none focus:bg-neutral-50",
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
    </>
  );
}
