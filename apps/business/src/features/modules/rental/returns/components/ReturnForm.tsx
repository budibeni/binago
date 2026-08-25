'use client';

import React from 'react';
import { Card, Input, Button, Checkbox, Textarea, Label } from '@adatrack/ui';
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

export function ReturnForm({ contract, handover, onSubmit, onCancel, isSubmitting }: ReturnFormProps) {
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
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">

      {/* SECTION 1: Contract Info */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            Informasi Kontrak
          </h3>
        </div>
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
      </Card>

      {/* SECTION 2: Waktu & Lokasi */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Waktu & Lokasi Pengembalian
          </h3>
        </div>
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
                <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Latitude</Label>
                <Input value={latitude ?? ''} readOnly className="bg-neutral-50 dark:bg-neutral-900/50" />
              </div>
              <div>
                <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Longitude</Label>
                <Input value={longitude ?? ''} readOnly className="bg-neutral-50 dark:bg-neutral-900/50" />
              </div>
              <div className="col-span-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Alamat (Opsional)</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan alamat pengembalian"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 3: Odometer */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            Odometer
          </h3>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-border">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Odometer Awal (Serah Terima)</p>
            <p className="text-2xl font-bold">{handover.odometerStart.toLocaleString('id-ID')}</p>
            <p className="text-xs text-muted-foreground">KM</p>
          </div>
          <div>
            <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-2 block">Odometer Akhir (KM) *</Label>
            <Input
              type="number"
              min={handover.odometerStart}
              value={odometerEnd}
              onChange={(e) => handleOdometerChange(Number(e.target.value))}
              className={odometerError ? 'border-danger' : ''}
              required
            />
            {odometerError && (
              <p className="text-xs text-danger mt-1">{odometerError}</p>
            )}
          </div>
          <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Jarak Tempuh</p>
            <p className="text-2xl font-bold text-primary">{distanceUsed.toLocaleString('id-ID')}</p>
            <p className="text-xs text-muted-foreground">KM</p>
          </div>
        </div>
      </Card>

      {/* SECTION 4: BBM */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Fuel className="w-4 h-4 text-primary" />
            Bahan Bakar
          </h3>
        </div>
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
      </Card>

      {/* SECTION 5: Kondisi */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            Kondisi Kendaraan
          </h3>
        </div>
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
      </Card>

      {/* SECTION 6: Checklist */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            Kelengkapan Kendaraan
          </h3>
        </div>
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
      </Card>

      {/* SECTION 7: Kerusakan */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Kerusakan
          </h3>
        </div>
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
              <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-2 block">
                Deskripsi Kerusakan
              </Label>
              <Textarea
                value={damageNotes}
                onChange={(e) => setDamageNotes(e.target.value)}
                placeholder="Contoh: Bemper depan sebelah kanan tergores."
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 8: Biaya Tambahan */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Biaya Tambahan
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {lateHours > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-400">
              Pengembalian terlambat <strong>{lateHours} jam</strong>. Harap masukkan biaya keterlambatan.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Biaya Keterlambatan (Rp)</Label>
              <Input
                type="number"
                min={0}
                value={lateFee}
                onChange={(e) => setLateFee(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Biaya Kerusakan (Rp)</Label>
              <Input
                type="number"
                min={0}
                value={damageFee}
                onChange={(e) => setDamageFee(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Biaya Lainnya (Rp)</Label>
              <Input
                type="number"
                min={0}
                value={additionalCharges}
                onChange={(e) => setAdditionalCharges(Number(e.target.value))}
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
      </Card>

      {/* Summary Card */}
      <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-sm">
        <div className="bg-primary/10 dark:bg-primary/20 border-b border-primary/20 py-3 px-4">
          <h3 className="text-sm font-bold text-primary">Ringkasan Pengembalian</h3>
        </div>
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
      </Card>

      {/* Notes */}
      <Card className="bg-white dark:bg-neutral-900 border-border shadow-sm">
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-border py-3 px-4">
          <h3 className="text-sm font-bold">Catatan</h3>
        </div>
        <div className="p-4">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan tambahan terkait pengembalian (opsional)"
            className="min-h-[80px]"
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting || !!odometerError}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan Pengembalian'}
        </Button>
      </div>
    </form>
  );
}
