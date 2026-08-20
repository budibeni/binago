'use client';

import React from 'react';
import { Map, History, ChevronLeft, Filter } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { VehicleList } from './components/VehicleList';
import { LiveMap } from './components/LiveMap';
import { PlaybackPanel } from './components/PlaybackPanel';
import { VehicleOverviewPanel } from './components/VehicleOverviewPanel';
import { mockVehicleGroups, mockVehicles } from './data/mockTrackingData';
import { getTranslation } from '../../i18n';
import { useBusinessLocale } from '../../components/BusinessShellLayout';
import type { StatusFilter, DateRange, PlaybackState } from './types/tracking';
import type { Locale } from '@adatrack/types';

// â”€â”€â”€ Mode â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type TrackingMode = 'live' | 'playback';

// â”€â”€â”€ TrackingFeature â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface TrackingFeatureProps {
  locale?: Locale;
}

export function TrackingFeature({ locale: localeProp }: TrackingFeatureProps) {
  const contextLocale = useBusinessLocale();
  const locale = localeProp ?? contextLocale ?? 'id';
  const t = getTranslation(locale);
  const tTracking = t.tracking;

  // â”€â”€ Mode â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [mode, setMode] = React.useState<TrackingMode>('live');

  // â”€â”€ VehicleList state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<string | null>(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = React.useState<string[]>(() => mockVehicles.map((v) => v.id));
  const [isVehicleListVisible, setIsVehicleListVisible] = React.useState(true);

  // â”€â”€ Playback state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // ——— Timer ref ——————————————————————————————————————————————————————————————————————————————
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── Computed ────────────────────────────────────────────────────────────────
  const allVehiclesUnfiltered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    return mockVehicles.filter((v) => {
      const matchStatus = statusFilter === 'all' || v.status === statusFilter;
      const matchSearch =
        !q ||
        v.plateNumber.toLowerCase().includes(q) ||
        v.groupName.toLowerCase().includes(q) ||
        (v.driverName?.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  }, [search, statusFilter]);

  const stopTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // ——— VehicleList handlers ——————————————————————————————————————————————————————————————————

  const handleVehicleSelect = React.useCallback((vehicleId: string) => {
    setSelectedVehicleId((prev) => (prev === vehicleId ? null : vehicleId));
  }, []);

  const handleVehicleCheck = React.useCallback((idOrIds: string | string[], checked: boolean) => {
    setSelectedVehicleIds((prev: string[]) => {
      const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
      if (checked) {
        return Array.from(new Set([...prev, ...ids]));
      }
      return prev.filter(id => !ids.includes(id));
    });
  }, []);

  const handleSelectAll = React.useCallback((checked: boolean) => {
    setSelectedVehicleIds(checked ? mockVehicles.map((v) => v.id) : []);
  }, []);

  // â”€â”€ Playback handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const handlePlaybackVehicleChange = React.useCallback((vehicleId: string) => {
    setPlaybackVehicleId(vehicleId);
    setPlaybackState({ status: 'idle', totalDuration: 0, currentTime: 0 });
    stopTimer();
  }, [stopTimer]);

  const handlePlaybackRequest = React.useCallback((vehicleId: string) => {
    setMode('playback');
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

  // â”€â”€ VehicleList labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    emptyTitle: tTracking.emptyTitle,
    emptyDescription: tTracking.emptyDescription,
    refreshData: tTracking.refreshData,
    hidePanel: tTracking.hidePanel,
  }), [tTracking]);

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">

      {/* Main Area: Map & Playback */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">

        {/* Mode Toggle */}
        <div className="absolute top-4 left-4 z-20">
          <div
            className="flex items-center rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-md p-0.5 shadow-sm gap-0.5"
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
                'flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                mode === 'live'
                  ? 'bg-white dark:bg-neutral-700 text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40',
              )}
            >
              {/* Live Dot Icon */}
              <svg className={cn("h-3 w-3", mode === 'live' ? "text-danger" : "text-foreground-muted")} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
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
                'flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                mode === 'playback'
                  ? 'bg-white dark:bg-neutral-700 text-foreground shadow-sm'
                  : 'text-foreground-muted hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40',
              )}
            >
              <History className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
              {tTracking.modePlayback}
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <LiveMap
            vehicles={allVehiclesUnfiltered}
            selectedVehicleId={selectedVehicleId || undefined}
            visibleVehicleIds={
              mode === 'playback'
                ? (playbackVehicleId ? [playbackVehicleId] : [])
                : allVehiclesUnfiltered.map(v => v.id).filter(id => selectedVehicleIds.includes(id))
            }
            onPlaybackRequest={handlePlaybackRequest}
          />
        </div>


        {/* Bottom Playback Panel */}
        <div
          className={cn(
            'shrink-0 border-t border-border bg-background transition-all duration-300 ease-in-out',
            mode === 'playback' ? 'h-[120px] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-10 pointer-events-none overflow-hidden'
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

        {/* Bottom Overview Panel (Live Mode) */}
        <div
          className={cn(
            'shrink-0 border-t border-border bg-background transition-all duration-300 ease-in-out',
            (mode === 'live' && selectedVehicleId) ? 'h-[148px] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-10 pointer-events-none overflow-hidden'
          )}
          aria-hidden={mode !== 'live' || !selectedVehicleId}
        >
          <VehicleOverviewPanel
            vehicle={mockVehicles.find(v => v.id === selectedVehicleId) || null}
            onClose={() => setSelectedVehicleId(null)}
            locale={locale}
          />
        </div>
      </div>

      {/* Right Sidebar: VehicleList or Collapsed Vertical Tab */}
      {mode === 'live' && (
        <div
          className={cn(
            'shrink-0 h-full z-10 transition-all duration-300 ease-in-out flex flex-col',
            isVehicleListVisible
              ? 'w-[320px] border-l border-border bg-background shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]'
              : 'w-[34px] py-2 items-center bg-transparent border-l border-border/40'
          )}
        >
          {isVehicleListVisible ? (
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
              onClose={() => setIsVehicleListVisible(false)}
              labels={vehicleListLabels}
            />
          ) : (
            <div className="flex flex-col items-center gap-2.5 h-full w-full">
              {/* Expand button */}
              <button
                type="button"
                onClick={() => setIsVehicleListVisible(true)}
                className="flex h-6 w-6 items-center justify-center text-foreground-muted hover:text-foreground transition-colors focus:outline-none shrink-0"
                title="Buka Panel Pemantauan"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {/* Vertical Tab Button */}
              <button
                type="button"
                onClick={() => setIsVehicleListVisible(true)}
                className="flex flex-col items-center py-2 px-0.5 text-foreground group shrink-0 transition-opacity hover:opacity-80"
                title="Buka Pemantauan"
              >

                {/* Vertical Text */}
                <div className="flex flex-col items-center gap-1 font-bold text-[8.5px] tracking-widest text-foreground-muted group-hover:text-foreground uppercase select-none mb-2 transition-colors">
                  {tTracking.title.toUpperCase().split('').map((char, index) => (
                    <span key={index} className="leading-none">{char}</span>
                  ))}
                </div>

                {/* Active Indicator Square */}
                <div className="h-1 w-1 bg-primary animate-pulse" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
