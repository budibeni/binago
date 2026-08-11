'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Car } from 'lucide-react';
import { getTranslation } from '../../i18n';
import { useBusinessLocale } from '../../components/BusinessShellLayout';
import { mockVehicles, mockVehicleGroups, filterVehicles } from './data/mockVehicles';
import { VehicleTable } from './components/VehicleTable';
import { VehicleDetailDrawer } from './components/VehicleDetailDrawer';
import type { Vehicle, VehicleStatusFilter } from './types/vehicle';
import type { DataTableFilterConfig } from '@binago/ui';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeStatusCounts(vehicles: Vehicle[], search: string, groupIds: string[]) {
  const base = filterVehicles(vehicles, search, 'all', groupIds);
  return {
    all: base.length,
    driving: base.filter((v) => v.status === 'driving').length,
    idle: base.filter((v) => v.status === 'idle').length,
    parking: base.filter((v) => v.status === 'parking').length,
    offline: base.filter((v) => v.status === 'offline').length,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function VehiclesFeature() {
  const locale = useBusinessLocale();
  const router = useRouter();

  const t = getTranslation(locale);
  const tV = t.vehicles;

  // ── State ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: 'all',
    groupIds: [],
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  const statusFilter = filterState.status as VehicleStatusFilter;
  const selectedGroupIds = filterState.groupIds as string[];

  const [detailVehicle, setDetailVehicle] = React.useState<Vehicle | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filteredVehicles = React.useMemo(
    () => filterVehicles(mockVehicles, search, statusFilter, selectedGroupIds),
    [search, statusFilter, selectedGroupIds],
  );

  const statusCounts = React.useMemo(
    () => computeStatusCounts(mockVehicles, search, selectedGroupIds),
    [search, selectedGroupIds],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleViewDetail = React.useCallback((vehicle: Vehicle) => {
    setDetailVehicle(vehicle);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = React.useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleEdit = React.useCallback((vehicle: Vehicle) => {
    // TODO: open edit modal (Task 06 scope terbatas — hanya placeholder)
    console.log('Edit vehicle:', vehicle.id);
  }, []);

  const handleTrack = React.useCallback((vehicle: Vehicle) => {
    // Navigate to tracking page
    router.push('/tracking');
    console.log('Track vehicle:', vehicle.id);
  }, [router]);

  const handleDelete = React.useCallback((vehicle: Vehicle) => {
    // TODO: confirmation dialog (Task 06 scope terbatas — hanya placeholder)
    console.log('Delete vehicle:', vehicle.id);
  }, []);

  // Filter toggle/clear logic is now handled by DataTableFilterPanel internally via onStateChange

  // ── Labels ──────────────────────────────────────────────────────────────────
  const tableLabels = React.useMemo(() => ({
    colPlateNumber: tV.colPlateNumber,
    colVehicle: tV.colVehicle,
    colGroup: tV.colGroup,
    colDriver: tV.colDriver,
    colStatus: tV.colStatus,
    colOdometer: tV.colOdometer,
    colLastUpdate: tV.colLastUpdate,
    colCategory: tV.colCategory,
    colBrand: tV.colBrand,
    colYear: tV.colYear,
    colFuel: tV.colFuel,
    colDeviceImei: tV.colDeviceImei,
    colNextService: tV.colNextService,
    colRegExpiry: tV.colRegExpiry,
    colActions: tV.colActions,
    noDriver: tV.noDriver,
    noDevice: tV.noDevice,
    statusDriving: tV.statusDriving,
    statusIdle: tV.statusIdle,
    statusParking: tV.statusParking,
    statusOffline: tV.statusOffline,
    emptyTitle: tV.emptyTitle,
    emptyDescription: tV.emptyDescription,
    noResultTitle: tV.noResultTitle,
    noResultDescription: tV.noResultDescription,
    searchPlaceholder: tV.searchPlaceholder,
    exportFilename: tV.exportFilename,
    actionDetail: tV.actionDetail,
    actionEdit: tV.actionEdit,
    actionTrack: tV.actionTrack,
    actionDelete: tV.actionDelete,
  }), [tV]);

  const filterLabels = React.useMemo(() => ({
    filterStatus: tV.filterStatus,
    filterGroup: tV.filterGroup,
    filterAll: tV.filterAll,
    clearFilters: tV.clearFilters,
    statusDriving: tV.statusDriving,
    statusIdle: tV.statusIdle,
    statusParking: tV.statusParking,
    statusOffline: tV.statusOffline,
  }), [tV]);

  const drawerLabels = React.useMemo(() => ({
    detailTitle: tV.detailTitle,
    detailVehicleInfo: tV.detailVehicleInfo,
    detailOperational: tV.detailOperational,
    detailMaintenance: tV.detailMaintenance,
    detailClose: tV.detailClose,
    noDriver: tV.noDriver,
    noDevice: tV.noDevice,
    statusDriving: tV.statusDriving,
    statusIdle: tV.statusIdle,
    statusParking: tV.statusParking,
    statusOffline: tV.statusOffline,
  }), [tV]);

  // ── Filter Config ────────────────────────────────────────────────────────────
  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: 'all', groupIds: [] }),
    labels: {
      title: 'Filter Kendaraan',
      clearAll: filterLabels.clearFilters,
    },
    fields: [
      {
        id: 'status',
        label: filterLabels.filterStatus,
        type: 'pills-single',
        options: [
          {
            value: 'all',
            label: filterLabels.filterAll,
            count: statusCounts.all,
            activeClass: 'bg-neutral-700 dark:bg-neutral-600 border-neutral-700 dark:border-neutral-500 text-white',
          },
          {
            value: 'driving',
            label: filterLabels.statusDriving,
            count: statusCounts.driving,
            colorClass: 'bg-success',
            activeClass: 'bg-success/15 border-success/40 text-success dark:text-success',
          },
          {
            value: 'idle',
            label: filterLabels.statusIdle,
            count: statusCounts.idle,
            colorClass: 'bg-warning',
            activeClass: 'bg-warning/15 border-warning/40 text-warning-600 dark:text-warning-400',
          },
          {
            value: 'parking',
            label: filterLabels.statusParking,
            count: statusCounts.parking,
            colorClass: 'bg-neutral-400',
            activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground',
          },
          {
            value: 'offline',
            label: filterLabels.statusOffline,
            count: statusCounts.offline,
            colorClass: 'bg-danger',
            activeClass: 'bg-danger/15 border-danger/40 text-danger',
          },
        ],
      },
      {
        id: 'groupIds',
        label: filterLabels.filterGroup,
        type: 'pills-multi',
        options: mockVehicleGroups.map((g) => ({
          value: g.id,
          label: g.name,
          colorClass: 'bg-info',
          activeClass: 'bg-info/15 border-info/40 text-info dark:text-info',
        })),
      },
    ],
  }), [filterState, filterLabels, statusCounts]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full">


      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        <VehicleTable
          data={filteredVehicles}
          labels={tableLabels}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onTrack={handleTrack}
          onDelete={handleDelete}
          searchValue={search}
          onSearchChange={setSearch}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
        />
      </div>

      {/* Detail Drawer */}
      <VehicleDetailDrawer
        vehicle={detailVehicle}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        labels={drawerLabels}
      />
    </div>
  );
}
