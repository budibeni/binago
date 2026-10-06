'use client';

import React from 'react';
import { Button, Input, Label, FormShell, FormCard, InputSelect, InputDecimal, InputString, InputTextarea, InputMultiCheckbox, InputOptions, useFormShell } from '@adatrack/ui';
import { CarFront, FileText, Settings, ShieldCheck } from 'lucide-react';
import { cn, formatCurrency } from '@adatrack/utils';
import type { RentalPricingCategory, RentalRate } from '../../pricing-category/types/pricing';
import { getRentalVehicleFormSchema, type RentalVehicleFormValues, type RentalVehicle, type RentalStatus, type RentalCondition } from '../types/rentalVehicle';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';

interface RentalVehicleFormProps {
  title: string;
  labels: Record<string, any>;
  initialData?: RentalVehicle;
  availableCoreVehicles?: Vehicle[];
  availablePricingCategory?: RentalPricingCategory[];
  availableRates?: RentalRate[];
  onCancel: () => void;
  onSave: (data: RentalVehicleFormValues) => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RentalVehicleForm({
  title,
  labels,
  initialData,
  availableCoreVehicles = [],
  availablePricingCategory = [],
  availableRates = [],
  onCancel,
  onSave,
  layout = 'default',
  open,
  onOpenChange,
}: RentalVehicleFormProps) {

  const isEdit = !!initialData;
  const schema = getRentalVehicleFormSchema(labels);
  
  const [vehicleId, setVehicleId] = React.useState(initialData?.vehicleId || '');
  const [categoryId, setCategoryId] = React.useState(initialData?.categoryId || '');
  const [status, setStatus] = React.useState<RentalStatus>(initialData?.status || 'READY');
  const [currentOdometer, setCurrentOdometer] = React.useState(initialData?.currentOdometer || 0);
  const [pricingType, setPricingType] = React.useState<'CATEGORY' | 'INDEPENDENT'>((initialData?.categoryId) ? 'CATEGORY' : 'INDEPENDENT');
  const [rateOverrideDaily, setRateOverrideDaily] = React.useState(initialData?.rateOverrideDaily || null);
  const [rateOverrideWeekly, setRateOverrideWeekly] = React.useState(initialData?.rateOverrideWeekly || null);
  const [rateOverrideMonthly, setRateOverrideMonthly] = React.useState(initialData?.rateOverrideMonthly || null);
  const [condition, setCondition] = React.useState<RentalCondition>(initialData?.condition || 'GOOD');
  const [conditionNotes, setConditionNotes] = React.useState(initialData?.conditionNotes || '');
  const [checklist, setChecklist] = React.useState<string[]>(() => {
    const init = initialData?.completenessChecklist || {
      stnkOriginal: false,
      spareKey: false,
      jackAndTools: false,
      spareTire: false,
      firstAidKit: false,
    };
    const list: string[] = [];
    if (init.stnkOriginal) list.push('stnkOriginal');
    if (init.spareKey) list.push('spareKey');
    if (init.jackAndTools) list.push('jackAndTools');
    if (init.spareTire) list.push('spareTire');
    if (init.firstAidKit) list.push('firstAidKit');
    return list;
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const selectedCoreVehicle = isEdit ? initialData.coreVehicle : availableCoreVehicles.find(v => v.id === vehicleId);
  const isSystemManaged = status === 'RESERVED' || status === 'RENTED';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    const formData = {
      vehicleId,
      categoryId: categoryId || null,
      status,
      currentOdometer,
      pricingType,
      rateOverrideDaily,
      rateOverrideWeekly,
      rateOverrideMonthly,
      condition,
      conditionNotes,
      completenessChecklist: {
        stnkOriginal: checklist.includes('stnkOriginal'),
        spareKey: checklist.includes('spareKey'),
        jackAndTools: checklist.includes('jackAndTools'),
        spareTire: checklist.includes('spareTire'),
        firstAidKit: checklist.includes('firstAidKit'),
      }
    };

    const result = schema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      for (const err of result.error.issues) {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      }
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      onSave(result.data);
      setIsSubmitting(false);
    }, 500);
  };



  return (
    <FormShell
      onSubmit={handleSubmit}
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      subtitle={labels.sectionVehicleDataDesc}
      onCancel={onCancel}
      cancelProps={{ disabled: isSubmitting }}
      saveText={isSubmitting ? 'Menyimpan...' : 'Simpan'}
      saveProps={{ disabled: isSubmitting || !vehicleId }}
      isSubmitting={isSubmitting}
    >
      <RentalVehicleFormContent 
        {...{ isEdit, vehicleId, setVehicleId, availableCoreVehicles, selectedCoreVehicle, labels, 
              checklist, setChecklist, pricingType, setPricingType, categoryId, 
              setCategoryId, availablePricingCategory, isSystemManaged, status, setStatus, 
              currentOdometer, setCurrentOdometer, rateOverrideDaily, setRateOverrideDaily, 
              rateOverrideWeekly, setRateOverrideWeekly, rateOverrideMonthly, setRateOverrideMonthly, 
              condition, setCondition, conditionNotes, setConditionNotes, availableRates, errors }} 
      />
    </FormShell>
  );
}

