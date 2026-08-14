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
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Checkbox } from '@adatrack/ui';
import type {
  TrackingVehicle,
  TrackingVehicleGroup,
  StatusFilter,
  GroupStatusSummary,
} from '../types/tracking';

// â”€â”€â”€ Helper: compute group status summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function computeGroupSummary(vehicles: TrackingVehicle[]): GroupStatusSummary {
  return vehicles.reduce(
    (acc, v) => {
      acc[v.status]++;
      return acc;
    },
    { driving: 0, idle: 0, parking: 0, offline: 0 } as GroupStatusSummary,
  );
}

// â”€â”€â”€ Helper: filter vehicles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€ Status Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const statusConfig = {
  driving: {
    color: 'text-success',
    bg: 'bg-success/15 dark:bg-success/20',
    dot: 'bg-success',
  },
  idle: {
    color: 'text-warning-600 dark:text-warning-400',
    bg: 'bg-warning/15 dark:bg-warning/20',
    dot: 'bg-warning',
  },
  parking: {
    color: 'text-neutral-600 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    dot: 'bg-neutral-400 dark:bg-neutral-500',
  },
  offline: {
    color: 'text-danger',
    bg: 'bg-danger/15 dark:bg-danger/20',
    dot: 'bg-danger',
  },
};

// â”€â”€â”€ StatusBadge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface StatusBadgeProps {
  status: TrackingVehicle['status'];
  labels: { driving: string; idle: string; parking: string; offline: string };
}

function StatusBadge({ status, labels }: StatusBadgeProps) {
  const c = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium leading-none',
        c.bg,
        c.color,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', c.dot)} />
      {labels[status]}
    </span>
  );
}

// â”€â”€â”€ VehicleListItem â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface VehicleListItemProps {
  vehicle: TrackingVehicle;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (id: string) => void;
  onCheck: (id: string, checked: boolean) => void;
  noDriverLabel: string;
  speedUnit: string;
  statusLabels: { driving: string; idle: string; parking: string; offline: string };
}

