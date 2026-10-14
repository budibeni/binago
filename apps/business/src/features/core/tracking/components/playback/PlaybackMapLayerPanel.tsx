'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronLeft, Route as RouteIcon } from 'lucide-react';
import { Checkbox } from '@adatrack/ui';
import { cn } from '@adatrack/utils';
import { geofenceService, routeService } from '@/data/services';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getTranslation } from '@/i18n';

export interface PlaybackMapLayerPanelProps {
  selectedGeofenceIds: string[];
  selectedRouteIds: string[];
  onGeofenceChange: (ids: string[]) => void;
  onRouteChange: (ids: string[]) => void;
  onClose: () => void;
  traversedGeofenceIds?: string[];
  similarRouteIds?: string[];
  routeSimilarityMap?: Record<string, number>;
  onCreateRoute?: () => void;
  hasPlaybackData?: boolean;
}

export function PlaybackMapLayerPanel({
  selectedGeofenceIds,
  selectedRouteIds,
  onGeofenceChange,
  onRouteChange,
  onClose,
  traversedGeofenceIds = [],
  similarRouteIds = [],
  routeSimilarityMap = {},
  onCreateRoute,
  hasPlaybackData = false,
}: PlaybackMapLayerPanelProps) {
  // Geofence states
  const [geoFilterMode, setGeoFilterMode] = useState<'relevant' | 'all'>('relevant');
  const [geoSearch, setGeoSearch] = useState('');
  const [geoPage, setGeoPage] = useState(1);
  const [geoItemsPerPage, setGeoItemsPerPage] = useState(5);

  // Route states
  const [routeFilterMode, setRouteFilterMode] = useState<'relevant' | 'all'>('relevant');
  const [routeSearch, setRouteSearch] = useState('');
  const [routePage, setRoutePage] = useState(1);
  const [routeItemsPerPage, setRouteItemsPerPage] = useState(5);

  const locale = useBusinessLocale() || 'id';
  const tTracking = getTranslation(locale).tracking;

  // --- Geofence Logic ---
  const allGeofences = useMemo(() => geofenceService.getGeofences(), []);
  const traversedSet = useMemo(() => new Set(traversedGeofenceIds), [traversedGeofenceIds]);

  const baseGeofences = useMemo(() => {
    if (geoFilterMode === 'relevant') {
      return allGeofences.filter((gf) => traversedSet.has(gf.id));
    }
    // Mode 'all': Smart sorting - letakkan geofence yang terlewati di urutan teratas
    return [...allGeofences].sort((a, b) => {
      const aTraversed = traversedSet.has(a.id) ? 1 : 0;
      const bTraversed = traversedSet.has(b.id) ? 1 : 0;
      if (bTraversed !== aTraversed) return bTraversed - aTraversed;
      return a.name.localeCompare(b.name);
    });
  }, [allGeofences, traversedSet, geoFilterMode]);

  const filteredGeofences = useMemo(() => {
    const q = geoSearch.toLowerCase().trim();
    if (!q) return baseGeofences;
    return baseGeofences.filter((gf) => gf.name.toLowerCase().includes(q));
  }, [baseGeofences, geoSearch]);

  const geoTotalPages = Math.max(1, Math.ceil(filteredGeofences.length / geoItemsPerPage));
  const currentGeoPage = Math.min(geoPage, geoTotalPages);

  const paginatedGeofences = useMemo(() => {
    const start = (currentGeoPage - 1) * geoItemsPerPage;
    return filteredGeofences.slice(start, start + geoItemsPerPage);
  }, [filteredGeofences, currentGeoPage, geoItemsPerPage]);

  const relevantGeofenceCount = traversedGeofenceIds.length;
  const allGeofenceCount = allGeofences.length;

  // --- Route Logic ---
  const allRoutes = useMemo(() => routeService.getRoutes(), []);
  const similarSet = useMemo(() => new Set(similarRouteIds), [similarRouteIds]);

  const baseRoutes = useMemo(() => {
    if (routeFilterMode === 'relevant') {
      // Hanya rute dengan kemiripan >= 80%
      const rel = allRoutes.filter(
        (rt) => similarSet.has(rt.id) || (routeSimilarityMap[rt.id] ?? 0) >= 80
      );
      return rel.sort((a, b) => (routeSimilarityMap[b.id] ?? 0) - (routeSimilarityMap[a.id] ?? 0));
    }
    // Mode 'all': Smart sorting - letakkan rute dengan kemiripan >= 80% di urutan teratas
    return [...allRoutes].sort((a, b) => {
      const aScore = routeSimilarityMap[a.id] ?? 0;
      const bScore = routeSimilarityMap[b.id] ?? 0;
      if (bScore !== aScore) return bScore - aScore;
      return a.name.localeCompare(b.name);
    });
  }, [allRoutes, similarSet, routeSimilarityMap, routeFilterMode]);

  const filteredRoutes = useMemo(() => {
    const q = routeSearch.toLowerCase().trim();
    if (!q) return baseRoutes;
    return baseRoutes.filter((rt) => rt.name.toLowerCase().includes(q));
  }, [baseRoutes, routeSearch]);

  const routeTotalPages = Math.max(1, Math.ceil(filteredRoutes.length / routeItemsPerPage));
  const currentRoutePage = Math.min(routePage, routeTotalPages);

  const paginatedRoutes = useMemo(() => {
    const start = (currentRoutePage - 1) * routeItemsPerPage;
    return filteredRoutes.slice(start, start + routeItemsPerPage);
  }, [filteredRoutes, currentRoutePage, routeItemsPerPage]);

  const relevantRouteCount = useMemo(() => {
    return allRoutes.filter(
      (rt) => similarSet.has(rt.id) || (routeSimilarityMap[rt.id] ?? 0) >= 80
    ).length;
  }, [allRoutes, similarSet, routeSimilarityMap]);

  const allRouteCount = allRoutes.length;

  // --- Handlers ---
  const handleReset = () => {
    onGeofenceChange([]);
    onRouteChange([]);
  };

  const handleToggleGeofence = (id: string, checked: boolean) => {
    if (checked) {
      onGeofenceChange([...selectedGeofenceIds, id]);
    } else {
      onGeofenceChange(selectedGeofenceIds.filter((gfId) => gfId !== id));
    }
  };

  const handleToggleRoute = (id: string, checked: boolean) => {
    if (checked) {
      onRouteChange([...selectedRouteIds, id]);
    } else {
      onRouteChange(selectedRouteIds.filter((rtId) => rtId !== id));
    }
  };

  const getPaginationArray = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }).map((_, i) => i + 1);
    }

    let start = Math.max(1, current - 2);
    let end = start + 4;

    if (end > total) {
      end = total;
      start = Math.max(1, end - 4);
    }

    const arr = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  };

  return (
    <div className="flex flex-col h-full w-full bg-background relative">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-3 h-[40px] bg-white dark:bg-neutral-900 border-b border-border">
        <h2 className="text-[12px] font-bold text-foreground tracking-tight">
          {tTracking.playbackSelectLayer}
        </h2>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-foreground transition-colors"
          title="Tutup Panel Layer"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Internal Scroll Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Legend */}
        <div className="flex flex-col gap-1.5 px-4 pt-3 pb-2 border-b border-border bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded-full shrink-0" />
            <span className="text-[10px] font-medium text-foreground-muted leading-tight">
              Track (Belum dilewati)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-danger rounded-full shrink-0" />
            <span className="text-[10px] font-medium text-foreground-muted leading-tight">
              Track (Sudah dilewati)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-0 border-t-[2px] border-dashed border-amber-500 shrink-0" />
            <span className="text-[10px] font-medium text-foreground-muted leading-tight">
              Rute
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-2.5 bg-green-500/20 border border-green-500 shrink-0 rounded-sm" />
            <span className="text-[10px] font-medium text-foreground-muted leading-tight">
              Geofence
            </span>
          </div>
        </div>

        {/* --- GEOFENCE SECTION --- */}
        <div className="flex flex-col mb-1">
          <div className="px-3 pt-3 pb-2 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-[11px] font-bold text-foreground-muted tracking-wider truncate">
                {tTracking.playbackGeofences.toUpperCase()}
              </h3>
              <span className="text-[11px] font-bold text-danger shrink-0">
                ({selectedGeofenceIds.length})
              </span>
            </div>

            {/* Toggle Segment: Terkait vs Semua */}
            <div className="flex items-center p-0.5 rounded bg-surface border border-border text-[9.5px] shrink-0">
              <button
                type="button"
                onClick={() => {
                  setGeoFilterMode('relevant');
                  setGeoPage(1);
                }}
                className={cn(
                  'px-1.5 py-0.5 rounded transition-all leading-none',
                  geoFilterMode === 'relevant'
                    ? 'bg-background text-foreground font-semibold shadow-xs border border-border/50'
                    : 'text-foreground-muted hover:text-foreground font-medium'
                )}
                title="Hanya tampilkan geofence yang terlewati oleh perjalanan"
              >
                Terkait ({relevantGeofenceCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setGeoFilterMode('all');
                  setGeoPage(1);
                }}
                className={cn(
                  'px-1.5 py-0.5 rounded transition-all leading-none',
                  geoFilterMode === 'all'
                    ? 'bg-background text-foreground font-semibold shadow-xs border border-border/50'
                    : 'text-foreground-muted hover:text-foreground font-medium'
                )}
                title="Tampilkan semua master geofence"
              >
                Semua ({allGeofenceCount})
              </button>
            </div>
          </div>

          <div className="px-3 mb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted" />
              <input
                type="text"
                value={geoSearch}
                onChange={(e) => {
                  setGeoSearch(e.target.value);
                  setGeoPage(1);
                }}
                placeholder={
                  geoFilterMode === 'relevant'
                    ? 'Cari geofence terlewati...'
                    : tTracking.playbackSearchGeofence
                }
                className="w-full pl-8 pr-2 py-1.5 text-[11px] rounded border border-border bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger transition-shadow"
              />
            </div>
          </div>

          <div className="px-3 pb-1">
            {paginatedGeofences.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {paginatedGeofences.map((gf) => {
                  const isTraversed = traversedGeofenceIds.includes(gf.id);
                  return (
                    <label
                      key={gf.id}
                      className="flex items-center justify-between gap-1.5 cursor-pointer group py-0.5 px-1 rounded hover:bg-surface transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 flex items-center bg-transparent"
                        >
                          <Checkbox
                            checked={selectedGeofenceIds.includes(gf.id)}
                            onCheckedChange={(checked) => handleToggleGeofence(gf.id, !!checked)}
                            className="h-3.5 w-3.5 data-[state=checked]:bg-danger data-[state=checked]:border-danger data-[state=checked]:text-white rounded-sm shadow-none"
                          />
                        </div>
                        <span className="text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors leading-none pt-px truncate">
                          {gf.name}
                        </span>
                      </div>
                      {isTraversed && (
                        <span
                          className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"
                          title="Terlewati"
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-[11px] text-foreground-muted py-3 px-2 bg-surface/40 rounded border border-dashed border-border">
                {geoFilterMode === 'relevant'
                  ? 'Belum ada geofence yang terlewati oleh perjalanan ini'
                  : tTracking.playbackNoGeofenceRoute}
              </div>
            )}
          </div>

          {/* Pagination Geofence */}
          {geoTotalPages > 1 && (
            <div className="px-3 py-1.5 flex items-center justify-between bg-surface border-y border-border">
              <div className="flex items-center gap-1">
                <select
                  value={geoItemsPerPage}
                  onChange={(e) => {
                    setGeoItemsPerPage(Number(e.target.value));
                    setGeoPage(1);
                  }}
                  className="bg-transparent text-[10px] text-foreground font-medium border border-border rounded py-0.5 px-1 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-[10px] text-foreground-muted">/hal</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setGeoPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentGeoPage === 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex gap-0.5">
                  {getPaginationArray(currentGeoPage, geoTotalPages).map((p) => (
                    <button
                      key={p}
                      onClick={() => setGeoPage(p)}
                      className={cn(
                        'w-5 h-5 rounded text-[10px] font-medium transition-colors shrink-0',
                        p === currentGeoPage
                          ? 'bg-neutral-500 text-white'
                          : 'hover:bg-muted text-foreground-muted hover:text-foreground'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setGeoPage((prev) => Math.min(geoTotalPages, prev + 1))}
                  disabled={currentGeoPage === geoTotalPages}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- ROUTE SECTION --- */}
        <div className="flex flex-col mb-1 border-t border-border">
          <div className="px-3 pt-3 pb-2 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-[11px] font-bold text-foreground-muted tracking-wider truncate">
                {tTracking.playbackRoutes.toUpperCase()}
              </h3>
              <span className="text-[11px] font-bold text-danger shrink-0">
                ({selectedRouteIds.length})
              </span>
            </div>

            {/* Toggle Segment: Terkait vs Semua */}
            <div className="flex items-center p-0.5 rounded bg-surface border border-border text-[9.5px] shrink-0">
              <button
                type="button"
                onClick={() => {
                  setRouteFilterMode('relevant');
                  setRoutePage(1);
                }}
                className={cn(
                  'px-1.5 py-0.5 rounded transition-all leading-none',
                  routeFilterMode === 'relevant'
                    ? 'bg-background text-foreground font-semibold shadow-xs border border-border/50'
                    : 'text-foreground-muted hover:text-foreground font-medium'
                )}
                title="Hanya tampilkan rute master dengan kemiripan ≥ 80%"
              >
                Terkait ({relevantRouteCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setRouteFilterMode('all');
                  setRoutePage(1);
                }}
                className={cn(
                  'px-1.5 py-0.5 rounded transition-all leading-none',
                  routeFilterMode === 'all'
                    ? 'bg-background text-foreground font-semibold shadow-xs border border-border/50'
                    : 'text-foreground-muted hover:text-foreground font-medium'
                )}
                title="Tampilkan semua master rute"
              >
                Semua ({allRouteCount})
              </button>
            </div>
          </div>

          <div className="px-3 mb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted" />
              <input
                type="text"
                value={routeSearch}
                onChange={(e) => {
                  setRouteSearch(e.target.value);
                  setRoutePage(1);
                }}
                placeholder={
                  routeFilterMode === 'relevant'
                    ? 'Cari rute terkait (≥ 80%)...'
                    : tTracking.playbackSearchRoute
                }
                className="w-full pl-8 pr-2 py-1.5 text-[11px] rounded border border-border bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger transition-shadow"
              />
            </div>
          </div>

          <div className="px-3 pb-1">
            {paginatedRoutes.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {paginatedRoutes.map((rt) => {
                  const similarity = routeSimilarityMap[rt.id] ?? 0;
                  const isSimilar = similarRouteIds.includes(rt.id) || similarity >= 80;
                  return (
                    <label
                      key={rt.id}
                      className="flex items-center justify-between gap-1.5 cursor-pointer group py-0.5 px-1 rounded hover:bg-surface transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 flex items-center bg-transparent"
                        >
                          <Checkbox
                            checked={selectedRouteIds.includes(rt.id)}
                            onCheckedChange={(checked) => handleToggleRoute(rt.id, !!checked)}
                            className="h-3.5 w-3.5 data-[state=checked]:bg-danger data-[state=checked]:border-danger data-[state=checked]:text-white rounded-sm shadow-none"
                          />
                        </div>
                        <span className="text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors leading-none pt-px truncate">
                          {rt.name}
                        </span>
                      </div>
                      {isSimilar && (
                        <span
                          className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"
                          title={similarity > 0 ? `${similarity}% Mirip` : 'Terkait'}
                        />
                      )}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-[11px] text-foreground-muted py-3 px-2 bg-surface/40 rounded border border-dashed border-border">
                {routeFilterMode === 'relevant'
                  ? 'Tidak ada rute dengan kemiripan ≥ 80%'
                  : tTracking.playbackNoGeofenceRoute}
              </div>
            )}
          </div>

          {/* Pagination Route */}
          {routeTotalPages > 1 && (
            <div className="px-3 py-1.5 flex items-center justify-between bg-surface border-y border-border">
              <div className="flex items-center gap-1">
                <select
                  value={routeItemsPerPage}
                  onChange={(e) => {
                    setRouteItemsPerPage(Number(e.target.value));
                    setRoutePage(1);
                  }}
                  className="bg-transparent text-[10px] text-foreground font-medium border border-border rounded py-0.5 px-1 focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-[10px] text-foreground-muted">/hal</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setRoutePage((prev) => Math.max(1, prev - 1))}
                  disabled={currentRoutePage === 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex gap-0.5">
                  {getPaginationArray(currentRoutePage, routeTotalPages).map((p) => (
                    <button
                      key={p}
                      onClick={() => setRoutePage(p)}
                      className={cn(
                        'w-5 h-5 rounded text-[10px] font-medium transition-colors shrink-0',
                        p === currentRoutePage
                          ? 'bg-neutral-500 text-white'
                          : 'hover:bg-muted text-foreground-muted hover:text-foreground'
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setRoutePage((prev) => Math.min(routeTotalPages, prev + 1))}
                  disabled={currentRoutePage === routeTotalPages}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3 border-t border-border mt-2 flex flex-col gap-2">
          <button
            onClick={handleReset}
            className="w-full py-1.5 text-[11px] font-semibold text-danger border border-danger/30 hover:bg-danger/5 rounded transition-colors"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={onCreateRoute}
            disabled={!hasPlaybackData}
            className="w-full py-1.5 px-3 flex items-center justify-center gap-2 text-[11px] font-semibold text-foreground bg-surface hover:bg-muted border border-border rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title={hasPlaybackData ? "Konversi riwayat playback ini menjadi Master Rute baru" : "Muat riwayat playback terlebih dahulu"}
          >
            <RouteIcon className="w-3.5 h-3.5 text-foreground-muted" />
            Buat Rute dari Playback
          </button>
        </div>
      </div>
    </div>
  );
}
