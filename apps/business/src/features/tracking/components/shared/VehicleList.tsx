'use client';

import React from 'react';
import {
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MapPin,
  Folder,
  Grid,
  LayoutGrid,
  Play,
  PauseCircle,
  CircleDot,
  User
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Checkbox } from '@adatrack/ui';
import type {
  TrackingVehicle,
  TrackingVehicleGroup,
  StatusFilter,
  GroupStatusSummary,
} from '../../types/tracking';

// --- Helper: compute group status summary -------------------------------------

function computeGroupSummary(vehicles: TrackingVehicle[]): GroupStatusSummary {
  return vehicles.reduce(
    (acc, v) => {
      acc[v.status]++;
      return acc;
    },
    { driving: 0, idle: 0, parking: 0, offline: 0 } as GroupStatusSummary,
  );
}

// --- Helper: filter vehicles ----------------------------------------------

function filterVehicles(
  vehicles: TrackingVehicle[],
  search: string,
  statusFilter: StatusFilter,
): TrackingVehicle[] {
  const q = search.toLowerCase().trim();
  return vehicles.filter((v) => {
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchSearch =
      !q ||
      v.plateNumber.toLowerCase().includes(q) ||
      v.groupName.toLowerCase().includes(q) ||
      (v.driverName?.toLowerCase().includes(q) ?? false);
    return matchStatus && matchSearch;
  });
}

// --- Status Config --------------------------------------------------------

const statusConfig = {
  driving: {
    color: 'text-success',
    dot: 'bg-success',
  },
  idle: {
    color: 'text-amber-500 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  parking: {
    color: 'text-blue-500 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  offline: {
    color: 'text-neutral-500 dark:text-neutral-400',
    dot: 'bg-neutral-400',
  },
};

// --- StatusBadge ----------------------------------------------------------

interface StatusBadgeProps {
  status: TrackingVehicle['status'];
  labels: { driving: string; idle: string; parking: string; offline: string };
}

function StatusBadge({ status, labels }: StatusBadgeProps) {
  const c = statusConfig[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground tracking-tight">
      <span className={cn('h-1 w-1 rounded-full shrink-0', c.dot)} />
      {labels[status]}
    </span>
  );
}

// --- VehicleListItem ------------------------------------------------------

interface VehicleListItemProps {
  vehicle: TrackingVehicle;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (id: string) => void;
  onCheck: (id: string, checked: boolean) => void;
  noDriverLabel: string;
  speedUnit: string;
  statusLabels: { driving: string; idle: string; parking: string; offline: string };
  hideStatus?: boolean;
}

