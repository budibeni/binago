'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Gauge, ChevronDown } from 'lucide-react';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { PlaybackPoint, Trip } from '../types';

const SPEED_OPTIONS = [1, 2, 4, 8] as const;
type SpeedMultiplier = typeof SPEED_OPTIONS[number];

export interface PlaybackControlsProps {
  pointsCount: number;
  currentIndex: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSeek: (index: number) => void;
  onSpeedChange?: (speed: SpeedMultiplier) => void;
  onHide?: () => void;
  currentPoint: PlaybackPoint;
  trip?: Trip | null;
}

export function PlaybackControls({
  pointsCount,
  currentIndex,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onSeek,
  onSpeedChange,
  onHide,
  currentPoint,
  trip,
}: PlaybackControlsProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const tr = t.tracking;

  const [speed, setSpeed] = useState<SpeedMultiplier>(1);

  const handleSpeedChange = (s: SpeedMultiplier) => {
    setSpeed(s);
    onSpeedChange?.(s);
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatShortTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const progress = pointsCount > 1 ? (currentIndex / (pointsCount - 1)) * 100 : 0;
  const isEnded = currentIndex >= pointsCount - 1 && !isPlaying;

  return (
    <div className="bg-surface border border-border shadow-[0_-8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.5)] rounded-t-3xl md:rounded-2xl overflow-hidden relative">

      {/* Hide Button (Absolute Top Right) */}
      <button
        onClick={onHide}
        className="absolute top-2 md:top-3 right-2 p-2.5 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-full transition-colors z-30"
        aria-label={tr?.hideControls || 'Sembunyikan kontrol'}
      >
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Drag handle (mobile) */}
      <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden="true">
        <div className="w-10 h-1 bg-border-strong rounded-full" />
      </div>

      {/* Trip Info Row */}
      {trip && (
        <div className="px-5 pt-3 pb-2 border-b border-border flex items-center justify-between gap-4 pr-14">
          {/* Route */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-sm min-w-0">
              <span className="text-foreground font-medium truncate">{trip.startAddress}</span>
              <svg className="w-3.5 h-3.5 text-foreground-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <span className="text-foreground font-medium truncate">{trip.endAddress}</span>
            </div>
          </div>
          {/* Meta */}
          <div className="flex items-center gap-3 shrink-0 text-xs text-foreground-muted font-medium">
            <span>{trip.distance} km</span>
            <span aria-hidden="true">·</span>
            <span>{trip.duration} {locale === 'en' ? 'min' : 'mnt'}</span>
          </div>
        </div>
      )}

      <div className="px-5 pt-4 pb-5 md:pb-4 space-y-4">

        {/* Live Info: Time + Speed */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle mb-0.5">
              {tr?.currentTime || tr?.time || 'Waktu'}
            </p>
            <p className="text-lg font-bold tabular-nums text-foreground leading-none">
              {formatTime(currentPoint.timestamp)}
            </p>
          </div>

          {/* Playback status badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            isPlaying
              ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400'
              : isEnded
              ? 'bg-surface-elevated text-foreground-muted'
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isPlaying ? 'bg-green-500 animate-pulse' : isEnded ? 'bg-neutral-400' : 'bg-amber-500'
            }`} aria-hidden="true" />
            {isPlaying
              ? (tr?.statusPlaying || 'Memutar')
              : isEnded
              ? (tr?.statusEnded || 'Selesai')
              : (tr?.statusPaused || 'Dijeda')
            }
          </div>

          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle mb-0.5">
              {tr?.speedLabel || tr?.speed || 'Kecepatan'}
            </p>
            <p className="text-lg font-bold tabular-nums text-foreground leading-none">
              {currentPoint.speed} <span className="text-sm font-normal text-foreground-muted">{tr?.speedUnit || 'km/h'}</span>
            </p>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full h-8 group cursor-pointer">
            {/* Track */}
            <div className="absolute left-0 right-0 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 rounded-full transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
              />
            </div>
            {/* Invisible range input for interaction */}
            <input
              type="range"
              min={0}
              max={pointsCount - 1}
              value={currentIndex}
              onChange={(e) => onSeek(parseInt(e.target.value, 10))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Playback timeline"
              aria-valuemin={0}
              aria-valuemax={pointsCount - 1}
              aria-valuenow={currentIndex}
            />
            {/* Thumb */}
            <div
              className="absolute w-5 h-5 bg-background border-2 border-red-600 rounded-full shadow-md pointer-events-none transition-all duration-300 ease-linear"
              style={{ left: `calc(${progress}% - 10px)` }}
              aria-hidden="true"
            />
          </div>
          {/* Time labels */}
          {trip && (
            <div className="flex justify-between text-[10px] text-foreground-subtle font-medium px-0.5">
              <span>{formatShortTime(trip.startTime)}</span>
              <span>{formatShortTime(trip.endTime)}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Speed selector */}
          <div className="flex items-center gap-1 bg-surface-elevated rounded-xl p-1" role="group" aria-label="Playback speed">
            <Gauge className="w-3.5 h-3.5 text-foreground-subtle ml-1 mr-0.5" aria-hidden="true" />
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  speed === s
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
                aria-pressed={speed === s}
                aria-label={`${s}x speed`}
              >
                {s}×
              </button>
            ))}
          </div>

          {/* Main controls */}
          <div className="flex items-center gap-3">
            {/* Reset */}
            <button
              onClick={onReset}
              className="p-2.5 text-foreground-subtle hover:text-foreground hover:bg-surface-elevated rounded-full transition-all"
              aria-label={tr?.replay || 'Ulang'}
            >
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={isPlaying ? onPause : onPlay}
              className="w-14 h-14 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full shadow-lg shadow-red-600/30 transition-all flex items-center justify-center"
              aria-label={isPlaying ? (tr?.pause || 'Jeda') : (tr?.play || 'Putar')}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" aria-hidden="true" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" aria-hidden="true" />
              )}
            </button>

            {/* Empty placeholder for symmetric layout */}
            <div className="w-10" aria-hidden="true" />
          </div>
        </div>

      </div>
    </div>
  );
}
