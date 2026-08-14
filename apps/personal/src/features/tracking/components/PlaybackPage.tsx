'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RouteOff, ChevronUp } from 'lucide-react';
import { PlaybackMap } from './PlaybackMap';
import { PlaybackControls } from './PlaybackControls';
import { PlaybackData, Trip, Vehicle } from '../types';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@adatrack/utils';

export interface PlaybackPageProps {
  playbackData: PlaybackData;
  trip?: Trip | null;
  vehicle?: Vehicle | undefined;
  onBack: () => void;
}

export function PlaybackPage({ playbackData, trip, vehicle, onBack }: PlaybackPageProps) {
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const tr = t.tracking;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 4 | 8>(1);
  const [showControls, setShowControls] = useState(true);

  const points = playbackData.points;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Playback Loop â€” speed-aware
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(50, 1000 / speedMultiplier);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= points.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, points.length, speedMultiplier]);

  const handlePlay = () => {
    if (currentIndex >= points.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleSeek = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSpeedChange = (speed: 1 | 2 | 4 | 8) => {
    setSpeedMultiplier(speed);
  };

  // --- EMPTY STATE ---
  if (points.length === 0) {
    return (
      <div className="flex flex-col h-full bg-surface">
        <div className="flex items-center px-4 py-4 shrink-0 border-b border-border">
          <button
            onClick={onBack}
            className="p-1 mr-2 text-foreground-muted hover:text-foreground transition-colors rounded-full hover:bg-surface-elevated"
            aria-label={tr?.back || t.common?.back || 'Kembali'}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-[15px]">{tr?.tripHistory || 'Riwayat Perjalanan'}</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={RouteOff}
            title={tr?.noPlaybackData || 'Tidak ada data playback'}
            description={tr?.noPlaybackDataDesc}
          />
        </div>
      </div>
    );
  }

  // --- MAIN PLAYBACK VIEW ---
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background overflow-hidden">

      {/* ======= MAP â€” full background ======= */}
      <div className="absolute inset-0 z-0">
        <PlaybackMap
          data={playbackData}
          currentIndex={currentIndex}
        />
      </div>

      {/* ======= HEADER OVERLAY ======= */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        {/* Gradient fade for readability */}
        <div className="absolute inset-0 h-40 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80 dark:to-transparent" aria-hidden="true" />

        <div className="relative flex items-center gap-3 px-4 pt-safe-top pt-4 pb-2">
          {/* Back button */}
          <button
            onClick={onBack}
            className="pointer-events-auto shrink-0 w-9 h-9 flex items-center justify-center bg-surface-elevated border border-border rounded-full text-foreground hover:bg-surface-elevated/90 transition-all shadow-sm"
            aria-label={tr?.back || t.common?.back || 'Kembali'}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Vehicle info */}
          {vehicle && (
            <div className="pointer-events-auto flex-1 min-w-0 drop-shadow-md">
              <p className="text-foreground font-bold text-base leading-tight truncate">
                {vehicle.type}
              </p>
              <p className="text-foreground-muted text-xs font-medium leading-tight mt-0.5">
                {vehicle.plateNumber}
              </p>
            </div>
          )}
          {!vehicle && (
            <div className="pointer-events-auto flex-1 min-w-0 drop-shadow-md">
              <p className="text-foreground font-bold text-base leading-tight truncate">
                {tr?.tripHistory || 'Riwayat Perjalanan'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======= FLOATING SHOW BUTTON ======= */}
      {/* Appears when controls are hidden */}
      <div 
        className={cn(
          "absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-all duration-300 ease-in-out",
          showControls ? "opacity-0 translate-y-8 pointer-events-none" : "opacity-100 translate-y-0"
        )}
      >
        <button
          onClick={() => setShowControls(true)}
          className="flex items-center gap-2 px-5 py-3 bg-surface border border-border shadow-lg rounded-full text-foreground font-semibold hover:bg-surface-elevated transition-all active:scale-95"
          aria-label={tr?.showControls || 'Tampilkan kontrol'}
        >
          <ChevronUp className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm">{tr?.showControls || 'Tampilkan kontrol'}</span>
        </button>
      </div>

      {/* ======= BOTTOM SHEET CONTROLS ======= */}
      {/*
        Mobile: full-width, pinned to bottom
        Desktop: centered, max-width, floating above bottom
      */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-lg md:px-4 transition-all duration-500 ease-in-out",
          showControls ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0 pointer-events-none"
        )}
      >
        <PlaybackControls
          pointsCount={points.length}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onSeek={handleSeek}
          onSpeedChange={handleSpeedChange}
          onHide={() => setShowControls(false)}
          currentPoint={points[currentIndex]}
          trip={trip}
        />
      </div>

    </div>
  );
}
