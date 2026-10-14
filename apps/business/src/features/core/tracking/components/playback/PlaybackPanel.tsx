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
  ArrowRight,
  RotateCcw,
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
import type { MockPlaybackTrackPoint } from '../../data/mockTrackingData';

// --- Helper: format seconds to HH:MM:SS ----------------------------------------
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

function formatTimestampOrAbsolute(
  timestamp?: string,
  dateStr?: string,
  timeStr?: string,
  progressSeconds?: number,
  showDate: boolean = false
): string {
  if (timestamp) {
    try {
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
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
    } catch {
      // fallback
    }
  }
  if (dateStr && timeStr && progressSeconds !== undefined) {
    return formatAbsoluteTime(dateStr, timeStr, progressSeconds, showDate);
  }
  return '--:--:--';
}

function calcProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

// --- PlaybackPanel Props -------------------------------------------------------
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
  currentPoint?: MockPlaybackTrackPoint | null;

  // --- Route Crop Mode Props ---
  isRouteCropMode?: boolean;
  cropStartIndex?: number;
  cropEndIndex?: number;
  totalPoints?: number;
  cropStartLabel?: string;
  cropEndLabel?: string;
  cropStartTimestamp?: string;
  cropEndTimestamp?: string;
  cropDistanceKm?: number;
  cropDurationSecs?: number;
  onCropStartChange?: (index: number) => void;
  onCropEndChange?: (index: number) => void;
  onSetCropStartToCurrent?: () => void;
  onSetCropEndToCurrent?: () => void;
  onResetCropRange?: () => void;
  onCancelRouteCrop?: () => void;
  onConfirmRouteCrop?: () => void;
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
  currentPoint,
  isRouteCropMode = false,
  cropStartIndex = 0,
  cropEndIndex = 0,
  totalPoints = 0,
  cropStartLabel,
  cropEndLabel,
  cropStartTimestamp,
  cropEndTimestamp,
  cropDistanceKm = 0,
  cropDurationSecs = 0,
  onCropStartChange,
  onCropEndChange,
  onSetCropStartToCurrent,
  onSetCropEndToCurrent,
  onResetCropRange,
  onCancelRouteCrop,
  onConfirmRouteCrop,
}: PlaybackPanelProps) {
  const locale = useBusinessLocale();
  const tTracking = getTranslation(locale).tracking;

  const { status, totalDuration, currentTime, errorMessage } = playbackState;
  const progress = calcProgress(currentTime, totalDuration);

  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = React.useState(false);
  const [vehicleSearch, setVehicleSearch] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(true);

  // Video Trimmer Dragging state for Left Handle, Right Handle, and Window
  const [isDraggingStart, setIsDraggingStart] = React.useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = React.useState(false);
  const [isDraggingWindow, setIsDraggingWindow] = React.useState(false);

  const isDraggingStartRef = React.useRef(false);
  const isDraggingEndRef = React.useRef(false);
  const isDraggingWindowRef = React.useRef(false);
  const cropStartIndexRef = React.useRef(cropStartIndex);
  const cropEndIndexRef = React.useRef(cropEndIndex);
  const totalPointsRef = React.useRef(totalPoints);
  const dragStartXRef = React.useRef(0);
  const dragStartIndexesRef = React.useRef({ start: 0, end: 0 });

  cropStartIndexRef.current = cropStartIndex;
  cropEndIndexRef.current = cropEndIndex;
  totalPointsRef.current = totalPoints;

  const handleStartDrag = (handle: 'start' | 'end' | 'window') => (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!trackRef.current || totalPointsRef.current <= 1) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartXRef.current = clientX;
    dragStartIndexesRef.current = { start: cropStartIndexRef.current, end: cropEndIndexRef.current };

    if (handle === 'start') {
      setIsDraggingStart(true);
      isDraggingStartRef.current = true;
    } else if (handle === 'end') {
      setIsDraggingEnd(true);
      isDraggingEndRef.current = true;
    } else {
      setIsDraggingWindow(true);
      isDraggingWindowRef.current = true;
    }

    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!trackRef.current || totalPointsRef.current <= 1) return;
      const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const rect = trackRef.current.getBoundingClientRect();
      const currentRatio = Math.max(0, Math.min(1, (currentX - rect.left) / rect.width));
      const targetIndex = Math.round(currentRatio * (totalPointsRef.current - 1));

      if (isDraggingStartRef.current) {
        // Drag dari samping kiri (Left Trimmer)
        const clampedStart = Math.max(0, Math.min(targetIndex, cropEndIndexRef.current - 1));
        onCropStartChange?.(clampedStart);
      } else if (isDraggingEndRef.current) {
        // Drag dari samping kanan (Right Trimmer)
        const clampedEnd = Math.min(totalPointsRef.current - 1, Math.max(targetIndex, cropStartIndexRef.current + 1));
        onCropEndChange?.(clampedEnd);
      } else if (isDraggingWindowRef.current) {
        // Geser seluruh rentang rute terpilih
        const deltaX = currentX - dragStartXRef.current;
        const deltaRatio = deltaX / rect.width;
        const deltaIndex = Math.round(deltaRatio * (totalPointsRef.current - 1));
        const initStart = dragStartIndexesRef.current.start;
        const initEnd = dragStartIndexesRef.current.end;
        const rangeLen = initEnd - initStart;

        let newStart = initStart + deltaIndex;
        let newEnd = initEnd + deltaIndex;

        if (newStart < 0) {
          newStart = 0;
          newEnd = rangeLen;
        } else if (newEnd > totalPointsRef.current - 1) {
          newEnd = totalPointsRef.current - 1;
          newStart = Math.max(0, newEnd - rangeLen);
        }

        onCropStartChange?.(newStart);
        onCropEndChange?.(newEnd);
      }
    };

    const onUp = () => {
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
      setIsDraggingWindow(false);
      isDraggingStartRef.current = false;
      isDraggingEndRef.current = false;
      isDraggingWindowRef.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  const isLoading = status === 'loading';
  const hasData = status === 'ready' || status === 'playing' || status === 'paused';
  const isPlaying = status === 'playing';
  const isIdle = status === 'idle';
  const isError = status === 'error';
  const canLoad = !!selectedVehicleId && !!dateRange.startDate && !!dateRange.endDate && !isLoading;

  const trackRef = React.useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasData || !onSeek || !trackRef.current || isDraggingStart || isDraggingEnd) return;
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

  const maxPointIdx = Math.max(1, totalPoints - 1);
  const startPercent = Math.min(100, Math.max(0, (cropStartIndex / maxPointIdx) * 100));
  const endPercent = Math.min(100, Math.max(0, (cropEndIndex / maxPointIdx) * 100));

  const startTimeDisplay = React.useMemo(() => {
    return formatTimestampOrAbsolute(
      cropStartTimestamp,
      dateRange.startDate,
      dateRange.startTime,
      (cropStartIndex / maxPointIdx) * totalDuration
    );
  }, [cropStartTimestamp, dateRange, cropStartIndex, maxPointIdx, totalDuration]);

  const endTimeDisplay = React.useMemo(() => {
    return formatTimestampOrAbsolute(
      cropEndTimestamp,
      dateRange.startDate,
      dateRange.startTime,
      (cropEndIndex / maxPointIdx) * totalDuration
    );
  }, [cropEndTimestamp, dateRange, cropEndIndex, maxPointIdx, totalDuration]);

  return (
    <>
      <div className={cn('flex items-center w-full h-full px-2 sm:px-4 bg-background border-t border-border transition-all duration-300 overflow-visible', className)}>
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
                  className="flex items-center justify-between w-[110px] sm:w-[140px] h-8 rounded-md bg-background border border-border px-2 sm:px-2.5 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger disabled:opacity-50 transition-colors hover:bg-surface-elevated shrink-0"
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
                      className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-1.5 sm:px-2 pr-6 sm:pr-7 text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                      value={dateRange.startDate}
                      onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
                      disabled={isLoading}
                    />
                    <Calendar className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground-muted" strokeWidth={2} />
                  </div>
                  <div className="relative w-[60px] sm:w-[75px] shrink-0">
                    <input
                      type="time"
                      className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-1.5 sm:px-2 pr-6 sm:pr-7 text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
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
                      className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-1.5 sm:px-2 pr-6 sm:pr-7 text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
                      value={dateRange.endDate}
                      onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
                      disabled={isLoading}
                    />
                    <Calendar className="pointer-events-none absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-foreground-muted" strokeWidth={2} />
                  </div>
                  <div className="relative w-[60px] sm:w-[75px] shrink-0">
                    <input
                      type="time"
                      className="w-full h-8 rounded-md bg-background border border-border hover:border-foreground-muted px-1.5 sm:px-2 pr-6 sm:pr-7 text-[11px] font-medium text-foreground shadow-sm focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger disabled:opacity-50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full cursor-pointer"
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
              className="bg-danger hover:bg-danger/90 text-white font-semibold h-8 px-3 sm:px-4 text-[11px] rounded-lg transition-all shrink-0"
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
            <div className="flex items-center gap-2.5 pr-2.5 sm:pr-3 border-r border-border shrink-0">
              <History className="h-4 w-4 text-danger hidden sm:block" strokeWidth={2.5} />
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-foreground truncate max-w-[110px] sm:max-w-[130px]">
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
                className="flex items-center justify-center h-8 w-8 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                title={tTracking.playbackResetToStart}
              >
                <SkipBack className="h-3.5 w-3.5" fill="currentColor" />
              </button>

              <button
                onClick={isPlaying ? onPause : onPlay}
                className="flex items-center justify-center h-9 w-9 rounded-full bg-danger hover:bg-red-600 text-white hover:scale-105 active:scale-95 transition-all shadow-sm"
                title={isPlaying ? tTracking.playbackPause : tTracking.playbackPlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 ml-0.5" fill="currentColor" />}
              </button>

              <button
                disabled
                className="flex items-center justify-center h-8 w-8 rounded-full text-foreground-muted opacity-40 transition-colors"
              >
                <SkipForward className="h-3.5 w-3.5" fill="currentColor" />
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 relative mx-5 h-full flex flex-col justify-center overflow-visible ">
              {/* Tooltip (Current Time) */}
              {!isRouteCropMode && (
                <div
                  className="absolute top-1 -translate-x-1/2 bg-foreground text-background text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10 transition-all duration-100 ease-linear whitespace-nowrap pointer-events-none"
                  style={{ left: `${progress}%` }}
                >
                  {formatAbsoluteTime(dateRange.startDate, dateRange.startTime, currentTime, false)}
                  <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-neutral-900 dark:border-t-white" />
                </div>
              )}

              {/* Track (Normal scrubber or Video Crop Trimmer) */}
              {!isRouteCropMode ? (
                /* ==========================================
                   NORMAL PLAYBACK TIMELINE SCRUBBER
                   ========================================== */
                <div
                  ref={trackRef}
                  className="relative w-full h-1.5 bg-border rounded-full cursor-pointer group hover:h-2 transition-all mt-3"
                  onClick={handleTimelineClick}
                >
                  <div className="absolute top-0 left-0 h-full bg-danger rounded-full transition-all duration-100 ease-linear z-[2]" style={{ width: `${progress}%` }} />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-[3px] border-danger rounded-full shadow-[0_0_8px_rgba(222,53,49,0.5)] transition-all duration-100 ease-linear group-hover:scale-110 z-[3]"
                    style={{ left: `calc(${progress}% - 7px)` }}
                  />
                </div>
              ) : (
                /* ==========================================
                   VIDEO TRIMMER MODE (SEPERTI CROP VIDEO - GOLD #F59E0B)
                   ========================================== */
                <div
                  ref={trackRef}
                  className="relative w-full h-8 bg-neutral-900/40 dark:bg-neutral-950/80 border border-neutral-300 dark:border-neutral-700/80 rounded-lg flex items-center cursor-pointer select-none overflow-visible"
                  onClick={handleTimelineClick}
                >
                  {/* Inner Clipped Container: Filmstrip ticks & dark outer masks */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    {/* Background Filmstrip / Audio Waveform Ticks */}
                    <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none opacity-20">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-px bg-foreground",
                            i % 6 === 0 ? "h-4" : i % 3 === 0 ? "h-2.5" : "h-1.5"
                          )}
                        />
                      ))}
                    </div>

                    {/* Mask Gelap Kiri (Bagian sebelum titik awal - Dibuang) */}
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-neutral-950/70 backdrop-blur-[0.5px] pointer-events-none z-[4]"
                      style={{ width: `${startPercent}%` }}
                    />

                    {/* Mask Gelap Kanan (Bagian setelah titik akhir - Dibuang) */}
                    <div
                      className="absolute top-0 bottom-0 right-0 bg-neutral-950/70 backdrop-blur-[0.5px] pointer-events-none z-[4]"
                      style={{ width: `${100 - endPercent}%` }}
                    />
                  </div>

                  {/* Kotak Seleksi Video Trimmer (Gold #F59E0B) */}
                  <div
                    className="absolute top-0 bottom-0 z-10 flex items-center overflow-visible"
                    style={{
                      left: `${startPercent}%`,
                      width: `${Math.max(1.5, endPercent - startPercent)}%`,
                    }}
                  >
                    {/* Area Tengah Trimmer (Bisa di-drag untuk menggeser window rentang rute) */}
                    <div
                      className={cn(
                        "absolute inset-0 border-y-[3px] border-amber-500 bg-amber-500/20 cursor-grab active:cursor-grabbing hover:bg-amber-500/30 transition-colors z-10",
                        isDraggingWindow && "bg-amber-500/35 cursor-grabbing"
                      )}
                      onMouseDown={handleStartDrag('window')}
                      onTouchStart={handleStartDrag('window')}
                      onClick={(e) => e.stopPropagation()}
                      title={tTracking.playbackDragWindowHint}
                    />

                    {/* Badge Mengambang Saat Menggeser Window Tengah */}
                    {isDraggingWindow && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-neutral-900/95 text-white border border-amber-500 shadow-xl text-[10px] font-bold font-mono whitespace-nowrap pointer-events-none z-35 flex items-center gap-1.5 animate-in fade-in">
                        <span className="text-amber-400">{startTimeDisplay}</span>
                        <span className="text-neutral-400">→</span>
                        <span className="text-amber-400">{endTimeDisplay}</span>
                      </div>
                    )}

                    {/* Samping Kiri: Handle Trimmer Awal (Left Crop Bracket - Gold) */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 bottom-0 w-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-l-[5px] flex items-center justify-center cursor-w-resize z-20 shadow-md touch-none group/left transition-all overflow-visible",
                        isDraggingStart && "bg-amber-400 ring-2 ring-amber-300"
                      )}
                      onMouseDown={handleStartDrag('start')}
                      onTouchStart={handleStartDrag('start')}
                      onClick={(e) => e.stopPropagation()}
                      title={tTracking.playbackDragLeftHint}
                    >
                      {/* 2 Garis vertikal grip khas video trimmer */}
                      <div className="flex gap-[2px] items-center pointer-events-none">
                        <div className="w-[1.5px] h-4 bg-white/90 rounded-full" />
                        <div className="w-[1.5px] h-4 bg-white/90 rounded-full" />
                      </div>

                      {/* Tooltip Waktu Mengambang di atas Handle Kiri */}
                      <div
                        className={cn(
                          "absolute -top-7 px-2 py-0.5 rounded bg-amber-500 text-white text-[9.5px] font-mono font-bold shadow-lg whitespace-nowrap pointer-events-none transition-all duration-75 z-30 flex items-center gap-1",
                          isDraggingStart || isDraggingWindow
                            ? "opacity-100 scale-105 ring-2 ring-amber-300"
                            : "opacity-95 group-hover/left:opacity-100",
                          startPercent < 10 ? "left-0" : startPercent > 85 ? "right-0" : "left-1/2 -translate-x-1/2"
                        )}
                      >
                        <span>{startTimeDisplay}</span>
                        <div
                          className={cn(
                            "absolute bottom-[-3px] w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-amber-500",
                            startPercent < 10 ? "left-2" : startPercent > 85 ? "right-2" : "left-1/2 -translate-x-1/2"
                          )}
                        />
                      </div>
                    </div>

                    {/* Samping Kanan: Handle Trimmer Akhir (Right Crop Bracket - Gold) */}
                    <div
                      className={cn(
                        "absolute right-0 top-0 bottom-0 w-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-r-[5px] flex items-center justify-center cursor-e-resize z-20 shadow-md touch-none group/right transition-all overflow-visible",
                        isDraggingEnd && "bg-amber-400 ring-2 ring-amber-300"
                      )}
                      onMouseDown={handleStartDrag('end')}
                      onTouchStart={handleStartDrag('end')}
                      onClick={(e) => e.stopPropagation()}
                      title={tTracking.playbackDragRightHint}
                    >
                      {/* 2 Garis vertikal grip khas video trimmer */}
                      <div className="flex gap-[2px] items-center pointer-events-none">
                        <div className="w-[1.5px] h-4 bg-white/90 rounded-full" />
                        <div className="w-[1.5px] h-4 bg-white/90 rounded-full" />
                      </div>

                      {/* Tooltip Waktu Mengambang di atas Handle Kanan */}
                      <div
                        className={cn(
                          "absolute -top-7 px-2 py-0.5 rounded bg-amber-500 text-white text-[9.5px] font-mono font-bold shadow-lg whitespace-nowrap pointer-events-none transition-all duration-75 z-30 flex items-center gap-1",
                          isDraggingEnd || isDraggingWindow
                            ? "opacity-100 scale-105 ring-2 ring-amber-300"
                            : "opacity-95 group-hover/right:opacity-100",
                          endPercent > 90 ? "right-0" : endPercent < 15 ? "left-0" : "left-1/2 -translate-x-1/2"
                        )}
                      >
                        <span>{endTimeDisplay}</span>
                        <div
                          className={cn(
                            "absolute bottom-[-3px] w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-amber-500",
                            endPercent > 90 ? "right-2" : endPercent < 15 ? "left-2" : "left-1/2 -translate-x-1/2"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Jarum Playhead Pemutar Merah di dalam Trimmer */}
                  <div
                    className="absolute top-0 bottom-0 w-[2px] bg-danger z-25 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.9)]"
                    style={{ left: `${progress}%` }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-danger border-2 border-white shadow-sm" />
                  </div>
                </div>
              )}
            </div>

            {/* Speed & Close / Action Buttons */}
            <div className="flex items-center gap-2 pl-3 border-l border-border shrink-0">
              {isRouteCropMode ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onCancelRouteCrop}
                    className="flex items-center justify-center h-9 px-3 text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors shrink-0"
                    title={tTracking.playbackTitleCancelCrop}
                  >
                    {tTracking.playbackCancelCrop}
                  </button>
                  <button
                    type="button"
                    onClick={onConfirmRouteCrop}
                    className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg bg-zinc-600 hover:bg-zinc-700 active:bg-zinc-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all shrink-0"
                    title={tTracking.playbackTitleConfirmCrop}
                  >
                    <span>{tTracking.playbackBtnConfirmCrop}</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative w-[56px]">
                    <select
                      value={speed}
                      onChange={(e) => onSpeedChange?.(Number(e.target.value))}
                      className="w-full h-8 rounded-lg bg-background px-2 text-[11px] text-foreground font-bold appearance-none focus:outline-none focus:ring-1 focus:ring-danger transition-colors cursor-pointer"
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
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-surface-elevated hover:bg-surface-elevated/80 text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
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
              className="w-full h-10 rounded-md border border-border bg-surface pl-9 pr-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary transition-colors "
            />
          </div>
          <div className="flex flex-col max-h-[300px] overflow-y-auto border border-border rounded-md">
            {vehicles.filter(v =>
              v.plateNumber.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
              (v.driverName?.toLowerCase() || '').includes(vehicleSearch.toLowerCase())
            ).length === 0 ? (
              <div className="px-4 py-8 text-center text-[12px] text-foreground-muted">
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
                    "flex flex-col items-start px-4 py-2.5 text-left border-b border-border hover:bg-surface-elevated last:border-b-0 transition-colors focus:outline-none focus:bg-surface-elevated",
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
