'use client';

import React, { useState } from 'react';
import { ConfirmDialog, toast } from '@adatrack/ui';
import { api } from '@adatrack/utils';
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
  const [groupToDelete, setGroupToDelete] = useState<any>(null);
  const t = getTranslation(locale);
  const tGroups = t.groups;

  const [currentTabData, setCurrentTabData] = useState<any[]>([]);

  const fetchData = React.useCallback(async () => {
      try {
        let data: any[] = [];
        switch (activeType) {
          case 'vehicles': data = await groupService.getVehicleGroups(); break;
          case 'drivers': data = await groupService.getDriverGroups(); break;
          case 'geofences': data = await groupService.getGeofenceGroups(); break;
          case 'routes': data = await groupService.getRouteGroups(); break;
        }
        setCurrentTabData(data);
      } catch (err) {
        console.error('Failed to fetch groups', err);
      }
  }, [activeType]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    setGroupToDelete(group);
  };

  const confirmDelete = async () => {
    if (!groupToDelete) return;
    try {
      await api.delete(`/groups/${groupToDelete.id}`);
      toast.success('Group deleted successfully');
      fetchData();
    } catch (err) {
      console.error('Failed to delete group', err);
      toast.error('Failed to delete group');
    } finally {
      setGroupToDelete(null);
    }
  };
  
  const handleSave = async (data: any) => {
    try {
      if (data.id) {
        await api.put(`/groups/${data.id}`, data);
        toast.success('Group updated successfully');
      } else {
        await api.post('/groups', data);
        toast.success('Group created successfully');
      }
      fetchData();
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to save group', err);
      toast.error('Failed to save group');
      throw err;
    }
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
          toolbarActions={
            <div className="flex items-center gap-2">
              <div className="w-[140px]">
                <Select value={activeType} onValueChange={(val) => setActiveType(val as GroupType)}>
                  <SelectTrigger className="h-8 text-[13px] font-medium shadow-none px-3 bg-transparent">
                    <SelectValue placeholder="Pilih Tipe Grup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicles" className="text-[13px] py-1.5">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{tGroups.tabs.vehicles}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="drivers" className="text-[13px] py-1.5">
                      <div className="flex items-center gap-2">
                        <UserRound className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{tGroups.tabs.drivers}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="geofences" className="text-[13px] py-1.5">
                      <div className="flex items-center gap-2">
                        <MapPinned className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{tGroups.tabs.geofences}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="routes" className="text-[13px] py-1.5">
                      <div className="flex items-center gap-2">
                        <Route className="w-3.5 h-3.5 text-foreground-muted" />
                        <span>{tGroups.tabs.routes}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="destructive" onClick={handleAdd} className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
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
      <ConfirmDialog
        open={!!groupToDelete}
        onOpenChange={(open) => !open && setGroupToDelete(null)}
        title="Delete Group"
        description={`Are you sure you want to delete the group ${groupToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
