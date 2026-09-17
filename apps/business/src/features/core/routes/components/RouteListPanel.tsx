import React, { useState } from 'react';
import { Search, Plus, MapPin, MapPinned, MoreVertical, Route as RouteIcon, ChevronRight, AlignJustify, LayoutList, Filter, ChevronDown, Folder } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@adatrack/ui';
import type { Route, RouteLocation } from '../types';
import type { Geofence } from '../../geofences/types';
import { getRouteTranslation } from '../i18n';
import type { Locale } from '@adatrack/types';

interface RouteListPanelProps {
  routes: Route[];
  geofences: Geofence[];
  groups?: any[];
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
  groups = [],
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
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('compact');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, false]))
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const filteredRoutes = routes.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const groupMap = new Map<string, Route[]>();
  groups.forEach(g => groupMap.set(g.id, []));
  const unassignedRoutes: Route[] = [];

  filteredRoutes.forEach(r => {
    if (r.groupId && groupMap.has(r.groupId)) {
      groupMap.get(r.groupId)!.push(r);
    } else {
      unassignedRoutes.push(r);
    }
  });

  const filteredGroups = groups.map(g => ({
    ...g,
    routes: groupMap.get(g.id) || []
  })).filter(g => g.routes.length > 0 || !search);

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

  const RouteListItem = ({ route }: { route: Route }) => {
    const isDetailed = viewMode === 'detailed' || selectedRouteId === route.id;
    return (
      <div
        onClick={() => onSelectRoute(route.id)}
        className={cn(
          "cursor-pointer transition-colors border-b border-border last:border-0",
          isDetailed ? "p-3" : "py-2 px-3",
          selectedRouteId === route.id
            ? 'bg-white dark:bg-neutral-900 border-primary-300 dark:border-primary-800 shadow-sm'
            : 'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        )}
      >
        <div className={cn("flex justify-between", isDetailed ? "items-start mb-2" : "items-center")}>
          <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
            {!isDetailed && (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
                <RouteIcon className="h-3 w-3" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <h3 className={cn(
              "text-xs font-semibold truncate tracking-tight leading-tight",
              selectedRouteId === route.id 
                ? "text-red-600 dark:text-red-500" 
                : "text-neutral-800 dark:text-neutral-200"
            )}>
                {route.name}
              </h3>
              {isDetailed && (
                <span className={`inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm mt-1 w-fit ${route.status === 'active'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}>
                  {t.status[route.status]}
                </span>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors" onClick={(e) => e.stopPropagation()}>
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
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

        {isDetailed && (
          <div className="space-y-1.5 text-[10px] text-neutral-600 dark:text-neutral-400 mt-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
              <span className="truncate" title={getLocationLabel(route.origin)}>
                {getLocationLabel(route.origin)}
              </span>
            </div>
            {route.stops && route.stops.length > 0 && (
              <div className="flex items-center gap-2 pl-0.5">
                <div className="w-2 border-l-2 border-dashed border-neutral-300 dark:border-neutral-700 h-3 ml-1" />
                <span className="text-neutral-400 text-[9px] font-bold uppercase tracking-wider italic">
                  + {route.stops.length} {t.list.stopCount}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <MapPinned className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
              <span className="truncate" title={getLocationLabel(route.destination)}>
                {getLocationLabel(route.destination)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-950 border-none overflow-hidden w-full">
      {/* -- Header ---------------------------------------------------------- */}
      <div className="shrink-0 flex items-center justify-between px-3 h-[44px] bg-white dark:bg-neutral-900 border-b border-border">
        {/* Kiri: Button Tambah Rute */}
        <div className="flex items-center">
          <Button
            variant="destructive"
            onClick={onCreateNew}
            className="h-8 gap-1.5 text-[13px] font-medium shadow-none"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">{t.addBtn}</span>
          </Button>
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
            placeholder="Cari..."
            className="w-full h-8 rounded-md border border-border bg-[#fafafa] dark:bg-neutral-900 pl-8 pr-3 text-[12px] text-foreground focus:outline-none focus:border-neutral-300 focus:bg-white transition-all placeholder:text-neutral-400"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md border transition-colors shrink-0",
                statusFilter !== 'all'
                  ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
                  : "bg-[#fafafa] dark:bg-neutral-900 border-border text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
              title="Filter Status"
            >
              <Filter className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'font-bold' : ''}
            >
              Semua Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatusFilter('active')}
              className={statusFilter === 'active' ? 'font-bold' : ''}
            >
              {t.status.active}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setStatusFilter('inactive')}
              className={statusFilter === 'inactive' ? 'font-bold' : ''}
            >
              {t.status.inactive}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => setViewMode(v => v === 'detailed' ? 'compact' : 'detailed')}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-[#fafafa] dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
          title={viewMode === 'detailed' ? 'Tampilan Ringkas' : 'Tampilan Detail'}
        >
          {viewMode === 'detailed' ? <AlignJustify className="h-3.5 w-3.5" /> : <LayoutList className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#fafafa] dark:bg-neutral-950">
        {filteredRoutes.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <RouteIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="font-medium text-neutral-900 dark:text-neutral-100">{t.list.empty}</p>
            <p className="text-[12px]">{t.list.emptyDesc}</p>
          </div>
        ) : (
          <>
            {filteredGroups.map(group => {
              const isExpanded = expandedGroups[group.id] ?? false;
              return (
                <div key={group.id} className="bg-white dark:bg-neutral-900 border border-border rounded-md shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] overflow-hidden mb-2">
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-[#fafafa] dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => toggleGroup(group.id)}
                  >
                    <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", !isExpanded && "-rotate-90")} />
                    <Folder className="h-[14px] w-[14px] text-[#e6b941] fill-[#f4cb5d] shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex-1 truncate ml-0.5 tracking-tight">
                      {group.name}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500 bg-[#fafafa] dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded-md leading-none">
                      {group.routes.length}
                    </span>
                  </div>
                  {isExpanded && group.routes.length > 0 && (
                    <div className="flex flex-col border-t border-border bg-[#fafafa] dark:bg-neutral-950 p-1 space-y-0.5">
                      {group.routes.map(route => <RouteListItem key={route.id} route={route} />)}
                    </div>
                  )}
                </div>
              );
            })}
            
            {unassignedRoutes.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 border border-border rounded-md shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] overflow-hidden mb-2">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fafafa] dark:bg-neutral-900 border-b border-border">
                  <span className="text-xs font-semibold text-neutral-500 flex-1 tracking-tight ml-5">
                    Tidak Masuk Grup
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 bg-white dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded-md leading-none">
                    {unassignedRoutes.length}
                  </span>
                </div>
                <div className="flex flex-col bg-[#fafafa] dark:bg-neutral-950 p-1 space-y-0.5">
                  {unassignedRoutes.map(route => <RouteListItem key={route.id} route={route} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
