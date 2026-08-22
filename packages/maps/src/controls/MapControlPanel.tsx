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
  MapPinSearch,
  CarFront,
  Moon,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { useMapActions } from '../core/MapContext';
import { SearchLocationTool } from '../tools/SearchLocationTool';
import { MeasureDistanceTool } from '../tools/MeasureDistanceTool';
import { GeofenceCheckTool } from '../tools/GeofenceCheckTool';
import { Locale, getMapTranslation } from '../i18n';
import type { BasemapId } from '../basemaps/types';
import type {
  LocationSearchResult,
  MapEntityOption,
  MapGeofenceOption,
  GeofenceCheckRequest,
  GeofenceCheckResult,
} from '../tools/types';

export type { LocationSearchResult, MapEntityOption, MapGeofenceOption, GeofenceCheckRequest, GeofenceCheckResult };

export interface MapControlPanelProps {
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
  onFitSelected?: () => void;
  onResetNorth?: () => void;
  mapContainerRef?: React.RefObject<HTMLElement>;
  onSearchAddress?: (query: string) => Promise<LocationSearchResult[]>;
  entities?: MapEntityOption[];
  geofences?: MapGeofenceOption[];
  onCheckEntityGeofence?: (req: GeofenceCheckRequest) => Promise<GeofenceCheckResult>;
  entityLabel?: string;
  className?: string;
  locale?: Locale;
  
  // Marker Style Toggle
  hasCustomMarker?: boolean;
  markerStyle?: 'default' | 'custom';
  onMarkerStyleChange?: (style: 'default' | 'custom') => void;
}

type ActivePanel =
  | 'basemap'
  | 'markerStyle'
  | 'more'
  | 'search'
  | 'geofence'
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
  entities,
  geofences,
  onCheckEntityGeofence,
  entityLabel,
  className,
  locale = 'id',
  hasCustomMarker,
  markerStyle = 'default',
  onMarkerStyleChange,
}: MapControlPanelProps) {
  const { zoomIn, zoomOut } = useMapActions();
  const t = getMapTranslation(locale);
  const tb = t.toolbar;
  const ctrl = t.controls;
  const bm = t.basemap;

  const [active, setActive] = useState<ActivePanel>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = (panel: ActivePanel) =>
    setActive((prev) => (prev === panel ? null : panel));
  const closeAll = () => setActive(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const handleFullscreen = useCallback(() => {
    const target = mapContainerRef?.current ?? document.documentElement;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [mapContainerRef]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!active || active === 'measure') return;
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
    { id: 'standard',  label: bm.standard,  Icon: BASEMAP_ICONS.standard },
    { id: 'osm',       label: bm.osm,       Icon: BASEMAP_ICONS.osm },
    { id: 'satellite', label: bm.satellite, Icon: BASEMAP_ICONS.satellite },
  ];

  const moreTools = [
    { id: 'search'   as const, Icon: Search,    label: tb.search,   onClick: () => toggle('search'),   isActive: active === 'search' },
    { id: 'geofence' as const, Icon: MapPinSearch, label: tb.geofence, onClick: () => toggle('geofence'), isActive: active === 'geofence' },
    ...(hasCustomMarker ? [{ id: 'markerStyle' as const, Icon: Tag, label: tb.markerStyle, onClick: () => toggle('markerStyle'), isActive: active === 'markerStyle' }] : []),
    { id: 'measure'  as const, Icon: Ruler,     label: tb.measure,  onClick: () => toggle('measure'),  isActive: active === 'measure' },
  ];

  const isMoreActive = active === 'more' || active === 'search' || active === 'geofence' || active === 'measure' || active === 'markerStyle';

  return (
    <div ref={panelRef} className={cn('relative', className)}>

      {/* ═══════════════════════════════════════════════════════════
          FLOATING PANEL AREA
          ═══════════════════════════════════════════════════════════ */}
      {active && (
        <div className="absolute right-0 top-full mt-2 md:right-full md:top-auto md:bottom-0 md:mt-0 md:mr-2.5 z-[70]">

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
          {(active === 'search' || active === 'geofence' || active === 'measure') && (
            <FloatingCard aria-label={
              active === 'search' ? tb.search :
              active === 'geofence' ? tb.geofence : tb.measure
            }>
              {active !== 'measure' && (
                <PanelHeader
                  title={active === 'search' ? tb.search : tb.geofence}
                  closeLabel={tb.exitFullscreen}
                  onClose={closeAll}
                />
              )}
              <div className={active === 'measure' ? '' : 'p-4'}>
                {active === 'search' && (
                  <SearchLocationTool onSearchAddress={onSearchAddress} locale={locale} />
                )}
                {active === 'geofence' && (
                  <GeofenceCheckTool
                    entities={entities}
                    geofences={geofences}
                    onCheckEntityGeofence={onCheckEntityGeofence}
                    entityLabel={entityLabel}
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
      <div className={cn(
        'flex bg-background rounded-[10px] border border-border shadow-lg overflow-hidden p-1 gap-1',
        // Mobile: horizontal row, auto width
        'flex-row',
        // Desktop: vertical column
        'md:flex-col md:w-auto',
      )}>

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

        <Sep />

        {/* More Tools */}
        <IconBtn
          id="ctrl-more-tools"
          icon={MoreHorizontal}
          label={tb.moreTools}
          onClick={() => toggle('more')}
          active={isMoreActive}
        />

      </div>
    </div>
  );
}

// -- FloatingCard --
function FloatingCard({ children, 'aria-label': ariaLabel }: { children: React.ReactNode; 'aria-label'?: string }) {
  return (
    <div
      className="bg-background rounded-xl border border-border shadow-lg overflow-hidden"
      role="dialog"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

// -- PanelHeader --
function PanelHeader({ title, onClose, closeLabel }: { title: string; onClose: () => void; closeLabel?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        title={closeLabel}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
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
