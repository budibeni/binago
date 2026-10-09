'use client';

import React, { useState } from 'react';
import {
  Car, MapPin, Search, Receipt, User, CalendarRange, Crosshair, StickyNote, CornerDownRight, FileText, CheckCircle2, ArrowRightLeft, PlayCircle
} from 'lucide-react';
import {
  Button, FormShell, InputNumber, InputSelect,
  InputDate, InputTextarea, FormCard, InputCheckbox, Label, InputDateTimeGps, PhoneLink
} from '@adatrack/ui';
import { cn, formatCurrency, formatDateTime } from '@adatrack/utils';
import type { RentalContract } from '../../contracts/types/contract';
import type { ReturnPayload } from '../types/return';
import type { BookingItem } from '../../bookings/types/booking';

interface ReturnFormProps {
  contract: RentalContract;
  itemsToReturn: BookingItem[];
  onSubmit: (data: ReturnPayload[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  layout?: 'default' | 'drawer';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const getMaxEndDate = (items: any[]) => {
  if (!items || items.length === 0) return "";
  let max = new Date(items[0].startDate || "");
  for (const item of items) {
    if (!item.startDate) continue;
    const d = new Date(item.startDate);
    if (item.rateType === "HOURLY") d.setHours(d.getHours() + (item.duration || 1));
    else d.setDate(d.getDate() + (item.duration || 1));
    if (d > max) max = d;
  }
  return max.toISOString();
};

export function ReturnForm({
  contract,
  itemsToReturn,
  onSubmit,
  onCancel,
  isSubmitting,
  layout = 'default',
  open,
  onOpenChange
}: ReturnFormProps) {
  const [activeTab, setActiveTab] = useState<string>(itemsToReturn[0]?.id || '');
  const [subTab, setSubTab] = useState<'RETURN' | 'HANDOVER'>('RETURN');

  const isSingleVehicle = itemsToReturn.length === 1;

  // State per kendaraan
  const [vehicleData, setVehicleData] = useState<Record<string, ReturnPayload>>(
    itemsToReturn.reduce((acc, item) => {
      acc[item.id] = {
        contractId: contract.id,
        bookingItemId: item.id,
        vehicleId: item.vehicleId,
        returnDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
        returnLocation: { latitude: 0, longitude: 0, address: '' },
        returnOdometer: null as unknown as number,
        returnCondition: {
          fuelLevel: '' as any,
          vehicleCondition: '' as any,
          equipmentChecklist: {},
          notes: '',
          damageNotes: '',
          staffName: 'Admin',
        },
        extraCharges: 0,
        lateFee: 0,
        damageFee: 0,
      };
      return acc;
    }, {} as Record<string, ReturnPayload>)
  );

  const [selectedItems, setSelectedItems] = useState<string[]>(
    itemsToReturn.map(h => h.id)
  );

  const calculateLateFee = (item: BookingItem, returnDateStr: string): number => {
    if (!item.endDate) return 0;
    const end = new Date(item.endDate).getTime();
    const ret = new Date(returnDateStr).getTime();
    if (ret > end) {
      // 10% of unit price per day late as a simple default
      const diffTime = Math.abs(ret - end);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * ((item.unitPrice || 0) * 0.1);
    }
    return 0;
  };

  const handleReturnDateChange = (itemId: string, date: string) => {
    const item = itemsToReturn.find(i => i.id === itemId);
    const newLateFee = item ? calculateLateFee(item, date) : 0;

    setVehicleData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        returnDate: date,
        lateFee: newLateFee
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payloads: ReturnPayload[] = [];

    for (const item of itemsToReturn) {
      if (!selectedItems.includes(item.id)) continue;
      const data = vehicleData[item.id];

      if (!data.returnOdometer || data.returnOdometer < (item.handoverOdometer || 0)) {
        alert(`Odometer akhir untuk kendaraan ${item.vehicleSnapshot?.licensePlate} tidak valid.`);
        return;
      }

      if (!data.returnLocation.latitude || !data.returnLocation.longitude) {
        alert(`Lokasi pengembalian wajib diisi untuk kendaraan ${item.vehicleSnapshot?.licensePlate}.`);
        return;
      }

      payloads.push(data);
    }

    if (payloads.length === 0) {
      alert('Pilih minimal satu kendaraan untuk dikembalikan.');
      return;
    }

    onSubmit(payloads);
  };

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSave}
      onCancel={onCancel}
      cancelProps={{ disabled: isSubmitting }}
      cancelText="Batal"
      saveText={isSubmitting ? 'Menyimpan...' : 'Proses Pengembalian'}
      saveProps={{ disabled: isSubmitting || selectedItems.length === 0 }}
      isSubmitting={isSubmitting}
      title="Proses Pengembalian"
    >
      <div className="flex flex-col gap-4">

        <FormCard
          title="Informasi Kontrak"
          description="Rincian kontrak penyewaan yang menjadi dasar pengembalian."
          icon={<FileText className="w-5 h-5 text-blue-500" />}
          iconWrapperClassName="bg-blue-100 dark:bg-blue-900/30 text-blue-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">No Kontrak</span>
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200">{contract.contractNumber}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {(contract.contractDate || contract.createdAt) ? new Date(contract.contractDate || contract.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Nama Pelanggan</span>
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1" title={contract.customerSnapshot?.name}>{contract.customerSnapshot?.name || '-'}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {contract.customerSnapshot?.type || '-'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Periode Sewa</span>
              <span className={cn(
                "text-[12px] font-semibold",
                (contract.startDate && new Date(contract.startDate).toDateString() === new Date().toDateString()) ? "text-destructive" : "text-slate-800 dark:text-slate-200"
              )}>
                {contract.startDate ? new Date(contract.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Selesai: {(contract.items && contract.items.length > 0) ? new Date(getMaxEndDate(contract.items)).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Layanan</span>
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">{contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dgn Sopir'}</span>
            </div>
          </div>
        </FormCard>

        <FormCard>
          <div className="space-y-3">
            {!isSingleVehicle && (
              <div className="mb-5">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar p-1.5 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
                  {itemsToReturn.map(item => {
                    const id = item.id;
                    const isSelected = activeTab === id;
                    const isChecked = selectedItems.includes(id);

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => { setActiveTab(id); setSubTab('RETURN'); }}
                        className={cn(
                          "px-3.5 py-1.5 text-[12px] font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 focus:outline-none",
                          isSelected
                            ? 'bg-white dark:bg-neutral-900 shadow-sm border border-slate-200/80 dark:border-slate-600 text-primary'
                            : 'border border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-white/60 dark:hover:bg-neutral-800/60'
                        )}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        ) : (
                          <div className={cn(
                            "w-2 h-2 rounded-full shrink-0 transition-all",
                            isSelected ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
                          )} />
                        )}
                        <span className={isSelected ? "text-primary" : ""}>
                          {item.vehicleSnapshot?.licensePlate}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab && (() => {
              const item = itemsToReturn.find(i => i.id === activeTab);
              const isChecked = isSingleVehicle || selectedItems.includes(activeTab);
              const data = vehicleData[activeTab];

              return (
                <div className="flex flex-col gap-4 pt-1">
                  {/* Header Kendaraan */}
                  <div className="mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <label className={cn("flex items-center gap-2.5 select-none group", isSingleVehicle ? "cursor-default opacity-90" : "cursor-pointer")}>
                        <InputCheckbox
                          className="m-0"
                          label=""
                          value={isChecked}
                          disabled={isSingleVehicle}
                          onChange={(checked) => {
                            if (isSingleVehicle) return;
                            if (checked) setSelectedItems(prev => [...prev, activeTab]);
                            else setSelectedItems(prev => prev.filter(id => id !== activeTab));
                          }}
                        />
                        <span className={cn("font-bold text-sm text-slate-800 dark:text-slate-200 transition-colors", !isSingleVehicle && "group-hover:text-primary")}>
                          {(isSingleVehicle ? itemsToReturn[0] : item)?.vehicleSnapshot?.licensePlate || "Belum ada Nopol"}
                        </span>
                      </label>
                      <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                        {((isSingleVehicle ? itemsToReturn[0] : item)?.vehicleSnapshot?.brand || "") + " " + ((isSingleVehicle ? itemsToReturn[0] : item)?.vehicleSnapshot?.model || "")}
                      </span>
                    </div>
                  </div>

                  {/* SUB-TABS KENDARAAN */}
                  <div className="flex items-center justify-between w-full border-b border-border mb-5">
                    <div className="flex">
                      <button
                        onClick={() => setSubTab('RETURN')}
                        type="button"
                        className={cn(
                          "text-[13px] font-semibold py-2.5 px-5 transition-all border-b-2 -mb-[1px]",
                          subTab === 'RETURN'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                      >
                        Pengembalian
                      </button>
                      <button
                        onClick={() => setSubTab('HANDOVER')}
                        type="button"
                        className={cn(
                          "text-[13px] font-semibold py-2.5 px-5 transition-all border-b-2 -mb-[1px]",
                          subTab === 'HANDOVER'
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                      >
                        Serah Terima
                      </button>
                    </div>

                    {/* Tombol Playback dipindah ke sebelah kanan tab */}
                    <div className="pb-1.5 pr-1">
                      <a
                        href="/tracking"
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof window !== 'undefined' && item?.vehicleId && item?.handoverDate) {
                            sessionStorage.setItem('adatrack_tracking_nav_state', JSON.stringify({
                              mode: 'playback',
                              vehicleId: item.vehicleId,
                              start: item.handoverDate
                            }));
                            window.open('/tracking', '_blank');
                          }
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Playback</span>
                      </a>
                    </div>
                  </div>

                  {isChecked ? (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                      {subTab === 'HANDOVER' ? (
                        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Waktu Serah Terima</span>
                                <span className="text-[13px] font-semibold">{item?.handoverDate ? formatDateTime(item.handoverDate) : '-'}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Lokasi Serah Terima</span>
                                <span className="text-[13px] font-semibold">{item?.handoverLocation?.address || '-'}</span>
                                {item?.handoverLocation?.latitude && (
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${item.handoverLocation.latitude},${item.handoverLocation.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors w-fit"
                                  >
                                    <MapPin className="w-3 h-3" />
                                    {item.handoverLocation.latitude}, {item.handoverLocation.longitude}
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Odometer Awal</span>
                                <span className="text-[13px] font-semibold">{item?.handoverOdometer ? `${item.handoverOdometer} km` : '-'}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sisa BBM Awal</span>
                                <span className="text-[13px] font-semibold">
                                  {({ EMPTY: 'Kosong', QUARTER: '1/4', HALF: '1/2', THREE_QUARTER: '3/4', FULL: 'Penuh' } as any)[item?.handoverCondition?.fuelLevel || ''] || '-'}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Kondisi Fisik Awal</span>
                                <span className={cn(
                                  "text-[13px] font-semibold",
                                  item?.handoverCondition?.vehicleCondition === 'GOOD' ? 'text-emerald-600 dark:text-emerald-400' : 'text-warning'
                                )}>
                                  {({ GOOD: 'Baik', MINOR_DAMAGE: 'Rusak Ringan', NEEDS_REPAIR: 'Rusak Berat' } as any)[item?.handoverCondition?.vehicleCondition || ''] || '-'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {item?.handoverCondition?.notes && (
                            <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl">
                              <span className="text-[11px] font-semibold text-warning uppercase tracking-wider mb-1 block">Catatan Kerusakan Awal</span>
                              <span className="text-[13px] font-medium text-warning-foreground">{item.handoverCondition.notes}</span>
                            </div>
                          )}

                          <div className="bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                            <Label className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-3 block tracking-wide">Kelengkapan Kendaraan Awal</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { key: 'stnkOriginal', label: 'STNK Original' },
                                { key: 'spareKey', label: 'Kunci Cadangan' },
                                { key: 'jackAndTools', label: 'Dongkrak & Toolkit' },
                                { key: 'spareTire', label: 'Ban Cadangan' },
                                { key: 'firstAidKit', label: 'P3K' }
                              ].map(({ key, label }) => {
                                const isChecked = (item?.handoverCondition?.equipmentChecklist as any)?.[key] || false;
                                return (
                                  <div key={key} className="flex items-center gap-2 h-8 px-2.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-neutral-900/50 opacity-80 cursor-default">
                                    <InputCheckbox className="m-0" label="" value={isChecked} disabled={true} onChange={() => { }} />
                                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Kolom Kiri */}
                            <div className="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-3.5">
                              <InputDateTimeGps
                                label="Waktu Pengembalian"
                                value={data.returnDate}
                                onChange={(v) => handleReturnDateChange(activeTab, v)}
                                latitude={data.returnLocation?.latitude}
                                longitude={data.returnLocation?.longitude}
                                onCoordinates={(lat, lng) => setVehicleData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], returnLocation: { ...prev[activeTab].returnLocation, latitude: lat, longitude: lng } } }))}
                                showAddress={false}
                                required
                              />
                              {data.lateFee !== undefined && data.lateFee > 0 && (
                                <div className="bg-danger/10 border border-danger/20 rounded-md p-2 flex justify-between items-center text-[11px] -mt-1">
                                  <span className="text-danger font-semibold">Estimasi Denda Terlambat:</span>
                                  <span className="text-danger font-bold text-sm">{formatCurrency(data.lateFee)}</span>
                                </div>
                              )}
                              <InputTextarea
                                id={`addr-${activeTab}`}
                                label="Detail Alamat Pengembalian (Opsional)"
                                value={data.returnLocation?.address || ''}
                                onChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, returnLocation: { ...data.returnLocation, address: v } } })}
                                placeholder="Cth: Area lobi, nama gedung, lantai..."
                                rows={3}
                              />
                            </div>
                            {/* Kolom Kanan */}
                            <div className="flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-3.5">
                              <InputNumber
                                label="Odometer Akhir (km)"
                                value={data.returnOdometer ?? null}
                                onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, returnOdometer: val || 0 } })}
                                placeholder="Contoh: 15500"
                              />
                              <p className="text-[10px] text-muted-foreground -mt-1.5 ml-1">Odometer Serah Terima: <b>{item?.handoverOdometer} km</b></p>
                              <InputSelect
                                label="Sisa BBM"
                                value={data.returnCondition.fuelLevel}
                                onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, returnCondition: { ...data.returnCondition, fuelLevel: val as any } } })}
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
                                value={data.returnCondition.vehicleCondition}
                                onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, returnCondition: { ...data.returnCondition, vehicleCondition: val as any } } })}
                                options={[
                                  { value: 'GOOD', label: 'Baik' },
                                  { value: 'MINOR_DAMAGE', label: 'Kerusakan Ringan' },
                                  { value: 'NEEDS_REPAIR', label: 'Perlu Perbaikan' },
                                ]}
                              />
                            </div>
                          </div>

                          {data.returnCondition.vehicleCondition && data.returnCondition.vehicleCondition !== 'GOOD' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-3.5">
                              <InputTextarea
                                label="Detail Kerusakan"
                                value={data.returnCondition.damageNotes || ''}
                                onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, returnCondition: { ...data.returnCondition, damageNotes: val } } })}
                                placeholder="Deskripsikan kerusakan yang ditemukan..."
                                rows={2}
                              />
                              <InputNumber
                                label="Taksiran Biaya Perbaikan (Rp)"
                                value={data.damageFee || null}
                                onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, damageFee: val || 0 } })}
                              />
                            </div>
                          )}

                          <div className="bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-3.5">
                            <Label className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-2.5 block tracking-wide">Kelengkapan Kendaraan</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {[
                                { key: 'stnkOriginal', label: 'STNK Original' },
                                { key: 'spareKey', label: 'Kunci Cadangan' },
                                { key: 'jackAndTools', label: 'Dongkrak & Toolkit' },
                                { key: 'spareTire', label: 'Ban Cadangan' },
                                { key: 'firstAidKit', label: 'P3K' }
                              ].map(({ key, label }) => {
                                const isItemChecked = (data.returnCondition.equipmentChecklist as any)?.[key] || false;
                                return (
                                  <label
                                    key={key}
                                    className={cn(
                                      "flex items-center gap-2 h-8 px-2.5 rounded-md border transition-all cursor-pointer bg-white dark:bg-neutral-900",
                                      isItemChecked
                                        ? "border-primary/40 shadow-sm"
                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-800"
                                    )}
                                  >
                                    <InputCheckbox
                                      id={`eq-${activeTab}-${key}`}
                                      className="m-0"
                                      label=""
                                      value={isItemChecked}
                                      onChange={(checked) => setVehicleData({
                                        ...vehicleData,
                                        [activeTab]: {
                                          ...data,
                                          returnCondition: { ...data.returnCondition, equipmentChecklist: { ...data.returnCondition.equipmentChecklist, [key]: checked === true } }
                                        }
                                      })}
                                    />
                                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 select-none">
                                      {label}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="bg-slate-50/50 dark:bg-slate-800/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-3.5">
                            <Label className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-2 block tracking-wide">Catatan Pengembalian</Label>
                            <InputTextarea
                              id={`notes-${activeTab}`}
                              value={data.returnCondition.notes || ''}
                              onChange={(val) => setVehicleData({
                                ...vehicleData,
                                [activeTab]: {
                                  ...data,
                                  returnCondition: { ...data.returnCondition, notes: val }
                                }
                              })}
                              placeholder="Tambahkan catatan khusus untuk kendaraan ini (opsional)..."
                              rows={2}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-dashed border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm text-muted-foreground">Kendaraan ini tidak dipilih untuk dikembalikan saat ini.</p>
                      <p className="text-xs text-muted-foreground mt-1">Centang kotak 'Kembalikan kendaraan ini' untuk memproses.</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </FormCard>

      </div>
    </FormShell>
  );
}
