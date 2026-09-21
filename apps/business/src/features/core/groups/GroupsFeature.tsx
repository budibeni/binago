'use client';

import React, { useState } from 'react';
import { Plus, Truck, UserRound, MapPinned, Route } from 'lucide-react';
import { getTranslation } from '../../../i18n';
import { groupService } from '@/data/services';
import { GroupTable } from './components/GroupTable';
import { GroupForm } from './components/GroupForm';
import { GroupView } from './components/GroupView';
import { Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@adatrack/ui';

export interface GroupsFeatureProps {
  locale: 'id' | 'en';
}

type GroupType = 'vehicles' | 'drivers' | 'geofences' | 'routes';

export function GroupsFeature({ locale }: GroupsFeatureProps) {
  const [activeType, setActiveType] = useState<GroupType>('vehicles');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<any>(null); // any used temporarily to avoid strict type imports, will be casted.
  const [detailGroup, setDetailGroup] = useState<any>(null);
  const t = getTranslation(locale);
  const tGroups = t.groups;

  const currentTabData = React.useMemo(() => {
    switch (activeType) {
      case 'vehicles': return groupService.getVehicleGroups();
      case 'drivers': return groupService.getDriverGroups();
      case 'geofences': return groupService.getGeofenceGroups();
      case 'routes': return groupService.getRouteGroups();
      default: return [];
    }
  }, [activeType]);

  const tableLabels = {
    searchPlaceholder: tGroups.table.searchPlaceholder,
    nameCol: tGroups.table.name,
    descCol: tGroups.table.description,
    memberCountCol: tGroups.table.memberCount,
    actionCol: tGroups.table.actions,
    addBtn: tGroups.actions.add,
    editBtn: tGroups.actions.edit,
    deleteBtn: tGroups.actions.delete,
  };

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

  const handleAdd = () => {
    setEditGroup(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (group: any) => {
    setEditGroup(group);
    setIsFormOpen(true);
  };
  
  const handleView = (group: any) => {
    setDetailGroup(group);
    setIsViewOpen(true);
  };
  
  const handleDelete = (group: any) => {
    console.log('Delete group:', group.id);
  };
  
  const handleSave = (data: any) => {
    console.log('Save group:', data);
    setIsFormOpen(false);
  };

  const getDefaultTypeSingular = () => {
    if (activeType === 'vehicles') return 'vehicle';
    if (activeType === 'drivers') return 'driver';
    if (activeType === 'geofences') return 'geofence';
    return 'route';
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <GroupTable 
          key={activeType}
          groups={currentTabData as any} 
          labels={tableLabels}
          onViewDetail={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          dtLabels={dtLabels}
          toolbarActions={
            <div className="flex items-center gap-2">
              <div className="w-[140px]">
                <Select value={activeType} onValueChange={(val) => setActiveType(val as GroupType)}>
                  <SelectTrigger className="h-8 text-[12px] font-medium shadow-none px-3 bg-transparent">
                    <SelectValue placeholder="Pilih Tipe Grup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicles" className="text-[12px] py-1.5">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{tGroups.tabs.vehicles}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="drivers" className="text-[12px] py-1.5">
                      <div className="flex items-center gap-2">
                        <UserRound className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{tGroups.tabs.drivers}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="geofences" className="text-[12px] py-1.5">
                      <div className="flex items-center gap-2">
                        <MapPinned className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{tGroups.tabs.geofences}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="routes" className="text-[12px] py-1.5">
                      <div className="flex items-center gap-2">
                        <Route className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{tGroups.tabs.routes}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="destructive" onClick={handleAdd} className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">{tGroups.actions.add}</span>
              </Button>
            </div>
          }
        />
      </div>
      
      <GroupForm
        group={editGroup}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSave}
        onCancel={() => setIsFormOpen(false)}
        layout="drawer"
        defaultType={getDefaultTypeSingular() as any}
        title={`${editGroup ? 'Ubah' : 'Tambah'} Grup ${
          activeType === 'vehicles' ? tGroups.tabs.vehicles :
          activeType === 'drivers' ? tGroups.tabs.drivers :
          activeType === 'geofences' ? tGroups.tabs.geofences :
          tGroups.tabs.routes
        }`}
      />
      <GroupView
        group={detailGroup}
        open={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
