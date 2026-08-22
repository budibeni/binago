import React, { useState } from 'react';
import { cn } from '@adatrack/utils';
import { Search, Plus, Edit2, Trash2, Users, LayoutGrid, Truck, UserRound, MapPinned } from 'lucide-react';
import { GroupData } from '../data/mockGroupsData';

export interface GroupDataTableProps {
  groups: GroupData[];
  locale: 'id' | 'en';
  activeTab?: string;
  labels: {
    searchPlaceholder: string;
    nameCol: string;
    descCol: string;
    memberCountCol: string;
    actionCol: string;
    addBtn: string;
    editBtn: string;
    deleteBtn: string;
  };
}

export function GroupDataTable({ groups, locale, labels, activeTab }: GroupDataTableProps) {
  const [search, setSearch] = useState('');

  const TabIcon = React.useMemo(() => {
    if (activeTab === 'vehicles') return Truck;
    if (activeTab === 'drivers') return UserRound;
    if (activeTab === 'geofences') return MapPinned;
    return LayoutGrid;
  }, [activeTab]);

  const filteredGroups = React.useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.description.toLowerCase().includes(q)
    );
  }, [groups, search]);

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between pb-3 gap-3 border-b border-border/50 mb-3">
        <div className="relative w-64 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-3.5 h-3.5 text-foreground-muted group-focus-within:text-danger transition-colors" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-danger/50 focus:border-danger/50 transition-all text-foreground placeholder:text-foreground-muted shadow-sm"
          />
        </div>
        <button
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-danger hover:bg-danger/90 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {labels.addBtn}
        </button>
      </div>

      {/* Modern List Area */}
      <div className="flex-1 overflow-auto bg-background relative">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border/60 text-foreground-muted text-[11px] font-semibold uppercase tracking-wider z-10 grid grid-cols-12 gap-3 px-4 py-2.5">
            <div className="col-span-4">{labels.nameCol}</div>
            <div className="col-span-5">{labels.descCol}</div>
            <div className="col-span-2 text-center">{labels.memberCountCol}</div>
            <div className="col-span-1 text-right">{labels.actionCol}</div>
          </div>

          {/* List Body */}
          <div className="flex flex-col">
            {filteredGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-b border-border/30">
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                  <TabIcon className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">Grup Tidak Ditemukan</h3>
                <p className="text-xs text-foreground-muted max-w-xs">
                  Tidak ada data grup yang cocok dengan pencarian Anda.
                </p>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div 
                  key={group.id}
                  className="group relative grid grid-cols-12 gap-3 items-center px-4 py-2 border-b border-border/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  {/* Subtle active indicator line on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-danger opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Name Col */}
                  <div className="col-span-4 flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-danger/10 text-danger shrink-0 border border-danger/10">
                      <TabIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-medium text-foreground truncate">{group.name}</span>
                  </div>

                  {/* Desc Col */}
                  <div className="col-span-5 text-sm text-foreground-subtle truncate">
                    {group.description}
                  </div>

                  {/* Member Count Col */}
                  <div className="col-span-2 flex justify-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-foreground-muted border border-border group-hover:bg-danger/10 group-hover:text-danger group-hover:border-danger/20 transition-colors">
                      {group.memberCount} unit
                    </span>
                  </div>

                  {/* Actions Col */}
                  <div className="col-span-1 flex items-center justify-end opacity-20 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-1.5 text-foreground-muted hover:text-foreground bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                      title={labels.editBtn}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className="p-1.5 text-foreground-muted hover:text-danger bg-transparent hover:bg-danger/10 rounded-md transition-colors"
                      title={labels.deleteBtn}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
