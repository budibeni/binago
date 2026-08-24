'use client';

import React from 'react';
import { getTranslation } from '../../../i18n';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { driverService, vehicleService, groupService } from '@/data/services';
import { DriverTable } from './components/DriverTable';
import { DriverDetailDrawer } from './components/DriverDetailDrawer';
import type { Driver, DriverStatusFilter } from './types/driver';
import { useRouter } from 'next/navigation';

export function DriversFeature() {
  const locale = useBusinessLocale();
  const router = useRouter();
  const t = getTranslation(locale);
  const tD = t.drivers;

  // --- State -------------------------------------------------------------------
  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: 'all',
    groupIds: [],
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const statusFilter = filterState.status as DriverStatusFilter;
  const selectedGroupIds = filterState.groupIds as string[];

  const [detailDriver, setDetailDriver] = React.useState<Driver | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // --- Filtered Data -----------------------------------------------------------
  const filteredDrivers = React.useMemo(() => {
    const filtered = driverService.getDrivers(search, statusFilter, selectedGroupIds);
    // Enrich with plate number & group name
    return filtered.map(driver => {
      let enriched = { ...driver };
      
      if (driver.assignedVehicleId) {
        const vehicle = vehicleService.getVehicles().find(v => v.id === driver.assignedVehicleId);
        if (vehicle) {
          enriched.assignedVehiclePlate = vehicle.plateNumber;
        }
      }
      
      if (driver.groupId) {
        const group = groupService.getDriverGroups().find(g => g.id === driver.groupId);
        if (group) {
          enriched.groupName = group.name;
        }
      }
      
      return enriched;
    });
  }, [search, statusFilter, selectedGroupIds]);

  // --- Handlers ----------------------------------------------------------------
  const handleViewDetail = React.useCallback((driver: Driver) => {
    setDetailDriver(driver);
    setDrawerOpen(true);
  }, []);

  const handleEdit = React.useCallback((driver: Driver) => {
    router.push(`/drivers/${driver.id}/edit`);
  }, [router]);

  const handleDelete = React.useCallback((driver: Driver) => {
    console.log('Delete driver:', driver.id);
  }, []);

  const handleAdd = React.useCallback(() => {
    router.push('/drivers/add');
  }, [router]);

  // --- Configs -----------------------------------------------------------------
  const tableLabels = React.useMemo(() => ({
    colDriver: tD.table.colDriver,
    colContact: tD.table.colContact,
    colIdentity: tD.table.colIdentity,
    colStatus: tD.table.colStatus,
    colAssignment: tD.table.colAssignment,
    colActions: tD.table.colActions,
    statusActive: tD.status.active,
    statusInactive: tD.status.inactive,
    statusOnLeave: tD.status.onLeave,
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
    phone: tD.labels.phone,
    ktp: tD.labels.ktp,
    licenseNo: tD.labels.licenseNo,
  }), [tD]);

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
          { value: 'all', label: tD.tabs.all },
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
        options: groupService.getDriverGroups().map(g => ({
          value: g.id,
          label: g.name
        }))
      }
    ],
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: 'all', groupIds: [] }),
    labels: { clearAll: tD.clearFilters }
  }), [tD, filterState]);

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6 items-center overflow-hidden">
      
      <div className="w-full h-full min-h-0 relative">
        <DriverTable
          data={filteredDrivers}
          labels={tableLabels}
          onViewDetail={handleViewDetail}
          onAdd={handleAdd}
          searchValue={search}
          onSearchChange={setSearch}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
        />
      </div>

      <DriverDetailDrawer
        driver={detailDriver}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={() => detailDriver && handleEdit(detailDriver)}
        onDelete={() => detailDriver && handleDelete(detailDriver)}
        labels={drawerLabels}
      />
    </div>
  );
}
