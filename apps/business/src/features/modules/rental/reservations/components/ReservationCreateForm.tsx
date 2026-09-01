import React, { useMemo } from 'react';
import { User, Car, Calendar, DollarSign, FileText, ClipboardList } from 'lucide-react';
import { cn } from '@adatrack/utils';
import { Button } from '@adatrack/ui';
import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import type { RateType, RentalType } from '../types/reservation';

export interface ReservationCreateFormData {
  customerId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  duration: number;
  rentalType: RentalType;
  rateType: RateType;
  deposit: number;
  notes: string;
}

interface ReservationCreateFormProps {
  formData: ReservationCreateFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationCreateFormData>>;
  customers: Customer[];
  vehicles: RentalVehicle[];
  labels: Record<string, string>;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  totalAmount: number;
  remainingAmount: number;
}

export function ReservationCreateForm({
  formData,
  setFormData,
  customers,
  vehicles,
  labels,
  onSubmit,
  onCancel,
  isSubmitting,
  totalAmount,
  remainingAmount,
}: ReservationCreateFormProps) {

  const selectedCustomer = useMemo(() => customers.find(c => c.id === formData.customerId), [customers, formData.customerId]);
  const selectedVehicle = useMemo(() => vehicles.find(v => v.id === formData.vehicleId), [vehicles, formData.vehicleId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  const SectionCard = ({ title, description, icon: Icon, children, className }: any) => (
    <div className={cn("bg-white dark:bg-neutral-900 border border-border rounded-xl p-5 shadow-sm h-fit", className)}>
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-0.5 mt-0.5">
          <h3 className="text-[14px] font-bold text-foreground">{title}</h3>
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-auto p-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. INFORMASI PELANGGAN */}
          <SectionCard title={labels.sectionCustomer} description="Pilih atau tambahkan pelanggan baru yang akan melakukan reservasi." icon={User}>
            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldCustomer} <span className="text-danger">*</span></label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                    value={formData.customerId}
                    onChange={e => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  >
                    <option value="">{labels.searchCustomerPlaceholder}</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" className="h-10 text-danger border-danger/30 hover:bg-danger/5 shrink-0">
                  <span className="font-bold mr-1">+</span> {labels.newCustomer}
                </Button>
              </div>

              {selectedCustomer && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-border/30 mt-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold mb-1">Nama Pelanggan</p>
                    <p className="text-sm font-bold">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold mb-1">Nomor Telepon</p>
                    <p className="text-sm font-bold">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold mb-1">Email</p>
                    <p className="text-sm font-bold">{selectedCustomer.email || '-'}</p>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* 2. INFORMASI KENDARAAN */}
          <SectionCard title={labels.sectionVehicle} description="Pilih kendaraan yang akan disewa." icon={Car}>
             <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldVehicle} <span className="text-danger">*</span></label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                    value={formData.vehicleId}
                    onChange={e => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
                  >
                    <option value="">{labels.selectVehiclePlaceholder}</option>
                    {vehicles.filter(v => v.status === 'READY' || v.status === 'RESERVED').map(v => (
                      <option key={v.id} value={v.vehicleId}>{v.coreVehicle.plateNumber} - {v.coreVehicle.brand} {v.coreVehicle.vehicleName}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldVehicleStatus}</label>
                  <div className="h-10 px-3 rounded-lg border bg-neutral-50 dark:bg-neutral-900 flex items-center text-sm text-muted-foreground">
                    {selectedVehicle ? selectedVehicle.status : '-'}
                  </div>
                </div>
              </div>

              {selectedVehicle && (
                <div className="grid grid-cols-4 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-border/30 mt-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold mb-1">Plat Nomor</p>
                    <p className="text-sm font-bold">{selectedVehicle.coreVehicle.plateNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground font-semibold mb-1">Merk / Model</p>
                    <p className="text-sm font-bold">{selectedVehicle.coreVehicle.brand} {selectedVehicle.coreVehicle.vehicleName} {selectedVehicle.coreVehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-semibold mb-1">Kilometer</p>
                    <p className="text-sm font-bold">{selectedVehicle.currentOdometer.toLocaleString('id-ID')} km</p>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* 3. PERIODE RESERVASI */}
          <SectionCard title={labels.sectionPeriod} description="Tentukan tanggal mulai dan selesai serta durasi sewa." icon={Calendar}>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldStartDate} <span className="text-danger">*</span></label>
                  <input 
                    type="datetime-local" 
                    className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                    value={formData.startDate.slice(0, 16)}
                    onChange={e => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value).toISOString() }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldEndDate} <span className="text-danger">*</span></label>
                  <input 
                    type="datetime-local" 
                    className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                    value={formData.endDate.slice(0, 16)}
                    onChange={e => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value).toISOString() }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldDuration}</label>
                  <div className="h-10 px-3 rounded-lg border bg-neutral-50 dark:bg-neutral-900 flex items-center text-sm font-semibold">
                    {formData.duration} hari
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldRentalType} <span className="text-danger">*</span></label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                    value={formData.rentalType}
                    onChange={e => setFormData(prev => ({ ...prev, rentalType: e.target.value as RentalType }))}
                  >
                    <option value="SELF_DRIVE">{labels.rentalTypeSelfDrive}</option>
                    <option value="WITH_DRIVER">{labels.rentalTypeWithDriver}</option>
                  </select>
                </div>
             </div>
          </SectionCard>

          {/* 4. INFORMASI HARGA */}
          <SectionCard title={labels.sectionPricing} description="Detail tarif sewa dan total biaya." icon={DollarSign}>
             <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldDailyRate}</label>
                  <div className="h-10 px-3 rounded-lg border bg-neutral-50 dark:bg-neutral-900 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Rp</span>
                    <span className="font-semibold">{selectedVehicle ? selectedVehicle.dailyRate.toLocaleString('id-ID') : '-'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldWeeklyRate}</label>
                  <div className="h-10 px-3 rounded-lg border bg-neutral-50 dark:bg-neutral-900 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Rp</span>
                    <span className="font-semibold">{selectedVehicle ? selectedVehicle.weeklyRate.toLocaleString('id-ID') : '-'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldMonthlyRate}</label>
                  <div className="h-10 px-3 rounded-lg border bg-neutral-50 dark:bg-neutral-900 flex items-center text-sm">
                    <span className="text-muted-foreground mr-2">Rp</span>
                    <span className="font-semibold">{selectedVehicle ? selectedVehicle.monthlyRate.toLocaleString('id-ID') : '-'}</span>
                  </div>
                </div>
             </div>
             
             <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldDuration}</label>
                  <select disabled className="w-full h-10 px-3 rounded-lg border bg-neutral-50 dark:bg-neutral-900 text-sm outline-none opacity-80 cursor-not-allowed appearance-none">
                    <option>{formData.duration} hari</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldUsedRate}</label>
                  <select 
                    className="w-full h-10 px-3 rounded-lg border bg-transparent text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                    value={formData.rateType}
                    onChange={e => setFormData(prev => ({ ...prev, rateType: e.target.value as RateType }))}
                  >
                    <option value="DAILY">Tarif Harian</option>
                    <option value="WEEKLY">Tarif Mingguan</option>
                    <option value="MONTHLY">Tarif Bulanan</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldTotalEstimate}</label>
                  <div className="h-10 px-3 rounded-lg border border-danger/20 bg-danger/5 flex items-center text-sm">
                    <span className="text-danger font-bold">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
             </div>

             <div className="w-1/3 pr-2">
                <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldDeposit}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
                  <input 
                    type="number" 
                    className="w-full h-10 pl-9 pr-3 rounded-lg border bg-transparent text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger"
                    placeholder="0"
                    value={formData.deposit || ''}
                    onChange={e => setFormData(prev => ({ ...prev, deposit: Number(e.target.value) }))}
                  />
                </div>
             </div>
          </SectionCard>

          {/* 5. INFORMASI TAMBAHAN */}
          <SectionCard title={labels.sectionAdditional} description="Kebutuhan tambahan dan catatan." icon={FileText}>
             <div className="flex gap-6 h-full">
               <div className="flex-1 flex flex-col">
                  <label className="text-xs font-bold text-foreground mb-1.5 block">{labels.fieldNotes}</label>
                  <div className="relative flex-1">
                    <textarea 
                      className="w-full h-[120px] p-3 rounded-lg border bg-transparent text-sm outline-none focus:border-danger focus:ring-1 focus:ring-danger resize-none"
                      placeholder={labels.notesPlaceholder}
                      value={formData.notes}
                      maxLength={500}
                      onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                    <div className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">
                      {formData.notes.length} / 500
                    </div>
                  </div>
               </div>
               <div className="w-48 shrink-0">
                  <label className="text-xs font-bold text-foreground mb-2.5 block">{labels.fieldAdditionalNeeds}</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border text-danger focus:ring-danger" />
                      <span className="text-sm">{labels.needDriver}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border text-danger focus:ring-danger" />
                      <span className="text-sm">{labels.needDelivery}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border text-danger focus:ring-danger" />
                      <span className="text-sm">{labels.needFuel}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border text-danger focus:ring-danger" />
                      <span className="text-sm">{labels.needOther}</span>
                    </label>
                  </div>
               </div>
             </div>
          </SectionCard>

          {/* RINGKASAN RESERVASI */}
          <SectionCard title={labels.sectionSummary} description="Cek kembali detail reservasi sebelum menyimpan." icon={ClipboardList} className="bg-neutral-50/50 dark:bg-neutral-900/30">
            <div className="flex gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-sm text-muted-foreground">Pelanggan</span>
                  <span className="text-sm font-semibold">{selectedCustomer?.name || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-sm text-muted-foreground">Kendaraan</span>
                  <span className="text-sm font-semibold">{selectedVehicle ? `${selectedVehicle.coreVehicle.plateNumber} - ${selectedVehicle.coreVehicle.brand} ${selectedVehicle.coreVehicle.vehicleName}` : '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-sm text-muted-foreground">Periode</span>
                  <span className="text-sm font-semibold">
                    {formData.startDate && formData.endDate 
                      ? `${new Date(formData.startDate).toLocaleDateString('id-ID')} - ${new Date(formData.endDate).toLocaleDateString('id-ID')}`
                      : '-'}
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-sm text-muted-foreground">Durasi</span>
                  <span className="text-sm font-semibold">{formData.duration} hari</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-sm text-muted-foreground">Tipe Rental</span>
                  <span className="text-sm font-semibold">{formData.rentalType === 'SELF_DRIVE' ? labels.rentalTypeSelfDrive : labels.rentalTypeWithDriver}</span>
                </div>
              </div>
              
              <div className="w-[280px] shrink-0 border-l border-border/50 pl-6 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Total Estimasi</span>
                  <span className="text-sm font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-muted-foreground">Deposit</span>
                  <span className="text-sm font-semibold">{formatCurrency(formData.deposit)}</span>
                </div>
                
                <div className="mt-auto bg-danger/5 border border-danger/10 rounded-lg p-3">
                  <p className="text-[11px] text-muted-foreground font-semibold mb-1">{labels.remainingEstimate}</p>
                  <p className="text-lg font-bold text-danger">{formatCurrency(remainingAmount)}</p>
                </div>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 px-4 md:px-8 bg-white dark:bg-neutral-950 border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-10 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[14px] font-bold text-foreground">
            {labels.addReservation || 'Buat Reservasi Baru'}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Masukkan informasi detail untuk membuat reservasi baru.
          </p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="bg-white dark:bg-neutral-900" onClick={onCancel} disabled={isSubmitting}>
            {labels.cancel || 'Batal'}
          </Button>
          <Button type="button" variant="primary" className="bg-danger hover:bg-danger/90 text-white" onClick={onSubmit} disabled={isSubmitting}>
            {labels.save || 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
