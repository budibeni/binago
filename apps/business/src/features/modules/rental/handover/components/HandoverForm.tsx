import React from 'react';
import { Card, Button, FormShell, FormCard, InputNumber, InputTextarea, Label, InputSelect, InputCheckbox, InputDateTimeGps } from '@adatrack/ui';
import { MapPin, Car, Fuel, Wrench, CheckSquare, Clock, FileText, StickyNote } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { RentalContract } from '../../contracts/types/contract';
import type { RentalHandover } from '../types/handover';
import type { BookingItem } from '../../bookings/types/booking';

interface HandoverFormProps {
  contract: RentalContract;
  handedOverItemIds?: string[];
  labels: Record<string, string>;
  onSubmit: (data: Omit<RentalHandover, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
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

export function HandoverForm({ contract, handedOverItemIds = [], labels, onSubmit, onCancel, isSubmitting, layout = 'default', open, onOpenChange }: HandoverFormProps) {
  const [selectedItemIds, setSelectedItemIds] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<string>('');
  
  const pendingItems = contract.booking?.items?.filter(i => !handedOverItemIds.includes(i.id)) || [];
  const isSingleVehicle = pendingItems.length === 1;

  React.useEffect(() => {
    const pendingItems = contract.booking?.items?.filter(i => !handedOverItemIds.includes(i.id)) || [];
    if (pendingItems.length > 0 && !activeTab && selectedItemIds.length === 0) {
      setActiveTab(pendingItems[0].id);
      setSelectedItemIds(pendingItems.map(i => i.id));
    }
  }, [contract, handedOverItemIds, activeTab, selectedItemIds]);

  const [vehicleData, setVehicleData] = React.useState<Record<string, {
    handoverAt: string,
    latitude: number | null,
    longitude: number | null,
    address: string,
    odometer: number | null,
    fuelLevel: RentalHandover['fuelLevel'] | '',
    vehicleCondition: RentalHandover['vehicleCondition'] | '',
    equipment: RentalHandover['equipmentChecklist']
  }>>({});

  React.useEffect(() => {
    setVehicleData(prev => {
      const newData = { ...prev };
      const pendingItems = contract.booking?.items?.filter(i => !handedOverItemIds.includes(i.id)) || [];
      pendingItems.forEach(item => {
        if (!newData[item.id]) {
          const now = new Date();
          now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
          const defaultHandoverAt = now.toISOString().slice(0, 16);

          newData[item.id] = {
            handoverAt: defaultHandoverAt,
            latitude: null,
            longitude: null,
            address: '',
            odometer: null,
            fuelLevel: '',
            vehicleCondition: '',
            equipment: {
              stnk: false,
              spareTire: false,
              jack: false,
              toolkit: false,
              triangle: false,
              fireExtinguisher: false,
            }
          };
        }
      });
      return newData;
    });
  }, [contract, handedOverItemIds]);

  const [odometerSource, setOdometerSource] = React.useState<'VEHICLE' | 'TRACKING' | 'MANUAL'>('VEHICLE');
  const [notes, setNotes] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const id of selectedItemIds) {
      const data = vehicleData[id];
      if (data.odometer === null || data.fuelLevel === '' || data.vehicleCondition === '') {
        alert('Mohon lengkapi data Odometer, BBM, dan Kondisi untuk semua kendaraan yang dipilih.');
        return;
      }
      if (!data.latitude || !data.longitude) {
        alert('Lokasi serah terima wajib diambil untuk semua kendaraan yang dipilih.');
        return;
      }
    }

    const payload = selectedItemIds.map(id => {
      const item = contract.booking?.items?.find(i => i.id === id);
      const data = vehicleData[id];
      return {
        contractId: contract.id,
        bookingItemId: id,
        customerId: contract.customerId,
        vehicleId: item!.vehicleId,
        handoverAt: new Date(data.handoverAt).toISOString(),
        handoverLatitude: data.latitude!,
        handoverLongitude: data.longitude!,
        handoverAddress: data.address || '-',
        odometerStart: Number(data.odometer),
        odometerSource,
        fuelLevel: data.fuelLevel as RentalHandover['fuelLevel'],
        vehicleCondition: data.vehicleCondition as RentalHandover['vehicleCondition'],
        equipmentChecklist: data.equipment,
        notes: notes,
        staffId: 'usr-budi',
        staffName: 'Budi Beni'
      };
    });

    onSubmit(payload);
  };

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      onCancel={onCancel}
        cancelProps={{ disabled: isSubmitting }}
        cancelText={labels.btnCancel}
        saveText={isSubmitting ? 'Menyimpan...' : labels.btnSave}
        saveProps={{ disabled: isSubmitting || selectedItemIds.length === 0 }}
        isSubmitting={isSubmitting}
      >
        <div className="flex flex-col gap-4">

