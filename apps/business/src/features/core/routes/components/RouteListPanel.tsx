import React, { useState } from 'react';
import { Search, Plus, MapPin, MapPinned, MoreVertical, Route as RouteIcon, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@adatrack/ui';
import type { Route, RouteLocation } from '../types';
import type { Geofence } from '../../geofences/types';
import { getRouteTranslation } from '../i18n';
import type { Locale } from '@adatrack/types';

interface RouteListPanelProps {
  routes: Route[];
  geofences: Geofence[];
  selectedRouteId?: string;
  onSelectRoute: (id: string | undefined) => void;
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  locale?: Locale;
  onClose?: () => void;
}

export function RouteListPanel({
  routes,
  geofences,
  selectedRouteId,
  onSelectRoute,
  onCreateNew,
  onEdit,
  onDelete,
  locale = 'id',
  onClose
}: RouteListPanelProps) {
  const t = getRouteTranslation(locale);
  const [search, setSearch] = useState('');

  const filteredRoutes = routes.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
  );

  const getLocationLabel = (loc: RouteLocation) => {
    if (loc.type === 'geofence' && loc.geofenceId) {
      return geofences.find(g => g.id === loc.geofenceId)?.name || loc.geofenceId;
    }
    if (loc.type === 'coordinate') {
      if (loc.address) return loc.address;
      if (loc.latitude !== undefined && loc.longitude !== undefined) {
        return `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`;
      }
    }
    return 'Unknown Location';
  };

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-950 border-none overflow-hidden w-full">
      {/* -- Header ---------------------------------------------------------- */}
      <div className="shrink-0 flex items-center justify-between px-3 h-[44px] bg-white dark:bg-neutral-900 border-b border-border">
        {/* Kiri: Button Tambah Rute */}
        <div className="flex items-center">
          <button
            onClick={onCreateNew}
            className="flex h-7 px-3 items-center justify-center gap-1.5 rounded-md bg-red-600 text-[10px] font-bold text-white hover:bg-red-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> {t.addBtn}
          </button>
        </div>

        {/* Kanan: Close */}
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-50 hover:text-foreground transition-colors ml-1"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* -- Search ---------------------------------------------------------- */}
      <div className="shrink-0 px-3 py-2 bg-white dark:bg-neutral-900 border-b border-border flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-8 rounded-md border border-border bg-[#fafafa] dark:bg-neutral-900 pl-8 pr-3 text-[12px] text-foreground focus:outline-none focus:border-neutral-300 focus:bg-white transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#fafafa] dark:bg-neutral-950">
        {filteredRoutes.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <RouteIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{t.list.empty}</p>
            <p className="text-[12px]">{t.list.emptyDesc}</p>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`p-3 rounded-md cursor-pointer transition-colors border ${
                selectedRouteId === route.id 
                  ? 'bg-white dark:bg-neutral-900 border-primary-300 dark:border-primary-800 shadow-sm' 
                  : 'bg-white dark:bg-neutral-900 border-transparent hover:border-neutral-200 dark:hover:border-neutral-800'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{route.name}</h3>
                  <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-sm mt-1 ${
                    route.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                    {t.status[route.status]}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(route.id); }}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950"
                      onClick={(e) => { e.stopPropagation(); onDelete(route.id); }}
                    >
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 mt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="truncate" title={getLocationLabel(route.origin)}>
                    {getLocationLabel(route.origin)}
                  </span>
                </div>
                {route.stops && route.stops.length > 0 && (
                  <div className="flex items-center gap-2 pl-0.5">
                    <div className="w-3 border-l-2 border-dashed border-neutral-300 dark:border-neutral-700 h-3 ml-1" />
                    <span className="text-neutral-400 text-[10px] font-medium italic">
                      + {route.stops.length} {t.list.stopCount}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPinned className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="truncate" title={getLocationLabel(route.destination)}>
                    {getLocationLabel(route.destination)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
