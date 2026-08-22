import React, { useState } from 'react';
import { cn } from '@adatrack/utils';
import { Truck, UserRound, MapPinned } from 'lucide-react';
import { getTranslation } from '../../i18n';
import { mockVehicleGroups, mockDriverGroups, mockGeofenceGroups } from './data/mockGroupsData';
import { GroupDataTable } from './components/GroupDataTable';

export interface GroupsFeatureProps {
  locale: 'id' | 'en';
}

type TabType = 'vehicles' | 'drivers' | 'geofences';

export function GroupsFeature({ locale }: GroupsFeatureProps) {
  const [activeTab, setActiveTab] = useState<TabType>('vehicles');
  const t = getTranslation(locale);
  const tGroups = t.groups;

  const tabs = [
    { id: 'vehicles' as const, label: tGroups.tabs.vehicles, icon: Truck, data: mockVehicleGroups },
    { id: 'drivers' as const, label: tGroups.tabs.drivers, icon: UserRound, data: mockDriverGroups },
    { id: 'geofences' as const, label: tGroups.tabs.geofences, icon: MapPinned, data: mockGeofenceGroups },
  ];

  const currentTabData = tabs.find(t => t.id === activeTab)?.data || [];

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

  return (
    <div className="flex flex-col h-full w-full bg-neutral-50 dark:bg-neutral-900/30 p-4 items-center overflow-hidden">
      
      <div className="w-full h-full flex flex-col bg-background border border-border/60 rounded-xl shadow-sm overflow-hidden">
        
        {/* Tabs - Segmented Control (Compact) */}
        <div className="w-full flex justify-center py-3 border-b border-border/50 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center p-1 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                    isActive 
                      ? 'text-danger shadow-sm bg-background border border-border/50' 
                      : 'text-foreground-muted hover:text-foreground hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30'
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive && "scale-105")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 p-4">
          <GroupDataTable 
            key={activeTab}
            activeTab={activeTab}
            groups={currentTabData} 
            locale={locale} 
            labels={tableLabels}
          />
        </div>
      </div>
    </div>
  );
}
