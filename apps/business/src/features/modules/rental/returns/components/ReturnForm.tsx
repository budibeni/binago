'use client';

import React from 'react';
import { Button, Checkbox, Label, FormShell, FormCard, InputString, InputNumber, InputDecimal, InputDateTime, InputTextarea } from '@adatrack/ui';
import { MapPin, Car, Gauge, Fuel, CheckSquare, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import type { RentalContract } from '../../contracts/types/contract';
import type { RentalHandover } from '../../handover/types/handover';
import type { RentalReturn } from '../types/return';

interface ReturnFormProps {
  contract: RentalContract;
  handover: RentalHandover;
  onSubmit: (data: Omit<RentalReturn, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FUEL_LEVELS: RentalHandover['fuelLevel'][] = ['EMPTY', 'QUARTER', 'HALF', 'THREE_QUARTER', 'FULL'];

const FUEL_LABELS: Record<string, string> = {
  EMPTY: 'Kosong',
  QUARTER: '1/4',
  HALF: '1/2',
  THREE_QUARTER: '3/4',
  FULL: 'Penuh',
};

const getConditionLabel = (c: string) => {
  if (c === 'GOOD') return 'Baik';
  if (c === 'MINOR_DAMAGE') return 'Kerusakan Ringan';
  return 'Perlu Perbaikan';
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

export function ReturnForm({ contract, handover, onSubmit, onCancel, isSubmitting, layout = 'default', open, onOpenChange }: ReturnFormProps) {
  const [returnedAt, setReturnedAt] = React.useState(
    new Date().toISOString().slice(0, 16)
  );

  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [address, setAddress] = React.useState('');
  const [isLocating, setIsLocating] = React.useState(false);

  const [odometerEnd, setOdometerEnd] = React.useState<number>(handover.odometerStart);
  const [odometerError, setOdometerError] = React.useState('');

  const [fuelLevelEnd, setFuelLevelEnd] = React.useState<RentalHandover['fuelLevel']>('HALF');
  const [vehicleConditionEnd, setVehicleConditionEnd] = React.useState<RentalHandover['vehicleCondition']>('GOOD');

  const [equipmentEnd, setEquipmentEnd] = React.useState<RentalHandover['equipmentChecklist']>({
    ...handover.equipmentChecklist,
  });

  const [hasDamage, setHasDamage] = React.useState(false);
  const [damageNotes, setDamageNotes] = React.useState('');

  const [lateFee, setLateFee] = React.useState(0);
  const [damageFee, setDamageFee] = React.useState(0);
  const [additionalCharges, setAdditionalCharges] = React.useState(0);

  const [notes, setNotes] = React.useState('');

  // Computed
  const distanceUsed = Math.max(0, odometerEnd - handover.odometerStart);

  const returnDateTime = new Date(returnedAt);
  const endDate = new Date(contract.endDate);
  const lateMs = returnDateTime.getTime() - endDate.getTime();
  const lateHours = lateMs > 0 ? Math.ceil(lateMs / (1000 * 60 * 60)) : 0;

  const totalCharges = lateFee + damageFee + additionalCharges;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsLocating(false);
      },
      () => {
        alert('Tidak dapat mengambil lokasi. Pastikan izin lokasi telah diberikan.');
        setIsLocating(false);
      }
    );
  };

  const handleOdometerChange = (val: number) => {
    setOdometerEnd(val);
    if (val < handover.odometerStart) {
      setOdometerError(`Odometer akhir tidak boleh lebih kecil dari odometer awal (${handover.odometerStart.toLocaleString('id-ID')} KM).`);
    } else {
      setOdometerError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      alert('Lokasi pengembalian wajib diambil terlebih dahulu.');
      return;
    }
    if (odometerEnd < handover.odometerStart) {
      alert('Odometer akhir tidak boleh lebih kecil dari odometer awal.');
      return;
    }

    onSubmit({
      contractId: contract.id,
      customerId: contract.customerId,
      vehicleId: contract.vehicleId,
      returnedAt: new Date(returnedAt).toISOString(),
      returnLatitude: latitude,
      returnLongitude: longitude,
      returnAddress: address,
      odometerEnd,
      fuelLevelEnd,
      vehicleConditionEnd,
      equipmentChecklistEnd: equipmentEnd,
      damageNotes: hasDamage ? damageNotes : '',
      additionalCharges: totalCharges,
      lateFee,
      damageFee,
      notes,
      staffId: 'usr-001',
      staffName: 'Admin',
    });
  };

  const coreVehicle = contract.vehicle?.coreVehicle;

  return (
    <form onSubmit={handleSubmit} className="w-full h-full relative">
      <FormShell
        layout={layout}
        open={open}
        onOpenChange={onOpenChange}
        onCancel={onCancel}
        cancelProps={{ disabled: isSubmitting }}
        saveText={isSubmitting ? 'Menyimpan...' : 'Simpan Pengembalian'}
        saveProps={{ disabled: isSubmitting || !!odometerError }}
        isSubmitting={isSubmitting}
      >
        <div className="space-y-6">

      {/* SECTION 1: Contract Info */}
      <FormCard title="Informasi Kontrak" icon={<Car className="w-5 h-5 text-primary" />}>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">No. Kontrak</p>
            <p className="text-sm font-bold">{contract.contractNumber}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Pelanggan</p>
            <p className="text-sm font-bold">{contract.customer?.name || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Kendaraan</p>
            <p className="text-sm font-bold">{coreVehicle?.brand} {coreVehicle?.vehicleName}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Nomor Polisi</p>
            <p className="text-sm font-bold">{coreVehicle?.plateNumber || '-'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Tanggal Mulai</p>
            <p className="text-sm">{formatDate(contract.startDate)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Jatuh Tempo</p>
            <p className="text-sm font-bold text-danger">{formatDate(contract.endDate)}</p>
          </div>
        </div>
      </FormCard>

      {/* SECTION 2: Waktu & Lokasi */}
      <FormCard title="Waktu & Lokasi Pengembalian" icon={<MapPin className="w-5 h-5 text-primary" />}>
        <div className="p-4 space-y-4">
          <div>
            <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">
              Tanggal & Waktu Pengembalian
            </Label>
            <input
              type="datetime-local"
              value={returnedAt}
              onChange={(e) => setReturnedAt(e.target.value)}
              className="w-full sm:w-64 rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {lateHours > 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Terlambat {lateHours} jam dari jatuh tempo
              </p>
            )}
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              {isLocating ? 'Mengambil lokasi...' : 'Ambil Lokasi Saat Ini'}
            </Button>
          </div>

          {(latitude || longitude) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputString
                  id="latitude"
                  label="Latitude"
                  value={latitude !== null ? String(latitude) : ''}
                  onChange={() => {}}
                  readOnly
                  className="bg-neutral-50 dark:bg-neutral-900/50"
                />
              </div>
              <div>
                <InputString
                  id="longitude"
                  label="Longitude"
                  value={longitude !== null ? String(longitude) : ''}
                  onChange={() => {}}
                  readOnly
                  className="bg-neutral-50 dark:bg-neutral-900/50"
                />
              </div>
              <div className="col-span-2">
                <InputTextarea
                  id="address"
                  label="Alamat (Opsional)"
                  value={address}
                  onChange={setAddress}
                  placeholder="Masukkan alamat pengembalian"
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>
      </FormCard>

      {/* SECTION 3: Odometer */}
      <FormCard title="Odometer" icon={<Gauge className="w-5 h-5 text-primary" />}>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-border">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Odometer Awal (Serah Terima)</p>
            <p className="text-2xl font-bold">{handover.odometerStart.toLocaleString('id-ID')}</p>
            <p className="text-xs text-muted-foreground">KM</p>
          </div>
          <div>
            <InputNumber
              id="odometerEnd"
              label="Odometer Akhir (KM)"
              value={odometerEnd}
              onChange={(val) => handleOdometerChange(val || 0)}
              min={handover.odometerStart}
              error={odometerError}
              required
            />
          </div>
          <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Jarak Tempuh</p>
            <p className="text-2xl font-bold text-primary">{distanceUsed.toLocaleString('id-ID')}</p>
            <p className="text-xs text-muted-foreground">KM</p>
          </div>
        </div>
      </FormCard>

      {/* SECTION 4: BBM */}
      <FormCard title="Bahan Bakar" icon={<Fuel className="w-5 h-5 text-primary" />}>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground w-32 shrink-0">BBM Saat Serah Terima:</span>
            <span className="font-bold text-sm">{FUEL_LABELS[handover.fuelLevel]}</span>
          </div>
          <div>
            <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-2 block">BBM Saat Pengembalian</Label>
            <div className="flex flex-wrap gap-2">
              {FUEL_LEVELS.map(lvl => (
                <Button
                  key={lvl}
                  type="button"
                  variant={fuelLevelEnd === lvl ? 'primary' : 'outline'}
                  onClick={() => setFuelLevelEnd(lvl)}
                >
                  {FUEL_LABELS[lvl]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </FormCard>

      {/* SECTION 5: Kondisi */}
      <FormCard title="Kondisi Kendaraan" icon={<Car className="w-5 h-5 text-primary" />}>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-border">
            <span className="text-[10px] uppercase font-bold text-muted-foreground w-32 shrink-0">Kondisi Awal:</span>
            <span className="font-bold text-sm">{getConditionLabel(handover.vehicleCondition)}</span>
          </div>
          <div>
            <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-2 block">Kondisi Saat Pengembalian</Label>
            <div className="flex flex-wrap gap-2">
              {(['GOOD', 'MINOR_DAMAGE', 'NEEDS_REPAIR'] as const).map(cond => (
                <Button
                  key={cond}
                  type="button"
                  variant={vehicleConditionEnd === cond ? 'primary' : 'outline'}
                  className={vehicleConditionEnd === cond ? (
                    cond === 'GOOD' ? 'bg-success hover:bg-success/90' :
                    cond === 'MINOR_DAMAGE' ? 'bg-amber-500 hover:bg-amber-600' :
                    'bg-danger hover:bg-danger/90'
                  ) : ''}
                  onClick={() => setVehicleConditionEnd(cond)}
                >
                  {getConditionLabel(cond)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </FormCard>

      {/* SECTION 6: Checklist */}
      <FormCard title="Kelengkapan Kendaraan" icon={<CheckSquare className="w-5 h-5 text-primary" />}>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.keys(equipmentEnd).map((key) => {
              if (key === 'other') return null;
              const wasAvailable = (handover.equipmentChecklist as any)[key];
              return (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={`ret-eq-${key}`}
                    checked={(equipmentEnd as any)[key]}
                    onCheckedChange={(c) => setEquipmentEnd({ ...equipmentEnd, [key]: c === true })}
                  />
                  <Label htmlFor={`ret-eq-${key}`} className="text-sm capitalize cursor-pointer">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                    {!wasAvailable && (
                      <span className="ml-1 text-xs text-amber-500">(tidak ada saat serah terima)</span>
                    )}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </FormCard>

      {/* SECTION 7: Kerusakan */}
      <FormCard title="Kerusakan" icon={<AlertTriangle className="w-5 h-5 text-primary" />}>
        <div className="p-4 space-y-4">
          <div className="flex gap-3">
            <Label className="text-sm font-medium">Ada kerusakan baru?</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={!hasDamage ? 'primary' : 'outline'}
                onClick={() => setHasDamage(false)}
              >
                Tidak
              </Button>
              <Button
                type="button"
                variant={hasDamage ? 'primary' : 'outline'}
                className={hasDamage ? 'bg-danger hover:bg-danger/90' : ''}
                onClick={() => setHasDamage(true)}
              >
                Ya
              </Button>
            </div>
          </div>
          {hasDamage && (
            <div>
              <InputTextarea
                id="damageNotes"
                label="Deskripsi Kerusakan"
                value={damageNotes}
                onChange={setDamageNotes}
                placeholder="Contoh: Bemper depan sebelah kanan tergores."
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>
      </FormCard>

      {/* SECTION 8: Biaya Tambahan */}
      <FormCard title="Biaya Tambahan" icon={<DollarSign className="w-5 h-5 text-primary" />}>
        <div className="p-4 space-y-4">
          {lateHours > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
              Pengembalian terlambat <strong>{lateHours} jam</strong>. Harap masukkan biaya keterlambatan.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <InputDecimal
                id="lateFee"
                label="Biaya Keterlambatan (Rp)"
                value={lateFee}
                onChange={(val) => setLateFee(val !== null ? val : 0)}
                prefixIcon={<span className="text-muted-foreground text-sm font-medium">Rp</span>}
                min={0}
              />
            </div>
            <div>
              <InputDecimal
                id="damageFee"
                label="Biaya Kerusakan (Rp)"
                value={damageFee}
                onChange={(val) => setDamageFee(val !== null ? val : 0)}
                prefixIcon={<span className="text-muted-foreground text-sm font-medium">Rp</span>}
                min={0}
              />
            </div>
            <div>
              <InputDecimal
                id="additionalCharges"
                label="Biaya Lainnya (Rp)"
                value={additionalCharges}
                onChange={(val) => setAdditionalCharges(val !== null ? val : 0)}
                prefixIcon={<span className="text-muted-foreground text-sm font-medium">Rp</span>}
                min={0}
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-border">
            <span className="text-sm font-bold">Total Biaya Tambahan</span>
            <span className="text-lg font-bold text-primary">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalCharges)}
            </span>
          </div>
        </div>
      </FormCard>

      {/* Summary Card */}
      <FormCard title="Ringkasan Pengembalian" className="bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-sm">
        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Odometer Awal</span>
            <span className="font-medium">{handover.odometerStart.toLocaleString('id-ID')} KM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Odometer Akhir</span>
            <span className="font-medium">{odometerEnd.toLocaleString('id-ID')} KM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jarak Tempuh</span>
            <span className="font-bold text-primary">{distanceUsed.toLocaleString('id-ID')} KM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Keterlambatan</span>
            <span className={lateHours > 0 ? 'font-bold text-amber-500' : 'font-medium'}>{lateHours > 0 ? `${lateHours} jam` : 'Tepat waktu'}</span>
          </div>
          <div className="flex justify-between col-span-2 border-t border-primary/20 pt-2 mt-1">
            <span className="text-muted-foreground">Total Biaya Tambahan</span>
            <span className="font-bold text-danger">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalCharges)}</span>
          </div>
        </div>
      </FormCard>

      {/* Notes */}
      <FormCard title="Catatan">
        <div className="p-4">
          <InputTextarea
            id="notes"
            value={notes}
            onChange={setNotes}
            placeholder="Catatan tambahan terkait pengembalian (opsional)"
            className="min-h-[80px]"
          />
        </div>
      </FormCard>
        </div>
      </FormShell>
    </form>
  );
}
