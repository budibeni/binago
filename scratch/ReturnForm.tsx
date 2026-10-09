'use client';

import React, { useState } from 'react';
import { 
  X, Check, AlertTriangle, HelpCircle, 
  Car, MapPin, Search, Plus, Map, Focus, Receipt, Hash, User, CalendarRange, Navigation, Crosshair, StickyNote, CornerDownRight
} from 'lucide-react';
import { 
  Button, FormShell, InputText, InputNumber, InputSelect, 
  InputDate, InputTextarea, FormCard, InputCheckbox, Badge,
  Drawer, DrawerContent
} from '@adatrack/ui';
import { cn, formatCurrency, formatIDR, formatDateTime } from '@adatrack/utils';
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
  const [notes, setNotes] = useState('');
  
  // Fees
  const [globalAdditionalFee, setGlobalAdditionalFee] = useState<number>(0);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);

  // State per kendaraan
  const [vehicleData, setVehicleData] = useState<Record<string, ReturnPayload>>(
    itemsToReturn.reduce((acc, item) => {
      acc[item.id] = {
        contractId: contract.id,
        bookingItemId: item.id,
        vehicleId: item.vehicleId,
        returnDate: new Date().toISOString(),
        returnLocation: { latitude: 0, longitude: 0, address: '' },
        returnOdometer: item.handoverOdometer || 0,
        returnCondition: {
          fuelLevel: item.handoverCondition?.fuelLevel || 'HALF',
          vehicleCondition: 'GOOD',
          equipmentChecklist: { ...item.handoverCondition?.equipmentChecklist },
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

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    itemsToReturn.reduce((acc, h) => {
      acc[h.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [locationLoading, setLocationLoading] = useState<Record<string, boolean>>({});
  const [locationError, setLocationError] = useState<Record<string, string>>({});

  const getLocation = (itemId: string) => {
    if (!navigator.geolocation) {
      setLocationError({ ...locationError, [itemId]: 'Geolocation tidak didukung browser ini.' });
      return;
    }

    setLocationLoading({ ...locationLoading, [itemId]: true });
    setLocationError({ ...locationError, [itemId]: '' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setVehicleData(prev => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            returnLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: 'Lokasi Terkini (Otomatis)'
            }
          }
        }));
        setLocationLoading({ ...locationLoading, [itemId]: false });
      },
      (error) => {
        setLocationError({ ...locationError, [itemId]: 'Gagal mendapatkan lokasi GPS. Pastikan izin lokasi aktif.' });
        setLocationLoading({ ...locationLoading, [itemId]: false });
      }
    );
  };

  const calculateLateFee = (item: BookingItem, returnDateStr: string): number => {
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

  const handleSave = () => {
    const payloads: ReturnPayload[] = [];
    
    for (const item of itemsToReturn) {
      if (!selectedItems[item.id]) continue;
      const data = vehicleData[item.id];
      
      if (!data.returnOdometer || data.returnOdometer < (item.handoverOdometer || 0)) {
        alert(`Odometer akhir untuk kendaraan ${item.vehicleSnapshot?.licensePlate} tidak valid.`);
        return;
      }
      
      if (!data.returnLocation.latitude || !data.returnLocation.longitude) {
        alert(`Lokasi pengembalian wajib diambil untuk kendaraan ${item.vehicleSnapshot?.licensePlate}.`);
        return;
      }
      
      payloads.push(data);
    }
    
    if (payloads.length === 0) {
      alert('Pilih minimal satu kendaraan untuk dikembalikan.');
      return;
    }
    
    if (globalAdditionalFee > 0 || globalDiscount > 0) {
      // Distribute global fees evenly or add to the first item for simplicity
      const perItemAdditional = globalAdditionalFee / payloads.length;
      const perItemDiscount = globalDiscount / payloads.length;
      
      payloads.forEach(p => {
        p.extraCharges = (p.extraCharges || 0) + perItemAdditional - perItemDiscount;
      });
    }

    // Pass the notes to all payloads just in case
    payloads.forEach(p => {
      p.returnCondition.notes = p.returnCondition.notes 
        ? `${p.returnCondition.notes}\n${notes}`
        : notes;
    });

    onSubmit(payloads);
  };

  // Calculations for summary
  const totalLateFee = Object.keys(vehicleData).filter(id => selectedItems[id]).reduce((sum, id) => sum + (vehicleData[id].lateFee || 0), 0);
  const totalDamageFee = Object.keys(vehicleData).filter(id => selectedItems[id]).reduce((sum, id) => sum + (vehicleData[id].damageFee || 0), 0);
  const totalAdditional = Object.keys(vehicleData).filter(id => selectedItems[id]).reduce((sum, id) => sum + (vehicleData[id].extraCharges || 0), 0);
  
  const remainingContract = contract.remainingAmount || 0;
  const deposit = contract.deposit || 0; // Deposit is normally refunded if no damage, otherwise offset

  // Let's assume deposit offsets damage/late fees
  const totalPenalties = totalLateFee + totalDamageFee + totalAdditional + globalAdditionalFee;
  let penaltyToPay = totalPenalties;
  let remainingDeposit = deposit;
  
  if (deposit > 0) {
    if (deposit >= totalPenalties) {
      remainingDeposit = deposit - totalPenalties;
      penaltyToPay = 0;
    } else {
      penaltyToPay = totalPenalties - deposit;
      remainingDeposit = 0;
    }
  }

  // GrandTotal > 0 means Customer needs to pay more. < 0 means Refund to Customer.
  const grandTotal = remainingContract + penaltyToPay - remainingDeposit - globalDiscount;

  return (
    <FormShell
      title="Proses Pengembalian"
      description="Catat kondisi akhir dan odometer kendaraan."
      onSave={handleSave}
      onCancel={onCancel}
      isSaving={isSubmitting}
      saveLabel="Simpan Pengembalian"
      variant={layout === 'drawer' ? 'drawer' : 'default'}
      className={layout === 'drawer' ? "rounded-none sm:rounded-l-2xl h-full border-0 bg-transparent shadow-none" : ""}
    >
      <div className="flex flex-col gap-6 p-6">
        
        {/* HEADER INFO */}
        <FormCard
          title="Informasi Kontrak"
          description="Detail kontrak sewa sebagai acuan pengembalian."
          icon={<Receipt className="w-5 h-5" />}
          iconWrapperClassName="text-blue-500"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-border">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5"><Hash className="w-3 h-3" /> No Kontrak</span>
              <span className="font-medium text-[13px]">{contract.contractNumber || '-'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5"><User className="w-3 h-3" /> Pelanggan</span>
              <span className="font-medium text-[13px]">{contract.customer?.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5"><CalendarRange className="w-3 h-3" /> Periode Utama</span>
              <span className="font-medium text-[13px]">
                {formatDateTime(contract.startDate)} - {contract.items[0]?.endDate ? formatDateTime(contract.items[0].endDate) : '-'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5"><Car className="w-3 h-3" /> Layanan</span>
              <span className="font-medium text-[13px]">{contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dengan Supir'}</span>
            </div>
          </div>
        </FormCard>

        {/* TABS PER KENDARAAN */}
        <FormCard
          title="Detail Kendaraan (Pilih Tab)"
          description="Lengkapi data pengembalian untuk kendaraan di bawah ini."
          icon={<Car className="w-5 h-5" />}
          iconWrapperClassName="text-emerald-500"
          contentClassName="p-0 border-none bg-transparent"
          headerClassName="px-0 pt-0"
        >
          <div className="flex flex-col border border-border/60 rounded-xl overflow-hidden bg-background shadow-sm">
            {/* TABS NAVIGATION */}
            <div className="flex items-center overflow-x-auto border-b border-border bg-neutral-50 dark:bg-neutral-900 scrollbar-hide">
              {itemsToReturn.map((item, idx) => {
                const isActive = activeTab === item.id;
                const isSelected = selectedItems[item.id];
                const cv = item.vehicleSnapshot;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3.5 border-b-2 text-[13px] font-semibold transition-all whitespace-nowrap outline-none",
                      isActive 
                        ? "border-primary text-primary bg-background" 
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                      isSelected 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800"
                    )}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    {cv?.brand} ({cv?.licensePlate})
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            {(() => {
              const item = itemsToReturn.find(i => i.id === activeTab);
              if (!item) return null;
              
              const isSelected = selectedItems[activeTab];
              const data = vehicleData[activeTab];
              const cv = item.vehicleSnapshot;

              return (
                <div className="flex flex-col p-5 bg-background min-h-[400px]">
                  
                  {/* SELECT TOGGLE */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border border-dashed">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">{cv?.brand} {cv?.model}</span>
                        <span className="text-xs text-muted-foreground font-medium">{cv?.categoryName} &bull; <span className="text-primary font-bold">{cv?.licensePlate}</span></span>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3 py-1.5 rounded-lg transition-colors">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-primary focus:ring-primary border-neutral-300"
                        checked={isSelected}
                        onChange={(e) => setSelectedItems({...selectedItems, [activeTab]: e.target.checked})}
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">Kembalikan kendaraan ini</span>
                    </label>
                  </div>

                  {isSelected ? (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                      
                      {/* ROW 1: Waktu & Lokasi */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                          <InputDate
                            label="Waktu Pengembalian (Aktual)"
                            value={data.returnDate}
                            onChange={(val) => handleReturnDateChange(activeTab, val)}
                            includeTime={true}
                          />
                          {/* Tampilkan denda keterlambatan jika ada */}
                          {data.lateFee !== undefined && data.lateFee > 0 && (
                            <div className="bg-danger/10 border border-danger/20 rounded-md p-2.5 flex justify-between items-center text-[11px]">
                              <span className="text-danger font-semibold">Estimasi Denda Terlambat:</span>
                              <span className="text-danger font-bold text-sm">{formatIDR(data.lateFee)}</span>
                            </div>
                          )}
                          <InputNumber
                            label="Odometer Akhir (km)"
                            value={data.returnOdometer}
                            onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...data, returnOdometer: val || 0 } })}
                            placeholder="Cth: 15500"
                          />
                          <p className="text-[11px] text-muted-foreground -mt-1.5 flex items-center gap-1.5">
                            <CornerDownRight className="w-3 h-3" />
                            Odometer awal: <span className="font-bold">{item.handoverOdometer} km</span>
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <Label className="text-[11px] uppercase font-semibold text-muted-foreground mb-1 block">Lokasi Pengembalian</Label>
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant={data.returnLocation.latitude ? "outline" : "primary"}
                              className="w-full justify-center h-10 shadow-none text-xs gap-2"
                              onClick={() => getLocation(activeTab)}
                              disabled={locationLoading[activeTab]}
                              type="button"
                            >
                              {locationLoading[activeTab] ? (
                                <><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" /> Mengambil lokasi...</>
                              ) : data.returnLocation.latitude ? (
                                <><Crosshair className="w-3.5 h-3.5" /> Perbarui Lokasi GPS</>
                              ) : (
                                <><MapPin className="w-3.5 h-3.5" /> Ambil Lokasi GPS Sekarang</>
                              )}
                            </Button>
                            
                            {locationError[activeTab] && (
                              <p className="text-[10px] text-danger font-medium">{locationError[activeTab]}</p>
                            )}

                            {data.returnLocation.latitude ? (
                              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-border text-xs flex flex-col gap-1.5 mt-1">
                                <div className="flex justify-between items-center text-muted-foreground">
                                  <span>Lat: <span className="font-mono text-foreground font-medium">{data.returnLocation.latitude.toFixed(6)}</span></span>
                                  <span>Lng: <span className="font-mono text-foreground font-medium">{data.returnLocation.longitude.toFixed(6)}</span></span>
                                </div>
                                <InputTextarea
                                  id={`addr-${activeTab}`}
                                  value={data.returnLocation.address || ''}
                                  onChange={(val) => setVehicleData({
                                    ...vehicleData,
                                    [activeTab]: { ...data, returnLocation: { ...data.returnLocation, address: val } }
                                  })}
                                  placeholder="Detail Alamat (Opsional)..."
                                  rows={2}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* ROW 2: BBM & Kondisi */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/50 pt-5">
                        <InputSelect
                          label="Level BBM Akhir"
                          value={data.returnCondition.fuelLevel}
                          onChange={(val) => setVehicleData({
                            ...vehicleData,
                            [activeTab]: { ...data, returnCondition: { ...data.returnCondition, fuelLevel: val } }
                          })}
                          options={[
                            { value: 'EMPTY', label: 'Kosong' },
                            { value: 'QUARTER', label: '1/4' },
                            { value: 'HALF', label: '1/2' },
                            { value: 'THREE_QUARTER', label: '3/4' },
                            { value: 'FULL', label: 'Penuh' },
                          ]}
                        />
                        
                        <InputSelect
                          label="Kondisi Fisik Akhir"
                          value={data.returnCondition.vehicleCondition}
                          onChange={(val) => setVehicleData({
                            ...vehicleData,
                            [activeTab]: { ...data, returnCondition: { ...data.returnCondition, vehicleCondition: val } }
                          })}
                          options={[
                            { value: 'GOOD', label: 'Baik' },
                            { value: 'MINOR_DAMAGE', label: 'Kerusakan Ringan' },
                            { value: 'NEEDS_REPAIR', label: 'Perlu Perbaikan (Rusak Berat)' },
                          ]}
                        />
                      </div>

                      {/* ROW 3: Damage Notes & Fee (if damaged) */}
                      {data.returnCondition.vehicleCondition !== 'GOOD' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-warning/5 border border-warning/20 p-4 rounded-xl">
                          <InputTextarea
                            label="Detail Kerusakan"
                            value={data.returnCondition.damageNotes || ''}
                            onChange={(val) => setVehicleData({
                              ...vehicleData,
                              [activeTab]: { ...data, returnCondition: { ...data.returnCondition, damageNotes: val } }
                            })}
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
                      <div className="border-t border-border/50 pt-5">
                        <Label className="text-[11px] uppercase font-semibold text-muted-foreground mb-3 block">Kelengkapan Kendaraan</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                          {Object.keys(data.returnCondition.equipmentChecklist || {}).map((key) => {
                            if (key === 'other') return null;
                            return (
                              <div key={key} className="flex items-center">
                                <InputCheckbox
                                  id={`eq-${activeTab}-${key}`}
                                  label={key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
                                  value={data.returnCondition.equipmentChecklist[key] || false}
                                  onChange={(checked) => setVehicleData({
                                    ...vehicleData,
                                    [activeTab]: {
                                      ...data,
                                      returnCondition: { 
                                        ...data.returnCondition, 
                                        equipmentChecklist: { ...data.returnCondition.equipmentChecklist, [key]: checked === true } 
                                      }
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
                    <div className="py-12 text-center bg-neutral-50 dark:bg-neutral-800/30 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700 flex flex-col items-center gap-2">
                      <Car className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-2" />
                      <p className="text-sm font-semibold text-muted-foreground">Kendaraan ini tidak dipilih untuk dikembalikan saat ini.</p>
                      <p className="text-xs text-muted-foreground max-w-sm">Centang kotak <span className="font-bold text-foreground">Kembalikan kendaraan ini</span> di pojok kanan atas untuk memproses pengembaliannya.</p>
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

// Add a simple Label component since it was missing
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={className}>{children}</label>;
}
