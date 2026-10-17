'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Truck, UserRound, MapPinned, Route } from 'lucide-react';
import type { Locale } from '@adatrack/types';
import { useBusinessLocale } from '../../../components/BusinessShellLayout';
import { groupService } from '@/data/services';
import type { Group, GroupType } from './types';
import { GroupTable } from './components/GroupTable';
import { GroupForm } from './components/GroupForm';
import { GroupView } from './components/GroupView';
import { getGroupTranslation } from './i18n';
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  toast,
  ConfirmDialog,
  type DataTableLabels,
} from '@adatrack/ui';
import { formatNumber } from '@adatrack/utils';

export interface GroupFeatureProps {
  locale?: Locale;
}

type TabType = 'vehicles' | 'drivers' | 'geofences' | 'routes';

export function GroupFeature({ locale: propLocale }: GroupFeatureProps) {
  const shellLocale = useBusinessLocale();
  const locale = propLocale || shellLocale || 'id';
  const t = getGroupTranslation(locale);

  const [activeType, setActiveType] = useState<TabType>('vehicles');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [detailGroup, setDetailGroup] = useState<Group | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  // Subscribe reactively to group repository updates
  useEffect(() => {
    return groupService.subscribe(() => {
      setDataVersion((v) => v + 1);
    });
  }, []);

  // Listen to browser popstate for drawer navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/groups/create') {
        setEditGroup(null);
        setIsFormOpen(true);
        setIsViewOpen(false);
      } else if (path === '/groups/edit' || path.startsWith('/groups/edit/')) {
        if (path === '/groups/edit') {
          setIsFormOpen(true);
          setIsViewOpen(false);
        } else {
          const id = path.replace('/groups/edit/', '');
          const found = groupService.getGroupById(id);
          if (found) {
            setEditGroup(found);
            setIsFormOpen(true);
            setIsViewOpen(false);
          }
        }
      } else if (path === '/groups') {
        setIsFormOpen(false);
        setIsViewOpen(false);
        setEditGroup(null);
        setDetailGroup(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentTabData = useMemo(() => {
    // dataVersion dependency triggers recalculation upon store update
    void dataVersion;
    switch (activeType) {
      case 'vehicles':
        return groupService.getVehicleGroups();
      case 'drivers':
        return groupService.getDriverGroups();
      case 'geofences':
        return groupService.getGeofenceGroups();
      case 'routes':
        return groupService.getRouteGroups();
      default:
        return [];
    }
  }, [activeType, dataVersion]);

  // Tour Automation Event Bridges
  useEffect(() => {
    const handleTourOpenDetail = () => {
      if (currentTabData.length > 0) {
        setDetailGroup(currentTabData[0]);
        setIsViewOpen(true);
      }
    };

    const handleTourOpenCreate = () => {
      setEditGroup(null);
      setIsFormOpen(true);
    };

    const handleTourCloseCreate = () => {
      setIsFormOpen(false);
    };

    window.addEventListener('adatrack:tour-open-group-detail', handleTourOpenDetail);
    window.addEventListener('adatrack:tour-open-group-create', handleTourOpenCreate);
    window.addEventListener('adatrack:tour-close-group-create', handleTourCloseCreate);

    return () => {
      window.removeEventListener('adatrack:tour-open-group-detail', handleTourOpenDetail);
      window.removeEventListener('adatrack:tour-open-group-create', handleTourOpenCreate);
      window.removeEventListener('adatrack:tour-close-group-create', handleTourCloseCreate);
    };
  }, [currentTabData]);

  const tableLabels = useMemo(
    () => ({
      searchPlaceholder: t.table.searchPlaceholder,
      nameCol: t.table.name,
      descCol: t.table.description,
      memberCountCol: t.table.memberCount,
      actionCol: t.table.actions,
      addBtn: t.actions.add,
      editBtn: t.actions.edit,
      deleteBtn: t.actions.delete,
      detailBtn: t.actions.detail,
      unit: t.table.unit,
    }),
    [t],
  );

  const dtLabels: DataTableLabels = useMemo(() => {
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

  const handleAdd = useCallback(() => {
    window.history.pushState(null, '', '/groups/create');
    setEditGroup(null);
    setIsViewOpen(false);
    setIsFormOpen(true);
  }, []);

  const handleEdit = useCallback((group: Group) => {
    window.history.pushState(null, '', '/groups/edit');
    setIsViewOpen(false);
    setEditGroup(group);
    setIsFormOpen(true);
  }, []);

  const handleView = useCallback((group: Group) => {
    window.history.pushState(null, '', `/groups/${group.id}`);
    setDetailGroup(group);
    setIsFormOpen(false);
    setIsViewOpen(true);
  }, []);

  const handleDelete = useCallback((group: Group) => {
    setDeleteTarget(group);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    const success = groupService.deleteGroup(deleteTarget.id);
    if (success) {
      toast.success(t.toast.deleteSuccess);
      if (detailGroup?.id === deleteTarget.id) {
        setIsViewOpen(false);
        setDetailGroup(null);
        window.history.pushState(null, '', '/groups');
      }
    } else {
      toast.error(t.toast.deleteFailed);
    }
    setIsDeleteDialogOpen(false);
    setDeleteTarget(null);
  }, [deleteTarget, detailGroup, t]);

  const handleSave = useCallback(
    (data: Partial<Group>) => {
      if (editGroup) {
        groupService.updateGroup(editGroup.id, data);
        toast.success(t.toast.updateSuccess);
      } else {
        const defaultSingular: GroupType =
          activeType === 'vehicles'
            ? 'vehicle'
            : activeType === 'drivers'
              ? 'driver'
              : activeType === 'geofences'
                ? 'geofence'
                : 'route';
        groupService.createGroup({ ...data, type: data.type || defaultSingular });
        toast.success(t.toast.createSuccess);
      }
      window.history.pushState(null, '', '/groups');
      setIsFormOpen(false);
      setEditGroup(null);
    },
    [editGroup, activeType, t],
  );

  const handleCloseForm = useCallback(() => {
    window.history.pushState(null, '', '/groups');
    setIsFormOpen(false);
    setEditGroup(null);
  }, []);

  const handleCloseView = useCallback(() => {
    window.history.pushState(null, '', '/groups');
    setIsViewOpen(false);
    setDetailGroup(null);
  }, []);

  const getDefaultTypeSingular = (): GroupType => {
    if (activeType === 'vehicles') return 'vehicle';
    if (activeType === 'drivers') return 'driver';
    if (activeType === 'geofences') return 'geofence';
    return 'route';
  };

  const getTabLabel = (type: TabType) => {
    switch (type) {
      case 'vehicles':
        return t.tabs.vehicles;
      case 'drivers':
        return t.tabs.drivers;
      case 'geofences':
        return t.tabs.geofences;
      case 'routes':
        return t.tabs.routes;
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <GroupTable
          key={activeType}
          groups={currentTabData}
          labels={tableLabels}
          onViewDetail={handleView}
          dtLabels={dtLabels}
          toolbarActions={
            <div className="flex items-center gap-2">
              <div id="group-type-selector" className="w-[140px]">
                <Select value={activeType} onValueChange={(val) => setActiveType(val as TabType)}>
                  <SelectTrigger className="h-8 text-[12px] font-medium shadow-none px-3 bg-transparent">
                    <SelectValue placeholder={t.table.selectTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicles" className="text-[12px] py-1.5">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{t.tabs.vehicles}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="drivers" className="text-[12px] py-1.5">
                      <div className="flex items-center gap-2">
                        <UserRound className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{t.tabs.drivers}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="geofences" className="text-[12px] py-1.5">
                      <div className="flex items-center gap-2">
                        <MapPinned className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{t.tabs.geofences}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="routes" className="text-[12px] py-1.5">
                      <div className="flex items-center gap-2">
                        <Route className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{t.tabs.routes}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                id="group-btn-add"
                variant="destructive"
                onClick={handleAdd}
                className="h-8 gap-1.5 text-[12px] font-medium shadow-none"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">{t.actions.add}</span>
              </Button>
            </div>
          }
        />
      </div>

      <GroupForm
        group={editGroup}
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseForm();
          else setIsFormOpen(true);
        }}
        onSave={handleSave}
        onCancel={handleCloseForm}
        layout="drawer"
        defaultType={getDefaultTypeSingular()}
        locale={locale}
        title={`${editGroup ? t.form.editTitle : t.form.addTitle} ${getTabLabel(activeType)}`}
      />

      <GroupView
        group={detailGroup}
        open={isViewOpen}
        onClose={handleCloseView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        locale={locale}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t.delete.title}
        description={
          <div className="flex flex-col gap-1 text-center">
            <span>{t.delete.description}</span>
            {deleteTarget && (
              <div className="mt-2 text-center">
                <strong className="text-danger text-[14px]">{deleteTarget.name}</strong>
              </div>
            )}
          </div>
        }
        confirmLabel={t.delete.confirm}
        cancelLabel={t.delete.cancel}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

// Backward-compatible alias
export const GroupsFeature = GroupFeature;
