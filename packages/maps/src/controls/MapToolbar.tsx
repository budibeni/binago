'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  CircleDot,
  Ruler,
  X,
  Navigation,
  Target
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { BasemapSwitcher } from './BasemapSwitcher';
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

export interface MapToolbarProps {
  /** Basemap aktif */
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
  onFitSelected?: () => void;
  onResetNorth?: () => void;
  /**
   * Ref ke elemen container map — digunakan untuk Fullscreen API.
   * Jika tidak disediakan, fallback ke document.documentElement.
   */
  mapContainerRef?: React.RefObject<HTMLElement>;
  /** Abstraction callback untuk search alamat */
  onSearchAddress?: (query: string) => Promise<LocationSearchResult[]>;
  /** Daftar entitas untuk GeofenceCheckTool */
  entities?: MapEntityOption[];
  /** Daftar geofence untuk GeofenceCheckTool */
  geofences?: MapGeofenceOption[];
  /** Abstraction callback untuk cek unit vs geofence */
  onCheckEntityGeofence?: (req: GeofenceCheckRequest) => Promise<GeofenceCheckResult>;
  className?: string;
  locale?: Locale;
}

type ToolId = 'search' | 'geofence' | 'measure' | null;

export function MapToolbar({
  basemap,
  onBasemapChange,
  onFitSelected,
  onResetNorth,
  mapContainerRef,
  onSearchAddress,
  entities,
  geofences,
  onCheckEntityGeofence,
  className,
  locale = 'id',
}: MapToolbarProps) {
  const t = getMapTranslation(locale).toolbar;
  const [activeTool, setActiveTool] = useState<ToolId>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const toolLabels: Record<NonNullable<ToolId>, string> = {
    search: t.search,
    geofence: t.geofence,
    measure: t.measure,
  };

  // ——— Fullscreen ———
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleFullscreen = useCallback(() => {
    const target = mapContainerRef?.current ?? document.documentElement;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [mapContainerRef]);

  // ——— Tool toggle — only one active at a time ———
  const toggleTool = (id: ToolId) => {
    setActiveTool((prev) => (prev === id ? null : id));
  };

  // ——— Close panel on Escape ———
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTool(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // ——— Close panel when clicking outside ———
  useEffect(() => {
    if (!activeTool) return;
    // Pengecualian: Tool ukur jarak berinteraksi langsung dengan peta, jangan ditutup saat klik di luar
    if (activeTool === 'measure') return;

    const handleOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActiveTool(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [activeTool]);

  return (
    <div ref={toolbarRef} className={cn('relative inline-flex flex-col items-end', className)}>
      {/* ——— Toolbar bar ——— */}
      <div className="inline-flex items-center gap-0.5 bg-background rounded-xl border border-border shadow-lg p-1">
        {/* Fit Selected */}
        <ToolButton
          id="toolbar-fit-selected"
          icon={Target}
          label="Tampilkan Pilihan"
          onClick={onFitSelected}
        />

        {/* Reset North */}
        <ToolButton
          id="toolbar-reset-north"
          icon={Navigation}
          label="Reset Arah Utara"
          onClick={onResetNorth}
        />

        {/* Fullscreen */}
        <ToolButton
          id="toolbar-fullscreen"
          icon={isFullscreen ? Minimize2 : Maximize2}
          label={isFullscreen ? t.exitFullscreen : t.fullscreen}
          onClick={handleFullscreen}
          active={isFullscreen}
        />

        {/* Separator */}
        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Search */}
        <ToolButton
          id="toolbar-search"
          icon={Search}
          label={t.search}
          onClick={() => toggleTool('search')}
          active={activeTool === 'search'}
        />

        {/* Geofence Check */}
        <ToolButton
          id="toolbar-geofence"
          icon={CircleDot}
          label={t.geofence}
          onClick={() => toggleTool('geofence')}
          active={activeTool === 'geofence'}
        />

        {/* Separator */}
        <div className="w-px h-5 bg-border mx-0.5" />

        {/* Measure Distance */}
        <ToolButton
          id="toolbar-measure"
          icon={Ruler}
          label={t.measure}
          onClick={() => toggleTool('measure')}
          active={activeTool === 'measure'}
        />

        {/* Separator */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* BasemapSwitcher — always visible */}
        <BasemapSwitcher value={basemap} onChange={onBasemapChange} compact={true} locale={locale} />
      </div>

      {/* ——— Tool Panels ——— */}
      {activeTool && (
        <div className="absolute top-full right-0 mt-2 z-[70]">
          <ToolPanel
            title={toolLabels[activeTool]}
            onClose={() => setActiveTool(null)}
            hideHeader={activeTool === 'measure'}
            closeLabel={t.exitFullscreen}
          >
            {activeTool === 'search' && (
              <SearchLocationTool onSearchAddress={onSearchAddress} locale={locale} />
            )}
            {activeTool === 'geofence' && (
              <GeofenceCheckTool
                entities={entities}
                geofences={geofences}
                onCheckEntityGeofence={onCheckEntityGeofence}
                locale={locale}
              />
            )}
            {activeTool === 'measure' && (
              <MeasureDistanceTool
                active={true}
                onDeactivate={() => setActiveTool(null)}
                locale={locale}
              />
            )}
          </ToolPanel>
        </div>
      )}
    </div>
  );
}

// ——— ToolButton ———
interface ToolButtonProps {
  id: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

function ToolButton({ id, icon: Icon, label, onClick, active }: ToolButtonProps) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150',
        active
          ? 'bg-accent/10 text-accent shadow-sm ring-1 ring-accent/20'
          : 'text-foreground-muted hover:bg-surface hover:text-foreground',
      )}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

// ——— ToolPanel ———
interface ToolPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  hideHeader?: boolean;
  closeLabel?: string;
}

function ToolPanel({ title, onClose, children, hideHeader, closeLabel }: ToolPanelProps) {
  return (
    <div
      className="bg-background rounded-xl border border-border shadow-lg overflow-hidden"
      role="dialog"
      aria-label={title}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className={hideHeader ? '' : 'p-4'}>{children}</div>
    </div>
  );
}
