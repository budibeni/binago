'use client';

import React from 'react';
import { getDriversTranslation } from './i18n';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
// Use hooks instead of mock services
import { DriverTable } from './components/DriverTable';
import { DriverView } from './components/DriverView';
import { DriverForm } from './components/DriverForm';
import { useDrivers } from './hooks/useDrivers';
import { useVehicles } from '@/features/core/vehicles/hooks/useVehicles';
import { api } from '@adatrack/utils';
import { groupService } from '@/data/services';
import type { Driver, DriverStatusFilter } from './types/driver';
import { useRouter } from 'next/navigation';

export function DriversFeature() {
  const locale = useBusinessLocale();
  const router = useRouter();
  const tD = getDriversTranslation(locale);

  // --- State -------------------------------------------------------------------
  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: '',
    groupIds: [],
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const statusFilter = (filterState.status || 'all') as DriverStatusFilter;
  const selectedGroupIds = filterState.groupIds as string[];

  const [detailDriver, setDetailDriver] = React.useState<Driver | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editDriver, setEditDriver] = React.useState<Driver | null>(null);

  // --- Filtered Data -----------------------------------------------------------
  const { drivers: fetchedDrivers, loading: driversLoading } = useDrivers({ search, status: statusFilter, groupIds: selectedGroupIds });
  const { vehicles: apiVehicles } = useVehicles();
  const loading = driversLoading;

  const [driverGroups, setDriverGroups] = React.useState<any[]>([]);
  React.useEffect(() => {
    groupService.getDriverGroups().then(setDriverGroups).catch(console.error);
  }, []);
  
  const filteredDrivers = React.useMemo(() => {
    // Enrich with plate number & group name
    return fetchedDrivers.map(driver => {
      let enriched = { ...driver };
      
      if (driver.assignedVehicleId) {
        const vehicle = apiVehicles.find(v => v.id === driver.assignedVehicleId);
        if (vehicle) {
          enriched.assignedVehiclePlate = vehicle.plateNumber;
        }
      }
      
      if (driver.groupId) {
        const group = driverGroups.find((g: any) => g.id === driver.groupId);
        if (group) {
          enriched.groupName = group.name;
        }
      }
      
      return enriched;
    });
  }, [fetchedDrivers, apiVehicles, driverGroups]);

  // --- Handlers ----------------------------------------------------------------
  const handleViewDetail = React.useCallback((driver: Driver) => {
    setDetailDriver(driver);
    setDrawerOpen(true);
  }, []);

  const handleEdit = React.useCallback((driver: Driver) => {
    setDrawerOpen(false);
    setEditDriver(driver);
  }, []);

  const handleDelete = React.useCallback(async (driver: Driver) => {
    if (confirm(`Are you sure you want to delete driver ${driver.name}?`)) {
      try {
        await api.delete(`/drivers/${driver.id}`);
        window.location.reload();
      } catch (err) {
        console.error('Failed to delete driver', err);
        alert('Failed to delete driver');
      }
    }
  }, []);

  const handleAdd = React.useCallback(() => {
    setIsFormOpen(true);
  }, []);

  // --- Configs -----------------------------------------------------------------
  const tableLabels = React.useMemo(() => ({
    colDriver: tD.table.colDriver,
    colGroup: tD.filterGroup,
    colPlacement: tD.labels.placement,
    colPhone: tD.labels.phone,
    colEmail: tD.labels.email,
    colAddress: tD.labels.address,
    colKtp: tD.labels.ktp,
    colPob: tD.labels.pob,
    colDob: tD.labels.dob,
    colLicenseNo: tD.labels.licenseNo,
    colLicenseExpiry: tD.labels.licenseExpiry,
    colJoinDate: tD.labels.joinDate,
    colActions: tD.table.colActions,
    emptyTitle: tD.table.emptyTitle,
    emptyDescription: tD.table.emptyDescription,
    noResultTitle: tD.table.noResultTitle,
    noResultDescription: tD.table.noResultDescription,
    searchPlaceholder: tD.searchPlaceholder,
    addDriver: tD.addDriver,
    exportFilename: tD.exportFilename,
    actionDetail: tD.actions.detail,
    actionEdit: tD.actions.edit,
    actionDelete: tD.actions.delete,
  }), [tD]);

  const dtLabels = React.useMemo(() => {
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

  const drawerLabels = React.useMemo(() => ({
    title: tD.drawer.title,
    close: tD.drawer.close,
    tabInfo: tD.drawer.tabInfo,
    tabHistory: tD.drawer.tabHistory,
    ktp: tD.labels.ktp,
    pob: tD.labels.pob,
    dob: tD.labels.dob,
    joinDate: tD.labels.joinDate,
    address: tD.labels.address,
    placement: tD.labels.placement,
    licenseNo: tD.labels.licenseNo,
    licenseExpiry: tD.labels.licenseExpiry,
    phone: tD.labels.phone,
    email: tD.labels.email,
    historyEmpty: tD.drawer.historyEmpty,
    actionEdit: tD.actions.edit,
    actionDelete: tD.actions.delete,
  }), [tD]);

  const filterConfig = React.useMemo(() => ({
    fields: [
      {
        id: 'status',
        label: tD.filterStatus,
        type: 'pills-single' as const,
        options: [
          { value: 'active', label: tD.status.active },
          { value: 'inactive', label: tD.status.inactive },
          { value: 'on_leave', label: tD.status.onLeave },
        ]
      },
      // Note: Groups filter would normally load from an API. We'll use static options for now.
      {
        id: 'groupIds',
        label: tD.filterGroup,
        type: 'pills-multi' as const,
        options: ([] as any[]).map(g => ({
          value: g.id,
          label: g.name
        }))
      }
    ],
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: '', groupIds: [] }),
    labels: { title: 'Filter', clearAll: tD.clearFilters }
  }), [tD, filterState]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <DriverTable
          data={filteredDrivers}
          labels={tableLabels}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          searchValue={search}
          onSearchChange={setSearch}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          dtLabels={dtLabels}
          isLoading={loading}
        />
      </div>

      <DriverView
        driver={detailDriver}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={() => detailDriver && handleEdit(detailDriver)}
        onDelete={() => detailDriver && handleDelete(detailDriver)}
        labels={drawerLabels}
      />

      {(isFormOpen || !!editDriver) && (
        <DriverForm
          layout="default"
          open={isFormOpen || !!editDriver}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false);
              setEditDriver(null);
            }
          }}
          driver={editDriver}
          onCancel={() => {
            setIsFormOpen(false);
            setEditDriver(null);
          }}

          onSave={async (data) => {
            try {
              const payload = {
                name: data.name,
                phone: data.phone,
                email: data.email,
                license_number: data.licenseNumber,
                license_type: 'SIM B1', // default or mapped if exists
              };
              
              if (data.id) {
                await api.put(`/drivers/${data.id}`, payload);
              } else {
                await api.post('/drivers', payload);
              }

              window.location.reload();
            } catch (err) {
              console.error('Failed to save driver', err);
              alert('Failed to save driver');
            }
            setIsFormOpen(false);
            setEditDriver(null);
          }}
        />
      )}
    </div>
  );
}
