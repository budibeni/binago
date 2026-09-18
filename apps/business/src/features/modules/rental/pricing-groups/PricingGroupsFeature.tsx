'use client';

import React from 'react';
import { getTranslation } from '@/i18n';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { pricingService } from '@/data/modules/rental/services/pricingService';
import { rentalVehicleService } from '@/data/modules/rental/services/vehicleService';

import type { RentalPricingGroup, RentalRate } from './types/pricing';
import { PricingGroupTable, type EnrichedPricingGroup } from './components/PricingGroupTable';
import { PricingGroupForm, type PricingGroupFormData } from './components/PricingGroupForm';
import { PricingGroupDetailDrawer } from './components/PricingGroupDetailDrawer';
import { PricingVehicleAssignmentDialog } from './components/PricingVehicleAssignmentDialog';
import { PricingVehicleCustomRateDialog } from './components/PricingVehicleCustomRateDialog';
import type { VehiclePricingSelection } from '@/data/modules/rental/services/pricingService';
import { Button, Card } from '@adatrack/ui';
import { Plus } from 'lucide-react';
import type { RateType } from '../reservations/types/reservation';

export function PricingGroupsFeature() {
  const locale = useBusinessLocale();
  const t = getTranslation(locale);
  // Using some standard labels or adding specific ones if they don't exist
  const labels = (t as any).pricingGroups || {
    title: 'Grup Tarif',
    pageSubtitle: 'Kelola master tarif penyewaan kendaraan',
    addBtn: 'Tambah',
    searchPlaceholder: 'Cari grup tarif...',
    actionDetail: 'Detail',
    actionEdit: 'Edit',
    formAddTitle: 'Tambah Grup Tarif Baru',
    formEditTitle: 'Edit Grup Tarif'
  };

  const [dataVersion, setDataVersion] = React.useState(0);
  
  // Data State
  const [groups, setGroups] = React.useState<EnrichedPricingGroup[]>([]);
  
  // UI State
  const [formOpen, setFormOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [assignmentOpen, setAssignmentOpen] = React.useState(false);
  const [customRateOpen, setCustomRateOpen] = React.useState(false);
  
  const [selectedGroup, setSelectedGroup] = React.useState<RentalPricingGroup | undefined>();
  const [selectedOverrideVehicleId, setSelectedOverrideVehicleId] = React.useState<string | undefined>();
  const [selectedRates, setSelectedRates] = React.useState<{ rateType: RateType, amount: number }[]>([]);
  const [selectedVehicles, setSelectedVehicles] = React.useState<any[]>([]);
  const [availableVehicles, setAvailableVehicles] = React.useState<VehiclePricingSelection[]>([]);

  React.useEffect(() => {
    const rawGroups = pricingService.getPricingGroups();
    const enriched = rawGroups.map(g => {
      const assignments = pricingService.getAssignedVehicles(g.id);
      return {
        ...g,
        vehicleCount: assignments.length
      };
    });
    setGroups(enriched);
  }, [dataVersion]);

  const handleAdd = () => {
    setSelectedGroup(undefined);
    setSelectedRates([]);
    setFormOpen(true);
  };

  const handleEdit = (group: EnrichedPricingGroup) => {
    const rates = pricingService.getRatesByGroupId(group.id);
    setSelectedGroup(group);
    setSelectedRates(rates.map(r => ({ rateType: r.rateType, amount: r.amount })));
    setFormOpen(true);
  };

  const handleDetail = (group: EnrichedPricingGroup) => {
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
    if (confirm('Apakah Anda yakin ingin menghapus Grup Tarif ini? Semua kendaraan di dalamnya akan dikeluarkan dari grup.')) {
      pricingService.deletePricingGroup(id);
      setDataVersion(v => v + 1);
      setDetailOpen(false);
    }
  };

  const handleOpenAssignment = async () => {
    if (!selectedGroup) return;
    const selections = await pricingService.getAvailableVehiclesForPricingGroup(selectedGroup.id);
    setAvailableVehicles(selections);
    setAssignmentOpen(true);
  };

  const handleSaveAssignment = (vehicleIds: string[]) => {
    if (!selectedGroup) return;
    pricingService.updatePricingGroupVehicles(selectedGroup.id, vehicleIds);
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

  const handleSubmitForm = (formData: PricingGroupFormData) => {
    const rates = [
      { rateType: 'DAILY' as RateType, amount: formData.dailyRate },
      { rateType: 'WEEKLY' as RateType, amount: formData.weeklyRate },
      { rateType: 'MONTHLY' as RateType, amount: formData.monthlyRate },
    ];

    if (selectedGroup) {
      pricingService.updatePricingGroup(selectedGroup.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status
      }, rates);
    } else {
      pricingService.createPricingGroup({
        name: formData.name,
        description: formData.description,
        status: formData.status
      }, rates);
    }

    setFormOpen(false);
    setDataVersion(v => v + 1);
  };

  const toolbarActions = (
    <Button onClick={handleAdd} size="sm" variant="destructive" className="h-8 gap-1.5 text-[13px] font-medium shadow-none">
      <Plus className="h-3.5 w-3.5" />
      <span className="hidden sm:inline-block">{labels.addBtn}</span>
    </Button>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 min-h-0 overflow-y-auto p-0">
        <PricingGroupTable 
          data={groups}
          labels={labels as any}
          toolbarActions={toolbarActions}
          onEdit={handleEdit}
          onDetail={handleDetail}
        />
      </div>

      <PricingGroupForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={selectedGroup}
        initialRates={selectedRates}
        onSubmit={handleSubmitForm}
        title={selectedGroup ? labels.formEditTitle : labels.formAddTitle}
      />

      <PricingGroupDetailDrawer
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
