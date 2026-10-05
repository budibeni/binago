'use client';

import React from 'react';
import { Button, FormShell, FormCard, InputNumber, InputSelect, InputTextarea, InputCheckbox, Label, InputDateTimeGps } from '@adatrack/ui';
import { Car, FileText, StickyNote, Receipt } from 'lucide-react';
import type { RentalContract } from '../../contracts/types/contract';
import type { RentalHandover } from '../../handover/types/handover';
import type { RentalReturn } from '../types/return';
import { cn, formatCurrency } from '@adatrack/utils';

interface ReturnFormProps {
  contract: RentalContract;
  handovers: RentalHandover[];
  onSubmit: (data: Omit<RentalReturn, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ReturnForm({ contract, handovers, onSubmit, onCancel, isSubmitting, layout = 'default', open, onOpenChange }: ReturnFormProps) {
  const [selectedHandoverIds, setSelectedHandoverIds] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>('');

  const isSingleVehicle = handovers.length === 1;

  React.useEffect(() => {
    if (handovers.length > 0 && !activeTab && selectedHandoverIds.length === 0) {
      setActiveTab(handovers[0].id);
      setSelectedHandoverIds(handovers.map(h => h.id));
    }
  }, [handovers, activeTab, selectedHandoverIds]);

  const [vehicleData, setVehicleData] = React.useState<Record<string, {
    returnedAt: string,
    latitude: number | null,
    longitude: number | null,
    address: string,
    odometerEnd: number | null,
    fuelLevelEnd: RentalHandover['fuelLevel'] | '',
    vehicleConditionEnd: RentalHandover['vehicleCondition'] | '',
    equipmentEnd: RentalHandover['equipmentChecklist'],
    damageNotes: string,
    damageFee: number,
    lateFee: number,
    additionalCharges: number,
  }>>({});

  React.useEffect(() => {
    setVehicleData(prev => {
      const newData = { ...prev };
      handovers.forEach(h => {
        if (!newData[h.id]) {
          // Default to current time, formatted for input type="datetime-local"
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          const defaultReturnedAt = now.toISOString().slice(0, 16);

          newData[h.id] = {
            returnedAt: defaultReturnedAt,
            latitude: null,
            longitude: null,
            address: '',
            odometerEnd: null,
            fuelLevelEnd: '',
            vehicleConditionEnd: '',
            equipmentEnd: h.equipmentChecklist ? { ...h.equipmentChecklist } : {
              stnk: false,
              spareTire: false,
              jack: false,
              toolkit: false,
              triangle: false,
              fireExtinguisher: false,
            },
            damageNotes: '',
            damageFee: 0,
            lateFee: 0,
            additionalCharges: 0,
          };
        }
      });
      return newData;
    });
  }, [handovers]);


  const [notes, setNotes] = React.useState('');
  const [globalAdditionalFee, setGlobalAdditionalFee] = React.useState<number>(0);
  const [globalDiscount, setGlobalDiscount] = React.useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHandoverIds.length === 0) {
      alert('Pilih minimal satu kendaraan untuk dikembalikan.');
      return;
    }

    for (const id of selectedHandoverIds) {
      const data = vehicleData[id];
      const hnd = handovers.find(h => h.id === id);
      if (!hnd) continue;

      if (!data.latitude || !data.longitude) {
        alert(`Lokasi pengembalian wajib diambil untuk kendaraan ${hnd.vehicle?.coreVehicle?.plateNumber || ''}.`);
        return;
      }
      if (data.odometerEnd === null || data.fuelLevelEnd === '' || data.vehicleConditionEnd === '') {
        alert(`Mohon lengkapi data Odometer, BBM, dan Kondisi untuk kendaraan ${hnd.vehicle?.coreVehicle?.plateNumber || ''}.`);
        return;
      }
      if (data.odometerEnd < hnd.odometerStart) {
        alert(`Odometer akhir tidak boleh lebih kecil dari odometer awal untuk kendaraan ${hnd.vehicle?.coreVehicle?.plateNumber || ''}.`);
        return;
      }
    }

    const payload = selectedHandoverIds.map(id => {
      const hnd = handovers.find(h => h.id === id);
      const data = vehicleData[id];
      return {
        contractId: contract.id,
        bookingItemId: hnd!.bookingItemId,
        customerId: contract.customerId,
        vehicleId: hnd!.vehicleId,
        returnedAt: new Date(data.returnedAt).toISOString(),
        returnLatitude: data.latitude!,
        returnLongitude: data.longitude!,
        returnAddress: data.address || '-',
        odometerEnd: Number(data.odometerEnd),
        fuelLevelEnd: data.fuelLevelEnd as RentalHandover['fuelLevel'],
        vehicleConditionEnd: data.vehicleConditionEnd as RentalHandover['vehicleCondition'],
        equipmentChecklistEnd: data.equipmentEnd,
        damageNotes: data.vehicleConditionEnd !== 'GOOD' ? data.damageNotes : '',
        additionalCharges: Number(data.lateFee) + Number(data.damageFee) + Number(data.additionalCharges),
        lateFee: Number(data.lateFee),
        damageFee: Number(data.damageFee),
        notes: notes,
        staffId: 'usr-budi',
        staffName: 'Budi Beni'
      };
    });

    // @ts-ignore
    onSubmit(payload);
  };

