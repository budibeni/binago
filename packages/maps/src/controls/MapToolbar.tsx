'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Minus,
  Search,
  Ruler,
  X,
  Navigation,
  Target,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { BasemapSwitcher } from './BasemapSwitcher';
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
} from '../tools/types';

export type { LocationSearchResult, MapEntityOption, MapGeofenceOption, GeofenceCheckRequest, GeofenceCheckResult };

export interface MapToolbarProps {
  /** Basemap aktif */
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
  onFitSelected?: () => void;
  onResetNorth?: () => void;
  /**
   * Ref ke elemen container map - digunakan untuk Fullscreen API.
   * Jika tidak disediakan, fallback ke document.documentElement.
   */
  mapContainerRef?: React.RefObject<HTMLElement>;
  /** Abstraction callback untuk search alamat */
  onSearchAddress?: (query: string) => Promise<LocationSearchResult[]>;
  className?: string;
  locale?: Locale;
}

type ToolId = 'search' | 'measure' | null;

export function MapToolbar({
  basemap,
  onBasemapChange,
  onFitSelected,
  onResetNorth,
  mapContainerRef,
  onSearchAddress,
  className,
  locale = 'id',
}: MapToolbarProps) {
  const t = getMapTranslation(locale).toolbar;
  const [activeTool, setActiveTool] = useState<ToolId>(null);
  const [isSearchHidden, setIsSearchHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const toolLabels: Record<NonNullable<ToolId>, string> = {
    search: t.search,
    measure: t.measure,
  };

  // --- Fullscreen ---
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
      target.requestFullscreen?.().catch(() => { });
    } else {
      document.exitFullscreen?.().catch(() => { });
    }
  }, [mapContainerRef]);

  // --- Tool toggle - only one active at a time ---
  const toggleTool = (id: ToolId) => {
    setActiveTool((prev) => {
      if (prev === id) {
        if (id === 'search' && isSearchHidden) {
          setIsSearchHidden(false);
          return 'search';
        }
        setIsSearchHidden(false);
        return null;
      }
      setIsSearchHidden(false);
      return id;
    });
  };

  // --- Close panel on Escape ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTool(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // --- Close panel when clicking outside ---
  useEffect(() => {
    if (!activeTool) return;
    // Card tool (search, measure) tidak boleh close saat klik di luar,
    // hanya close jika tombol close / toggle yang diklik
    if (activeTool === 'search' || activeTool === 'measure') return;

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
      {/* --- Toolbar bar --- */}
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

        {/* Search with mini Show button when hidden */}
        <div className="relative flex items-center justify-center">
          <ToolButton
            id="toolbar-search"
            icon={Search}
            label={t.search}
            onClick={() => {
              if (activeTool === 'search' && isSearchHidden) {
                setIsSearchHidden(false);
              } else {
                toggleTool('search');
              }
            }}
            active={activeTool === 'search'}
          />

          {/* Icon/button di samping button/icon Cari ketika card sedang di-hide */}
          {activeTool === 'search' && isSearchHidden && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchHidden(false);
              }}
              title={locale === 'id' ? 'Tampilkan Pencarian' : 'Show Search'}
              aria-label={locale === 'id' ? 'Tampilkan Pencarian' : 'Show Search'}
              className="absolute -top-[36px] left-0 z-30 flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700/80 shadow-md transition-all duration-150 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

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

        {/* BasemapSwitcher - always visible */}
        <BasemapSwitcher value={basemap} onChange={onBasemapChange} compact={true} locale={locale} />
      </div>

      {/* --- Tool Panels --- */}
      {activeTool && (
        <div
          className={cn(
            'absolute top-full right-0 mt-2 z-[70]',
            activeTool === 'search' && isSearchHidden && 'hidden pointer-events-none'
          )}
        >
          <ToolPanel
            title={toolLabels[activeTool]}
            onClose={() => {
              setActiveTool(null);
              setIsSearchHidden(false);
            }}
            onHide={activeTool === 'search' ? () => setIsSearchHidden(true) : undefined}
            hideLabel={locale === 'id' ? 'Sembunyikan' : 'Hide'}
            hideHeader={activeTool === 'measure'}
            closeLabel={locale === 'id' ? 'Tutup' : 'Close'}
          >
            {activeTool === 'search' && (
              <SearchLocationTool onSearchAddress={onSearchAddress} locale={locale} />
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

// --- ToolButton ---
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

// --- ToolPanel ---
interface ToolPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  hideHeader?: boolean;
  closeLabel?: string;
  onHide?: () => void;
  hideLabel?: string;
}

function ToolPanel({ title, onClose, children, hideHeader, closeLabel, onHide, hideLabel }: ToolPanelProps) {
  return (
    <div
      className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xl overflow-visible select-none"
      role="dialog"
      aria-label={title}
    >
      {!hideHeader && (
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
      )}
      <div className={hideHeader ? '' : 'p-3'}>{children}</div>
    </div>
  );
}
