'use client';

import React from 'react';
import {
  Search,
  Settings2,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react';
import { cn } from '@binago/utils';
import { Checkbox } from '@binago/ui';
import type {
  TrackingVehicle,
  TrackingVehicleGroup,
  StatusFilter,
  GroupStatusSummary,
} from '../types/tracking';

// ─── Helper: compute group status summary ─────────────────────────────────────

function computeGroupSummary(vehicles: TrackingVehicle[]): GroupStatusSummary {
  return vehicles.reduce(
    (acc, v) => {
      acc[v.status]++;
      return acc;
    },
    { driving: 0, idle: 0, parking: 0, offline: 0 } as GroupStatusSummary,
  );
}

// ─── Helper: filter vehicles ──────────────────────────────────────────────────

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

// ─── Status Config ────────────────────────────────────────────────────────────

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

// ─── StatusBadge ──────────────────────────────────────────────────────────────

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

// ─── VehicleListItem ──────────────────────────────────────────────────────────

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
        'group flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors',
        isSelected
          ? 'bg-neutral-50 dark:bg-neutral-800/80'
          : 'hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40',
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
      {/* Checkbox */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0">
        <Checkbox
          id={`vehicle-check-${vehicle.id}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheck(vehicle.id, !!checked)}
          aria-label={`Pilih ${vehicle.plateNumber}`}
        />
      </div>

      {/* Plate + Driver */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-foreground leading-tight truncate">
          {vehicle.plateNumber}
        </p>
        <p className="text-[12px] text-foreground-muted truncate mt-0.5 uppercase tracking-wide">
          {vehicle.driverName ?? noDriverLabel}
        </p>
      </div>

      {/* Status & Speed */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <p className="text-[13px] font-semibold text-foreground leading-none">
          {vehicle.speed} <span className="text-[11px] text-foreground-muted font-normal">{speedUnit}</span>
        </p>
        <StatusBadge status={vehicle.status} labels={statusLabels} />
      </div>
    </div>
  );
}

// ─── VehicleGroupHeader ───────────────────────────────────────────────────────

interface VehicleGroupHeaderProps {
  group: TrackingVehicleGroup;
  isExpanded: boolean;
  onToggle: () => void;
  summary: GroupStatusSummary;
  totalCount: number;
  statusLabels: { driving: string; idle: string; parking: string; offline: string };
}

function VehicleGroupHeader({
  group,
  isExpanded,
  onToggle,
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
    <button
      type="button"
      className={cn(
        'w-full flex flex-col gap-1.5 px-4 py-3 border-b border-border transition-colors',
        'hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
      )}
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-label={`${group.name}, ${totalCount} kendaraan`}
    >
      <div className="w-full flex items-center justify-between">
        <p className="text-[14px] font-semibold text-foreground leading-tight truncate">
          {group.name}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[13px] font-bold text-foreground">{totalCount}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
          )}
        </div>
      </div>
      
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
        {summaryParts.map((part, index) => (
          <React.Fragment key={part.status}>
            {index > 0 && <span className="text-border">·</span>}
            <span className={cn('text-[12px] font-medium', statusConfig[part.status].color)}>
              {part.label}
            </span>
          </React.Fragment>
        ))}
      </div>
    </button>
  );
}

// ─── VehicleList Props ──────────────────────────────────────────────────────────

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
  /** Callback when a vehicle checkbox is toggled */
  onVehicleCheck: (vehicleId: string, checked: boolean) => void;
  /** Callback to select/deselect all visible vehicles */
  onSelectAll: (checked: boolean) => void;
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
  };
  className?: string;
}

// ─── VehicleList Component ────────────────────────────────────────────────────

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
  labels,
  className,
}: VehicleListProps) {
  // ── Local state: which groups are expanded ──────────────────────────────────
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g.id, true])),
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // ── Computed: filter vehicles per group ─────────────────────────────────────
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

  // ── Computed: select all state ──────────────────────────────────────────────
  const allVisibleIds = filteredGroups.flatMap((g) => g.filteredVehicles.map((v) => v.id));
  const allChecked =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedVehicleIds.includes(id));
  const someChecked =
    !allChecked && allVisibleIds.some((id) => selectedVehicleIds.includes(id));

  // ── Status filter tabs config ───────────────────────────────────────────────
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
      {/* ── Panel Header ──────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 h-[56px] border-b border-border">
        <h2 className="text-[14px] font-bold text-foreground uppercase tracking-widest">
          {labels.title}
        </h2>
        <span className="text-[14px] font-bold text-foreground">{totalAllUnfiltered}</span>
      </div>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="relative flex-1 min-w-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className={cn(
              'w-full h-9 rounded-md border border-border bg-background pl-9 pr-3 text-[13px] text-foreground placeholder:text-foreground-subtle',
              'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors',
            )}
            aria-label={labels.searchPlaceholder}
          />
        </div>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground-muted hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary shrink-0"
          aria-label={labels.filterSettings}
          title={labels.filterSettings}
        >
          <Settings2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* ── Status Filter ─────────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-border px-4 py-3 bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter status kendaraan">
          {statusFilters.map(({ key, label, count }) => {
            const isSelected = statusFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onStatusFilterChange(key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors border',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
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

      {/* ── Select All ────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-background">
        <Checkbox
          id="vehicle-list-select-all"
          checked={someChecked ? 'indeterminate' : allChecked}
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          aria-label={labels.allUnits}
        />
        <label
          htmlFor="vehicle-list-select-all"
          className="text-[12px] font-bold text-foreground uppercase tracking-wider cursor-pointer select-none"
        >
          {labels.allUnits.toUpperCase()}
        </label>
      </div>

      {/* ── Scrollable Vehicle List ───────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto" role="list" aria-label="Daftar kendaraan">
        {filteredGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <MapPin className="h-10 w-10 text-border mb-4" aria-hidden="true" />
            <p className="text-[14px] font-medium text-foreground">Tidak ada kendaraan ditemukan</p>
            <p className="text-[13px] text-foreground-muted mt-1">
              Coba sesuaikan kata kunci atau filter status.
            </p>
          </div>
        )}

        {filteredGroups.map((group) => {
          const summary = computeGroupSummary(group.vehicles);
          const isExpanded = expandedGroups[group.id] ?? true;

          return (
            <div key={group.id} role="listitem">
              {/* Group Header */}
              <VehicleGroupHeader
                group={group}
                isExpanded={isExpanded}
                onToggle={() => toggleGroup(group.id)}
                summary={summary}
                totalCount={group.vehicles.length}
                statusLabels={statusLabels}
              />

              {/* Vehicle Items */}
              {isExpanded && (
                <div>
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

      {/* ── Footer Summary ────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-center px-4 py-3 border-t border-border bg-neutral-50 dark:bg-neutral-900/50">
        <p className="text-[12px] font-medium text-foreground-muted">
          {labels.groupSummary(filteredGroups.length, totalVisible)}
        </p>
      </div>
    </aside>
  );
}
