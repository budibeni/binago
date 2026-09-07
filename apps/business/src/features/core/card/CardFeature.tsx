'use client';

import React from 'react';
import { credentialService } from '@/data/core/card/services/credentialService';
import { AccessCredential } from './types/credential';
import { CardTable } from './components/CardTable';
import { CardForm } from './components/CardForm';
import type { DataTableFilterConfig } from '@adatrack/ui';

export function CardFeature() {
  const [data, setData] = React.useState<AccessCredential[]>([]);

  // Table state
  const [searchValue, setSearchValue] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: 'ALL',
    type: 'ALL',
  });

  // Form (edit-only)
  const [editCard, setEditCard] = React.useState<AccessCredential | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const loadData = React.useCallback(async () => {
    const result = await credentialService.getCredentials({
      search: searchValue,
      status: filterState.status as any,
      type: filterState.type as any,
    });
    setData(result);
  }, [searchValue, filterState]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = React.useCallback((card: AccessCredential) => {
    setEditCard(card);
    setIsFormOpen(true);
  }, []);

  const handleSave = React.useCallback(async (formData: Partial<AccessCredential>) => {
    if (!editCard?.id) return;
    await credentialService.saveCredential(formData as any, editCard.id);
    setIsFormOpen(false);
    setEditCard(null);
    await loadData();
  }, [editCard, loadData]);

  const handleCancel = React.useCallback(() => {
    setIsFormOpen(false);
    setEditCard(null);
  }, []);

  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: 'ALL', type: 'ALL' }),
    labels: { title: 'Filter Card', clearAll: 'Reset' },
    fields: [
      {
        id: 'status',
        label: 'Status',
        type: 'pills-single',
        options: [
          { value: 'ALL', label: 'Semua Status' },
          { value: 'ACTIVE', label: 'Aktif', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'INACTIVE', label: 'Tidak Aktif', colorClass: 'bg-neutral-400', activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground' },
        ],
      },
      {
        id: 'type',
        label: 'Jenis',
        type: 'pills-single',
        options: [
          { value: 'ALL', label: 'Semua Jenis' },
          { value: 'RFID', label: 'RFID', colorClass: 'bg-info', activeClass: 'bg-info/15 border-info/40 text-info' },
          { value: 'NFC', label: 'NFC', colorClass: 'bg-primary', activeClass: 'bg-primary/15 border-primary/40 text-primary' },
        ],
      },
    ],
  }), [filterState]);

  return (
    <div className="flex flex-col h-full w-full">

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        <CardTable
          data={data}
          onEdit={handleEdit}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
        />
      </div>

      {/* Edit Form (drawer) */}
      {(isFormOpen && !!editCard) && (
        <CardForm
          card={editCard}
          open={isFormOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false);
              setEditCard(null);
            }
          }}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

    </div>
  );
}
