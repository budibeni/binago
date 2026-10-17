'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Plus,
  Minus,
  Maximize,
  Minimize,
  MoreHorizontal,
  Search,
  CircleDot,
  Ruler,
  Map as MapIcon,
  MapPinned,
  Satellite,
  Check,
  X,
  Navigation,
  Target,
  MapPin,
  Crosshair,
  Tag,
  CarFront,
  Moon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { useMapActions } from '../core/MapContext';
import { SearchLocationTool } from '../tools/SearchLocationTool';
import { MeasureDistanceTool } from '../tools/MeasureDistanceTool';
import { Locale, getMapTranslation } from '../i18n';
import type { BasemapId } from '../basemaps/types';
import type {
  LocationSearchResult,
  MapEntityOption,
  MapGeofenceOption,
  GeofenceCheckRequest,
  GeofenceCheckResult,
  SearchGeofenceOption,
  SearchRouteOption,
  SearchAreaVehicleResult,
  SearchAreaGeofenceResult,
  SearchAreaRouteResult,
  ActiveSearchAreaHighlight,
} from '../tools/types';

export type {
  LocationSearchResult,
  MapEntityOption,
  MapGeofenceOption,
  GeofenceCheckRequest,
  GeofenceCheckResult,
  SearchGeofenceOption,
  SearchRouteOption,
  SearchAreaVehicleResult,
  SearchAreaGeofenceResult,
  SearchAreaRouteResult,
  ActiveSearchAreaHighlight,
};

export interface MapControlPanelProps {
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
  onFitSelected?: () => void;
  onResetNorth?: () => void;
  mapContainerRef?: React.RefObject<HTMLElement>;
  onSearchAddress?: (query: string) => Promise<LocationSearchResult[]>;
  className?: string;
  locale?: Locale;

  /** Mode live tracking: jika true, tampilkan 5 tab dan armada. Jika false, hanya navigasi lokasi peta (3 tab) */
  isLiveTracking?: boolean;

  // Search Tool Geofence & Route Props
  geofenceSearchOptions?: SearchGeofenceOption[];
  routeSearchOptions?: SearchRouteOption[];
  onFindVehiclesInGeofence?: (geofenceId: string) => SearchAreaVehicleResult[];
  onFindVehiclesOnRoute?: (routeId: string) => SearchAreaVehicleResult[];
  onFindVehiclesInRadius?: (center: { lat: number; lng: number }, radiusMeters: number) => SearchAreaVehicleResult[];
  onSelectSearchVehicle?: (vehicleId: string) => void;
  onFindGeofencesInRadius?: (center: { lat: number; lng: number }, radiusMeters: number) => SearchAreaGeofenceResult[];
  onSelectSearchGeofence?: (geofenceId: string) => void;
  onFindRoutesInRadius?: (center: { lat: number; lng: number }, radiusMeters: number) => SearchAreaRouteResult[];
  onSelectSearchRoute?: (routeId: string) => void;
  onHighlightArea?: (highlight: ActiveSearchAreaHighlight | null) => void;
  onResolveMapsUrl?: (url: string) => Promise<{ lat: number; lng: number } | null>;

  // Marker Style Toggle
  hasCustomMarker?: boolean;
  markerStyle?: 'default' | 'custom';
  onMarkerStyleChange?: (style: 'default' | 'custom') => void;

  // Tool Toggles
  showMeasureTool?: boolean;
}

type ActivePanel =
  | 'basemap'
  | 'markerStyle'
  | 'more'
  | 'search'
  | 'measure'
  | null;

const BASEMAP_ICONS: Record<BasemapId, React.FC<{ className?: string }>> = {
  standard: MapIcon,
  dark: Moon,
  osm: MapPinned,
  satellite: Satellite,
};

