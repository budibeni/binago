'use client';

import React, { useState } from 'react';
import { Plus, Truck, UserRound, MapPinned } from 'lucide-react';
import { getTranslation } from '../../../i18n';
import { groupService } from '@/data/services';
import { GroupDataTable } from './components/GroupDataTable';
import { GroupForm } from './components/GroupForm';
import { Button, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@adatrack/ui';

export interface GroupsFeatureProps {
  locale: 'id' | 'en';
}

type GroupType = 'vehicles' | 'drivers' | 'geofences';

export function GroupsFeature({ locale }: GroupsFeatureProps) {
  const [activeType, setActiveType] = useState<GroupType>('vehicles');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<any>(null); // any used temporarily to avoid strict type imports, will be casted.
  const t = getTranslation(locale);
  const tGroups = t.groups;

  const currentTabData = React.useMemo(() => {
    switch (activeType) {
      case 'vehicles': return groupService.getVehicleGroups();
      case 'drivers': return groupService.getDriverGroups();
      case 'geofences': return groupService.getGeofenceGroups();
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

  const handleAdd = () => {
    setEditGroup(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (group: any) => {
    setEditGroup(group);
    setIsFormOpen(true);
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
    return 'geofence';
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <GroupDataTable 
          key={activeType}
          groups={currentTabData} 
          labels={tableLabels}
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
      />
    </div>
  );
}
