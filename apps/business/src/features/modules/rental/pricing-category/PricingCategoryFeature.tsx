'use client';

import React from 'react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { pricingService } from '@/data/modules/rental/services/pricingService';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';

import type { RentalPricingCategory, RentalRate } from './types/pricing';
import { PricingCategoryTable, type EnrichedPricingCategory } from './components/PricingCategoryTable';
import { PricingCategoryForm, type PricingCategoryFormData } from './components/PricingCategoryForm';
import { PricingCategoryDetailDrawer } from './components/PricingCategoryDetailDrawer';
import { PricingVehicleAssignmentDialog } from './components/PricingVehicleAssignmentDialog';
import { PricingVehicleCustomRateDialog } from './components/PricingVehicleCustomRateDialog';
import type { VehiclePricingSelection } from '@/data/modules/rental/services/pricingService';
import { Button, Card } from '@adatrack/ui';
import type { DataTableFilterConfig } from '@adatrack/ui';
import { Plus } from 'lucide-react';
import type { RateType } from '../reservations/types/reservation';

export function PricingCategoryFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  // Using some standard labels or adding specific ones if they don't exist
  const labels = (t as any).pricingCategorys || {
    title: locale === 'en' ? 'Pricing Category' : 'Kategori Tarif',
    pageSubtitle: locale === 'en' ? 'Manage rental pricing categories' : 'Kelola master tarif penyewaan kendaraan',
    addBtn: locale === 'en' ? 'Add' : 'Tambah',
    exportBtn: locale === 'en' ? 'Export' : 'Ekspor',
    searchPlaceholder: locale === 'en' ? 'Search pricing category...' : 'Cari kategori tarif...',
    actionDetail: locale === 'en' ? 'Detail' : 'Detail',
    actionEdit: locale === 'en' ? 'Edit' : 'Edit',
    formAddTitle: locale === 'en' ? 'Add New Pricing Category' : 'Tambah Kategori Tarif Baru',
    formEditTitle: locale === 'en' ? 'Edit Pricing Category' : 'Edit Kategori Tarif',
    headerName: locale === 'en' ? 'Pricing Category' : 'Kategori Tarif',
    headerDesc: locale === 'en' ? 'Description' : 'Deskripsi',
    headerVehicles: locale === 'en' ? 'Vehicles' : 'Kendaraan',
    headerStatus: locale === 'en' ? 'Status' : 'Status',
    statusActive: locale === 'en' ? 'Active' : 'Aktif',
    statusInactive: locale === 'en' ? 'Inactive' : 'Nonaktif',
    unit: locale === 'en' ? 'units' : 'unit',
  };

  const [dataVersion, setDataVersion] = React.useState(0);
  
  // Data State
  const [groups, setGroups] = React.useState<EnrichedPricingCategory[]>([]);
  
  // Filter State
  const [filterState, setFilterState] = React.useState<Record<string, string | string[]>>({ status: [] });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  
  // UI State
  const [formOpen, setFormOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [assignmentOpen, setAssignmentOpen] = React.useState(false);
  const [customRateOpen, setCustomRateOpen] = React.useState(false);
  
  const [selectedGroup, setSelectedGroup] = React.useState<RentalPricingCategory | undefined>();
  const [selectedOverrideVehicleId, setSelectedOverrideVehicleId] = React.useState<string | undefined>();
  const [selectedRates, setSelectedRates] = React.useState<{ rateType: RateType, amount: number }[]>([]);
  const [selectedVehicles, setSelectedVehicles] = React.useState<any[]>([]);
  const [availableVehicles, setAvailableVehicles] = React.useState<VehiclePricingSelection[]>([]);

  React.useEffect(() => {
    const rawGroups = pricingService.getPricingCategory();
    let enriched = rawGroups.map(g => {
      const assignments = pricingService.getAssignedVehicles(g.id);
      return {
        ...g,
        vehicleCount: assignments.length
      };
    });

    if (filterState.status && filterState.status.length > 0) {
      enriched = enriched.filter(g => filterState.status.includes(g.status));
    }

    setGroups(enriched);
  }, [dataVersion, filterState]);

  const handleAdd = () => {
    setSelectedGroup(undefined);
    setSelectedRates([]);
    setFormOpen(true);
  };

  const handleEdit = (group: EnrichedPricingCategory) => {
    const rates = pricingService.getRatesByGroupId(group.id);
    setSelectedGroup(group);
    setSelectedRates(rates.map(r => ({ rateType: r.rateType, amount: r.amount })));
    setFormOpen(true);
  };

  const handleDetail = (group: EnrichedPricingCategory) => {
    const rates = pricingService.getRatesByGroupId(group.id);
    const assignments = pricingService.getAssignedVehicles(group.id);
    
    // Resolve full vehicle details
    const vehiclesDetail = assignments.map(a => {
      const vehicle = rentalVehicleService.getRentalVehicleById(a.vehicleId);
      const overrides = pricingService.getVehicleOverrides(a.vehicleId);
      return {
        assignment: a,
        vehicle: vehicle!,
        overrides
      };
    }).filter(v => v.vehicle);

    setSelectedGroup(group);
    setSelectedRates(rates.map(r => ({ rateType: r.rateType, amount: r.amount })));
    setSelectedVehicles(vehiclesDetail);
    setDetailOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Kategori Tarif ini? Semua kendaraan di dalamnya akan dikeluarkan dari kategori.')) {
      pricingService.deletePricingCategory(id);
      setDataVersion(v => v + 1);
      setDetailOpen(false);
    }
  };

  const handleOpenAssignment = async () => {
    if (!selectedGroup) return;
    const selections = await pricingService.getAvailableVehiclesForPricingCategory(selectedGroup.id);
    setAvailableVehicles(selections);
    setAssignmentOpen(true);
  };

  const handleSaveAssignment = (vehicleIds: string[]) => {
    if (!selectedGroup) return;
    pricingService.updatePricingCategoryVehicles(selectedGroup.id, vehicleIds);
    setAssignmentOpen(false);
    setAssignmentOpen(false);
    
    // Refresh detail drawer silently
    if (selectedGroup) {
      setTimeout(() => handleDetail(selectedGroup as any), 100);
    }
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    if (selectedGroup) {
      pricingService.removeVehicleFromGroup(vehicleId, selectedGroup.id);
      setDataVersion(v => v + 1);
      setTimeout(() => handleDetail(selectedGroup as any), 100);
    }
  };

  const handleOpenManageOverride = (vehicleId: string) => {
    setSelectedOverrideVehicleId(vehicleId);
    setCustomRateOpen(true);
  };

  const handleSaveCustomRate = (vehicleId: string, rates: { rateType: RateType; amount: number }[]) => {
    // Save rates
    rates.forEach(r => pricingService.setVehicleOverride(vehicleId, r.rateType, r.amount));
    
    setDataVersion(v => v + 1);
    setCustomRateOpen(false);
    setSelectedOverrideVehicleId(undefined);

    // Refresh detail drawer to reflect removal of vehicle
    if (selectedGroup) {
      setTimeout(() => handleDetail(selectedGroup as any), 100);
    }
  };

  const handleSubmitForm = (formData: PricingCategoryFormData) => {
    const rates = [
      { rateType: 'DAILY' as RateType, amount: formData.dailyRate },
      { rateType: 'WEEKLY' as RateType, amount: formData.weeklyRate },
      { rateType: 'MONTHLY' as RateType, amount: formData.monthlyRate },
    ];

    if (selectedGroup) {
      pricingService.updatePricingCategory(selectedGroup.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status
      }, rates);
    } else {
      pricingService.createPricingCategory({
        name: formData.name,
        description: formData.description,
        status: formData.status
      }, rates);
    }

    setFormOpen(false);
    setDataVersion(v => v + 1);
  };

  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: [] }),
    labels: {
      title: 'Filter',
      clearAll: locale === 'en' ? 'Clear Filters' : 'Hapus Filter',
    },
    fields: [
      {
        id: 'status',
        label: 'Status',
        type: 'pills-single',
        options: [
          { value: 'ACTIVE', label: locale === 'en' ? 'Active' : 'Aktif', colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'INACTIVE', label: locale === 'en' ? 'Inactive' : 'Nonaktif', colorClass: 'bg-neutral-400', activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground' },
        ],
      },
    ],
  }), [filterState, locale]);

  const dtLabels = React.useMemo(() => {
    const isEn = locale === 'en';
    return {
      paginationShowing: (from: number, to: number, total: number) => isEn
        ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items`
        : `Menampilkan ${from}-${to} dari ${total.toLocaleString('id-ID')} data`,
      paginationPerPage: isEn ? '/ page' : '/ halaman',
      toolbarFilter: isEn ? 'Filter' : 'Filter',
      toolbarColumns: isEn ? 'Columns' : 'Kolom',
      toolbarExport: isEn ? 'Export' : 'Ekspor',
    };
  }, [locale]);

  const toolbarActions = (
    <Button onClick={handleAdd} size="sm" variant="destructive" className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
      <Plus className="h-3.5 w-3.5" />
      <span className="hidden sm:inline-block">{labels.addBtn}</span>
    </Button>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <PricingCategoryTable 
          data={groups}
          labels={labels as any}
          toolbarActions={toolbarActions}
          onEdit={handleEdit}
          onDetail={handleDetail}
          filterConfig={filterConfig}
          isFilterOpen={isFilterOpen}
          onFilterOpenChange={setIsFilterOpen}
          dtLabels={dtLabels}
        />
      </div>

      <PricingCategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={selectedGroup}
        initialRates={selectedRates}
        onSubmit={handleSubmitForm}
        title={selectedGroup ? labels.formEditTitle : labels.formAddTitle}
      />

      <PricingCategoryDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        group={selectedGroup}
        rates={selectedRates as RentalRate[]}
        vehicles={selectedVehicles}
        onEdit={() => {
          setDetailOpen(false);
          if (selectedGroup) handleEdit(selectedGroup as any);
        }}
        onDelete={() => {
          setDetailOpen(false);
          if (selectedGroup) handleDelete(selectedGroup.id);
        }}
        onAssignVehicle={handleOpenAssignment}
        onRemoveVehicle={handleRemoveVehicle}
      />

      <PricingVehicleAssignmentDialog
        open={assignmentOpen}
        onOpenChange={setAssignmentOpen}
        groupId={selectedGroup?.id || ''}
        groupName={selectedGroup?.name || ''}
        availableVehicles={availableVehicles}
        onSave={handleSaveAssignment}
      />

      {selectedOverrideVehicleId && (
        <PricingVehicleCustomRateDialog
          open={customRateOpen}
          onOpenChange={setCustomRateOpen}
          vehicleId={selectedOverrideVehicleId}
          initialRates={pricingService.getVehicleOverrides(selectedOverrideVehicleId)}
          onSave={handleSaveCustomRate}
        />
      )}
    </div>
  );
}
