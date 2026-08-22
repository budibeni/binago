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
    searchPlaceholder: t.tracking.searchPlaceholder, // Reuse search placeholder or create specific one
    nameCol: tGroups.table.name,
    descCol: tGroups.table.description,
    memberCountCol: tGroups.table.memberCount,
    actionCol: tGroups.table.actions,
    addBtn: tGroups.actions.add,
    editBtn: tGroups.actions.edit,
    deleteBtn: tGroups.actions.delete,
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden p-6 gap-4">
      
      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-lg w-fit shrink-0 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                isActive 
                  ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50' 
                  : 'text-foreground-muted hover:text-foreground hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-danger" : "opacity-70")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0">
        {/* We use key to force unmount/remount of table when tab changes, 
            so local state (like search) resets automatically */}
        <GroupDataTable 
          key={activeTab}
          groups={currentTabData} 
          locale={locale} 
          labels={tableLabels}
        />
      </div>
      
    </div>
  );
}
