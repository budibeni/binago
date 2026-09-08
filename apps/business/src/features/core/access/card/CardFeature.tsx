'use client';

import React from 'react';
import { cardService } from '@/data/core/access/card/services/cardService';
import { driverService } from '@/data/services/driverService';
import { personelService } from '@/data/core/access/personel/services/personelService';
import { CardModel } from './types/card';
import { CardTable } from './components/CardTable';
import { CardForm } from './components/CardForm';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getCardTranslation } from './i18n';
import type { DataTableFilterConfig } from '@adatrack/ui';

export function CardFeature() {
  const locale = useBusinessLocale();
  const t = getCardTranslation(locale);
  const [data, setData] = React.useState<CardModel[]>([]);

  // Table state
  const [searchValue, setSearchValue] = React.useState('');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: 'ALL',
    type: 'ALL',
  });

  // Form (edit-only)
  const [editCard, setEditCard] = React.useState<CardModel | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const activeAssignments = React.useMemo(() => {
    const set = new Set<string>();
    data.forEach(c => {
      if (c.status === 'ACTIVE' && c.holderId) set.add(c.holderId);
    });
    return set;
  }, [data]);

  const loadData = React.useCallback(async () => {
    const result = await cardService.getCredentials({
      search: searchValue,
      status: filterState.status as any,
      type: filterState.type as any,
    });

    const mapped = result.map((c) => {
      let holderName = t.form.unassigned;
      let holderSubtitle = '';

      if (c.holderType === 'DRIVER' && c.holderId) {
        const d = driverService.getDriverById(c.holderId);
        holderName = d ? d.name : 'Unknown Driver';
        holderSubtitle = t.form.valDriver;
      } else if (c.holderType === 'PERSONEL' && c.holderId) {
        const p = personelService.getPersonelById(c.holderId);
        holderName = p ? p.name : 'Unknown Personel';
        holderSubtitle = p ? p.personelType : t.form.valPersonel;
      }

      return {
        ...c,
        holderName,
        holderSubtitle,
      };
    });

    setData(mapped);
  }, [searchValue, filterState, t]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = React.useCallback((card: CardModel) => {
    setEditCard(card);
    setIsFormOpen(true);
  }, []);

  const handleSave = React.useCallback(async (formData: Partial<CardModel>) => {
    if (!editCard?.id) return;
    await cardService.saveCredential(formData as any, editCard.id);
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
    labels: { title: t.filter.title, clearAll: t.filter.clearAll },
    fields: [
      {
        id: 'status',
        label: t.filter.status,
        type: 'pills-single',
        options: [
          { value: 'ALL', label: t.filter.allStatus },
          { value: 'ACTIVE', label: t.filter.active, colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'INACTIVE', label: t.filter.inactive, colorClass: 'bg-neutral-400', activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground' },
        ],
      },
      {
        id: 'type',
        label: t.filter.type,
        type: 'pills-single',
        options: [
          { value: 'ALL', label: t.filter.allType },
          { value: 'RFID', label: 'RFID', colorClass: 'bg-info', activeClass: 'bg-info/15 border-info/40 text-info' },
          { value: 'NFC', label: 'NFC', colorClass: 'bg-primary', activeClass: 'bg-primary/15 border-primary/40 text-primary' },
        ],
      },
    ],
  }), [filterState, t]);

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
          t={t}
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
          activeAssignments={activeAssignments}
          t={t}
        />
      )}

    </div>
  );
}
