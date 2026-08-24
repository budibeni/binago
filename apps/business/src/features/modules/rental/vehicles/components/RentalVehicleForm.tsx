'use client';

import React from 'react';
import { Button, Input, Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea } from '@adatrack/ui';
import { CarFront, FileText, Settings, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import type { RentalVehicle, RentalVehicleProfile, RentalEquipment, RentalStatus, RentalCondition } from '../types/rentalVehicle';
import type { Vehicle } from '@/features/core/vehicles/types/vehicle';

interface RentalVehicleFormProps {
  title: string;
  labels: Record<string, string>;
  initialData?: RentalVehicle;
  availableCoreVehicles?: Vehicle[];
  onCancel: () => void;
  onSave: (data: Omit<RentalVehicleProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function RentalVehicleForm({
  title,
  labels,
  initialData,
  availableCoreVehicles = [],
  onCancel,
  onSave,
}: RentalVehicleFormProps) {
  
  const isEdit = !!initialData;
  const [vehicleId, setVehicleId] = React.useState(initialData?.vehicleId || '');
  const [status, setStatus] = React.useState<RentalStatus>(initialData?.status || 'READY');
  const [dailyRate, setDailyRate] = React.useState(initialData?.dailyRate?.toString() || '');
  const [weeklyRate, setWeeklyRate] = React.useState(initialData?.weeklyRate?.toString() || '');
  const [monthlyRate, setMonthlyRate] = React.useState(initialData?.monthlyRate?.toString() || '');
  const [deposit, setDeposit] = React.useState(initialData?.deposit?.toString() || '');
  const [condition, setCondition] = React.useState<RentalCondition>(initialData?.condition || 'GOOD');
  const [startOdo, setStartOdo] = React.useState(initialData?.rentalStartOdometer?.toString() || '');
  const [currentOdo, setCurrentOdo] = React.useState(initialData?.currentOdometer?.toString() || '');
  const [notes, setNotes] = React.useState(initialData?.notes || '');
  const [stnkExpiry, setStnkExpiry] = React.useState(initialData?.stnkExpiredAt || '');
  const [taxExpiry, setTaxExpiry] = React.useState(initialData?.taxExpiredAt || '');
  const [insuranceExpiry, setInsuranceExpiry] = React.useState(initialData?.insuranceExpiredAt || '');
  
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
        dailyRate: Number(dailyRate) || 0,
        weeklyRate: Number(weeklyRate) || 0,
        monthlyRate: Number(monthlyRate) || 0,
        deposit: Number(deposit) || 0,
        condition,
        currentOdometer: Number(currentOdo) || 0,
        rentalStartOdometer: Number(startOdo) || 0,
        notes,
        stnkExpiredAt: stnkExpiry,
        taxExpiredAt: taxExpiry,
        insuranceExpiredAt: insuranceExpiry,
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
    <form onSubmit={handleSubmit} className="flex flex-col w-full h-full relative">
      <div className="w-full max-w-6xl mx-auto p-4 lg:p-6 pb-24 flex flex-col gap-4 lg:gap-5">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 items-start">
          {/* Kolom Kiri */}
          <div className="flex flex-col gap-4 lg:gap-5">

            {/* Core Info Card */}
            <div className="bg-background border border-border/60 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <CarFront className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Data Kendaraan</h2>
                  <p className="text-[11px] text-foreground-subtle mt-0.5 leading-relaxed">Data kendaraan dikelola di Master Data Armada. Informasi berikut bersifat read-only.</p>
                </div>
              </div>

              {!isEdit && (
                <div className="flex flex-col gap-1.5">
                  <Select value={vehicleId} onValueChange={setVehicleId} required>
                    <SelectTrigger className="h-9 text-sm text-muted-foreground"><SelectValue placeholder={labels.fieldSelectVehicle} /></SelectTrigger>
                    <SelectContent>
                    {availableCoreVehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.plateNumber} - {v.brand} {v.vehicleName}</SelectItem>
                    ))}
                    </SelectContent>
                  </Select>
                  {availableCoreVehicles.length === 0 && (
                    <p className="text-[11px] text-warning mt-1">{labels.noCoreVehicles}</p>
                  )}
                </div>
              )}

              {selectedCoreVehicle && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-3 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 rounded-xl border border-border/60">
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Plat Nomor</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.plateNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Merk</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.brand}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Model</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.vehicleName}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Tahun</span>
                    <p className="font-semibold text-sm">{selectedCoreVehicle.year}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Document Expire Card */}
            <div className="bg-background border border-border/60 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Dokumen Kendaraan</h2>
                  <p className="text-[11px] text-foreground-subtle mt-0.5 leading-relaxed">Masa berlaku dokumen legal kendaraan.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Masa Berlaku STNK</Label>
                  <Input type="date" value={stnkExpiry} onChange={e => setStnkExpiry(e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">Masa Berlaku Pajak</Label>
                  <Input type="date" value={taxExpiry} onChange={e => setTaxExpiry(e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">Masa Berlaku Asuransi</Label>
                  <Input type="date" value={insuranceExpiry} onChange={e => setInsuranceExpiry(e.target.value)} className="h-9 text-sm" />
                </div>
              </div>
            </div>

          </div>

          {/* Kolom Kanan */}
          <div className="flex flex-col gap-4 lg:gap-5">

            {/* Rental Config Card */}
            <div className="bg-background border border-border/60 rounded-2xl p-4 lg:p-5 flex flex-col gap-4 h-full">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Data Rental</h2>
                  <p className="text-[11px] text-foreground-subtle mt-0.5 leading-relaxed">Pengaturan tarif, status, kondisi, dan kilometer.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Status Rental</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as RentalStatus)}>
                    <SelectTrigger className="h-9 text-sm border-danger text-danger"><SelectValue placeholder="Pilih status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="READY">Ready / Tersedia</SelectItem>
                      <SelectItem value="RESERVED">Reserved / Dipesan</SelectItem>
                      <SelectItem value="RENTED">Disewa</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="UNAVAILABLE">Tidak Tersedia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">Tarif Harian</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                    <Input type="number" min="0" value={dailyRate} onChange={e => setDailyRate(e.target.value)} className="h-9 text-sm pl-9" placeholder="0" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">Deposit</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                    <Input type="number" min="0" value={deposit} onChange={e => setDeposit(e.target.value)} className="h-9 text-sm pl-9" placeholder="0" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">Tarif Mingguan</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                    <Input type="number" min="0" value={weeklyRate} onChange={e => setWeeklyRate(e.target.value)} className="h-9 text-sm pl-9" placeholder="0" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold">Tarif Bulanan</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                    <Input type="number" min="0" value={monthlyRate} onChange={e => setMonthlyRate(e.target.value)} className="h-9 text-sm pl-9" placeholder="0" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Kondisi</Label>
                  <Select value={condition} onValueChange={(v) => setCondition(v as RentalCondition)}>
                    <SelectTrigger className="h-9 text-sm border-danger text-danger"><SelectValue placeholder="Pilih kondisi" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GOOD">Baik</SelectItem>
                      <SelectItem value="MINOR_DAMAGE">Kerusakan Ringan</SelectItem>
                      <SelectItem value="NEEDS_REPAIR">Perlu Perbaikan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Kilometer Terakhir</Label>
                  <div className="flex gap-2">
                    <Input type="number" min="0" value={currentOdo} onChange={e => setCurrentOdo(e.target.value)} className="h-9 text-sm w-32" placeholder="15.000" />
                    <Button type="button" variant="outline" size="sm" className="h-9 text-[11px] px-3 whitespace-nowrap" onClick={() => setCurrentOdo('15000')}>Ambil dari odometer</Button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Catatan</Label>
                  <div className="relative">
                    <Input value={notes} onChange={e => setNotes(e.target.value)} className="h-10 text-sm pr-14" placeholder="Tulis catatan (opsional)" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{notes.length} / 500</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Equipment Card (Full Width at Bottom) */}
        <div className="bg-background border border-border/60 rounded-2xl p-4 lg:p-5 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Kelengkapan</h2>
              <p className="text-[11px] text-foreground-subtle mt-0.5 leading-relaxed">Checklist perlengkapan yang ada pada kendaraan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm mt-1 ml-[52px]">
            {/* Col 1 */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={equipment.stnk} onChange={() => handleEqToggle('stnk')} className="rounded border-muted-foreground/30 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors text-muted-foreground text-xs">STNK</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={equipment.spareTire} onChange={() => handleEqToggle('spareTire')} className="rounded border-muted-foreground/30 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors text-muted-foreground text-xs">Ban Cadangan</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={equipment.toolkit} onChange={() => handleEqToggle('toolkit')} className="rounded border-muted-foreground/30 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors text-muted-foreground text-xs">Toolkit</span>
              </label>
            </div>
            
            {/* Col 2 */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={equipment.fireExtinguisher} onChange={() => handleEqToggle('fireExtinguisher')} className="rounded border-muted-foreground/30 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors text-muted-foreground text-xs">APAR</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={equipment.jack} onChange={() => handleEqToggle('jack')} className="rounded border-muted-foreground/30 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors text-muted-foreground text-xs">Dongkrak</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={equipment.firstAidKit} onChange={() => handleEqToggle('firstAidKit')} className="rounded border-muted-foreground/30 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors text-muted-foreground text-xs">P3K</span>
              </label>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={equipment.bpkb} onChange={() => handleEqToggle('bpkb')} className="rounded border-muted-foreground/30 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors text-muted-foreground text-xs">BPKB</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={equipment.audio} onChange={() => handleEqToggle('audio')} className="rounded border-muted-foreground/30 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5" />
                <span className="group-hover:text-foreground transition-colors text-muted-foreground text-xs">Radio / Audio</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Full-Width Footer */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-40 flex items-center justify-between px-4 md:px-6 lg:px-8 py-3.5 bg-background border-t border-border/40 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          <span className="text-xs text-foreground-subtle mt-0.5">Lengkapi data armada rental Anda</span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting} className="bg-background">
            Batal
          </Button>
          <Button type="submit" variant="primary" size="sm" className="bg-danger hover:bg-danger/90 text-white min-w-[100px]" disabled={isSubmitting || !vehicleId}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </form>
  );
}
