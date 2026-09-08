'use client';

import React from 'react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getLogTranslation } from './i18n';
import { logService } from '@/data/core/access/log/services/logService';
import { CardLog, CardActivityType, CardLogStatus, HolderType } from './types/log';
import { LogTable } from './components/LogTable';
import type { DataTableFilterConfig } from '@adatrack/ui';

export default function LogFeature() {
  const locale = useBusinessLocale();
  const t = getLogTranslation(locale);

  // ─── Data State ─────────────────────────────────────────────────────────────
  const [allData, setAllData] = React.useState<CardLog[]>([]);

  // ─── Filter & Search State ───────────────────────────────────────────────────
  const [searchValue, setSearchValue] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    activity: 'ALL',
    status: 'ALL',
    holder: 'ALL',
  });

  // ─── Load Data ───────────────────────────────────────────────────────────────
  React.useEffect(() => {
    logService
      .getLogs({
        page: 1,
        limit: 1000, // load all, client-side filtering in table
        search: searchValue,
        activityType: filterState.activity as CardActivityType | 'ALL',
        status: filterState.status as CardLogStatus | 'ALL',
        holderType: filterState.holder as HolderType | 'ALL',
      })
      .then((r) => setAllData(r.items))
      .catch(console.error);
  }, [searchValue, filterState]);

  // ─── Filter Config ───────────────────────────────────────────────────────────
  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ activity: 'ALL', status: 'ALL', holder: 'ALL' }),
    labels: { title: 'Filter', clearAll: 'Reset' },
    fields: [
      {
        id: 'activity',
        label: t.columns.activity,
        type: 'pills-single' as const,
        options: [
          { value: 'ALL', label: t.activity.all },
          { value: 'ATTENDANCE', label: t.activity.attendance },
          { value: 'CHECKER', label: t.activity.checker },
          { value: 'ENGINE_AUTH', label: t.activity.engineAuth },
        ],
      },
      {
        id: 'status',
        label: t.columns.status,
        type: 'pills-single' as const,
        options: [
          { value: 'ALL', label: t.status.all },
          { value: 'SUCCESS', label: t.status.success },
          { value: 'FAILED', label: t.status.failed },
        ],
      },
      {
        id: 'holder',
        label: t.columns.holder,
        type: 'pills-single' as const,
        options: [
          { value: 'ALL', label: t.holder.all },
          { value: 'DRIVER', label: t.holder.driver },
          { value: 'PERSONEL', label: t.holder.personel },
        ],
      },
    ],
  }), [filterState, t]);

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6 overflow-hidden">
      <LogTable
        data={allData}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterConfig={filterConfig}
        isFilterOpen={isFilterOpen}
        onFilterOpenChange={setIsFilterOpen}
        t={t}
      />
    </div>
  );
}