  // --- Kalkulasi Ringkasan Biaya Akhir ---
  const remainingContract = contract.remainingAmount || 0;
  const deposit = contract.deposit || 0;

  let totalLateFee = 0;
  let totalDamageFee = 0;
  let totalAdditional = 0;

  selectedHandoverIds.forEach(id => {
    const d = vehicleData[id];
    if (d) {
      totalLateFee += Number(d.lateFee) || 0;
      totalDamageFee += (d.vehicleConditionEnd !== 'GOOD' ? Number(d.damageFee) : 0) || 0;
      totalAdditional += Number(d.additionalCharges) || 0;
    }
  });

  const totalPenalty = totalLateFee + totalDamageFee + totalAdditional;
  const grandTotal = remainingContract + totalPenalty + globalAdditionalFee - globalDiscount - deposit;

  const formatIDR = (val: number) => formatCurrency(val);

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      cancelProps={{ disabled: isSubmitting }}
      cancelText="Batal"
      saveText={isSubmitting ? 'Menyimpan...' : 'Simpan Pengembalian'}
      saveProps={{ disabled: isSubmitting || selectedHandoverIds.length === 0 }}
      isSubmitting={isSubmitting}
    >
      <div className="flex flex-col gap-4">

        {/* HEADER: Informasi Kontrak */}
        <FormCard
          title="Informasi Kontrak"
          description="Rincian kontrak penyewaan yang menjadi dasar pengembalian."
          icon={<FileText className="w-4 h-4 text-primary" />}
          iconWrapperClassName="text-primary"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-[13px] font-normal text-neutral-500 mb-1">Nomor Kontrak</p>
              <p className="text-[13px] font-semibold text-foreground">{contract.contractNumber}</p>
            </div>
            <div>
              <p className="text-[13px] font-normal text-neutral-500 mb-1">Pelanggan</p>
              <p className="text-[13px] font-semibold text-foreground">{contract.customer?.name || '-'}</p>
            </div>
            <div>
              <p className="text-[13px] font-normal text-neutral-500 mb-1">Periode Sewa</p>
              <p className="text-[13px] font-semibold text-foreground">
                {new Date(contract.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} - {new Date(contract.endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-normal text-neutral-500 mb-1">Layanan</p>
              <p className="text-[13px] font-semibold text-foreground">
                {contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dgn Sopir'} <span className="text-muted-foreground font-normal">({contract.rateType === 'DAILY' ? 'Harian' : contract.rateType === 'WEEKLY' ? 'Mingguan' : 'Bulanan'})</span>
              </p>
            </div>
          </div>
        </FormCard>

        {/* KONTEN: Detail Kendaraan (Tabs) */}
        <FormCard
          title={isSingleVehicle ? "Detail Pengembalian" : "Detail Pengembalian (Pilih Tab)"}
          description="Lengkapi data pengembalian untuk kendaraan di bawah ini."
          icon={<Car className="w-5 h-5" />}
          iconWrapperClassName="text-sky-500"
        >
          <div className="space-y-3">
            {!isSingleVehicle && (
              <div className="shrink-0 bg-background border-b border-border mb-3">
                <div className="flex items-center overflow-x-auto hide-scrollbar">
                  {handovers.map(h => {
                    const id = h.id;
                    const isSelected = activeTab === id;
                    const isChecked = selectedHandoverIds.includes(id);

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id)}
                        className={cn(
                          "px-4 h-[34px] text-xs font-semibold border-b-2 transition-colors focus:outline-none flex items-center gap-2 pt-[2px] whitespace-nowrap",
                          isSelected ? 'border-b-danger text-foreground' : 'border-b-transparent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", isChecked ? "bg-primary" : "bg-neutral-300")} />
                        <Car className={cn("h-3.5 w-3.5", isSelected ? "text-sky-500 dark:text-sky-400" : "opacity-70")} />
                        {h.vehicle?.coreVehicle?.plateNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab && vehicleData[activeTab] && (() => {
              const h = handovers.find(i => i.id === activeTab);
              const isChecked = selectedHandoverIds.includes(activeTab);
              const data = vehicleData[activeTab];

              if (!h) return null;

              return (
                <div className="flex flex-col gap-4 pt-1">
                  {/* Header: Nama Kendaraan | Waktu Serah Terima | Checkbox */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="min-w-0">
                      <h5 className="font-bold text-sm">{h.vehicle?.coreVehicle?.plateNumber}</h5>
                      <p className="text-xs text-muted-foreground">{h.vehicle?.coreVehicle?.brand} {h.vehicle?.coreVehicle?.vehicleName}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-medium text-sky-600 dark:text-sky-400 uppercase tracking-wider">Serah Terima</p>
                        <p className="text-xs font-semibold text-sky-900 dark:text-sky-100">
                          {new Date(h.handoverAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </div>
                      {!isSingleVehicle && (
                        <div className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg transition-colors">
                          <InputCheckbox
                            label="Kembalikan kendaraan ini"
                            value={isChecked}
                            onChange={(checked) => {
                              if (checked) setSelectedHandoverIds([...selectedHandoverIds, activeTab]);
                              else setSelectedHandoverIds(selectedHandoverIds.filter(id => id !== activeTab));
                            }}
                            className="m-0"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {isChecked ? (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-300">

                      {/* ROW 1: Kiri = Waktu Pengembalian, Kanan = Biaya Tambahan */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Kiri */}
                        <InputDateTimeGps
                          label="Waktu Pengembalian"
                          value={data.returnedAt}
                          onChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, returnedAt: v } })}
                          latitude={data.latitude}
                          longitude={data.longitude}
                          onCoordinates={(lat, lng) => setVehicleData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], latitude: lat, longitude: lng } }))}
                          address={data.address}
                          onAddressChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, address: v } })}
                          addressLabel="Detail Alamat (Opsional)"
                          addressPlaceholder="Cth: Area parkir basement B2..."
                          required
                        />
                        {/* Kanan */}
                        <div className="flex flex-col gap-3 p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
                          <p className="text-[11px] uppercase font-bold text-neutral-600 dark:text-neutral-400">Biaya Tambahan</p>
                          <InputNumber
                            label="Denda Keterlambatan (Rp)"
                            value={data.lateFee}
                            onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, lateFee: val || 0 } })}
                          />
                          <InputNumber
                            label="Biaya Lainnya (Rp)"
                            value={data.additionalCharges}
                            onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, additionalCharges: val || 0 } })}
                          />
                        </div>
                      </div>

                      {/* ROW 2: Odometer, BBM, Kondisi */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/50 pt-3">
                        <InputNumber
                          label={`Odometer Akhir (KM) - Awal: ${h.odometerStart}`}
                          value={data.odometerEnd}
                          onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, odometerEnd: val } })}
                          min={h.odometerStart}
                          placeholder="Contoh: 15500"
                        />
                        <InputSelect
                          label="BBM Akhir"
                          value={data.fuelLevelEnd}
                          onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, fuelLevelEnd: val as any } })}
                          placeholder="Pilih Kondisi BBM"
                          options={[
                            { value: 'EMPTY', label: 'Kosong' },
                            { value: 'QUARTER', label: '1/4' },
                            { value: 'HALF', label: '1/2' },
                            { value: 'THREE_QUARTER', label: '3/4' },
                            { value: 'FULL', label: 'Penuh' },
                          ]}
                        />
                        <InputSelect
                          label="Kondisi Kendaraan"
                          value={data.vehicleConditionEnd}
                          onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, vehicleConditionEnd: val as any } })}
                          placeholder="Pilih Kondisi Kendaraan"
                          options={[
                            { value: 'GOOD', label: 'Baik' },
                            { value: 'MINOR_DAMAGE', label: 'Kerusakan Ringan' },
                            { value: 'NEEDS_REPAIR', label: 'Perlu Perbaikan' },
                          ]}
                        />
                      </div>

                      {/* ROW 3: Detail Kerusakan (jika ada) */}
                      {data.vehicleConditionEnd && data.vehicleConditionEnd !== 'GOOD' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in border-t border-border/50 pt-3">
                          <InputTextarea
                            label="Detail Kerusakan"
                            value={data.damageNotes}
                            onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, damageNotes: val } })}
                            placeholder="Deskripsikan kerusakan yang ditemukan..."
                            rows={2}
                          />
                          <InputNumber
                            label="Taksiran Biaya Perbaikan (Rp)"
                            value={data.damageFee}
                            onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, damageFee: val || 0 } })}
                          />
                        </div>
                      )}

                      {/* ROW 4: Kelengkapan */}
                      <div className="border-t border-border/50 pt-3">
                        <Label className="text-[11px] uppercase font-semibold text-muted-foreground mb-2 block">Kelengkapan Kendaraan</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Object.keys(data.equipmentEnd || {}).map((key) => {
                            if (key === 'other') return null;
                            return (
                              <div key={key} className="flex items-center">
                                <InputCheckbox
                                  id={`eq-${activeTab}-${key}`}
                                  label={key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
                                  value={(data.equipmentEnd as any)?.[key] || false}
                                  onChange={(checked) => setVehicleData({
                                    ...vehicleData,
                                    [activeTab]: {
                                      ...data,
                                      equipmentEnd: { ...data.equipmentEnd, [key]: checked === true }
                                    }
                                  })}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="py-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm text-muted-foreground">Kendaraan ini tidak dipilih untuk dikembalikan saat ini.</p>
                      <p className="text-xs text-muted-foreground mt-1">Centang kotak di atas untuk memproses pengembaliannya.</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </FormCard>

        {/* SUMMARY: Ringkasan Biaya Akhir */}
        <FormCard
          title="Ringkasan Tagihan & Pelunasan"
          description="Tambahkan potongan/biaya tambahan khusus untuk transaksi ini secara keseluruhan."
          icon={<Receipt className="w-5 h-5" />}
          iconWrapperClassName="text-amber-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <InputNumber
              label="Biaya Tambahan Transaksi (Rp)"
              value={globalAdditionalFee}
              onChange={(val) => setGlobalAdditionalFee(val || 0)}
              placeholder="Cth: Biaya penjemputan, admin..."
            />
            <InputNumber
              label="Potongan / Diskon Global (Rp)"
              value={globalDiscount}
              onChange={(val) => setGlobalDiscount(val || 0)}
              placeholder="Cth: Diskon kompensasi..."
            />
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-border p-5">
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Sisa Tagihan Kontrak Sewa</span>
                <span className="font-medium text-foreground">{formatIDR(remainingContract)}</span>
              </div>
              
              {totalLateFee > 0 && (
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Total Denda Keterlambatan</span>
                  <span className="font-medium text-foreground">{formatIDR(totalLateFee)}</span>
                </div>
              )}
              {totalDamageFee > 0 && (
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Total Biaya Perbaikan (Kerusakan)</span>
                  <span className="font-medium text-foreground">{formatIDR(totalDamageFee)}</span>
                </div>
              )}
              {totalAdditional > 0 && (
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Total Biaya Lainnya (Per Kendaraan)</span>
                  <span className="font-medium text-foreground">{formatIDR(totalAdditional)}</span>
                </div>
              )}
              {globalAdditionalFee > 0 && (
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Biaya Tambahan Transaksi (Global)</span>
                  <span className="font-medium text-foreground">{formatIDR(globalAdditionalFee)}</span>
                </div>
              )}

              {globalDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 mt-1">
                  <span>Potongan / Diskon (Global)</span>
                  <span className="font-medium">- {formatIDR(globalDiscount)}</span>
                </div>
              )}

              {deposit > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 mt-1">
                  <span>Deposit (Jaminan) yang Dipotong</span>
                  <span className="font-medium">- {formatIDR(deposit)}</span>
                </div>
              )}

              <div className="border-t border-border/50 my-2"></div>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-base">Total Akhir</span>
                <span className={cn(
                  "font-bold text-lg",
                  grandTotal > 0 ? "text-danger" : grandTotal < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                )}>
                  {grandTotal < 0 ? `(Refund) ${formatIDR(Math.abs(grandTotal))}` : formatIDR(grandTotal)}
                </span>
              </div>

              {grandTotal > 0 && (
                <p className="text-xs text-danger/80 mt-1 text-right">
                  *Pelanggan <b>Wajib Membayar</b> sejumlah {formatCurrency(grandTotal)}
                </p>
              )}
              {grandTotal < 0 && (
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1 text-right">
                  *Perusahaan melakukan <b>Refund</b> sejumlah {formatCurrency(Math.abs(grandTotal))}
                </p>
              )}
              {grandTotal === 0 && (
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  *Pembayaran <b>LUNAS</b> (Tidak ada tagihan/refund).
                </p>
              )}
            </div>
          </div>
        </FormCard>

        {/* FOOTER: Catatan */}
        <FormCard
          title="Catatan Keseluruhan"
          description="Catatan tambahan secara keseluruhan jika ada."
          icon={<StickyNote className="w-4 h-4 text-neutral-500" />}
          iconWrapperClassName="text-neutral-500"
        >
          <InputTextarea
            id="notes"
            value={notes}
            onChange={setNotes}
            placeholder="Catatan tambahan terkait pengembalian keseluruhan (Opsional)..."
            rows={3}
          />
        </FormCard>

      </div>
    </FormShell>
  );
}
