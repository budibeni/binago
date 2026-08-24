import React, { useState } from 'react';
import { cn } from '@adatrack/utils';
import { Route } from '../types';
import { Geofence } from '../../geofences/types';
import { RouteListPanel } from './RouteListPanel';
import { RouteMap } from './RouteMap';
import type { Locale } from '@adatrack/types';
import { ChevronLeft } from 'lucide-react';

interface RouteListViewProps {
  routes: Route[];
  geofences: Geofence[];
  selectedRouteId?: string;
  onSelectRoute: (id: string | undefined) => void;
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  locale?: Locale;
}

export function RouteListView({
  routes,
  geofences,
  selectedRouteId,
  onSelectRoute,
  onCreateNew,
  onEdit,
  onDelete,
  locale = 'id',
}: RouteListViewProps) {
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const selectedRoute = routes.find(r => r.id === selectedRouteId) || null;

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">
      {/* Main Area: Map */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-background z-0">
        <RouteMap
          geofences={geofences}
          selectedRoute={selectedRoute}
          editorMode="idle"
          editorGeometry={null}
          onEditorGeometryChange={() => {}}
        />
      </div>

      {/* Right Sidebar: RouteListPanel or Collapsed Tab */}
      <div
        className={cn(
          'shrink-0 h-full z-10 transition-all duration-300 ease-in-out flex flex-col relative',
          isPanelVisible
            ? 'w-[320px] lg:w-[380px] border-l border-neutral-200 dark:border-neutral-800 bg-background shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]'
            : 'w-[34px] py-2 items-center bg-transparent border-l border-neutral-200 dark:border-neutral-800'
        )}
      >
        {isPanelVisible ? (
          <RouteListPanel
            routes={routes}
            geofences={geofences}
            selectedRouteId={selectedRouteId}
            onSelectRoute={onSelectRoute}
            onCreateNew={onCreateNew}
            onEdit={onEdit}
            onDelete={onDelete}
            locale={locale}
            onClose={() => setIsPanelVisible(false)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2.5 h-full w-full bg-white dark:bg-neutral-900">
            {/* Expand button */}
            <button
              type="button"
              onClick={() => setIsPanelVisible(true)}
              className="flex h-6 w-6 items-center justify-center text-foreground-muted hover:text-foreground transition-colors focus:outline-none shrink-0"
              title={locale === 'en' ? 'Open Route Panel' : 'Buka Panel Rute'}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Vertical Tab Button */}
            <button
              type="button"
              onClick={() => setIsPanelVisible(true)}
              className="flex flex-col items-center py-2 px-0.5 text-foreground group shrink-0 transition-opacity hover:opacity-80"
              title={locale === 'en' ? 'Open Route' : 'Buka Rute'}
            >
              <div className="font-bold text-[10px] tracking-[0.2em] text-foreground-muted group-hover:text-foreground uppercase select-none mb-4 mt-2 transition-colors [writing-mode:vertical-rl] rotate-180">
                ROUTE
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
