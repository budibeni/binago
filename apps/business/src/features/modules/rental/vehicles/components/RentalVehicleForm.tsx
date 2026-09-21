'use client';

import React from 'react';
import { Button, Input, Label, FormShell, FormCard, InputSelect, InputDate, InputDecimal, InputString } from '@adatrack/ui';
import { CarFront, FileText, Settings, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalPricingCategory } from '../../pricing-category/types/pricing';
import type { RentalVehicle, RentalVehicleProfile, RentalEquipment, RentalStatus, RentalCondition } from '../types/rentalVehicle';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';

interface RentalVehicleFormProps {
  title: string;
  labels: Record<string, string>;
  initialData?: RentalVehicle;
  availableCoreVehicles?: Vehicle[];
  availablePricingCategory?: RentalPricingCategory[];
  availableRates?: import('@/features/modules/rental/pricing-category/types/pricing').RentalRate[];
  onCancel: () => void;
  onSave: (data: Omit<RentalVehicleProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
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
  const [vehicleId, setVehicleId] = React.useState(initialData?.vehicleId || '');
  const [status, setStatus] = React.useState<RentalStatus>(initialData?.status || 'READY');
  const [pricingType, setPricingType] = React.useState<'CATEGORY' | 'INDEPENDENT'>(initialData?.pricingType || 'INDEPENDENT');
  const [pricingCategoryId, setPricingCategoryId] = React.useState(initialData?.pricingCategoryId || '');
  const [dailyRate, setDailyRate] = React.useState(initialData?.dailyRate?.toString() || '');
  const [weeklyRate, setWeeklyRate] = React.useState(initialData?.weeklyRate?.toString() || '');
  const [monthlyRate, setMonthlyRate] = React.useState(initialData?.monthlyRate?.toString() || '');
  const [deposit, setDeposit] = React.useState(initialData?.deposit?.toString() || '');
  const [condition, setCondition] = React.useState<RentalCondition>(initialData?.condition || 'GOOD');
  const [startOdo, setStartOdo] = React.useState(initialData?.rentalStartOdometer?.toString() || '');
  const [currentOdo, setCurrentOdo] = React.useState(initialData?.currentOdometer?.toString() || '');
  const [notes, setNotes] = React.useState(initialData?.notes || '');
  const defaultEq = { stnk: false, bpkb: false, spareTire: false, jack: false, toolkit: false, firstAidKit: false, fireExtinguisher: false, carpet: false, audio: false };
  const [equipment, setEquipment] = React.useState<RentalEquipment>(initialData?.equipment || defaultEq);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSave({
        vehicleId,
        status,
        pricingType,
        pricingCategoryId: pricingType === 'CATEGORY' ? pricingCategoryId : undefined,
        dailyRate: pricingType === 'INDEPENDENT' ? (Number(dailyRate) || 0) : 0,
        weeklyRate: pricingType === 'INDEPENDENT' ? (Number(weeklyRate) || 0) : 0,
        monthlyRate: pricingType === 'INDEPENDENT' ? (Number(monthlyRate) || 0) : 0,
        deposit: Number(deposit) || 0,
        condition,
        currentOdometer: Number(currentOdo) || 0,
        rentalStartOdometer: Number(startOdo) || 0,
        notes,
        stnkExpiredAt: initialData?.stnkExpiredAt || '',
        taxExpiredAt: initialData?.taxExpiredAt || '',
        insuranceExpiredAt: initialData?.insuranceExpiredAt || '',
        equipment,
      });
      setIsSubmitting(false);
    }, 800);
  };

  const handleEqToggle = (key: keyof RentalEquipment) => {
    setEquipment(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCoreVehicle = isEdit ? initialData.coreVehicle : availableCoreVehicles.find(v => v.id === vehicleId);

  return (
    <FormShell
      onSubmit={handleSubmit}
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      subtitle="Lengkapi data kendaraan rental Anda"
      onCancel={onCancel}
      cancelProps={{ disabled: isSubmitting }}
      saveText={isSubmitting ? 'Menyimpan...' : 'Simpan'}
      saveProps={{ disabled: isSubmitting || !vehicleId }}
      isSubmitting={isSubmitting}
    >
      <div className="w-full max-w-6xl mx-auto p-4 lg:p-6 flex flex-col gap-4 lg:gap-5">

        <div className={cn("grid gap-4 lg:gap-5 items-start", (layout === 'fullscreen' || layout === 'default') ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
          {/* Kolom Kiri */}
          <div className="flex flex-col gap-4 lg:gap-5">

            {/* Core Info Card */}
            <FormCard
              title={labels.sectionVehicleData}
              description={labels.sectionVehicleDataDesc}
              icon={<CarFront className="w-5 h-5 text-danger" />}
            >

              {!isEdit && (
                <div>
                  <InputSelect
                    id="vehicleId"
                    label={labels.fieldSelectVehicle}
                    value={vehicleId}
                    onChange={(v) => setVehicleId(v)}
                    options={availableCoreVehicles.map(v => ({ value: v.id, label: `${v.plateNumber} - ${v.brand} ${v.vehicleName}` }))}
                    required
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
                    <span className="text-[11px] text-muted-foreground">{labels.fieldGrup}</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.groupName || '-'}</p>
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
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldTahun}</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.year || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldWarna}</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.color || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldBahanBakar}</span>
                    <p className="font-semibold text-sm capitalize">{selectedCoreVehicle.fuelType || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldNoStnk}</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.stnkNumber || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">{labels.fieldBerlakuStnk}</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.registrationExpiry || '-'}</p>
                  </div>
                </div>
              )}

            </FormCard>

            {/* Kelengkapan Card */}
            <FormCard
              title={labels.sectionEquipmentTitle}
              description={labels.sectionEquipmentDesc}
              icon={<ShieldCheck className="w-5 h-5 text-danger" />}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'stnk', label: labels.equipStnk },
                  { id: 'bpkb', label: labels.equipBpkb },
                  { id: 'spareTire', label: labels.equipSpareTire },
                  { id: 'jack', label: labels.equipJack },
                  { id: 'toolkit', label: labels.equipToolkit },
                  { id: 'firstAidKit', label: labels.equipFirstAid },
                  { id: 'fireExtinguisher', label: labels.equipFireExtinguisher },
                  { id: 'carpet', label: labels.equipCarpet },
                  { id: 'audio', label: labels.equipAudio }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2.5 px-3 min-h-[42px] border rounded-lg cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50",
                      equipment[item.id as keyof RentalEquipment]
                        ? "bg-danger/5 border-danger/40"
                        : "border-border/60"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={equipment[item.id as keyof RentalEquipment]}
                      onChange={() => handleEqToggle(item.id as keyof RentalEquipment)}
                      className="rounded border-neutral-300 text-danger accent-red-600 focus:ring-danger w-4 h-4 shrink-0"
                    />
                    <span className="text-xs font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </FormCard>

          </div>

          {/* Kolom Kanan */}
          <div className="flex flex-col gap-4 lg:gap-5">

            {/* Rental Config Card */}
            <FormCard
              title={labels.sectionRentalData}
              description={labels.sectionRentalDataDesc}
              icon={<Settings className="w-5 h-5 text-danger" />}
              className="h-full"
            >

              <div className={cn("grid gap-x-4 gap-y-4", (layout === 'fullscreen' || layout === 'default') ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
                <div className="sm:col-span-2">
                  {(() => {
                    const isSystemManaged = status === 'RESERVED' || status === 'RENTED';
                    return (
                      <div className="flex flex-col gap-1">
                        <InputSelect
                          id="status"
                          label={labels.fieldRentalStatus}
                          value={status}
                          onChange={(v) => setStatus(v as RentalStatus)}
                          disabled={isSystemManaged}
                          options={[
                            { value: 'READY', label: labels.statusReady },
                            { value: 'RESERVED', label: labels.statusReserved },
                            { value: 'RENTED', label: labels.statusRented },
                            { value: 'MAINTENANCE', label: labels.statusMaintenance },
                            { value: 'UNAVAILABLE', label: labels.statusUnavailable }
                          ]}
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
                    );
                  })()}
                </div>

                <div className="sm:col-span-2">
                  <div className="flex flex-col gap-1.5 mb-2">
                    <Label className="text-xs font-semibold">{labels.pricingLabel}</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => setPricingType('CATEGORY')}
                        className={cn(
                          "flex-1 py-2.5 px-3 border rounded-lg text-[12px] font-medium transition-colors text-center",
                          pricingType === 'CATEGORY'
                            ? "bg-danger/10 text-danger border-danger"
                            : "bg-background text-foreground hover:bg-muted border-border"
                        )}
                      >
                        {labels.pricingCategory}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingType('INDEPENDENT')}
                        className={cn(
                          "flex-1 py-2.5 px-3 border rounded-lg text-[12px] font-medium transition-colors text-center",
                          pricingType === 'INDEPENDENT'
                            ? "bg-danger/10 text-danger border-danger"
                            : "bg-background text-foreground hover:bg-muted border-border"
                        )}
                      >
                        {labels.pricingIndependent}
                      </button>
                    </div>
                  </div>
                </div>

                {pricingType === 'CATEGORY' ? (
                  <div className="sm:col-span-2 flex flex-col gap-3">
                    <InputSelect
                      id="pricingCategoryId"
                      label={labels.fieldPricingCategoryId}
                      value={pricingCategoryId}
                      onChange={setPricingCategoryId}
                      options={availablePricingCategory.map(g => ({ value: g.id, label: g.name }))}
                      required={pricingType === 'CATEGORY'}
                    />
                    {pricingCategoryId && (() => {
                      const cat = availablePricingCategory.find(c => c.id === pricingCategoryId);
                      if (!cat) return null;
                      const catRates = availableRates.filter(r => r.pricingCategoryId === pricingCategoryId && r.status === 'ACTIVE');
                      const daily = catRates.find(r => r.rateType === 'DAILY');
                      const weekly = catRates.find(r => r.rateType === 'WEEKLY');
                      const monthly = catRates.find(r => r.rateType === 'MONTHLY');
                      const fmt = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
                      return (
                        <div className="bg-gray-100 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-3">
                          <div className="flex flex-col gap-0.5 mb-3">
                            <span className="text-[11px] text-muted-foreground">Kategori Terpilih</span>
                            <p className="font-semibold text-sm">{cat.name}</p>
                            {cat.description && <p className="text-[11px] text-muted-foreground">{cat.description}</p>}
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
                    <div>
                      <InputDecimal
                        id="dailyRate"
                        label={labels.fieldDailyRateRp}
                        value={dailyRate ? Number(dailyRate) : null}
                        onChange={(v) => setDailyRate(v !== null ? String(v) : '')}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <InputDecimal
                        id="weeklyRate"
                        label={labels.fieldWeeklyRateRp}
                        value={weeklyRate ? Number(weeklyRate) : null}
                        onChange={(v) => setWeeklyRate(v !== null ? String(v) : '')}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <InputDecimal
                        id="monthlyRate"
                        label={labels.fieldMonthlyRateRp}
                        value={monthlyRate ? Number(monthlyRate) : null}
                        onChange={(v) => setMonthlyRate(v !== null ? String(v) : '')}
                        placeholder="0"
                      />
                    </div>
                  </>
                )}

                {/* Deposit - selalu tampil */}
                <div className="sm:col-span-2">
                  <InputDecimal
                    id="deposit"
                    label={labels.fieldDepositRp}
                    value={deposit ? Number(deposit) : null}
                    onChange={(v) => setDeposit(v !== null ? String(v) : '')}
                    placeholder="0"
                  />
                </div>

              </div>
            </FormCard>

            {/* Catatan Card */}
            <FormCard
              title={labels.sectionNotes}
              description={labels.sectionNotesDesc}
              icon={<FileText className="w-5 h-5 text-danger" />}
            >
              <InputString
                id="notes"
                label=""
                value={notes}
                onChange={(v) => setNotes(v)}
                placeholder={labels.notesPlaceholder}
                maxLength={500}
                helpText={`${notes.length} / 500`}
              />
            </FormCard>

          </div>
        </div>

      </div>
    </FormShell>
  );
}
