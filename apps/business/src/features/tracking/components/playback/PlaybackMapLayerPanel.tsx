'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
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
}

// No longer a constant, handled in state

export function PlaybackMapLayerPanel({
  selectedGeofenceIds,
  selectedRouteIds,
  onGeofenceChange,
  onRouteChange,
  onClose,
}: PlaybackMapLayerPanelProps) {
  
  // Geofence states
  const [geoSearch, setGeoSearch] = useState('');
  const [geoPage, setGeoPage] = useState(1);
  const [geoItemsPerPage, setGeoItemsPerPage] = useState(5);
  
  // Route states
  const [routeSearch, setRouteSearch] = useState('');
  const [routePage, setRoutePage] = useState(1);
  const [routeItemsPerPage, setRouteItemsPerPage] = useState(5);

  const locale = useBusinessLocale() || 'id';
  const tTracking = getTranslation(locale).tracking;

  // --- Geofence Logic ---
  const filteredGeofences = useMemo(() => {
    const q = geoSearch.toLowerCase().trim();
    if (!q) return geofenceService.getGeofences();
    return geofenceService.getGeofences().filter(gf => gf.name.toLowerCase().includes(q));
  }, [geoSearch]);

  const geoTotalPages = Math.max(1, Math.ceil(filteredGeofences.length / geoItemsPerPage));
  const currentGeoPage = Math.min(geoPage, geoTotalPages);
  
  const paginatedGeofences = useMemo(() => {
    const start = (currentGeoPage - 1) * geoItemsPerPage;
    return filteredGeofences.slice(start, start + geoItemsPerPage);
  }, [filteredGeofences, currentGeoPage, geoItemsPerPage]);

  // --- Route Logic ---
  const filteredRoutes = useMemo(() => {
    const q = routeSearch.toLowerCase().trim();
    if (!q) return routeService.getRoutes();
    return routeService.getRoutes().filter(rt => rt.name.toLowerCase().includes(q));
  }, [routeSearch]);

  const routeTotalPages = Math.max(1, Math.ceil(filteredRoutes.length / routeItemsPerPage));
  const currentRoutePage = Math.min(routePage, routeTotalPages);

  const paginatedRoutes = useMemo(() => {
    const start = (currentRoutePage - 1) * routeItemsPerPage;
    return filteredRoutes.slice(start, start + routeItemsPerPage);
  }, [filteredRoutes, currentRoutePage, routeItemsPerPage]);

  // --- Handlers ---
  const handleReset = () => {
    onGeofenceChange([]);
    onRouteChange([]);
  };

  const handleToggleGeofence = (id: string, checked: boolean) => {
    if (checked) {
      onGeofenceChange([...selectedGeofenceIds, id]);
    } else {
      onGeofenceChange(selectedGeofenceIds.filter(gfId => gfId !== id));
    }
  };

  const handleToggleRoute = (id: string, checked: boolean) => {
    if (checked) {
      onRouteChange([...selectedRouteIds, id]);
    } else {
      onRouteChange(selectedRouteIds.filter(rtId => rtId !== id));
    }
  };

  // Safe pagination array to avoid extremely long lists if data grows big
  const getPaginationArray = (current: number, total: number) => {
    // For small data we can just return all pages
    return Array.from({ length: total }).map((_, i) => i + 1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background relative">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-3 h-[40px] bg-white dark:bg-neutral-900 border-b border-border">
        <h2 className="text-[12px] font-bold text-foreground tracking-tight">{tTracking.playbackSelectLayer}</h2>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-50 hover:text-foreground transition-colors"
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
            <span className="text-[10px] font-medium text-foreground-muted leading-tight">Track (Belum dilewati)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-danger rounded-full shrink-0" />
            <span className="text-[10px] font-medium text-foreground-muted leading-tight">Track (Sudah dilewati)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-0 border-t-[2px] border-dashed border-amber-500 shrink-0" />
            <span className="text-[10px] font-medium text-foreground-muted leading-tight">Rute</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-4 h-2.5 bg-green-500/20 border border-green-500 shrink-0 rounded-sm" />
            <span className="text-[10px] font-medium text-foreground-muted leading-tight">Geofence</span>
          </div>
        </div>
        
        {/* --- GEOFENCE SECTION --- */}
        <div className="flex flex-col mb-1">
          <div className="px-3 pt-3 pb-1.5 flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-foreground-muted tracking-wider">{tTracking.playbackGeofences.toUpperCase()}</h3>
            <span className="text-[11px] font-bold text-danger">{selectedGeofenceIds.length}</span>
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
                placeholder={tTracking.playbackSearchGeofence}
                className="w-full pl-8 pr-2 py-1.5 text-[11px] rounded border border-border bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger transition-shadow"
              />
            </div>
          </div>
          
          <div className="px-3 pb-1">
            {paginatedGeofences.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {paginatedGeofences.map((gf) => (
                  <label key={gf.id} className="flex items-center gap-2 cursor-pointer group py-0.5">
                    <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center bg-transparent">
                      <Checkbox
                        checked={selectedGeofenceIds.includes(gf.id)}
                        onCheckedChange={(checked) => handleToggleGeofence(gf.id, !!checked)}
                        className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400 data-[state=checked]:text-white rounded-sm shadow-none"
                      />
                    </div>
                    <span className="text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors leading-none pt-px">
                      {gf.name}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center text-[12px] text-foreground-muted py-4">
                {tTracking.playbackNoGeofenceRoute}
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
                  onClick={() => setGeoPage(prev => Math.max(1, prev - 1))}
                  disabled={currentGeoPage === 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex gap-0.5 overflow-x-auto max-w-[120px] scrollbar-hide">
                  {getPaginationArray(currentGeoPage, geoTotalPages).map((p) => (
                    <button
                      key={p}
                      onClick={() => setGeoPage(p)}
                      className={cn(
                        "w-5 h-5 rounded text-[10px] font-medium transition-colors shrink-0",
                        p === currentGeoPage
                          ? "bg-neutral-500 text-white"
                          : "hover:bg-muted text-foreground-muted hover:text-foreground"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setGeoPage(prev => Math.min(geoTotalPages, prev + 1))}
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
          <div className="px-3 pt-3 pb-1.5 flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-foreground-muted tracking-wider">{tTracking.playbackRoutes.toUpperCase()}</h3>
            <span className="text-[11px] font-bold text-danger">{selectedRouteIds.length}</span>
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
                placeholder={tTracking.playbackSearchRoute}
                className="w-full pl-8 pr-2 py-1.5 text-[11px] rounded border border-border bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger transition-shadow"
              />
            </div>
          </div>
          
          <div className="px-3 pb-1">
            {paginatedRoutes.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {paginatedRoutes.map((rt) => (
                  <label key={rt.id} className="flex items-center gap-2 cursor-pointer group py-0.5">
                    <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center bg-transparent">
                      <Checkbox
                        checked={selectedRouteIds.includes(rt.id)}
                        onCheckedChange={(checked) => handleToggleRoute(rt.id, !!checked)}
                        className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400 data-[state=checked]:text-white rounded-sm shadow-none"
                      />
                    </div>
                    <span className="text-[11.5px] font-normal text-foreground-muted group-hover:text-danger transition-colors leading-none pt-px">
                      {rt.name}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center text-[12px] text-foreground-muted py-4">
                {tTracking.playbackNoGeofenceRoute}
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
                  onClick={() => setRoutePage(prev => Math.max(1, prev - 1))}
                  disabled={currentRoutePage === 1}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <div className="flex gap-0.5 overflow-x-auto max-w-[120px] scrollbar-hide">
                  {getPaginationArray(currentRoutePage, routeTotalPages).map((p) => (
                    <button
                      key={p}
                      onClick={() => setRoutePage(p)}
                      className={cn(
                        "w-5 h-5 rounded text-[10px] font-medium transition-colors shrink-0",
                        p === currentRoutePage
                          ? "bg-neutral-500 text-white"
                          : "hover:bg-muted text-foreground-muted hover:text-foreground"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setRoutePage(prev => Math.min(routeTotalPages, prev + 1))}
                  disabled={currentRoutePage === routeTotalPages}
                  className="p-1 rounded hover:bg-muted disabled:opacity-50 text-foreground-muted hover:text-foreground transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Reset Button and Legend */}
        <div className="p-3 border-t border-border mt-2">
          <button
            onClick={handleReset}
            className="w-full py-1.5 text-[11px] font-semibold text-danger border border-danger/30 hover:bg-danger/5 rounded transition-colors"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
