'use client';

import React from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Folder,
  Hexagon,
  Square,
  Waypoints,
  MapPin,
  Edit2,
  Plus,
  Filter,
  MoreVertical
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Checkbox, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@adatrack/ui';
import type { Geofence, GeofenceGroup } from '../types';
import { type GeofenceLocale, getGeofencesTranslation } from '../i18n';

interface GeofenceListPanelProps {
  groups: GeofenceGroup[];
  geofences: Geofence[];
  selectedId?: string;
  visibleIds: string[];
  onSelect: (id: string) => void;
  onCheck: (ids: string[], checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onAdd: () => void;
  onEdit: (geofence: Geofence) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
  locale?: GeofenceLocale;
}

export function GeofenceListPanel({
  groups,
  geofences,
  selectedId,
  visibleIds,
  onSelect,
  onCheck,
  onSelectAll,
  onAdd,
  onEdit,
  onDelete,
  onClose,
  locale = 'id',
}: GeofenceListPanelProps) {
  const t = getGeofencesTranslation(locale);
  const [search, setSearch] = React.useState('');
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, false])),
  );
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'inactive'>('all');

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Grouping
  const groupMap = new Map<string, Geofence[]>();
  groups.forEach(g => groupMap.set(g.id, []));
  const unassignedGeofences: Geofence[] = [];

  geofences.forEach(gf => {
    const matchSearch = gf.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || gf.status === statusFilter;
    if (!matchSearch || !matchStatus) return;

    if (gf.groupId && groupMap.has(gf.groupId)) {
      groupMap.get(gf.groupId)!.push(gf);
    } else {
      unassignedGeofences.push(gf);
    }
  });

  const filteredGroups = groups.map(g => ({
    ...g,
    geofences: groupMap.get(g.id) || []
  })).filter(g => g.geofences.length > 0 || !search);

  const totalFiltered = filteredGroups.reduce((acc, g) => acc + g.geofences.length, 0) + unassignedGeofences.length;

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-neutral-950 border-l border-border overflow-hidden w-[320px] shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
      {/* -- Header ---------------------------------------------------------- */}
      <div className="shrink-0 flex items-center justify-between px-3 h-[44px] bg-white dark:bg-neutral-900 border-b border-border">
        {/* Kiri: Button Tambah Geofence */}
        <div className="flex items-center">
          <Button
            variant="destructive"
            onClick={onAdd}
            className="h-8 gap-1.5 text-[12px] font-medium shadow-none"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline-block">{t.addGeofence}</span>
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
              {t.active}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setStatusFilter('inactive')} 
              className={statusFilter === 'inactive' ? 'font-bold' : ''}
            >
              {t.inactive}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* -- Select All ------------------------------------------------------ */}
      {totalFiltered > 0 && (
        <div className="shrink-0 flex items-center justify-between px-3 py-2 bg-[#fafafa] dark:bg-neutral-900 border-b border-border">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="geofence-select-all"
              checked={
                visibleIds.length === 0 ? false :
                  visibleIds.length === geofences.length ? true :
                    'indeterminate'
              }
              onCheckedChange={(checked) => onSelectAll(!!checked)}
              aria-label="Tampilkan semua geofence"
              className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-700 data-[state=checked]:border-neutral-700 data-[state=checked]:text-white data-[state=indeterminate]:bg-neutral-700 data-[state=indeterminate]:border-neutral-700 data-[state=indeterminate]:text-white rounded-sm"
            />
            <label
              htmlFor="geofence-select-all"
              className="text-[11px] font-bold text-foreground cursor-pointer select-none tracking-tight"
            >
              {t.allGeofences}
            </label>
          </div>
          <span className="text-[10px] font-bold text-neutral-500 bg-white dark:bg-neutral-800 px-1.5 py-0.5 border border-border rounded-md leading-none">
            {geofences.length}
          </span>
        </div>
      )}

      {/* -- Scrollable List ------------------------------------------------- */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2.5 bg-[#fcfcfc] dark:bg-neutral-950">
        {totalFiltered === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MapPin className="h-8 w-8 text-neutral-300 mb-3" />
            <p className="text-[12px] font-medium text-foreground">{t.noGeofences}</p>
          </div>
        )}

        {/* Groups */}
        {filteredGroups.map((group) => {
          const isExpanded = expandedGroups[group.id] ?? false;
          const groupGeofenceIds = group.geofences.map(g => g.id);
          const isGroupChecked = groupGeofenceIds.length > 0 && groupGeofenceIds.every(id => visibleIds.includes(id));
          const isGroupIndeterminate = !isGroupChecked && groupGeofenceIds.some(id => visibleIds.includes(id));

          return (
            <div key={group.id} className="bg-white dark:bg-neutral-900 border border-border rounded-md shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
              <div
                className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-[#fafafa] dark:hover:bg-neutral-800 transition-colors"
                onClick={() => toggleGroup(group.id)}
              >
                <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", !isExpanded && "-rotate-90")} />

                <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center bg-transparent">
                  <Checkbox
                    checked={isGroupIndeterminate ? 'indeterminate' : isGroupChecked}
                    onCheckedChange={(checked) => onCheck(groupGeofenceIds, !!checked)}
                    aria-label={`Tampilkan geofence grup ${group.name}`}
                    className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400 data-[state=checked]:text-white data-[state=indeterminate]:bg-neutral-400 data-[state=indeterminate]:border-neutral-400 data-[state=indeterminate]:text-white rounded-sm shadow-none"
                  />
                </div>

                <Folder className="h-[14px] w-[14px] text-[#e6b941] fill-[#f4cb5d] shrink-0" />
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex-1 truncate ml-0.5 tracking-tight">
                  {group.name}
                </span>
                <span className="text-[10px] font-bold text-neutral-500 bg-[#fafafa] dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded-md leading-none">
                  {group.geofences.length}
                </span>
              </div>

              {isExpanded && group.geofences.length > 0 && (
                <div className="flex flex-col border-t border-border">
                  {group.geofences.map(gf => (
                    <GeofenceListItem
                      key={gf.id}
                      geofence={gf}
                      isSelected={selectedId === gf.id}
                      isChecked={visibleIds.includes(gf.id)}
                      onCheck={(checked) => onCheck([gf.id], checked)}
                      onSelect={() => onSelect(gf.id)}
                      onEdit={() => onEdit(gf)}
                      onDelete={() => onDelete(gf.id)}
                      locale={locale}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Unassigned */}
        {unassignedGeofences.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-border rounded-md shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#fafafa] dark:bg-neutral-900">
              <div className="shrink-0 flex items-center bg-transparent ml-[22px]">
                <Checkbox
                  checked={unassignedGeofences.every(g => visibleIds.includes(g.id))}
                  onCheckedChange={(checked) => onCheck(unassignedGeofences.map(g => g.id), !!checked)}
                  aria-label="Tampilkan lainnya"
                  className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400 data-[state=checked]:text-white rounded-sm shadow-none"
                />
              </div>
              <span className="text-xs font-semibold text-neutral-500 flex-1 tracking-tight">
                {t.unassigned}
              </span>
              <span className="text-[10px] font-bold text-neutral-500 bg-white dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded-md leading-none">
                {unassignedGeofences.length}
              </span>
            </div>
            <div className="flex flex-col border-t border-border">
              {unassignedGeofences.map(gf => (
                <GeofenceListItem
                  key={gf.id}
                  geofence={gf}
                  isSelected={selectedId === gf.id}
                  isChecked={visibleIds.includes(gf.id)}
                  onCheck={(checked) => onCheck([gf.id], checked)}
                  onSelect={() => onSelect(gf.id)}
                  onEdit={() => onEdit(gf)}
                  onDelete={() => onDelete(gf.id)}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
function GeofenceListItem({
  geofence,
  isSelected,
  isChecked,
  onCheck,
  onSelect,
  onEdit,
  onDelete,
  locale
}: {
  geofence: Geofence;
  isSelected: boolean;
  isChecked: boolean;
  onCheck: (checked: boolean) => void;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  locale: GeofenceLocale;
}) {
  const t = getGeofencesTranslation(locale);
  const isRectangle = geofence.geometry.type === 'rectangle';
  const isMultiline = geofence.geometry.type === 'multiline';

  let descText = `${(geofence.geometry as any).coordinates?.length || 0} ${t.points}`;
  if (isRectangle) descText = t.areaDimension;
  if (isMultiline) descText = `${(geofence.geometry as any).coordinates?.length || 0} ${t.routePoints}`;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex items-center justify-between py-2 px-3 border-b border-border last:border-0 cursor-pointer transition-colors",
        isSelected ? 'bg-neutral-50 dark:bg-neutral-800/80' : 'hover:bg-[#fafafa] dark:hover:bg-neutral-800/40'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center bg-transparent">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => onCheck(!!checked)}
            aria-label={`Tampilkan ${geofence.name}`}
            className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400 data-[state=checked]:text-white rounded-sm shadow-none"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate tracking-tight leading-tight">
            {geofence.name}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={cn("text-[9px] font-bold uppercase tracking-wider", geofence.status === 'active' ? "text-emerald-500" : "text-neutral-400")}>
              {geofence.status === 'active' ? t.active : t.inactive}
            </span>
            <span className="text-[10px] text-neutral-400 truncate tracking-tight">
              &bull; {descText}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Actions & Icon */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Icon */}
        <div className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
          isRectangle ? "bg-blue-50 text-blue-500 dark:bg-blue-500/10" : 
          isMultiline ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10" : 
          "bg-red-50 text-red-400 dark:bg-red-500/10"
        )}>
          {isRectangle ? <Square className="h-3 w-3" /> : 
            isMultiline ? <Waypoints className="h-3 w-3" /> : 
            <Hexagon className="h-3 w-3" />}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              {t.edit}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950"
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
              {t.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
