'use client';

import React from 'react';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getPricingCategoryTranslation } from './i18n';
import { pricingService } from '@/data/modules/rental/services/pricingService';
import { useRouter } from 'next/navigation';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';

import type { RentalPricingCategory, RentalRate } from './types/pricing';
import { PricingCategoryTable, type EnrichedPricingCategory } from './components/PricingCategoryTable';
import { PricingCategoryForm, type PricingCategoryFormData } from './components/PricingCategoryForm';
import { PricingCategoryView } from './components/PricingCategoryView';
import { PricingCategoryAssignmentForm } from './components/PricingCategoryAssignmentForm';
import type { VehiclePricingSelection } from '@/data/modules/rental/services/pricingService';
import { Button, Card, toast, ConfirmDialog } from '@adatrack/ui';
import type { DataTableFilterConfig } from '@adatrack/ui';
import { Plus } from 'lucide-react';
import type { RateType } from '../bookings/types/booking';
import { formatNumber } from '@adatrack/utils';


export function PricingCategoryFeature() {
  const locale = useBusinessLocale();
  const labels = getPricingCategoryTranslation(locale);

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
  
  const [selectedGroup, setSelectedGroup] = React.useState<EnrichedPricingCategory | undefined>();
  const [deleteGroup, setDeleteGroup] = React.useState<EnrichedPricingCategory | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<EnrichedPricingCategory | null>(null);
  const editingRates = React.useMemo(() => {
    if (!editingCategory) return [];
    return pricingService.getRatesByGroupId(editingCategory.id);
  }, [editingCategory, dataVersion]);

  const [selectedRates, setSelectedRates] = React.useState<{ rateType: RateType, amount: number }[]>([]);
  const [selectedVehicles, setSelectedVehicles] = React.useState<any[]>([]);
  const [availableVehicles, setAvailableVehicles] = React.useState<VehiclePricingSelection[]>([]);

  React.useEffect(() => {
    const rawGroups = pricingService.getPricingCategory();
    let enriched = rawGroups.map(g => {
      const assignments = pricingService.getAssignedVehicles(g.id);
      const rates = pricingService.getRatesByGroupId(g.id);
      return {
        ...g,
        vehicleCount: assignments.length,
        rates
      };
    });

    if (filterState.status && filterState.status.length > 0) {
      enriched = enriched.filter(g => filterState.status.includes(g.status));
    }

    setGroups(enriched);
  }, [dataVersion, filterState]);

  const router = useRouter();

  const handleAdd = () => {
    window.history.pushState(null, '', '/rental/pricing-category/create');
    setEditingCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (group: EnrichedPricingCategory) => {
    window.history.pushState(null, '', `/rental/pricing-category/edit`);
    setEditingCategory(group);
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
    const group = groups.find(g => g.id === id);
    if (group) {
      setDeleteGroup(group);
      setDeleteOpen(true);
    }
  };

  const handleConfirmDelete = (id: string) => {
    pricingService.deletePricingCategory(id);
    setDataVersion(v => v + 1);
    setDetailOpen(false);
    setDeleteOpen(false);
    toast.success(labels.deleteSuccess);
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
    
    toast.success('Daftar kendaraan berhasil diperbarui');
    
    // Refresh detail drawer silently
    if (selectedGroup) {
      setTimeout(() => handleDetail(selectedGroup as any), 100);
    }
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    if (selectedGroup) {
      pricingService.removeVehicleFromGroup(vehicleId, selectedGroup.id);
      setDataVersion(v => v + 1);
      toast.success('Kendaraan dikeluarkan dari kategori');
      setTimeout(() => handleDetail(selectedGroup as any), 100);
    }
  };


  const handleSubmitForm = (formData: PricingCategoryFormData) => {
    const rates = [
      { rateType: 'DAILY' as RateType, amount: formData.dailyRate },
      { rateType: 'WEEKLY' as RateType, amount: formData.weeklyRate },
      { rateType: 'MONTHLY' as RateType, amount: formData.monthlyRate },
    ];

    if (editingCategory) {
      pricingService.updatePricingCategory(editingCategory.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status
      }, rates);
      toast.success(labels.updateSuccess);
    } else {
      pricingService.createPricingCategory({
        code: formData.name.substring(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-4),
        name: formData.name,
        description: formData.description || '',
        defaultDeposit: formData.defaultDeposit || 0,
        status: formData.status || 'ACTIVE'
      }, rates);
      toast.success(labels.createSuccess);
    }

    window.history.pushState(null, '', '/rental/pricing-category');
    setFormOpen(false);
    setEditingCategory(null);
    setDataVersion(v => v + 1);
  };

  const handleCloseForm = (open: boolean) => {
    if (!open) {
      window.history.pushState(null, '', '/rental/pricing-category');
      setEditingCategory(null);
    }
    setFormOpen(open);
  };

  const filterConfig: DataTableFilterConfig = React.useMemo(() => ({
    state: filterState,
    onStateChange: setFilterState,
    onClearAll: () => setFilterState({ status: [] }),
    labels: {
      title: 'Filter',
      clearAll: labels.clearFilters,
    },
    fields: [
      {
        id: 'status',
        label: labels.filterStatus,
        type: 'pills-single',
        options: [
          { value: 'ACTIVE', label: labels.statusActive, colorClass: 'bg-success', activeClass: 'bg-success/15 border-success/40 text-success' },
          { value: 'INACTIVE', label: labels.statusInactive, colorClass: 'bg-neutral-400', activeClass: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-400 text-foreground' },
        ],
      },
    ],
  }), [filterState, locale]);

  const dtLabels = React.useMemo(() => {
    const isEn = locale === 'en';
    return {
      paginationShowing: (from: number, to: number, total: number) => isEn
        ? `Showing ${from}-${to} of ${total.toLocaleString('en-US')} items`
        : `Menampilkan ${from}-${to} dari ${formatNumber(total)} data`,
      paginationPerPage: isEn ? '/ page' : '/ halaman',
      toolbarFilter: isEn ? 'Filter' : 'Filter',
      toolbarColumns: isEn ? 'Columns' : 'Kolom',
      toolbarExport: isEn ? 'Export' : 'Ekspor',
    };
  }, [locale]);

  const toolbarActions = (
    <Button onClick={handleAdd} size="sm" variant="destructive" className="h-8 gap-1.5 text-[12px] font-medium shadow-none">
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
        onOpenChange={handleCloseForm}
        initialData={editingCategory || undefined}
        initialRates={editingRates}
        title={editingCategory ? labels.formEditTitle : labels.formAddTitle}
        onSubmit={handleSubmitForm}
        layout="drawer"
        labels={labels as any}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Kategori Tarif"
        description={
          <div className="flex flex-col">
            <span>Apakah Anda yakin ingin menghapus Kategori Tarif ini? Semua kendaraan di dalamnya akan dikeluarkan dari kategori.</span>
            <div className="mt-3 text-center">
              <strong className="text-danger text-[15px]">{deleteGroup?.name}</strong>
            </div>
          </div>
        }
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
        onConfirm={() => {
          if (deleteGroup) handleConfirmDelete(deleteGroup.id);
        }}
        variant="danger"
      />

      <PricingCategoryView
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
        labels={labels as any}
      />

      <PricingCategoryAssignmentForm
        open={assignmentOpen}
        onOpenChange={setAssignmentOpen}
        groupId={selectedGroup?.id || ''}
        groupName={selectedGroup?.name || ''}
        availableVehicles={availableVehicles}
        onSave={handleSaveAssignment}
      />
    </div>
  );
}
