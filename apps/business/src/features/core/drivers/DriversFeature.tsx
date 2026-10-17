'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { formatNumber } from '@adatrack/utils';
import { toast, ConfirmDialog, type DataTableLabels, type DataTableFilterConfig } from '@adatrack/ui';
import { getDriversTranslation } from './i18n';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { driverService, vehicleService, groupService } from '@/data/services';
import { DriverTable, type DriverTableLabels } from './components/DriverTable';
import { DriverView } from './components/DriverView';
import { DriverForm } from './components/DriverForm';
import type { Driver, DriverStatusFilter } from './types/driver';

export function DriversFeature() {
  const locale = useBusinessLocale();
  const tD = getDriversTranslation(locale);

  // --- State -------------------------------------------------------------------
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: '',
    groupIds: [],
    performance: [],
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const statusFilter = (filterState.status || 'all') as DriverStatusFilter;
  const performanceFilter = (filterState.performance || []) as string[];
  const selectedGroupIds = filterState.groupIds as string[];

  const [detailDriver, setDetailDriver] = React.useState<Driver | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editDriver, setEditDriver] = React.useState<Driver | null>(null);
  const [deleteTargetDriver, setDeleteTargetDriver] = React.useState<Driver | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // --- Filtered Data -----------------------------------------------------------
  const filteredDrivers = React.useMemo(() => {
    // refreshKey dependency ensures re-fetch on create/update/delete
    void refreshKey;
    const filtered = driverService.getDrivers(search, statusFilter, selectedGroupIds, performanceFilter);
    // Enrich with plate number & group name
    return filtered.map((driver) => {
      const enriched = { ...driver };

      if (driver.assignedVehicleId) {
        const vehicle = vehicleService.getVehicles().find((v) => v.id === driver.assignedVehicleId);
        if (vehicle) {
          enriched.assignedVehiclePlate = vehicle.plateNumber;
        }
      }

      if (driver.groupId) {
        const group = groupService.getDriverGroups().find((g) => g.id === driver.groupId);
        if (group) {
          enriched.groupName = group.name;
        }
      }

      return enriched;
    });
  }, [search, statusFilter, selectedGroupIds, performanceFilter, refreshKey]);

  // --- Handlers with URL synchronization ---------------------------------------
  const handleViewDetail = React.useCallback((driver: Driver) => {
    window.history.pushState(null, '', `/drivers/${driver.id}`);
    setDetailDriver(driver);
    setDrawerOpen(true);
  }, []);

  const handleCloseDetail = React.useCallback(() => {
    window.history.pushState(null, '', '/drivers');
    setDrawerOpen(false);
    setDetailDriver(null);
  }, []);

  const handleEdit = React.useCallback((driver: Driver) => {
    window.history.pushState(null, '', '/drivers/edit');
    setDrawerOpen(false);
    setEditDriver(driver);
    setIsFormOpen(true);
  }, []);

  const handleAdd = React.useCallback(() => {
    window.history.pushState(null, '', '/drivers/create');
    setEditDriver(null);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = React.useCallback(() => {
    window.history.pushState(null, '', '/drivers');
    setIsFormOpen(false);
    setEditDriver(null);
  }, []);

  const handleSave = React.useCallback(
    (data: Partial<Driver>) => {
      if (editDriver) {
        driverService.updateDriver(editDriver.id, data);
        toast.success(
          locale === 'en'
            ? 'Driver data updated successfully'
            : 'Data pengemudi berhasil diperbarui',
        );
      } else {
        driverService.createDriver(data);
        toast.success(
          locale === 'en'
            ? 'Driver registered successfully'
            : 'Data pengemudi baru berhasil ditambahkan',
        );
      }
      window.history.pushState(null, '', '/drivers');
      setIsFormOpen(false);
      setEditDriver(null);
      setRefreshKey((k) => k + 1);
    },
    [editDriver, locale],
  );

  const handleDelete = React.useCallback((driver: Driver) => {
    setDeleteTargetDriver(driver);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    if (!deleteTargetDriver) return;
    driverService.deleteDriver(deleteTargetDriver.id);
    toast.success(
      locale === 'en'
        ? 'Driver deleted successfully'
        : 'Data pengemudi berhasil dihapus',
    );
    if (detailDriver?.id === deleteTargetDriver.id) {
      setDrawerOpen(false);
      setDetailDriver(null);
      window.history.pushState(null, '', '/drivers');
    }
    setRefreshKey((k) => k + 1);
    setIsDeleteDialogOpen(false);
    setDeleteTargetDriver(null);
  }, [deleteTargetDriver, detailDriver, locale]);

  // --- Interactive Tour Event Listeners ----------------------------------------
  React.useEffect(() => {
    const handleTourOpenDetail = () => {
      const item = filteredDrivers[0];
      if (item) {
        setDetailDriver(item);
        setDrawerOpen(true);
      }
    };
    const handleTourCloseDetail = () => {
      setDrawerOpen(false);
    };
    const handleTourOpenForm = () => {
      setDrawerOpen(false);
      setEditDriver(null);
      setIsFormOpen(true);
    };
    const handleTourCloseForm = () => {
      setIsFormOpen(false);
      setEditDriver(null);
    };
    const handleTourOpenFilter = () => {
      setIsFilterOpen(true);
    };
    const handleTourCloseFilter = () => {
      setIsFilterOpen(false);
    };

    window.addEventListener('adatrack:tour-open-driver-detail', handleTourOpenDetail);
    window.addEventListener('adatrack:tour-close-driver-detail', handleTourCloseDetail);
    window.addEventListener('adatrack:tour-open-driver-form', handleTourOpenForm);
    window.addEventListener('adatrack:tour-close-driver-form', handleTourCloseForm);
    window.addEventListener('adatrack:tour-open-filter', handleTourOpenFilter);
    window.addEventListener('adatrack:tour-close-filter', handleTourCloseFilter);

    return () => {
      window.removeEventListener('adatrack:tour-open-driver-detail', handleTourOpenDetail);
      window.removeEventListener('adatrack:tour-close-driver-detail', handleTourCloseDetail);
      window.removeEventListener('adatrack:tour-open-driver-form', handleTourOpenForm);
      window.removeEventListener('adatrack:tour-close-driver-form', handleTourCloseForm);
      window.removeEventListener('adatrack:tour-open-filter', handleTourOpenFilter);
      window.removeEventListener('adatrack:tour-close-filter', handleTourCloseFilter);
    };
  }, [filteredDrivers]);

  // --- Configs -----------------------------------------------------------------
  const tableLabels: DriverTableLabels = React.useMemo(
    () => ({
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
      colStatus: tD.table.colStatus,
      colVehicle: tD.table.colVehicle,
      colPerformance: tD.table.colPerformance,
      emptyTitle: tD.table.emptyTitle,
      emptyDescription: tD.table.emptyDescription,
      noResultTitle: tD.table.noResultTitle,
      noResultDescription: tD.table.noResultDescription,
      searchPlaceholder: tD.searchPlaceholder,
      addDriver: tD.addDriver,
      exportFilename: tD.exportFilename,
      actionAdd: locale === 'en' ? 'Add' : 'Tambah',
      statusActive: tD.status.active,
      statusInactive: tD.status.inactive,
      statusOnLeave: tD.status.onLeave,
    }),
    [tD, locale],
  );

  const dtLabels: DataTableLabels = React.useMemo(() => {
    const isEn = locale === 'en';
    return {
      paginationShowing: (from: number, to: number, total: number) =>
        isEn
          ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items`
          : `Menampilkan ${from}-${to} dari ${formatNumber(total)} data`,
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
      noResultDesc: isEn
        ? 'No data matches your search or filters.'
        : 'Tidak ada data yang sesuai dengan pencarian atau filter Anda.',
    };
  }, [locale]);

  const drawerLabels = React.useMemo(
    () => ({
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
      group: tD.filterGroup,
      licenseNo: tD.labels.licenseNo,
      licenseExpiry: tD.labels.licenseExpiry,
      phone: tD.labels.phone,
      email: tD.labels.email,
      historyEmpty: tD.drawer.historyEmpty,
      actionEdit: tD.actions.edit,
      actionDelete: tD.actions.delete,
    }),
    [tD],
  );

  const filterConfig: DataTableFilterConfig = React.useMemo(
    () => ({
      fields: [
        {
          id: 'status',
          label: tD.filterStatus,
          type: 'pills-single' as const,
          options: [
            { value: 'active', label: tD.status.active },
            { value: 'inactive', label: tD.status.inactive },
            { value: 'on_leave', label: tD.status.onLeave },
          ],
        },
        {
          id: 'performance',
          label: 'Performa',
          type: 'pills-multi' as const,
          options: [
            {
              value: '5',
              label: (
                <div className="flex items-center gap-0.5 py-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                </div>
              ),
            },
            {
              value: '4',
              label: (
                <div className="flex items-center gap-0.5 py-0.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                </div>
              ),
            },
            {
              value: '3',
              label: (
                <div className="flex items-center gap-0.5 py-0.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                </div>
              ),
            },
            {
              value: '2',
              label: (
                <div className="flex items-center gap-0.5 py-0.5">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                </div>
              ),
            },
            {
              value: '1',
              label: (
                <div className="flex items-center gap-0.5 py-0.5">
                  {Array.from({ length: 1 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                </div>
              ),
            },
          ],
        },
        {
          id: 'groupIds',
          label: tD.filterGroup,
          type: 'pills-multi' as const,
          options: groupService.getDriverGroups().map((g) => ({
            value: g.id,
            label: g.name,
          })),
        },
      ],
      state: filterState,
      onStateChange: setFilterState,
      onClearAll: () => setFilterState({ status: '', performance: [], groupIds: [] }),
      labels: { title: 'Filter', clearAll: tD.clearFilters },
    }),
    [tD, filterState],
  );

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
        />
      </div>

      <DriverView
        driver={detailDriver}
        isOpen={drawerOpen}
        onClose={handleCloseDetail}
        onEdit={() => detailDriver && handleEdit(detailDriver)}
        onDelete={() => detailDriver && handleDelete(detailDriver)}
        labels={drawerLabels}
      />

      {(isFormOpen || !!editDriver) && (
        <DriverForm
          layout="drawer"
          open={isFormOpen || !!editDriver}
          onOpenChange={(open) => {
            if (!open) {
              handleCloseForm();
            }
          }}
          driver={editDriver}
          onCancel={handleCloseForm}
          onSave={handleSave}
        />
      )}

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={locale === 'en' ? 'Delete Driver?' : 'Hapus Pengemudi?'}
        description={
          <div className="flex flex-col gap-1 text-center">
            <span>
              {locale === 'en'
                ? 'Are you sure you want to delete this driver? This action cannot be undone.'
                : 'Apakah Anda yakin ingin menghapus data pengemudi ini? Tindakan ini tidak dapat dibatalkan.'}
            </span>
            {deleteTargetDriver && (
              <div className="mt-2 text-center">
                <strong className="text-danger text-[14px]">{deleteTargetDriver.name}</strong>
              </div>
            )}
          </div>
        }
        confirmLabel={locale === 'en' ? 'Delete' : 'Hapus'}
        cancelLabel={locale === 'en' ? 'Cancel' : 'Batal'}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export const DriverFeature = DriversFeature;