function RentalVehicleFormContent(props: any) {
  const { isEdit, vehicleId, setVehicleId, availableCoreVehicles, selectedCoreVehicle, labels, 
          checklist, setChecklist, pricingType, setPricingType, categoryId, 
          setCategoryId, availablePricingCategory, isSystemManaged, status, setStatus, 
          currentOdometer, setCurrentOdometer, rateOverrideDaily, setRateOverrideDaily, 
          rateOverrideWeekly, setRateOverrideWeekly, rateOverrideMonthly, setRateOverrideMonthly, 
          condition, setCondition, conditionNotes, setConditionNotes, availableRates, errors } = props;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-6 flex flex-col gap-4 lg:gap-5">
      <div className="grid grid-cols-1 group-data-[layout=fullscreen]/form:lg:grid-cols-2 group-data-[layout=default]/form:lg:grid-cols-2 gap-4 lg:gap-5 items-start">
          {/* Kolom Kiri */}
          <div className="flex flex-col gap-4 lg:gap-5">
            {/* Core Info Card */}
            <FormCard
              title={labels.sectionVehicleData}
              description={labels.sectionVehicleDataDesc}
              icon={<CarFront className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
            >
              {!isEdit && (
                <div>
                  <InputSelect
                    id="vehicleId"
                    label={labels.fieldSelectVehicle}
                    value={vehicleId}
                    onChange={setVehicleId}
                    options={availableCoreVehicles.map((v: any) => ({ value: v.id, label: `${v.plateNumber} - ${v.brand} ${v.vehicleName}` }))}
                    required
                    error={errors.vehicleId}
                  />
                  {availableCoreVehicles.length === 0 && (
                    <p className="text-[11px] text-warning mt-1">{labels.noCoreVehicles}</p>
                  )}
                </div>
              )}

              {selectedCoreVehicle && (
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 bg-gray-100 dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldPlatNomor}</span>
                    <p className="font-semibold text-sm uppercase">{selectedCoreVehicle.plateNumber || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldMerk}</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.brand || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldAlias}</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.vehicleName || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldKategori}</span>
                    <p className="font-semibold text-sm capitalize">{selectedCoreVehicle.vehicleCategory || '-'}</p>
                  </div>
                </div>
              )}
            </FormCard>

            {/* Kelengkapan Card */}
            <FormCard
              title={labels.sectionEquipmentTitle}
              description={labels.sectionEquipmentDesc}
              icon={<ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
            >
              <div className="pt-2">
                <InputMultiCheckbox
                  id="checklist"
                  label=""
                  value={checklist}
                  onChange={setChecklist}
                  options={[
                    { value: 'stnkOriginal', label: labels.equipStnk },
                    { value: 'spareKey', label: labels.equipSpareKey },
                    { value: 'jackAndTools', label: labels.equipJackAndTools },
                    { value: 'spareTire', label: labels.equipSpareTire },
                    { value: 'firstAidKit', label: labels.equipFirstAid }
                  ]}
                />
              </div>
            </FormCard>

            <FormCard
              title={labels.sectionNotes}
              description={labels.sectionNotesDesc}
              icon={<FileText className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
            >
              <InputOptions
                id="condition"
                label={labels.colCondition || 'Kondisi'}
                value={condition}
                onChange={(v) => setCondition(v as RentalCondition)}
                options={[
                  { value: 'GOOD', label: 'Baik' },
                  { value: 'MINOR_DAMAGE', label: 'Rusak Ringan' },
                  { value: 'NEEDS_REPAIR', label: 'Butuh Perbaikan' },
                ]}
                layout="horizontal"
              />
              <InputTextarea
                id="conditionNotes"
                label="Catatan Kondisi"
                value={conditionNotes || ''}
                onChange={setConditionNotes}
                placeholder={labels.notesPlaceholder}
                maxLength={500}
                helpText={`${(conditionNotes || '').length} / 500`}
                rows={3}
              />
            </FormCard>
          </div>

          {/* Kolom Kanan */}
          <div className="flex flex-col gap-4 lg:gap-5">
            <FormCard
              title={labels.sectionRentalData}
              description={labels.sectionRentalDataDesc}
              icon={<Settings className="w-5 h-5 text-violet-500 dark:text-violet-400" />}
              className="h-full"
            >
              <div className="grid grid-cols-1 group-data-[layout=fullscreen]/form:sm:grid-cols-2 group-data-[layout=default]/form:sm:grid-cols-2 gap-x-4 gap-y-4">
                
                <div className="sm:col-span-2">
                  <div className="flex flex-col gap-1">
                    <InputSelect
                      id="status"
                      label={labels.fieldRentalStatus}
                      value={status}
                      onChange={(v) => setStatus(v as RentalStatus)}
                      disabled={isSystemManaged}
                      options={
                        isSystemManaged
                          ? [
                              { value: 'RESERVED', label: labels.statusReserved || 'Dipesan' },
                              { value: 'RENTED', label: labels.statusRented || 'Disewa' }
                            ].filter(o => o.value === status) // Only show the active one when disabled
                          : [
                              { value: 'READY', label: labels.statusReady || 'Tersedia' },
                              { value: 'MAINTENANCE', label: labels.statusMaintenance || 'Perawatan' },
                              { value: 'UNAVAILABLE', label: labels.statusUnavailable || 'Nonaktif' }
                            ]
                      }
                    />
                    {isSystemManaged ? (
                      <p className="text-[11px] text-warning flex items-center gap-1 mt-0.5">
                        <span>⚠</span> {labels.statusSystemManaged}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {labels.statusManualHint}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <InputDecimal
                    id="currentOdometer"
                    label={labels.fieldCurrentOdometer}
                    value={currentOdometer || null}
                    onChange={(v) => setCurrentOdometer(v || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-2">
                  <InputOptions
                    id="pricingType"
                    label={labels.pricingLabel}
                    value={pricingType}
                    onChange={(v) => {
                      setPricingType(v as 'CATEGORY' | 'INDEPENDENT');
                      if (v === 'INDEPENDENT') {
                        setCategoryId('');
                      }
                    }}
                    options={[
                      { value: 'CATEGORY', label: labels.pricingCategory, description: 'Gunakan tarif dari kategori' },
                      { value: 'INDEPENDENT', label: labels.pricingIndependent, description: 'Tentukan tarif khusus' },
                    ]}
                    layout="cards"
                  />
                </div>
                {pricingType === 'CATEGORY' ? (
                  <div className="sm:col-span-2 flex flex-col gap-3">
                    <InputSelect
                      id="categoryId"
                      label={labels.fieldPricingCategoryId}
                      value={categoryId || ''}
                      onChange={setCategoryId}
                      options={availablePricingCategory.map((g: any) => ({ value: g.id, label: g.name }))}
                      required={pricingType === 'CATEGORY'}
                      error={errors.categoryId}
                    />
                    {categoryId && (() => {
                      const cat = availablePricingCategory.find((c: any) => c.id === categoryId);
                      if (!cat) return null;
                      const catRates = availableRates.filter((r: any) => r.pricingCategoryId === categoryId && r.status === 'ACTIVE');
                      const daily = catRates.find((r: any) => r.rateType === 'DAILY');
                      const weekly = catRates.find((r: any) => r.rateType === 'WEEKLY');
                      const monthly = catRates.find((r: any) => r.rateType === 'MONTHLY');
                      const fmt = (n: number) => `${formatCurrency(n)}`;
                      return (
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
                          <div className="flex flex-col gap-0.5 mb-3">
                            <span className="text-[11px] text-muted-foreground">{labels.fieldPricingCategoryId}</span>
                            <p className="font-semibold text-sm">{cat.name}</p>
                          </div>
                          {catRates.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                              {daily && (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[11px] text-muted-foreground">{labels.fieldDailyRate}</span>
                                  <p className="font-semibold text-sm text-foreground">{fmt(daily.amount)}</p>
                                </div>
                              )}
                              {weekly && (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[11px] text-muted-foreground">{labels.fieldWeeklyRate}</span>
                                  <p className="font-semibold text-sm text-foreground">{fmt(weekly.amount)}</p>
                                </div>
                              )}
                              {monthly && (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-[11px] text-muted-foreground">{labels.fieldMonthlyRate}</span>
                                  <p className="font-semibold text-sm text-foreground">{fmt(monthly.amount)}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-muted-foreground italic">Belum ada tarif yang ditetapkan.</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <>
                    <InputDecimal
                      id="rateOverrideDaily"
                      label={labels.fieldDailyRateRp}
                      value={rateOverrideDaily}
                      onChange={setRateOverrideDaily}
                      placeholder="0"
                    />
                    <InputDecimal
                      id="rateOverrideWeekly"
                      label={labels.fieldWeeklyRateRp}
                      value={rateOverrideWeekly}
                      onChange={setRateOverrideWeekly}
                      placeholder="0"
                    />
                    <InputDecimal
                      id="rateOverrideMonthly"
                      label={labels.fieldMonthlyRateRp}
                      value={rateOverrideMonthly}
                      onChange={setRateOverrideMonthly}
                      placeholder="0"
                    />
                  </>
                )}
              </div>
            </FormCard>

          </div>
      </div>
    </div>
  );
}
