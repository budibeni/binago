'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Car } from 'lucide-react';
import { getTranslation } from '../../../i18n';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { vehicleService } from '@/data/services';
import { VehicleTable } from './components/VehicleTable';
import { VehicleView } from './components/VehicleView';
import { VehicleForm } from './components/VehicleForm';
import type { Vehicle, VehicleStatusFilter } from './types/vehicle';
import type { DataTableFilterConfig, DataTableLabels } from '@adatrack/ui';

// ===========================================================================

// count computation removed

// ===========================================================================

export function VehiclesFeature() {
  const locale = useBusinessLocale();
  const router = useRouter();

  const t = getTranslation(locale);
  const tV = t.vehicles;

  // ===========================================================================
  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: [],
    groupIds: [],
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const statusFilter = filterState.status as VehicleStatusFilter;
  const selectedGroupIds = filterState.groupIds as string[];

  const [detailVehicle, setDetailVehicle] = React.useState<Vehicle | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [editVehicle, setEditVehicle] = React.useState<Vehicle | null>(null);

  // ===========================================================================
  const filteredVehicles = React.useMemo(
    () => vehicleService.getVehicles({ search, status: statusFilter, groupIds: selectedGroupIds }),
    [search, statusFilter, selectedGroupIds],
  );

  // statusCounts removed

  // ===========================================================================
  const handleViewDetail = React.useCallback((vehicle: Vehicle) => {
    setDetailVehicle(vehicle);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = React.useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleEdit = React.useCallback((vehicle: Vehicle) => {
    setDrawerOpen(false);
    setEditVehicle(vehicle);
  }, []);

  const handleTrack = React.useCallback((vehicle: Vehicle) => {
    // Navigate to tracking page
    router.push('/tracking');
    console.log('Track vehicle:', vehicle.id);
  }, [router]);

  const handleDelete = React.useCallback((vehicle: Vehicle) => {
    // TODO: confirmation dialog (Task 06 scope terbatas - hanya placeholder)
    console.log('Delete vehicle:', vehicle.id);
  }, []);

  // Filter toggle/clear logic is now handled by DataTableFilterPanel internally via onStateChange

  // ===========================================================================
  const tableLabels = React.useMemo(() => ({
    colPlateNumber: tV.colPlateNumber,
    colVehicle: tV.colVehicle,
    colGroup: tV.colGroup,
    colDriver: tV.colDriver,
    colCategory: tV.colCategory,
    colBrand: tV.colBrand,
    colYear: tV.colYear,
    colFuel: tV.colFuel,
    colDeviceImei: tV.colDeviceImei,
    colRegExpiry: tV.colRegExpiry,
    colColor: locale === 'en' ? 'Color' : 'Warna',
    colDeviceSim: locale === 'en' ? 'SIM Number' : 'Nomor SIM',
    colFuelCapacity: locale === 'en' ? 'Fuel Capacity' : 'Kap. BBM',
    colKirExpiry: locale === 'en' ? 'KIR Expiry' : 'Masa Berlaku KIR',
    colNotes: locale === 'en' ? 'Notes' : 'Catatan',
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
    actionAdd: locale === 'en' ? 'Add' : 'Tambah',
  }), [tV, locale]);

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

  const dtLabels: DataTableLabels = React.useMemo(() => {
    const isEn = locale === 'en';
    return {
      paginationShowing: (from: number, to: number, total: number) => isEn ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items` : `Menampilkan ${from}-${to} dari ${total.toLocaleString('id-ID')} data`,
      paginationPerPage: isEn ? '/ page' : '/ halaman',
      toolbarRefresh: isEn ? 'Refresh' : 'Refresh',
      toolbarFilter: isEn ? 'Filter' : 'Filter',
      toolbarColumns: isEn ? 'Columns' : 'Kolom',
      toolbarExport: isEn ? 'Export' : 'Ekspor',
      activeFilterClear: isEn ? 'Clear Filters' : 'Reset Filter',
      columnPanelHideAll: isEn ? 'Hide all' : 'Sembunyikan semua',
      columnPanelShowAll: isEn ? 'Show all' : 'Tampilkan semua',
      errorLoadData: isEn ? 'Failed to load data.' : 'Gagal memuat data.',
      errorTryAgain: isEn ? 'Try Again' : 'Coba Lagi',
      errorTitle: isEn ? 'An error occurred' : 'Terjadi Kesalahan',
      noResultTitle: isEn ? 'No results found' : 'Hasil Tidak Ditemukan',
      noResultDesc: isEn ? 'No data matches your search or filters.' : 'Tidak ada data yang sesuai dengan pencarian atau filter Anda.',
    };
  }, [locale]);

  // ===========================================================================
  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: [], groupIds: [] }),
    labels: {
      title: 'Filter',
      clearAll: filterLabels.clearFilters,
    },
    fields: [
      {
        id: 'status',
        label: filterLabels.filterStatus,
        type: 'pills-multi',
        options: [
          {
            value: 'driving',
            label: filterLabels.statusDriving,
            colorClass: 'bg-success',
            activeClass: 'bg-success/15 border-success/40 text-success dark:text-success',
          },
          {
            value: 'idle',
            label: filterLabels.statusIdle,
            colorClass: 'bg-warning',
            activeClass: 'bg-warning/15 border-warning/40 text-warning-600 dark:text-warning-400',
          },
          {
            value: 'parking',
            label: filterLabels.statusParking,
            colorClass: 'bg-neutral-400',
            activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground',
          },
          {
            value: 'offline',
            label: filterLabels.statusOffline,
            colorClass: 'bg-danger',
            activeClass: 'bg-danger/15 border-danger/40 text-danger',
          },
        ],
      },
      {
        id: 'groupIds',
        label: filterLabels.filterGroup,
        type: 'pills-multi',
        options: vehicleService.getVehicleGroups().map(g => ({
          value: g.id,
          label: g.name,
          colorClass: 'bg-info',
          activeClass: 'bg-info/15 border-info/40 text-info dark:text-info',
        })),
      },
    ],
  }), [filterState, filterLabels]);

  // ===========================================================================
  return (
    <div className="flex flex-col h-full w-full">


      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
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
          onAdd={undefined}
          dtLabels={dtLabels}
        />
      </div>

      {/* Detail View */}
      <VehicleView
        vehicle={detailVehicle}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        labels={drawerLabels}
      />

      {!!editVehicle && (
        <VehicleForm
          vehicle={editVehicle}
          open={!!editVehicle}
          onOpenChange={(open) => {
            if (!open) {
              setEditVehicle(null);
            }
          }}
          onSave={(data) => {
            console.log('Saved vehicle:', data);
            setEditVehicle(null);
          }}
          onCancel={() => {
            setEditVehicle(null);
          }}
        />
      )}
    </div>
  );
}