function VehicleListItem({
  vehicle,
  isSelected,
  isChecked,
  onSelect,
  onCheck,
  noDriverLabel,
  statusLabels,
  hideStatus,
}: VehicleListItemProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors',
        isSelected ? 'bg-neutral-50 dark:bg-neutral-800/80' : 'hover:bg-[#fafafa] dark:hover:bg-neutral-800/40'
      )}
      onClick={() => onSelect(vehicle.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(vehicle.id);
        }
      }}
      aria-selected={isSelected}
    >
      <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center bg-transparent mr-1.5">
        <Checkbox
          id={`vehicle-check-${vehicle.id}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheck(vehicle.id, !!checked)}
          aria-label={`Pilih ${vehicle.plateNumber}`}
          className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400 data-[state=checked]:text-white rounded-sm shadow-none"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center ml-1 space-y-0.5">
        <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate tracking-tight leading-tight">
          {vehicle.plateNumber}
        </span>
        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 truncate tracking-tight">
          {vehicle.vehicleType || '-'}
        </span>
        <div className="flex items-center gap-1 text-[10px] font-medium text-neutral-500 truncate tracking-tight">
          <User className="h-2.5 w-2.5 shrink-0 opacity-70" />
          <span className="truncate">{vehicle.driverName ?? noDriverLabel}</span>
        </div>
      </div>

      {!hideStatus && (
        <div className="flex items-center justify-end shrink-0 mx-1">
          <StatusBadge status={vehicle.status} labels={statusLabels} />
        </div>
      )}
    </div>
  );
}

// --- VehicleGroupHeader ---------------------------------------------------

interface VehicleGroupHeaderProps {
  group: TrackingVehicleGroup;
  isExpanded: boolean;
  onToggle: () => void;
  isChecked: boolean | 'indeterminate';
  onCheck: (checked: boolean) => void;
  selectAllInGroupLabel?: string;
  totalCount: number;
}

function VehicleGroupHeader({
  group,
  isExpanded,
  onToggle,
  isChecked,
  onCheck,
  selectAllInGroupLabel,
  totalCount,
}: VehicleGroupHeaderProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 cursor-pointer bg-white dark:bg-neutral-900 hover:bg-[#fafafa] dark:hover:bg-neutral-800 transition-colors"
      onClick={onToggle}
    >
      <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform", !isExpanded && "-rotate-90")} />

      <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center bg-transparent">
        <Checkbox
          id={`group-check-${group.id}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheck(!!checked)}
          aria-label={selectAllInGroupLabel || `Pilih semua di grup ${group.name}`}
          className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400 data-[state=checked]:text-white data-[state=indeterminate]:bg-neutral-400 data-[state=indeterminate]:border-neutral-400 data-[state=indeterminate]:text-white rounded-sm shadow-none"
        />
      </div>

      <Folder className="h-[14px] w-[14px] text-[#e6b941] fill-[#f4cb5d] shrink-0 ml-0.5" />

      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex-1 truncate ml-0.5 tracking-tight">
        {group.name}
      </span>

      <span className="text-[10px] font-bold text-neutral-500 bg-[#fafafa] dark:bg-neutral-800 border border-border px-1.5 py-0.5 rounded-md leading-none">
        {totalCount}
      </span>
    </div>
  );
}

// --- VehicleList Props ----------------------------------------------------

