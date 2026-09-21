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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-start">
          {/* Kolom Kiri */}
          <div className="flex flex-col gap-4 lg:gap-5">

            {/* Core Info Card */}
            <FormCard
              title="Data Kendaraan"
              description="Data kendaraan dikelola di Master Data Kendaraan. Informasi berikut bersifat read-only."
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
                    <span className="text-[11px] text-muted-foreground">Plat Nomor</span>
                    <p className="font-semibold text-sm uppercase">{selectedCoreVehicle.plateNumber || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">Grup</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.groupName || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">Merk</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.brand || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">Kendaraan (Alias)</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.vehicleName || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">Kategori</span>
                    <p className="font-semibold text-sm capitalize">{selectedCoreVehicle.vehicleCategory || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">Tahun</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.year || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">Warna</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.color || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">Bahan Bakar</span>
                    <p className="font-semibold text-sm capitalize">{selectedCoreVehicle.fuelType || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">No. STNK</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.stnkNumber || '-'}</p>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[11px] text-muted-foreground">Berlaku STNK</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.registrationExpiry || '-'}</p>
                  </div>
                </div>
              )}

              {/* Kelengkapan */}
              <div className="mt-6 border-t border-border/40 pt-5">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-foreground">Kelengkapan Kendaraan</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Ceklis perlengkapan yang tersedia di kendaraan ini.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'stnk', label: 'STNK' },
                    { id: 'bpkb', label: 'BPKB' },
                    { id: 'spareTire', label: 'Ban Cadangan' },
                    { id: 'jack', label: 'Dongkrak' },
                    { id: 'toolkit', label: 'Toolkit' },
                    { id: 'firstAidKit', label: 'P3K' },
                    { id: 'fireExtinguisher', label: 'APAR' },
                    { id: 'carpet', label: 'Karpet' },
                    { id: 'audio', label: 'Radio / Audio' }
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
              </div>

            </FormCard>

          </div>

          {/* Kolom Kanan */}
          <div className="flex flex-col gap-4 lg:gap-5">

            {/* Rental Config Card */}
            <FormCard
              title="Data Rental"
              description="Pengaturan tarif, status, kondisi, dan kilometer."
              icon={<Settings className="w-5 h-5 text-danger" />}
              className="h-full"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <div className="sm:col-span-2">
                  <InputSelect
                    id="status"
                    label="Status Rental"
                    value={status}
                    onChange={(v) => setStatus(v as RentalStatus)}
                    options={[
                      { value: 'READY', label: 'Ready / Tersedia' },
                      { value: 'RESERVED', label: 'Reserved / Dipesan' },
                      { value: 'RENTED', label: 'Disewa' },
                      { value: 'MAINTENANCE', label: 'Maintenance' },
                      { value: 'UNAVAILABLE', label: 'Tidak Tersedia' }
                    ]}
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex flex-col gap-1.5 mb-2">
                    <Label className="text-xs font-semibold">Pengaturan Tarif</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => setPricingType('CATEGORY')}
                        className={cn(
                          "flex-1 py-2.5 px-3 border rounded-lg text-[12px] font-medium transition-colors text-center",
                          pricingType === 'CATEGORY'
                            ? "bg-primary/10 text-primary border-primary"
                            : "bg-background text-foreground hover:bg-muted border-border"
                        )}
                      >
                        Tarif Kategori
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingType('INDEPENDENT')}
                        className={cn(
                          "flex-1 py-2.5 px-3 border rounded-lg text-[12px] font-medium transition-colors text-center",
                          pricingType === 'INDEPENDENT'
                            ? "bg-primary/10 text-primary border-primary"
                            : "bg-background text-foreground hover:bg-muted border-border"
                        )}
                      >
                        Tarif Mandiri (Kustom)
                      </button>
                    </div>
                  </div>
                </div>

                {pricingType === 'CATEGORY' ? (
                  <div className="sm:col-span-2">
                    <InputSelect
                      id="pricingCategoryId"
                      label="Pilih Kategori Tarif"
                      value={pricingCategoryId}
                      onChange={setPricingCategoryId}
                      options={availablePricingCategory.map(g => ({ value: g.id, label: g.name }))}
                      required={pricingType === 'CATEGORY'}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <InputDecimal
                        id="dailyRate"
                        label="Tarif Harian"
                        value={dailyRate ? Number(dailyRate) : null}
                        onChange={(v) => setDailyRate(v !== null ? String(v) : '')}
                        prefixIcon={<span className="text-muted-foreground text-sm font-medium">Rp</span>}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <InputDecimal
                        id="deposit"
                        label="Deposit"
                        value={deposit ? Number(deposit) : null}
                        onChange={(v) => setDeposit(v !== null ? String(v) : '')}
                        prefixIcon={<span className="text-muted-foreground text-sm font-medium">Rp</span>}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <InputDecimal
                        id="weeklyRate"
                        label="Tarif Mingguan"
                        value={weeklyRate ? Number(weeklyRate) : null}
                        onChange={(v) => setWeeklyRate(v !== null ? String(v) : '')}
                        prefixIcon={<span className="text-muted-foreground text-sm font-medium">Rp</span>}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <InputDecimal
                        id="monthlyRate"
                        label="Tarif Bulanan"
                        value={monthlyRate ? Number(monthlyRate) : null}
                        onChange={(v) => setMonthlyRate(v !== null ? String(v) : '')}
                        prefixIcon={<span className="text-muted-foreground text-sm font-medium">Rp</span>}
                        placeholder="0"
                      />
                    </div>
                  </>
                )}

                <div className="sm:col-span-2">
                  <InputSelect
                    id="condition"
                    label="Kondisi"
                    value={condition}
                    onChange={(v) => setCondition(v as RentalCondition)}
                    options={[
                      { value: 'GOOD', label: 'Baik' },
                      { value: 'MINOR_DAMAGE', label: 'Kerusakan Ringan' },
                      { value: 'NEEDS_REPAIR', label: 'Perlu Perbaikan' }
                    ]}
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Kilometer Terakhir</Label>
                  <div className="flex gap-2">
                    <Input type="number" min="0" value={currentOdo} onChange={e => setCurrentOdo(e.target.value)} className="h-9 text-sm w-32" placeholder="15.000" />
                    <Button type="button" variant="outline" size="sm" className="h-9 text-[11px] px-3 whitespace-nowrap" onClick={() => setCurrentOdo('15000')}>Ambil dari odometer</Button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <InputString
                    id="notes"
                    label="Catatan"
                    value={notes}
                    onChange={(v) => setNotes(v)}
                    placeholder="Tulis catatan (opsional)"
                    maxLength={500}
                    helpText={`${notes.length} / 500 karakter`}
                  />
                </div>
              </div>
            </FormCard>

          </div>
        </div>


      </div>
    </FormShell>
  );
}
