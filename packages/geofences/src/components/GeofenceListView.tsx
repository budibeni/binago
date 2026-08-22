'use client';

import React, { useState } from 'react';
import { cn } from '@adatrack/utils';
import { GeofenceMap } from './GeofenceMap';
import { GeofenceListPanel } from './GeofenceListPanel';
import { ChevronLeft } from 'lucide-react';
import type { Geofence, GeofenceGroup } from '../types';

interface GeofenceListViewProps {
  groups: GeofenceGroup[];
  geofences: Geofence[];
  onAdd: () => void;
  onEdit: (geofence: Geofence) => void;
  onDelete: (id: string) => void;
}

export function GeofenceListView({
  groups,
  geofences,
  onAdd,
  onEdit,
  onDelete,
}: GeofenceListViewProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [visibleIds, setVisibleIds] = useState<string[]>(() => geofences.map(g => g.id));
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  const handleCheck = (ids: string[], checked: boolean) => {
    setVisibleIds(prev => {
      if (checked) {
        const toAdd = ids.filter(id => !prev.includes(id));
        return [...prev, ...toAdd];
      } else {
        return prev.filter(id => !ids.includes(id));
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setVisibleIds(geofences.map(g => g.id));
    } else {
      setVisibleIds([]);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">
      {/* Main Area: Map */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-background">
        <GeofenceMap
          geofences={geofences}
          selectedGeofenceId={selectedId}
          visibleGeofenceIds={visibleIds}
          editorMode="idle"
          editorGeometry={null}
          onEditorGeometryChange={() => {}}
        />
      </div>

      {/* Right Sidebar: GeofenceListPanel or Collapsed Tab */}
      <div
        className={cn(
          'shrink-0 h-full z-10 transition-all duration-300 ease-in-out flex flex-col',
          isPanelVisible
            ? 'w-[320px] border-l border-neutral-200 dark:border-neutral-800 bg-background shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]'
            : 'w-[34px] py-2 items-center bg-transparent border-l border-neutral-200 dark:border-neutral-800'
        )}
      >
        {isPanelVisible ? (
          <GeofenceListPanel
            groups={groups}
            geofences={geofences}
            selectedId={selectedId}
            visibleIds={visibleIds}
            onSelect={(id) => setSelectedId(id)}
            onCheck={handleCheck}
            onSelectAll={handleSelectAll}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            onClose={() => setIsPanelVisible(false)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2.5 h-full w-full">
            {/* Expand button */}
            <button
              type="button"
              onClick={() => setIsPanelVisible(true)}
              className="flex h-6 w-6 items-center justify-center text-foreground-muted hover:text-foreground transition-colors focus:outline-none shrink-0"
              title="Buka Panel Geofence"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Vertical Tab Button */}
            <button
              type="button"
              onClick={() => setIsPanelVisible(true)}
              className="flex flex-col items-center py-2 px-0.5 text-foreground group shrink-0 transition-opacity hover:opacity-80"
              title="Buka Geofence"
            >
              <div className="font-bold text-[10px] tracking-[0.2em] text-foreground-muted group-hover:text-foreground uppercase select-none mb-4 mt-2 transition-colors [writing-mode:vertical-rl] rotate-180">
                GEOFENCE
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
