'use client';

import React from 'react';
import { ConfirmDialog, toast } from '@adatrack/ui';
import { api } from '@adatrack/utils';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { getDevicesTranslation } from './i18n';
import { DeviceTable } from './components/DeviceTable';
import { DeviceView } from './components/DeviceView';
import { DeviceForm } from './components/DeviceForm';
import { useDevices } from './hooks/useDevices';
import type { Device } from './types/device';

export function DevicesFeature() {
  const locale = useBusinessLocale();
  const tD = getDevicesTranslation(locale);

  // --- State -------------------------------------------------------------------
  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: '',
    protocol: '',
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const [detailDevice, setDetailDevice] = React.useState<Device | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editDevice, setEditDevice] = React.useState<Device | null>(null);
  const [deviceToDelete, setDeviceToDelete] = React.useState<Device | null>(null);

  // --- Filtered Data -----------------------------------------------------------
  const { devices, loading, refetch } = useDevices({
    search,
    status: filterState.status as string,
    protocol: filterState.protocol as string,
  });

  // --- Handlers ----------------------------------------------------------------
  const handleViewDetail = React.useCallback((device: Device) => {
    setDetailDevice(device);
    setDrawerOpen(true);
  }, []);

  const handleEdit = React.useCallback((device: Device) => {
    const proto = (device.protocol || '').toUpperCase();
    if (proto !== 'SMARTPHONE' && proto !== 'HTTP_MOBILE') {
      toast.error('Perangkat GPS fisik hanya dapat diedit melalui Admin Portal.');
      return;
    }
    setDrawerOpen(false);
    setEditDevice(device);
  }, []);

  const handleDelete = React.useCallback((device: Device) => {
    const proto = (device.protocol || '').toUpperCase();
    if (proto !== 'SMARTPHONE' && proto !== 'HTTP_MOBILE') {
      toast.error('Perangkat GPS fisik hanya dapat dihapus melalui Admin Portal.');
      return;
    }
    setDrawerOpen(false);
    setDeviceToDelete(device);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!deviceToDelete) return;
    try {
      await api.delete(`/devices/${deviceToDelete.imei}`);
      toast.success(tD.messages.deleted);
      refetch();
      setDeviceToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete device', err);
      toast.error('Gagal menghapus perangkat');
    }
  }, [deviceToDelete, refetch, tD.messages.deleted]);

  const handleAdd = React.useCallback(() => {
    setEditDevice(null);
    setIsFormOpen(true);
  }, []);

  // --- Configs -----------------------------------------------------------------
  const tableLabels = React.useMemo(() => ({
    colActions: tD.table.colActions,
    colImei: tD.table.colImei,
    colProtocol: tD.table.colProtocol,
    colBrandModel: tD.table.colBrandModel,
    colSim: tD.table.colSim,
    colVehicle: tD.table.colVehicle,
    colStatus: tD.table.colStatus,
    colLastSeen: tD.table.colLastSeen,
    emptyTitle: tD.table.emptyTitle,
    emptyDescription: tD.table.emptyDescription,
    noResultTitle: tD.table.noResultTitle,
    noResultDescription: tD.table.noResultDescription,
    searchPlaceholder: tD.searchPlaceholder,
    addDevice: tD.addDevice,
    exportFilename: tD.exportFilename,
    statusLabels: tD.status,
    protocolLabels: tD.protocols,
  }), [tD]);

  const drawerLabels = React.useMemo(() => ({
    title: tD.drawer.title,
    close: tD.drawer.close,
    tabInfo: tD.drawer.tabInfo,
    tabVehicle: tD.drawer.tabVehicle,
    imei: tD.drawer.imei,
    protocol: tD.drawer.protocol,
    brandModel: tD.drawer.brandModel,
    simNumber: tD.drawer.simNumber,
    iccid: tD.drawer.iccid,
    status: tD.drawer.status,
    company: tD.drawer.company,
    vehicleName: tD.drawer.vehicleName,
    plateNumber: tD.drawer.plateNumber,
    registeredAt: tD.drawer.registeredAt,
    updatedAt: tD.drawer.updatedAt,
    actionEdit: tD.drawer.actionEdit,
    actionDelete: tD.drawer.actionDelete,
  }), [tD]);

  const filterConfig = React.useMemo(() => ({
    fields: [
      {
        id: 'status',
        label: tD.filterStatus,
        type: 'pills-single' as const,
        options: [
          { value: 'assigned', label: tD.status.assigned },
          { value: 'idle', label: tD.status.idle },
        ],
      },
      {
        id: 'protocol',
        label: tD.filterProtocol,
        type: 'pills-single' as const,
        options: [
          { value: 'SMARTPHONE', label: tD.protocols.SMARTPHONE },
          { value: 'GT06', label: tD.protocols.GT06 },
          { value: 'TELTONIKA', label: tD.protocols.TELTONIKA },
        ],
      },
    ],
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: '', protocol: '' }),
    labels: { title: 'Filter', clearAll: tD.clearFilters },
  }), [tD, filterState]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <DeviceTable
          data={devices}
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
          isLoading={loading}
        />
      </div>

      <DeviceView
        device={detailDevice}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={() => detailDevice && handleEdit(detailDevice)}
        onDelete={() => detailDevice && handleDelete(detailDevice)}
        labels={drawerLabels}
      />

      {(isFormOpen || !!editDevice) && (
        <DeviceForm
          layout="default"
          open={isFormOpen || !!editDevice}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false);
              setEditDevice(null);
            }
          }}
          device={editDevice}
          onCancel={() => {
            setIsFormOpen(false);
            setEditDevice(null);
          }}
          onSave={async (data) => {
            try {
              if (editDevice) {
                await api.put(`/devices/${editDevice.imei}`, data);
                toast.success(tD.messages.updated);
              } else {
                await api.post('/devices', data);
                toast.success(tD.messages.created);
              }
              refetch();
              setIsFormOpen(false);
              setEditDevice(null);
            } catch (err: any) {
              console.error('Failed to save device', err);
              const errMsg = err?.response?.data?.message || err?.message || 'Gagal menyimpan perangkat';
              toast.error(errMsg);
              throw err;
            }
          }}
        />
      )}

      <ConfirmDialog
        open={!!deviceToDelete}
        onOpenChange={(open) => !open && setDeviceToDelete(null)}
        title={tD.messages.deleteConfirmTitle}
        description={`${tD.messages.deleteConfirmDesc} (${deviceToDelete?.imei})`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