function VehicleListItem({
  vehicle,
  isSelected,
  isChecked,
  onSelect,
  onCheck,
  noDriverLabel,
  speedUnit,
  statusLabels,
}: VehicleListItemProps) {
  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 py-1 pr-2 cursor-pointer transition-colors',
        isSelected
          ? 'bg-neutral-100 dark:bg-neutral-800/80 rounded-r-md'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40 rounded-r-md'
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
      {/* Horizontal branch line */}
      <div className="absolute left-[-15px] top-1/2 w-[11px] border-t border-neutral-400 dark:border-neutral-600 -z-10" />

      {/* Checkbox */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center z-10 bg-background">
        <Checkbox
          id={`vehicle-check-${vehicle.id}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheck(vehicle.id, !!checked)}
          aria-label={`Pilih ${vehicle.plateNumber}`}
        />
      </div>

      {/* Grid Icon */}
      <Grid className="h-[15px] w-[15px] text-slate-400 fill-slate-300 shrink-0 z-10" />

      {/* Plate + Driver */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5 ml-0.5 z-10">
        <span className="text-[13px] font-medium text-foreground whitespace-nowrap">
          {vehicle.plateNumber}
        </span>
        <span className="text-[13px] text-foreground-muted whitespace-nowrap truncate">
          / {vehicle.driverName ?? noDriverLabel}
        </span>
      </div>

      {/* Status */}
      <div className="flex flex-col items-end gap-1 shrink-0 z-10">
        <StatusBadge status={vehicle.status} labels={statusLabels} />
      </div>
    </div>
  );
}

// â”€â”€â”€ VehicleGroupHeader â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface VehicleGroupHeaderProps {
  group: TrackingVehicleGroup;
  isExpanded: boolean;
  onToggle: () => void;
  isChecked: boolean | 'indeterminate';
  onCheck: (checked: boolean) => void;
  summary: GroupStatusSummary;
  totalCount: number;
  statusLabels: { driving: string; idle: string; parking: string; offline: string };
}

function VehicleGroupHeader({
  group,
  isExpanded,
  onToggle,
  isChecked,
  onCheck,
  summary,
  totalCount,
  statusLabels,
}: VehicleGroupHeaderProps) {
  const summaryParts = [
    summary.driving > 0 && { label: `${summary.driving} ${statusLabels.driving}`, status: 'driving' as const },
    summary.idle > 0 && { label: `${summary.idle} ${statusLabels.idle}`, status: 'idle' as const },
    summary.parking > 0 && { label: `${summary.parking} ${statusLabels.parking}`, status: 'parking' as const },
    summary.offline > 0 && { label: `${summary.offline} ${statusLabels.offline}`, status: 'offline' as const },
  ].filter(Boolean) as { label: string; status: TrackingVehicle['status'] }[];

  return (
    <div className="flex flex-col w-full group/header">
      <div className="flex items-center gap-1.5">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="z-10 flex items-center justify-center w-3.5 h-3.5 border border-neutral-400 bg-background text-foreground-muted hover:border-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <span className="text-[11px] leading-[0] font-bold block mb-[3px]">-</span>
          ) : (
            <span className="text-[11px] leading-[0] font-bold block mb-[1px]">+</span>
          )}
        </button>

        {/* Group Info Container */}
        <div className="flex flex-1 items-center gap-1.5 px-2 py-1 rounded bg-[#eaf4f7] border border-[#d6edf3] dark:bg-cyan-900/20 dark:border-cyan-800/50 mr-2 transition-colors hover:bg-[#e1f0f4] dark:hover:bg-cyan-900/30">
          <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center">
            <Checkbox
              checked={isChecked}
              onCheckedChange={(c) => onCheck(!!c)}
              aria-label={`Pilih grup ${group.name}`}
            />
          </div>
          
          <Folder className="h-4 w-4 text-[#e6b941] fill-[#f4cb5d] shrink-0" />
          
          <span className="text-[14px] text-foreground whitespace-nowrap overflow-hidden text-ellipsis mr-2">
            {group.name}
          </span>
          
          <div className="flex-1 flex items-center justify-end gap-x-1.5">
             <span className="text-[11px] font-semibold text-foreground-muted bg-background/50 px-1.5 py-0.5 rounded shadow-sm leading-none">{totalCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ VehicleList Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface VehicleListProps {
  /** All vehicle groups with their vehicles */
  groups: TrackingVehicleGroup[];
  /** Currently highlighted vehicle id (on map) */
  selectedVehicleId: string | null;
  /** Checked vehicle ids (multi-select) */
  selectedVehicleIds: string[];
  /** Current search query */
  search: string;
  /** Current status filter */
  statusFilter: StatusFilter;
  /** Callback when a vehicle row is clicked */
  onVehicleSelect: (vehicleId: string) => void;
  /** Callback when search changes */
  onSearchChange: (q: string) => void;
  /** Callback when status filter changes */
  onStatusFilterChange: (filter: StatusFilter) => void;
  /** Callback when a vehicle checkbox is toggled (supports multiple for group toggle) */
  onVehicleCheck: (vehicleId: string | string[], checked: boolean) => void;
  /** Callback to select/deselect all visible vehicles */
  onSelectAll: (checked: boolean) => void;
  /** Optional callback to close/hide sidebar */
  onClose?: () => void;
  /** i18n labels */
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
    groupSummary: (groups: number, vehicles: number) => string;
    emptyTitle?: string;
    emptyDescription?: string;
    refreshData?: string;
    hidePanel?: string;
  };
  className?: string;
}

// â”€â”€â”€ VehicleList Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
}: VehicleListProps) {
  // â”€â”€ Local state: which groups are expanded â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, true])),
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // â”€â”€ Computed: filter vehicles per group â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      filteredVehicles: filterVehicles(group.vehicles, search, statusFilter),
    }))
    .filter((g) => g.filteredVehicles.length > 0 || !search);

  // Total visible matching search & filter
  const totalVisible = filteredGroups.reduce((s, g) => s + g.filteredVehicles.length, 0);
  
  // Total overall stats (regardless of current filter, used for the filter counts)
  const allVehiclesUnfiltered = search 
    ? groups.flatMap((g) => filterVehicles(g.vehicles, search, 'all'))
    : groups.flatMap((g) => g.vehicles);

  const totalAllUnfiltered = allVehiclesUnfiltered.length;
  const overallSummary = computeGroupSummary(allVehiclesUnfiltered);

  // â”€â”€ Computed: select all state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const allVisibleIds = filteredGroups.flatMap((g) => g.filteredVehicles.map((v) => v.id));
  const allChecked =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedVehicleIds.includes(id));
  const someChecked =
    !allChecked && allVisibleIds.some((id) => selectedVehicleIds.includes(id));

  // â”€â”€ Status filter tabs config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        'flex flex-col h-full bg-background border-r border-border overflow-hidden',
        className,
      )}
      aria-label={labels.title}
    >
      {/* â”€â”€ Panel Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="shrink-0 flex items-center justify-between px-3 h-[40px] border-b border-border bg-neutral-50/30 dark:bg-neutral-900/10">
        <div className="flex items-center gap-2">
          <h2 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
            {labels.title}
          </h2>
          <span className="text-[10px] font-bold text-foreground-muted bg-neutral-200/60 dark:bg-neutral-800 px-1.5 py-0.5 rounded-full leading-none">
            {totalAllUnfiltered}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-foreground-muted hover:bg-neutral-200/50 hover:text-foreground transition-colors"
            title={labels.hidePanel || "Sembunyikan Panel"}
            aria-label={labels.hidePanel || "Sembunyikan Panel"}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* â”€â”€ Search â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border">
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className={cn(
              'w-full h-8 rounded-md border border-border bg-background pl-8 pr-3 text-[12px] text-foreground placeholder:text-foreground-subtle',
              'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors',
            )}
            aria-label={labels.searchPlaceholder}
          />
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground-muted hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary shrink-0"
          aria-label={labels.refreshData || "Muat ulang data"}
          title={labels.refreshData || "Muat ulang data"}
          onClick={() => {
            // TODO: implement refresh logic if passed down, or just mock it for now.
          }}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* â”€â”€ Status Filter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="shrink-0 border-b border-border px-3 py-2 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter status kendaraan">
          {statusFilters.map(({ key, label, count }) => {
            const isSelected = statusFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onStatusFilterChange(key)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors border',
                  'focus:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1',
                  isSelected
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground-muted border-border hover:border-foreground/30 hover:text-foreground',
                )}
                aria-pressed={isSelected}
                aria-label={`Filter: ${label} (${count})`}
              >
                {label} <span className={cn('opacity-70', isSelected && 'font-semibold')}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* â”€â”€ Select All â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="shrink-0 flex items-center gap-2.5 px-3 py-2.5 border-b border-border bg-background">
        <Checkbox
          id="vehicle-list-select-all"
          checked={someChecked ? 'indeterminate' : allChecked}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          aria-label={labels.allUnits}
        />
        <label
          htmlFor="vehicle-list-select-all"
          className="text-[11px] font-bold text-foreground uppercase tracking-wider cursor-pointer select-none"
        >
          {labels.allUnits.toUpperCase()}
        </label>
      </div>

      {/* â”€â”€ Scrollable Vehicle List â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3" role="list" aria-label="Daftar kendaraan">
        {filteredGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <MapPin className="h-10 w-10 text-border mb-4" aria-hidden="true" />
            <p className="text-[14px] font-medium text-foreground">{labels.emptyTitle || 'Tidak ada kendaraan ditemukan'}</p>
            <p className="text-[13px] text-foreground-muted mt-1">
              {labels.emptyDescription || 'Coba sesuaikan kata kunci atau filter status.'}
            </p>
          </div>
        )}

        {filteredGroups.map((group) => {
          const summary = computeGroupSummary(group.vehicles);
          const isExpanded = expandedGroups[group.id] ?? true;

          // Compute group check state
          const groupVisibleIds = group.filteredVehicles.map(v => v.id);
          const isGroupChecked = groupVisibleIds.length > 0 && groupVisibleIds.every(id => selectedVehicleIds.includes(id));
          const isGroupIndeterminate = !isGroupChecked && groupVisibleIds.some(id => selectedVehicleIds.includes(id));
          const groupCheckState = isGroupIndeterminate ? 'indeterminate' : isGroupChecked;

          return (
            <div key={group.id} role="listitem" className="mb-3 last:mb-0">
              {/* Group Header */}
              <VehicleGroupHeader
                group={group}
                isExpanded={isExpanded}
                onToggle={() => toggleGroup(group.id)}
                isChecked={groupCheckState}
                onCheck={(c) => onVehicleCheck(groupVisibleIds, c)}
                summary={summary}
                totalCount={group.vehicles.length}
                statusLabels={statusLabels}
              />

              {/* Vehicle Items (Tree Branch) */}
              {isExpanded && (
                <div className="relative ml-[6px] pl-[15px] border-l border-neutral-400 dark:border-neutral-600 mt-1 flex flex-col gap-0.5">
                  {group.filteredVehicles.map((vehicle) => (
                    <VehicleListItem
                      key={vehicle.id}
                      vehicle={vehicle}
                      isSelected={vehicle.id === selectedVehicleId}
                      isChecked={selectedVehicleIds.includes(vehicle.id)}
                      onSelect={onVehicleSelect}
                      onCheck={onVehicleCheck}
                      noDriverLabel={labels.noDriver}
                      speedUnit={labels.speedUnit}
                      statusLabels={statusLabels}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* â”€â”€ Footer Summary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="shrink-0 flex items-center justify-center px-3 py-2 border-t border-border bg-neutral-50 dark:bg-neutral-900/50">
        <p className="text-[11px] font-medium text-foreground-muted">
          {labels.groupSummary(filteredGroups.length, totalVisible)}
        </p>
      </div>
    </aside>
  );
}
