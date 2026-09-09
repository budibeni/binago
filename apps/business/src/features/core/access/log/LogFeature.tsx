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
    activity: '',
    status: '',
    holder: '',
  });

  // ─── Load Data ───────────────────────────────────────────────────────────────
  React.useEffect(() => {
    logService
      .getLogs({
        page: 1,
        limit: 1000,
        search: searchValue,
        activityType: (filterState.activity || 'ALL') as CardActivityType | 'ALL',
        status: (filterState.status || 'ALL') as CardLogStatus | 'ALL',
        holderType: (filterState.holder || 'ALL') as HolderType | 'ALL',
      })
      .then((r) => setAllData(r.items))
      .catch(console.error);
  }, [searchValue, filterState]);

  // ─── Filter Config ───────────────────────────────────────────────────────────
  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ activity: '', status: '', holder: '' }),
    labels: { title: 'Filter', clearAll: 'Reset' },
    fields: [
      {
        id: 'activity',
        label: t.columns.activity,
        type: 'pills-single' as const,
        options: [
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
          { value: 'SUCCESS', label: t.status.success },
          { value: 'FAILED', label: t.status.failed },
        ],
      },
      {
        id: 'holder',
        label: t.columns.holder,
        type: 'pills-single' as const,
        options: [
          { value: 'DRIVER', label: t.holder.driver },
          { value: 'PERSONEL', label: t.holder.personel },
        ],
      },
    ],
  }), [filterState, t]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <LogTable
          data={allData}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          t={t}
          exportFilename="log-card-adatrack"
          dtLabels={{
            paginationShowing: (from: number, to: number, total: number) => locale === 'en' ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items` : `Menampilkan ${from}-${to} dari ${total.toLocaleString('id-ID')} data`,
            paginationPerPage: locale === 'en' ? '/ page' : '/ halaman',
            toolbarFilter: 'Filter',
            toolbarColumns: locale === 'en' ? 'Columns' : 'Kolom',
            toolbarExport: locale === 'en' ? 'Export' : 'Ekspor',
            activeFilterClear: locale === 'en' ? 'Clear Filters' : 'Reset Filter',
            columnPanelHideAll: locale === 'en' ? 'Hide all' : 'Sembunyikan semua',
            columnPanelShowAll: locale === 'en' ? 'Show all' : 'Tampilkan semua',
            noResultTitle: locale === 'en' ? 'No results found' : 'Hasil Tidak Ditemukan',
            noResultDesc: locale === 'en' ? 'No data matches your search or filters.' : 'Tidak ada data yang sesuai.',
          }}
        />
      </div>
    </div>
  );
}
