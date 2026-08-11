'use client';

import React from 'react';
import { Map, History } from 'lucide-react';
import { cn } from '@binago/utils';
import { VehicleList } from './components/VehicleList';
import { LiveMap } from './components/LiveMap';
import { PlaybackPanel } from './components/PlaybackPanel';
import { mockVehicleGroups, mockVehicles } from './data/mockTrackingData';
import { getTranslation } from '../../i18n';
import type { StatusFilter, DateRange, PlaybackState } from './types/tracking';
import type { Locale } from '@binago/types';

// ─── Mode ─────────────────────────────────────────────────────────────────────

type TrackingMode = 'live' | 'playback';

// ─── TrackingFeature ──────────────────────────────────────────────────────────

interface TrackingFeatureProps {
  locale?: Locale;
}

export function TrackingFeature({ locale = 'id' }: TrackingFeatureProps) {
  const t = getTranslation(locale);
  const tTracking = t.tracking;

  // ── Mode ──────────────────────────────────────────────────────────────────
  const [mode, setMode] = React.useState<TrackingMode>('live');

  // ── VehicleList state ─────────────────────────────────────────────────────
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = React.useState<string[]>([]);

  // ── Playback state ────────────────────────────────────────────────────────
  const [playbackVehicleId, setPlaybackVehicleId] = React.useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState<DateRange>({
    date: new Date().toISOString().slice(0, 10),
    startTime: '06:00',
    endTime: '18:00',
  });
  const [playbackState, setPlaybackState] = React.useState<PlaybackState>({
    status: 'idle',
    totalDuration: 0,
    currentTime: 0,
  });

  // ── Timer ref ─────────────────────────────────────────────────────────────
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // ── VehicleList handlers ──────────────────────────────────────────────────

  const handleVehicleSelect = React.useCallback((vehicleId: string) => {
    setSelectedVehicleId((prev) => (prev === vehicleId ? null : vehicleId));
  }, []);

  const handleMapSelect = React.useCallback((vehicleId: string | null) => {
    setSelectedVehicleId(vehicleId);
  }, []);

  const handleVehicleCheck = React.useCallback((vehicleId: string, checked: boolean) => {
    setSelectedVehicleIds((prev: string[]) =>
      checked ? [...prev, vehicleId] : prev.filter((id: string) => id !== vehicleId),
    );
  }, []);

  const handleSelectAll = React.useCallback((checked: boolean) => {
    setSelectedVehicleIds(checked ? mockVehicles.map((v) => v.id) : []);
  }, []);

  // ── Playback handlers ─────────────────────────────────────────────────────

  const handlePlaybackVehicleChange = React.useCallback((vehicleId: string) => {
    setPlaybackVehicleId(vehicleId);
    setPlaybackState({ status: 'idle', totalDuration: 0, currentTime: 0 });
    stopTimer();
  }, [stopTimer]);

  const handleLoadHistory = React.useCallback(() => {
    if (!playbackVehicleId) return;
    stopTimer();
    setPlaybackState({ status: 'loading', totalDuration: 0, currentTime: 0 });
    setTimeout(() => {
      setPlaybackState({ status: 'ready', totalDuration: 3600, currentTime: 0 });
    }, 1500);
  }, [playbackVehicleId, stopTimer]);

  const handlePlay = React.useCallback(() => {
    setPlaybackState((prev: PlaybackState) => {
      if (prev.status !== 'ready' && prev.status !== 'paused') return prev;
      return { ...prev, status: 'playing' as const };
    });
    timerRef.current = setInterval(() => {
      setPlaybackState((prev: PlaybackState) => {
        if (prev.status !== 'playing') { stopTimer(); return prev; }
        const next = prev.currentTime + 1;
        if (next >= prev.totalDuration) {
          stopTimer();
          return { ...prev, status: 'ready' as const, currentTime: prev.totalDuration };
        }
        return { ...prev, currentTime: next };
      });
    }, 100);
  }, [stopTimer]);

  const handlePause = React.useCallback(() => {
    stopTimer();
    setPlaybackState((prev: PlaybackState) => ({ ...prev, status: 'paused' as const }));
  }, [stopTimer]);

  const handleStop = React.useCallback(() => {
    stopTimer();
    setPlaybackState((prev: PlaybackState) => ({ ...prev, status: 'ready' as const, currentTime: 0 }));
  }, [stopTimer]);

  const handleSeek = React.useCallback((progress: number) => {
    setPlaybackState((prev: PlaybackState) => ({
      ...prev,
      currentTime: (progress / 100) * prev.totalDuration,
    }));
  }, []);

  // ── VehicleList labels ────────────────────────────────────────────────────
  const vehicleListLabels = React.useMemo(() => ({
    title: tTracking.title,
    unitCount: tTracking.unitCount,
    searchPlaceholder: tTracking.searchPlaceholder,
    filterSettings: tTracking.filterSettings,
    allUnits: tTracking.allUnits,
    statusAll: tTracking.statusAll,
    statusDriving: tTracking.statusDriving,
    statusIdle: tTracking.statusIdle,
    statusParking: tTracking.statusParking,
    statusOffline: tTracking.statusOffline,
    noDriver: tTracking.noDriver,
    speedUnit: tTracking.speedUnit,
    groupSummary: tTracking.groupSummary,
  }), [tTracking]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">

      {/* Main Area: Map & Playback */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">

        {/* Mode Toggle */}
        <div className="absolute top-4 left-4 z-20">
          <div
            className="flex items-center rounded-lg border border-neutral-200 bg-neutral-100/80 backdrop-blur-md p-1 shadow-sm"
            role="tablist"
            aria-label="Mode Pemantauan"
          >
            {/* Tab: Live */}
            <button
              role="tab"
              type="button"
              aria-selected={mode === 'live'}
              onClick={() => setMode('live')}
              className={cn(
                'flex items-center gap-2 px-5 py-1.5 text-[13px] font-bold rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                mode === 'live'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground hover:bg-neutral-200/50',
              )}
            >
              {/* Live Dot Icon */}
              <svg className={cn("h-4 w-4", mode === 'live' ? "text-danger" : "text-foreground-muted")} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <circle cx="8" cy="8" r="6" fill="currentColor" />
                <circle cx="8" cy="8" r="2" fill="white" />
              </svg>
              {tTracking.modeLive}
            </button>

            {/* Tab: Playback */}
            <button
              role="tab"
              type="button"
              aria-selected={mode === 'playback'}
              onClick={() => setMode('playback')}
              className={cn(
                'flex items-center gap-2 px-5 py-1.5 text-[13px] font-bold rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                mode === 'playback'
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground hover:bg-neutral-200/50',
              )}
            >
              <History className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              {tTracking.modePlayback}
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <LiveMap
            vehicles={mockVehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={handleMapSelect}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Bottom Playback Panel */}
        <div
          className={cn(
            'shrink-0 border-t border-border bg-background transition-all duration-300 ease-in-out',
            mode === 'playback' ? 'h-[160px] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-10 pointer-events-none overflow-hidden'
          )}
          aria-hidden={mode !== 'playback'}
        >
          <PlaybackPanel
            vehicles={mockVehicles}
            selectedVehicleId={playbackVehicleId}
            dateRange={dateRange}
            playbackState={playbackState}
            onVehicleChange={handlePlaybackVehicleChange}
            onDateRangeChange={setDateRange}
            onLoad={handleLoadHistory}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onSeek={handleSeek}
          />
        </div>
      </div>

      {/* Right Sidebar: VehicleList */}
      <div className="shrink-0 w-[320px] flex flex-col h-full border-l border-border bg-background shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
        <VehicleList
          groups={mockVehicleGroups}
          selectedVehicleId={selectedVehicleId}
          selectedVehicleIds={selectedVehicleIds}
          search={search}
          statusFilter={statusFilter}
          onVehicleSelect={handleVehicleSelect}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onVehicleCheck={handleVehicleCheck}
          onSelectAll={handleSelectAll}
          labels={vehicleListLabels}
        />
      </div>
    </div>
  );
}