export function MapControlPanel({
  basemap,
  onBasemapChange,
  onFitSelected,
  onResetNorth,
  mapContainerRef,
  onSearchAddress,
  className,
  locale = 'id',
  isLiveTracking,
  hasCustomMarker,
  markerStyle = 'custom',
  onMarkerStyleChange,
  showMeasureTool = true,
  geofenceSearchOptions,
  routeSearchOptions,
  onFindVehiclesInGeofence,
  onFindVehiclesOnRoute,
  onFindVehiclesInRadius,
  onSelectSearchVehicle,
  onFindGeofencesInRadius,
  onSelectSearchGeofence,
  onFindRoutesInRadius,
  onSelectSearchRoute,
  onHighlightArea,
  onResolveMapsUrl,
}: MapControlPanelProps) {
  const { zoomIn, zoomOut } = useMapActions();
  const t = getMapTranslation(locale);
  const tb = t.toolbar;
  const ctrl = t.controls;
  const bm = t.basemap;

  const [active, setActive] = useState<ActivePanel>(null);
  const [isSearchHidden, setIsSearchHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = (panel: ActivePanel) => {
    setActive((prev) => {
      if (prev === panel) {
        if (panel === 'search' && isSearchHidden) {
          setIsSearchHidden(false);
          return 'search';
        }
        setIsSearchHidden(false);
        if (panel === 'search') {
          onHighlightArea?.(null);
        }
        return null;
      }
      setIsSearchHidden(false);
      if (panel !== 'search') {
        onHighlightArea?.(null);
      }
      return panel;
    });
  };
  const closeAll = () => {
    setActive(null);
    setIsSearchHidden(false);
    onHighlightArea?.(null);
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const handleFullscreen = useCallback(() => {
    const target = mapContainerRef?.current ?? document.documentElement;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => { });
    } else {
      document.exitFullscreen?.().catch(() => { });
    }
  }, [mapContainerRef]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    // Card tool (search, measure) tidak boleh close saat klik di luar,
    // hanya boleh close jika tombol close (X) atau tombol tool diklik
    if (!active || active === 'search' || active === 'measure') return;
    const onOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closeAll();
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [active]);

  const ActiveBasemapIcon = BASEMAP_ICONS[basemap] ?? MapIcon;

  const basemapOptions: { id: BasemapId; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'standard', label: bm.standard, Icon: BASEMAP_ICONS.standard },
    { id: 'osm', label: bm.osm, Icon: BASEMAP_ICONS.osm },
    { id: 'satellite', label: bm.satellite, Icon: BASEMAP_ICONS.satellite },
  ];

  const moreTools = [
    ...(hasCustomMarker ? [{ id: 'markerStyle' as const, Icon: Tag, label: tb.markerStyle, onClick: () => toggle('markerStyle'), isActive: active === 'markerStyle' }] : []),
    ...(showMeasureTool ? [{ id: 'measure' as const, Icon: Ruler, label: tb.measure, onClick: () => toggle('measure'), isActive: active === 'measure' }] : []),
  ];

  const isMoreActive = active === 'more' || active === 'measure' || active === 'markerStyle';

  return (
    <div ref={panelRef} className={cn('relative', className)}>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING PANEL AREA
          ═══════════════════════════════════════════════════════════ */}
      {active && (
        <div
          className={cn(
            'absolute right-0 top-full mt-2 md:right-full md:top-auto md:bottom-0 md:mt-0 md:mr-2.5 z-[70]',
            active === 'search' && isSearchHidden && 'hidden pointer-events-none'
          )}
        >

          {/* -- Basemap picker -- */}
          {active === 'basemap' && (
            <FloatingCard aria-label={bm.label}>
              <div className="p-1 min-w-[180px]" role="listbox" aria-label={bm.label}>
                {basemapOptions.map(({ id, label, Icon }) => {
                  const selected = basemap === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => { onBasemapChange(id); closeAll(); }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                        selected
                          ? 'bg-accent/10 text-accent font-medium'
                          : 'text-foreground-muted hover:bg-surface hover:text-foreground',
                      )}
                    >
                      <span className="w-4 flex justify-center shrink-0">
                        {selected && <Check className="w-4 h-4 text-accent" />}
                      </span>
                      <Icon className={cn('w-4 h-4 shrink-0', selected ? 'text-accent' : 'text-foreground-subtle')} />
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </FloatingCard>
          )}

          {/* -- Marker Style picker -- */}
          {active === 'markerStyle' && hasCustomMarker && (
            <FloatingCard aria-label={tb.markerStyle}>
              <div className="p-1 min-w-[180px]" role="listbox" aria-label={tb.markerStyle}>
                <button
                  type="button"
                  role="option"
                  aria-selected={markerStyle === 'default'}
                  onClick={() => { onMarkerStyleChange?.('default'); closeAll(); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    markerStyle === 'default'
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-foreground-muted hover:bg-surface hover:text-foreground',
                  )}
                >
                  <span className="w-4 flex justify-center shrink-0">
                    {markerStyle === 'default' && <Check className="w-4 h-4 text-accent" />}
                  </span>
                  <Navigation className={cn('w-4 h-4 shrink-0', markerStyle === 'default' ? 'text-accent' : 'text-foreground-subtle')} />
                  <span className="truncate">{tb.defaultMarker}</span>
                </button>
                <button
                  type="button"
                  role="option"
                  aria-selected={markerStyle === 'custom'}
                  onClick={() => { onMarkerStyleChange?.('custom'); closeAll(); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                    markerStyle === 'custom'
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-foreground-muted hover:bg-surface hover:text-foreground',
                  )}
                >
                  <span className="w-4 flex justify-center shrink-0">
                    {markerStyle === 'custom' && <Check className="w-4 h-4 text-accent" />}
                  </span>
                  <CarFront className={cn('w-4 h-4 shrink-0', markerStyle === 'custom' ? 'text-accent' : 'text-foreground-subtle')} />
                  <span className="truncate">{tb.customMarker}</span>
                </button>
              </div>
            </FloatingCard>
          )}

          {/* -- More tools menu -- */}
          {active === 'more' && (
            <FloatingCard aria-label={tb.moreTools}>
              <div className="p-1 min-w-[192px]">
                {moreTools.map(({ id, Icon, label, onClick, isActive }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={onClick}
                    aria-label={label}
                    aria-pressed={isActive}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left',
                      isActive
                        ? 'bg-accent/10 text-accent font-medium'
                        : 'text-foreground-muted hover:bg-surface hover:text-foreground',
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </FloatingCard>
          )}

          {/* -- Tool panels -- */}
          {(active === 'search' || active === 'measure') && (
            <FloatingCard aria-label={
              active === 'search' ? tb.search : tb.measure
            }>
              {active !== 'measure' && (
                <PanelHeader
                  title={locale === 'id' ? 'Cari' : 'Search'}
                  closeLabel={locale === 'id' ? 'Tutup' : 'Close'}
                  onClose={closeAll}
                  onHide={active === 'search' ? () => setIsSearchHidden(true) : undefined}
                  hideLabel={locale === 'id' ? 'Kecilkan' : 'Minimize'}
                />
              )}
              <div className={active === 'measure' ? '' : 'p-3'}>
                {active === 'search' && (
                  <SearchLocationTool
                    isLiveTracking={isLiveTracking}
                    onSearchAddress={onSearchAddress}
                    geofenceOptions={geofenceSearchOptions}
                    routeOptions={routeSearchOptions}
                    onFindVehiclesInGeofence={onFindVehiclesInGeofence}
                    onFindVehiclesOnRoute={onFindVehiclesOnRoute}
                    onFindVehiclesInRadius={onFindVehiclesInRadius}
                    onSelectVehicle={onSelectSearchVehicle}
                    onFindGeofencesInRadius={onFindGeofencesInRadius}
                    onSelectGeofence={onSelectSearchGeofence}
                    onFindRoutesInRadius={onFindRoutesInRadius}
                    onSelectRoute={onSelectSearchRoute}
                    onHighlightArea={onHighlightArea}
                    onResolveMapsUrl={onResolveMapsUrl}
                    locale={locale}
                  />
                )}
                {active === 'measure' && (
                  <MeasureDistanceTool
                    active={true}
                    onDeactivate={closeAll}
                    locale={locale}
                  />
                )}
              </div>
            </FloatingCard>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          PRIMARY CONTROL PANEL
          ═══════════════════════════════════════════════════════════ */}
      <div
        id="map-control-panel"
        className={cn(
        'flex bg-background rounded-[10px] border border-border shadow-lg overflow-visible p-1 gap-1',
        // Mobile: horizontal row, auto width
        'flex-row',
        // Desktop: vertical column
        'md:flex-col md:w-auto',
      )}>

        {/* Search with mini Show button when hidden */}
        <div className="relative flex items-center justify-center">
          <IconBtn
            id="ctrl-search"
            icon={Search}
            label={tb.search}
            onClick={() => {
              if (active === 'search' && isSearchHidden) {
                setIsSearchHidden(false);
              } else {
                toggle('search');
              }
            }}
            active={active === 'search'}
          />

          {/* Icon/button di samping button/icon Cari ketika card sedang di-hide */}
          {active === 'search' && isSearchHidden && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchHidden(false);
              }}
              title={locale === 'id' ? 'Tampilkan Pencarian' : 'Show Search'}
              aria-label={locale === 'id' ? 'Tampilkan Pencarian' : 'Show Search'}
              className={cn(
                'absolute z-30 flex items-center justify-center transition-all duration-150 active:scale-95 shadow-md',
                // Ukuran dan radius sama persis dengan button cari (w-[28px] h-[28px] rounded-md)
                'w-[28px] h-[28px] rounded-md',
                // Style netral tanpa border biru
                'bg-white dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700/80',
                // Desktop: persis di samping kiri tombol Cari
                'md:-left-[34px] md:top-0',
                // Mobile: persis di atas tombol Cari
                '-top-[34px] left-0'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        <Sep />

        {/* Basemap */}
        <IconBtn
          id="ctrl-basemap"
          icon={ActiveBasemapIcon}
          label={bm.label}
          onClick={() => toggle('basemap')}
          active={active === 'basemap'}
        />

        <Sep />

        {/* Zoom In */}
        <IconBtn id="ctrl-zoom-in" icon={Plus} label={ctrl.zoomIn} onClick={zoomIn} />

        <Sep />

        {/* Zoom Out */}
        <IconBtn id="ctrl-zoom-out" icon={Minus} label={ctrl.zoomOut} onClick={zoomOut} />

        <Sep />

        {/* Fit Selected (Target) */}
        <IconBtn
          id="ctrl-fit-selected"
          icon={Crosshair}
          label={tb.fitSelected}
          onClick={onFitSelected}
        />

        <Sep />

        {/* Fullscreen */}
        <IconBtn
          id="ctrl-fullscreen"
          icon={isFullscreen ? Minimize : Maximize}
          label={isFullscreen ? tb.exitFullscreen : tb.fullscreen}
          onClick={handleFullscreen}
          active={isFullscreen}
        />

        {/* More Tools / Single Tool */}
        {moreTools.length === 1 ? (
          <>
            <Sep />
            <IconBtn
              id={`ctrl-${moreTools[0].id}`}
              icon={moreTools[0].Icon}
              label={moreTools[0].label}
              onClick={moreTools[0].onClick}
              active={moreTools[0].isActive}
            />
          </>
        ) : moreTools.length > 1 ? (
          <>
            <Sep />
            <IconBtn
              id="ctrl-more-tools"
              icon={MoreHorizontal}
              label={tb.moreTools}
              onClick={() => toggle('more')}
              active={isMoreActive}
            />
          </>
        ) : null}

      </div>
    </div>
  );
}

// -- FloatingCard --
function FloatingCard({ children, 'aria-label': ariaLabel }: { children: React.ReactNode; 'aria-label'?: string }) {
  return (
    <div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xl overflow-visible select-none"
      role="dialog"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

// -- PanelHeader --
function PanelHeader({
  title,
  onClose,
  closeLabel,
  onHide,
  hideLabel,
}: {
  title: string;
  onClose: () => void;
  closeLabel?: string;
  onHide?: () => void;
  hideLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/90 rounded-t-2xl">
      <h3 className="text-xs font-bold text-foreground tracking-tight">{title}</h3>
      <div className="flex items-center gap-2.5">
        {onHide && (
          <button
            type="button"
            onClick={onHide}
            aria-label={hideLabel}
            title={hideLabel}
            className="w-6 h-6 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          title={closeLabel}
          className="w-6 h-6 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// -- Sep - responsive separator --
function Sep() {
  return (
    <div className={cn(
      'bg-border shrink-0',
      'w-px self-stretch my-0.5',
      'md:w-auto md:h-px md:self-stretch md:my-0 md:mx-0.5',
    )} />
  );
}

// -- IconBtn --
interface IconBtnProps {
  id: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

function IconBtn({ id, icon: Icon, label, onClick, active }: IconBtnProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center w-[28px] h-[28px] rounded-md transition-all duration-150 shrink-0',
        active
          ? 'bg-accent/10 text-accent ring-1 ring-accent/20'
          : 'text-foreground-muted hover:bg-surface hover:text-foreground',
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
