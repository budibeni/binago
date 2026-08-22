import React, { useState } from 'react';
import { cn } from '@adatrack/utils';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { GroupData } from '../data/mockGroupsData';

export interface GroupDataTableProps {
  groups: GroupData[];
  locale: 'id' | 'en';
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

export function GroupDataTable({ groups, locale, labels }: GroupDataTableProps) {
  const [search, setSearch] = useState('');

  const filteredGroups = React.useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.description.toLowerCase().includes(q)
    );
  }, [groups, search]);

  return (
    <div className="flex flex-col h-full bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-danger/50 transition-shadow text-foreground placeholder:text-foreground-muted"
          />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-danger text-danger-foreground text-sm font-semibold rounded-lg hover:bg-danger/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {labels.addBtn}
        </button>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-800/80 backdrop-blur-md text-foreground-muted text-xs font-semibold uppercase tracking-wider z-10 border-b border-border shadow-sm">
            <tr>
              <th className="px-4 py-3 font-semibold">{labels.nameCol}</th>
              <th className="px-4 py-3 font-semibold">{labels.descCol}</th>
              <th className="px-4 py-3 font-semibold">{labels.memberCountCol}</th>
              <th className="px-4 py-3 font-semibold text-right">{labels.actionCol}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {filteredGroups.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-foreground-muted">
                  Tidak ada grup ditemukan.
                </td>
              </tr>
            ) : (
              filteredGroups.map((group) => (
                <tr 
                  key={group.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group/row"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {group.name}
                  </td>
                  <td className="px-4 py-3 text-foreground-subtle max-w-[300px] truncate">
                    {group.description}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger">
                      {group.memberCount} unit
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover/row:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 text-foreground-muted hover:text-danger bg-surface hover:bg-danger/10 rounded-md transition-colors"
                        title={labels.editBtn}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 text-foreground-muted hover:text-danger bg-surface hover:bg-danger/10 rounded-md transition-colors"
                        title={labels.deleteBtn}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
