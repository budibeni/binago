'use client';

import React from 'react';
import { getPersonelTranslation } from './i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { personelService } from '@/data/core/access/personel/services/personelService';
import { PersonelTable } from './components/PersonelTable';
import { PersonelView } from './components/PersonelView';
import { PersonelForm } from './components/PersonelForm';
import type { Personel, PersonelStatusFilter, PersonelTypeFilter } from './types/personel';

export function PersonelFeature() {
  const locale = useBusinessLocale();
  const tP = getPersonelTranslation(locale);

  // --- State -------------------------------------------------------------------
  const [search, setSearch] = React.useState('');
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({
    status: 'all',
    type: 'all',
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const statusFilter = filterState.status as PersonelStatusFilter;
  const typeFilter = filterState.type as PersonelTypeFilter;

  const [detailPersonel, setDetailPersonel] = React.useState<Personel | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editPersonel, setEditPersonel] = React.useState<Personel | null>(null);

  // Default filter configuration
  const filterConfig = React.useMemo(() => ({
    fields: [
      {
        id: 'status',
        label: tP.filterStatus,
        type: 'pills-single' as const,
        options: [
          { value: 'all', label: tP.tabs.all },
          { value: 'active', label: tP.status.active },
          { value: 'inactive', label: tP.status.inactive },
        ]
      },
      {
        id: 'type',
        label: tP.filterType,
        type: 'pills-single' as const,
        options: [
          { value: 'all', label: tP.tabs.all },
          { value: 'CHECKER', label: tP.types.CHECKER },
          { value: 'MECHANIC', label: tP.types.MECHANIC },
          { value: 'STAFF', label: tP.types.STAFF },
          { value: 'MANAGEMENT', label: tP.types.MANAGEMENT },
          { value: 'OTHER', label: tP.types.OTHER },
        ]
      }
    ],
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: 'all', type: 'all' }),
    labels: { clearAll: tP.clearFilters }
  }), [tP, filterState]);

  // --- Filtered Data -----------------------------------------------------------
  const filteredPersonel = React.useMemo(() => {
    return personelService.getPersonel(search, statusFilter, typeFilter).map((p) => {
      // Translate the type for display
      const translatedType = tP.types[p.personelType] || p.personelType;
      return { ...p, personelType: translatedType as any };
    });
  }, [search, statusFilter, typeFilter, tP]);

  // --- Handlers ----------------------------------------------------------------
  const handleViewDetail = React.useCallback((personel: Personel) => {
    setDetailPersonel(personel);
    setDrawerOpen(true);
  }, []);

  const handleEdit = React.useCallback((personel: Personel) => {
    setDrawerOpen(false);
    setEditPersonel(personel);
  }, []);

  const handleDelete = React.useCallback((personel: Personel) => {
    personelService.deletePersonel(personel.id);
    setDrawerOpen(false);
    setDetailPersonel(null);
  }, []);

  const handleAdd = React.useCallback(() => {
    setIsFormOpen(true);
  }, []);

  // --- Configs -----------------------------------------------------------------
  const tableLabels = React.useMemo(() => ({
    colPersonel: tP.table.colPersonel,
    colContact: tP.table.colContact,
    colIdentity: tP.table.colIdentity,
    colStatus: tP.table.colStatus,
    colType: tP.table.colType,
    colActions: tP.table.colActions,
    statusActive: tP.status.active,
    statusInactive: tP.status.inactive,
    emptyTitle: tP.table.emptyTitle,
    emptyDescription: tP.table.emptyDescription,
    noResultTitle: tP.table.noResultTitle,
    noResultDescription: tP.table.noResultDescription,
    searchPlaceholder: tP.searchPlaceholder,
    addPersonel: tP.addPersonel,
    exportFilename: tP.exportFilename,
    actionDetail: tP.actions.detail,
    actionEdit: tP.actions.edit,
    actionDelete: tP.actions.delete,
    phone: tP.labels.phone,
    nik: tP.labels.nik,
    noCard: tP.labels.noCard,
  }), [tP]);

  const drawerLabels = React.useMemo(() => ({
    title: tP.drawer.title,
    close: tP.drawer.close,
    tabInfo: tP.drawer.tabInfo,
    actionEdit: tP.actions.edit,
    actionDelete: tP.actions.delete,
    name: tP.labels.name,
    type: tP.labels.type,
    nik: tP.labels.nik,
    phone: tP.labels.phone,
    email: tP.labels.email,
    address: tP.labels.address,
    card: tP.labels.card,
    status: tP.labels.status,
    notes: tP.labels.notes,
    noCard: tP.labels.noCard,
    statusActive: tP.status.active,
    statusInactive: tP.status.inactive,
  }), [tP]);

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 md:p-6 items-center overflow-hidden">
      
      <div className="w-full h-full min-h-0 relative">
        <PersonelTable
          data={filteredPersonel}
          labels={tableLabels}
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          searchValue={search}
          onSearchChange={setSearch}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
        />
      </div>

      <PersonelView
        personel={detailPersonel}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={() => detailPersonel && handleEdit(detailPersonel)}
        onDelete={() => detailPersonel && handleDelete(detailPersonel)}
        labels={drawerLabels}
      />

      {(isFormOpen || !!editPersonel) && (
        <PersonelForm
          layout="default"
          open={isFormOpen || !!editPersonel}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormOpen(false);
              setEditPersonel(null);
            }
          }}
          personel={editPersonel}
          onCancel={() => {
            setIsFormOpen(false);
            setEditPersonel(null);
          }}
          onSave={(data) => {
            if (editPersonel) {
              personelService.updatePersonel(editPersonel.id, data);
            } else {
              personelService.createPersonel(data as any);
            }
            setIsFormOpen(false);
            setEditPersonel(null);
          }}
        />
      )}
    </div>
  );
}