          {/* HEADER: Informasi Kontrak */}
          <FormCard
            title={labels.sectionContract}
            description="Rincian kontrak penyewaan yang menjadi dasar serah terima."
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
                {new Date(contract.startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} - {new Date(getMaxEndDate(contract.booking?.items || [])).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-normal text-neutral-500 mb-1">Layanan</p>
              <p className="text-[13px] font-semibold text-foreground">
                {contract.rentalType === 'SELF_DRIVE' ? 'Lepas Kunci' : 'Dgn Sopir'} 
              </p>
            </div>
          </div>
          </FormCard>

          {/* KONTEN: Detail Kendaraan (Tabs) */}
          <FormCard
            title={isSingleVehicle ? "Detail Kendaraan" : "Detail Kendaraan (Pilih Tab)"}
            description="Lengkapi data serah terima untuk kendaraan di bawah ini."
            icon={<Car className="w-5 h-5" />}
            iconWrapperClassName="text-sky-500"
          >
            <div className="space-y-3">
              {!isSingleVehicle && (
                <div className="shrink-0 bg-background border-b border-border mb-3">
                  <div className="flex items-center overflow-x-auto hide-scrollbar">
                    {pendingItems.map(item => {
                        const id = item.id;
                        const isSelected = activeTab === id;
                        const isChecked = selectedItemIds.includes(id);

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
                            {item.vehicle?.coreVehicle?.plateNumber}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {activeTab && (() => {
                const item = contract.booking?.items?.find(i => i.id === activeTab);
                const isChecked = selectedItemIds.includes(activeTab);

                return (
                  <div className="flex flex-col gap-4 pt-1">

                    {/* Checkbox Pilih Kendaraan */}
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div>
                        <h5 className="font-bold text-sm">{item?.vehicle?.coreVehicle?.plateNumber}</h5>
                        <p className="text-xs text-muted-foreground">{item?.vehicle?.coreVehicle?.brand} {item?.vehicle?.coreVehicle?.vehicleName}</p>
                      </div>
                      {!isSingleVehicle && (
                        <div className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg transition-colors">
                          <InputCheckbox
                            label="Serah terimakan kendaraan ini"
                            value={isChecked}
                            onChange={(checked) => {
                              if (checked) setSelectedItemIds([...selectedItemIds, activeTab]);
                              else setSelectedItemIds(selectedItemIds.filter(id => id !== activeTab));
                            }}
                            className="m-0"
                          />
                        </div>
                      )}
                    </div>

                    {isChecked ? (
                      <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                          <InputDateTimeGps
                            label="Waktu Serah Terima"
                            value={vehicleData[activeTab]?.handoverAt}
                            onChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], handoverAt: v } })}
                            latitude={vehicleData[activeTab]?.latitude}
                            longitude={vehicleData[activeTab]?.longitude}
                            onCoordinates={(lat, lng) => setVehicleData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], latitude: lat, longitude: lng } }))}
                            showAddress={false}
                            required
                          />
                          <InputTextarea
                            id={`addr-${activeTab}`}
                            label="Detail Alamat (Opsional)"
                            value={vehicleData[activeTab]?.address}
                            onChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], address: v } })}
                            placeholder="Cth: Area lobi..."
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border/50 pt-3">
                          <InputNumber
                            label="Odometer (km)"
                            value={vehicleData[activeTab]?.odometer ?? null}
                            onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], odometer: val } })}
                            placeholder="Contoh: 15000"
                          />
                          <InputSelect
                            label="BBM"
                            value={vehicleData[activeTab]?.fuelLevel}
                            onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], fuelLevel: val as any } })}
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
                            label="Kondisi"
                            value={vehicleData[activeTab]?.vehicleCondition}
                            onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], vehicleCondition: val as any } })}
                            placeholder="Pilih Kondisi Kendaraan"
                            options={[
                              { value: 'GOOD', label: 'Baik' },
                              { value: 'MINOR_DAMAGE', label: 'Kerusakan Ringan' },
                              { value: 'NEEDS_REPAIR', label: 'Perlu Perbaikan' },
                            ]}
                          />
                        </div>

                        <div className="border-t border-border/50 pt-3">
                          <Label className="text-[11px] uppercase font-semibold text-muted-foreground mb-2 block">Kelengkapan Kendaraan</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.keys(vehicleData[activeTab]?.equipment || {}).map((key) => {
                              if (key === 'other') return null;
                              return (
                                <div key={key} className="flex items-center">
                                  <InputCheckbox
                                    id={`eq-${activeTab}-${key}`}
                                    label={key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
                                    value={(vehicleData[activeTab]?.equipment as any)?.[key] || false}
                                    onChange={(checked) => setVehicleData({
                                      ...vehicleData,
                                      [activeTab]: {
                                        ...vehicleData[activeTab],
                                        equipment: { ...vehicleData[activeTab].equipment, [key]: checked === true }
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
                        <p className="text-sm text-muted-foreground">Kendaraan ini tidak dipilih untuk diserahterimakan saat ini.</p>
                        <p className="text-xs text-muted-foreground mt-1">Centang kotak di atas untuk mengisi detail kondisinya.</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </FormCard>

          {/* FOOTER: Catatan */}
          <FormCard
            title={labels.sectionNotes}
            description="Catatan tambahan secara keseluruhan jika ada."
            icon={<StickyNote className="w-4 h-4 text-neutral-500" />}
            iconWrapperClassName="text-neutral-500"
          >
            <InputTextarea
              id="notes"
              value={notes}
              onChange={setNotes}
              placeholder="Catatan tambahan terkait serah terima keseluruhan (Opsional)..."
              rows={3}
            />
          </FormCard>

        </div>
      </FormShell>
  );
}