export interface VehicleListProps {
  groups: TrackingVehicleGroup[];
  selectedVehicleId: string | null;
  selectedVehicleIds: string[];
  search: string;
  statusFilter: StatusFilter;
  onVehicleSelect: (vehicleId: string) => void;
  onSearchChange: (q: string) => void;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onVehicleCheck: (vehicleId: string | string[], checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onClose?: () => void;
  labels: {
    title: string;
    unitCount: string;
    searchPlaceholder: string;
    filterSettings: string;
    allUnits: string;
    statusAll: string;
    statusDriving: string;
    statusIdle: string;
    statusParking: string;
    statusOffline: string;
    noDriver: string;
    speedUnit: string;
    groupSummary: (groups: number) => string;
    emptyTitle?: string;
    emptyDescription?: string;
    refreshData?: string;
    hidePanel?: string;
    lastUpdated?: string;
    selectAllInGroup?: (groupName: string) => string;
  };
  className?: string;
  hideStatusFilterTabs?: boolean;
  hideVehicleStatus?: boolean;
}

// --- VehicleList Component ------------------------------------------------

export function VehicleList({
  groups,
  selectedVehicleId,
  selectedVehicleIds,
  search,
  statusFilter,
  onVehicleSelect,
  onSearchChange,
  onStatusFilterChange,
  onVehicleCheck,
  onSelectAll,
  onClose,
  labels,
  className,
  hideStatusFilterTabs,
  hideVehicleStatus,
}: VehicleListProps) {
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, true])),
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      filteredVehicles: filterVehicles(group.vehicles, search, statusFilter),
    }))
    .filter((g) => g.filteredVehicles.length > 0 || !search);

  const totalVisible = filteredGroups.reduce((s, g) => s + g.filteredVehicles.length, 0);

  const allVehiclesUnfiltered = search
    ? groups.flatMap((g) => filterVehicles(g.vehicles, search, 'all'))
    : groups.flatMap((g) => g.vehicles);

  const totalAllUnfiltered = allVehiclesUnfiltered.length;
  const overallSummary = computeGroupSummary(allVehiclesUnfiltered);

  const allVisibleIds = filteredGroups.flatMap((g) => g.filteredVehicles.map((v) => v.id));
  const allChecked =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedVehicleIds.includes(id));
  const someChecked =
    !allChecked && allVisibleIds.some((id) => selectedVehicleIds.includes(id));

  const statusFilters: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: labels.statusAll, count: totalAllUnfiltered },
    { key: 'driving', label: labels.statusDriving, count: overallSummary.driving },
    { key: 'idle', label: labels.statusIdle, count: overallSummary.idle },
    { key: 'parking', label: labels.statusParking, count: overallSummary.parking },
    { key: 'offline', label: labels.statusOffline, count: overallSummary.offline },
  ];

  const statusLabels = {
    driving: labels.statusDriving,
    idle: labels.statusIdle,
    parking: labels.statusParking,
    offline: labels.statusOffline,
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-white dark:bg-neutral-950 border-r border-border overflow-hidden',
        className,
      )}
      aria-label={labels.title}
    >
      {/* -- Header ---------------------------------------------------------- */}
      <div className="shrink-0 flex items-center justify-between px-3 h-[40px] bg-white dark:bg-neutral-900 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-[12px] font-bold text-foreground tracking-tight">
            {labels.title}
          </h2>
          <span className="text-[10px] font-bold text-[#de3531] bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md leading-none">
            {totalAllUnfiltered}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-50 hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* -- Search ---------------------------------------------------------- */}
      <div className="shrink-0 px-3 py-2 bg-white dark:bg-neutral-900 border-b border-border flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full h-8 rounded-md border border-border bg-[#fafafa] dark:bg-neutral-900 pl-8 pr-3 text-[12px] text-foreground focus:outline-none focus:border-neutral-300 focus:bg-white transition-all placeholder:text-neutral-400"
          />
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-[#fafafa] dark:bg-neutral-900 text-neutral-500 hover:bg-white dark:hover:bg-neutral-800 transition-colors shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* -- Tabs ------------------------------------------------------------ */}
      {!hideStatusFilterTabs && (
        <div className="shrink-0 bg-white dark:bg-neutral-900 border-b border-border px-1">
          <div className="flex items-center justify-between">
            {statusFilters.map(({ key, label, count }) => {
              const isSelected = statusFilter === key;

              const IconContent = () => {
                if (key === 'all') return <LayoutGrid className={cn("w-4 h-4 mb-1", isSelected ? 'text-[#de3531]' : 'text-[#de3531]')} />;
                if (key === 'driving') return <Play className={cn("w-4 h-4 mb-1", isSelected ? 'text-success fill-transparent' : 'text-success fill-transparent')} />;
                if (key === 'idle') return <PauseCircle className="w-4 h-4 mb-1 text-amber-500" />;
                if (key === 'parking') return (
                  <div className="w-4 h-4 mb-1 rounded-full border-[1.5px] border-blue-500 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-blue-500 leading-none">P</span>
                  </div>
                );
                if (key === 'offline') return <CircleDot className="w-4 h-4 mb-1 text-neutral-400" />;
                return null;
              };

              return (
                <button
                  key={key}
                  onClick={() => onStatusFilterChange(key)}
                  className={cn(
                    "flex-1 flex flex-col items-center py-2 border-b-2 transition-colors focus:outline-none",
                    isSelected ? 'border-[#de3531]' : 'border-transparent hover:border-neutral-100'
                  )}
                >
                  <IconContent />
                  <span className={cn("text-[10px] font-bold leading-none mb-0.5 tracking-tight", isSelected ? 'text-[#de3531]' : 'text-neutral-500')}>
                    {key === 'all' ? labels.statusAll : label}
                  </span>
                  <span className={cn("text-[10px] font-bold leading-none", isSelected ? 'text-[#de3531]' : 'text-neutral-500')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* -- Select All ------------------------------------------------------ */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 bg-[#fafafa] dark:bg-neutral-900 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="vehicle-list-select-all"
            checked={someChecked ? 'indeterminate' : allChecked}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
            aria-label="Semua"
            className="h-3.5 w-3.5 data-[state=checked]:bg-neutral-700 data-[state=checked]:border-neutral-700 data-[state=checked]:text-white data-[state=indeterminate]:bg-neutral-700 data-[state=indeterminate]:border-neutral-700 data-[state=indeterminate]:text-white rounded-sm"
          />
          <label
            htmlFor="vehicle-list-select-all"
            className="text-[11px] font-bold text-foreground cursor-pointer select-none tracking-tight"
          >
            {labels.statusAll}
          </label>
        </div>
        <span className="text-[10px] font-bold text-neutral-500 bg-white dark:bg-neutral-800 px-1.5 py-0.5 border border-border rounded-md leading-none">
          {totalAllUnfiltered}
        </span>
      </div>

      {/* -- Scrollable List ------------------------------------------------- */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2.5 bg-[#fcfcfc] dark:bg-neutral-950" role="list">
        {filteredGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MapPin className="h-8 w-8 text-neutral-300 mb-3" />
            <p className="text-[12px] font-medium text-foreground">{labels.emptyTitle || 'Tidak ada kendaraan'}</p>
          </div>
        )}

        {filteredGroups.map((group) => {
          const isExpanded = expandedGroups[group.id] ?? true;
          const groupVisibleIds = group.filteredVehicles.map(v => v.id);

          const isGroupChecked = groupVisibleIds.length > 0 && groupVisibleIds.every(id => selectedVehicleIds.includes(id));
          const isGroupIndeterminate = !isGroupChecked && groupVisibleIds.some(id => selectedVehicleIds.includes(id));
          const groupCheckState = isGroupIndeterminate ? 'indeterminate' : isGroupChecked;

          return (
            <div key={group.id} role="listitem" className="bg-white dark:bg-neutral-900 border border-border rounded-md shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
              <VehicleGroupHeader
                group={group}
                isExpanded={isExpanded}
                onToggle={() => toggleGroup(group.id)}
                isChecked={groupCheckState}
                onCheck={(c) => onVehicleCheck(groupVisibleIds, c)}
                selectAllInGroupLabel={labels.selectAllInGroup ? labels.selectAllInGroup(group.name) : undefined}
                totalCount={group.vehicles.length}
              />

              {isExpanded && (
                <div className="flex flex-col border-t border-border">
                  {group.filteredVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border-b border-border last:border-0">
                      <VehicleListItem
                        vehicle={vehicle}
                        isSelected={vehicle.id === selectedVehicleId}
                        isChecked={selectedVehicleIds.includes(vehicle.id)}
                        onSelect={onVehicleSelect}
                        onCheck={onVehicleCheck}
                        noDriverLabel={labels.noDriver}
                        speedUnit={labels.speedUnit}
                        statusLabels={statusLabels}
                        hideStatus={hideVehicleStatus}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* -- Footer ---------------------------------------------------------- */}
      <div className="shrink-0 flex items-center justify-between px-3 h-[34px] border-t border-border bg-[#fafafa] dark:bg-neutral-900">
        <span className="text-[10px] font-semibold text-neutral-400 tracking-tight">
          {labels.groupSummary ? labels.groupSummary(filteredGroups.length) : `${filteredGroups.length} grup`}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400 tracking-tight">
          <RefreshCw className="w-3 h-3" />
          <span>{labels.lastUpdated || 'Terakhir diperbarui'} 10:45:23</span>
        </div>
      </div>
    </aside>
  );
}
