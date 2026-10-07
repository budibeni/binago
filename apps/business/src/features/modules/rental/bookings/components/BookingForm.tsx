'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { User, ShoppingCart, Calendar, Settings2, FileText, ClipboardList, Trash2, Plus, Info } from 'lucide-react';
import { Button, FormShell, FormCard, InputSelect, InputDate, InputTime, InputDecimal, InputString, InputTextarea, useForm } from '@adatrack/ui';
import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import type { RateType, RentalType, BookingStatus } from '../types/booking';
import { getBookingFormSchema } from '../types/booking';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getBookingTranslation } from '../i18n';
import { formatCurrency } from '@adatrack/utils';

export interface BookingItemData {
  vehicleId: string;
  rateType: RateType;
  packageId?: string;
  packageName?: string;
  duration: number; // in days or hours depending on rateType
  unitPrice: number;
  depositSnapshot: number;
  subtotal: number;
}

export interface BookingFormData {
  id?: string;
  bookingNumber?: string;
  status?: BookingStatus;
  customerId: string;
  items: BookingItemData[];
  startDate: string; // Global Pick-up time
  createdAt?: string; // Tanggal Booking
  rentalType: RentalType;
  deposit: number;
  notes: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  driverFee?: number;
}

interface BookingFormProps {
  initialData?: Partial<BookingFormData>;
  customers: Customer[];
  vehicles: RentalVehicle[];
  onSubmit: (data: BookingFormData & { endDate: string; duration: number }) => void;
  onCancel: () => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_FORM_DATA: BookingFormData = {
  customerId: '',
  items: [],
  startDate: '',
  rentalType: 'SELF_DRIVE',
  deposit: 0,
  notes: '',
  pickupLocation: '',
  dropoffLocation: '',
};

export function BookingForm({
  initialData,
  customers,
  vehicles,
  onSubmit,
  onCancel,
  layout = 'default',
  open,
  onOpenChange,
}: BookingFormProps) {
  const locale = useBusinessLocale();
  const t = getBookingTranslation(locale);
  const isEditing = !!initialData?.id;

  const { formData, errors, isSubmitting, handleChange, handleSubmit, setFormData } = useForm<BookingFormData>({
    initialData: initialData ? { ...DEFAULT_FORM_DATA, ...initialData } : DEFAULT_FORM_DATA,
    resetOn: [open],
    schema: getBookingFormSchema(t.validation || {}),
    onSubmit: async (data) => {
      // Calculate global max end date and duration for backend
      let maxDurationDays = 0;
      (data.items || []).forEach(item => {
        let days = 0;
        if (item.rateType === 'PACKAGE') {
          const v = vehicles.find(x => x.vehicleId === item.vehicleId);
          const pkg = v?.packages?.find(p => p.id === item.packageId);
          days = pkg?.durationDays || 1;
        } else if (item.rateType === 'DAILY') {
          days = item.duration;
        } else if (item.rateType === 'HOURLY') {
          days = item.duration / 24;
        }
        if (days > maxDurationDays) maxDurationDays = days;
      });
      if (maxDurationDays === 0) maxDurationDays = 1;

      let endDate = '';
      if (data.startDate) {
        const d = new Date(data.startDate);
        d.setDate(d.getDate() + maxDurationDays);
        endDate = d.toISOString();
      }

      await new Promise(r => setTimeout(r, 800)); // simulate API
      onSubmit({ ...(data as BookingFormData), endDate, duration: Math.ceil(maxDurationDays) });
    },
  });

  const selectedCustomer = useMemo(() => customers.find(c => c.id === formData.customerId), [customers, formData.customerId]);

  const [pickUpDate, setPickUpDate] = useState<string>('');
  const [pickUpTime, setPickUpTime] = useState<string>('');

  useEffect(() => {
    if (formData.startDate) {
      const d = new Date(formData.startDate);
      // en-CA is guaranteed YYYY-MM-DD, en-GB is guaranteed HH:mm
      setPickUpDate(d.toLocaleDateString('en-CA')); 
      setPickUpTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    }
  }, [formData.startDate]);

  const handlePickUpChange = (d: string, t: string) => {
    setPickUpDate(d);
    setPickUpTime(t);
    if (d && t) {
      const dateObj = new Date(`${d}T${t}:00`);
      handleChange('startDate', dateObj.toISOString());
    } else {
      handleChange('startDate', '');
    }
  };

  // Recalculate Subtotals for each item based on its own duration
  useEffect(() => {
    if (!formData.items || formData.items.length === 0) return;
    
    let hasChanges = false;
    const newItems = formData.items.map(item => {
      const v = vehicles.find(x => x.vehicleId === item.vehicleId);
      if (!v) return item;

      let subtotal = 0;
      let unitPrice = item.unitPrice;
      let depositSnapshot = item.depositSnapshot;

      if (item.rateType === 'PACKAGE' && item.packageId && v.packages) {
        const pkg = v.packages.find(p => p.id === item.packageId);
        if (pkg) {
          unitPrice = pkg.price;
          depositSnapshot = pkg.deposit || 0;
          subtotal = pkg.price; // Package price is absolute for its duration
        }
      } else if (item.rateType === 'DAILY') {
        unitPrice = v.dailyRate;
        depositSnapshot = v.dailyDeposit || 0;
        subtotal = v.dailyRate * (item.duration || 1);
      } else if (item.rateType === 'HOURLY') {
        unitPrice = v.hourlyRate;
        depositSnapshot = v.hourlyDeposit || 0;
        subtotal = v.hourlyRate * (item.duration || 1); 
      }

      if (item.subtotal !== subtotal || item.unitPrice !== unitPrice || item.depositSnapshot !== depositSnapshot) {
        hasChanges = true;
        return { ...item, subtotal, unitPrice, depositSnapshot, packageName: item.rateType === 'PACKAGE' && v.packages ? v.packages.find(p => p.id === item.packageId)?.name : undefined };
      }
      return item;
    });

    if (hasChanges) {
      handleChange('items', newItems);
    }
  }, [formData.items, vehicles, handleChange]);

  const totalAmount = useMemo(() => {
    const itemsTotal = (formData.items || []).reduce((acc, item) => acc + (item.subtotal || 0), 0);
    return itemsTotal + (formData.driverFee || 0);
  }, [formData.items, formData.driverFee]);

  const totalSuggestedDeposit = useMemo(() => {
    return (formData.items || []).reduce((acc, item) => acc + (item.depositSnapshot || 0), 0);
  }, [formData.items]);

  // Auto-update deposit when suggested deposit changes
  useEffect(() => {
    if (!isEditing && formData.deposit !== totalSuggestedDeposit) {
      handleChange('deposit', totalSuggestedDeposit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSuggestedDeposit, isEditing]);

  const [selectedVehicleToAdd, setSelectedVehicleToAdd] = useState<string>('');
  
  const handleAddVehicle = () => {
    if (selectedVehicleToAdd && !(formData.items || []).find(i => i.vehicleId === selectedVehicleToAdd)) {
      const v = vehicles.find(x => x.vehicleId === selectedVehicleToAdd);
      if (v) {
        const newItem: BookingItemData = {
          vehicleId: v.vehicleId,
          rateType: 'DAILY',
          duration: 1, // Default 1 Hari
          unitPrice: v.dailyRate,
          depositSnapshot: v.dailyDeposit || 0,
          subtotal: v.dailyRate * 1
        };
        handleChange('items', [...(formData.items || []), newItem]);
      }
      setSelectedVehicleToAdd('');
    }
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    handleChange('items', (formData.items || []).filter(v => v.vehicleId !== vehicleId));
  };

  const handleItemChange = (index: number, updates: Partial<BookingItemData>) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], ...updates };
    handleChange('items', newItems);
  };

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? `Edit Booking ${formData.bookingNumber ? `(${formData.bookingNumber})` : ''}`.trim() : (t.addBooking || 'Tambah Booking')}
      subtitle="Masukkan informasi detail booking."
      onCancel={onCancel}
      cancelText={t.cancel || 'Batal'}
      onSave={() => handleSubmit()}
      saveText={t.save || 'Simpan'}
      isSubmitting={isSubmitting}
      columns={2}
    >
      {/* BARIS 1 */}
      
        
        {/* KIRI: PELANGGAN */}
        <div className="flex flex-col gap-6 h-full">
          <FormCard className="h-full" title={t.sectionGeneral} description={t.selectCustomerDesc || "Pilih pelanggan dari database."} icon={<User className="w-5 h-5 text-primary" />} iconWrapperClassName="bg-primary/10">
            <div className="flex flex-col gap-6">
              <div>
                <InputSelect
                  label={t.fieldCustomer}
                  value={formData.customerId || ''}
                  onChange={(val) => handleChange('customerId', val)}
                  placeholder={t.searchCustomerPlaceholder}
                  options={customers.map(c => ({ value: c.id, label: `${c.name} - ${c.phone}` }))}
                  error={errors.customerId}
                  required
                />
              </div>

              {selectedCustomer ? (
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 -mt-2">
                  <div>
                    <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{t.customerType || "Tipe Pelanggan"}</p>
                    <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold text-primary">{selectedCustomer.type === 'COMPANY' ? 'Perusahaan' : 'Individu'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{selectedCustomer.type === 'COMPANY' ? (t.companyName || 'Nama Perusahaan') : (t.fullName || 'Nama Lengkap')}</p>
                    <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{t.contact || "Kontak"}</p>
                    <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">{selectedCustomer.phone} • {selectedCustomer.email || '-'}</p>
                  </div>
                  {selectedCustomer.type === 'INDIVIDUAL' ? (
                    <div>
                      <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">NIK (KTP)</p>
                      <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">{(selectedCustomer as any).nik || '-'}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{t.picName || "PIC (Penanggung Jawab)"}</p>
                      <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold">{(selectedCustomer as any).picName || '-'} ({(selectedCustomer as any).picPhone || '-'})</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-1">{t.address || "Alamat"}</p>
                    <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold line-clamp-2" title={selectedCustomer.address}>{selectedCustomer.address || '-'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-dashed border-border/60 -mt-2 text-center h-[240px]">
                  <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground font-medium">{t.noCustomerSelected || "Belum ada pelanggan yang dipilih"}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Silakan cari dan pilih pelanggan terlebih dahulu.</p>
                </div>
              )}
            </div>
          </FormCard>
        </div>

        {/* KANAN: STATUS, PEMBAYARAN & EKSTRA */}
        <div className="flex flex-col gap-6 h-full">
          <FormCard className="h-full" title={t.bookingSettings || "Pengaturan Booking"} description={t.bookingSettingsDesc || "Atur status dan tipe penyewaan kendaraan."} icon={<Settings2 className="w-5 h-5 text-blue-500" />} iconWrapperClassName="bg-blue-100 dark:bg-blue-900/30">
            <div className="flex flex-col gap-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputSelect
                    label={t.fieldRentalType}
                    value={formData.rentalType || 'SELF_DRIVE'}
                    onChange={(val) => handleChange('rentalType', val as RentalType)}
                    options={[
                      { value: 'SELF_DRIVE', label: t.rentalTypeSelfDrive },
                      { value: 'WITH_DRIVER', label: t.rentalTypeWithDriver }
                    ]}
                    error={errors.rentalType}
                    required
                  />
                </div>
                <div>
                  <InputSelect
                    label={'Status Booking'}
                    value={formData.status || 'DRAFT'}
                    onChange={(val) => handleChange('status', val as BookingStatus)}
                    options={isEditing ? [
                      { value: 'DRAFT', label: t.statusDraft || 'Draft' },
                      { value: 'BOOKED', label: t.statusBooked || 'Dipesan' },
                      { value: 'CANCELLED', label: t.statusCancelled || 'Dibatalkan' }
                    ] : [
                      { value: 'DRAFT', label: t.statusDraft || 'Draft' },
                      { value: 'BOOKED', label: t.statusBooked || 'Dipesan' }
                    ]}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <InputDate
                  label={t.pickupDate || "Tanggal Ambil"}
                  value={pickUpDate}
                  onChange={(d) => handlePickUpChange(d, pickUpTime)}
                  error={errors.startDate}
                  required
                />
                <InputTime
                  label={t.pickupTimeOnly || "Jam Ambil"}
                  value={pickUpTime}
                  onChange={(t) => handlePickUpChange(pickUpDate, t)}
                  error={errors.startDate}
                  required
                />
              </div>

              <div>
                <InputString
                  label={t.fieldPickupLocation || 'Lokasi Pengambilan'}
                  value={formData.pickupLocation || ''}
                  onChange={(val) => handleChange('pickupLocation', val)}
                  placeholder={t.pickupPlaceholder || 'Contoh: Bandara, Stasiun'}
                />
              </div>

              <div>
                <InputTextarea
                  label={t.fieldNotes}
                  value={formData.notes || ''}
                  onChange={(val) => handleChange('notes', val)}
                  placeholder={t.notesPlaceholder}
                  maxLength={500}
                  helpText={`${formData.notes?.length || 0} / 500`}
                  error={errors.notes}
                  className="min-h-[120px]"
                />
              </div>

            </div>
          </FormCard>
        </div>

      {/* BARIS 2: KENDARAAN */}
      <div className="mt-2 md:col-span-2 group-data-[layout=drawer]/form:!col-span-1 group-data-[layout=dialog]/form:!col-span-1">
        <FormCard title={t.sectionVehicle || "Daftar Kendaraan"} description={t.selectVehicleDesc || "Pilih kendaraan yang disewa beserta durasi/paketnya."} icon={<ShoppingCart className="w-5 h-5 text-emerald-500" />} iconWrapperClassName="bg-emerald-100 dark:bg-emerald-900/30">
          
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-foreground">{t.selectVehicle || "Pilih Kendaraan"}</h4>
            
            {/* Hanya tampilkan input fee jika with driver */}
            {formData.rentalType === 'WITH_DRIVER' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">{t.globalDriverFee || "Biaya Pengemudi (Global)"}</span>
                <div className="w-[150px]">
                  <InputDecimal
                    value={formData.driverFee || 0}
                    onChange={(val) => handleChange('driverFee', val !== null ? val : 0)}
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mb-2">
            <div className="flex items-end gap-2">
              <div className="w-[300px]">
                <InputSelect
                  value={selectedVehicleToAdd}
                  onChange={setSelectedVehicleToAdd}
                  placeholder={t.selectVehicle || "Pilih Kendaraan"}
                  options={vehicles
                    .filter(v => (v.status === 'READY' || v.status === 'RESERVED') && !(formData.items || []).find(i => i.vehicleId === v.vehicleId))
                    .map(v => ({ value: v.vehicleId, label: `${v.coreVehicle.plateNumber} - ${v.coreVehicle.brand} ${v.coreVehicle.vehicleName}` }))}
                />
              </div>
              <Button type="button" onClick={handleAddVehicle} disabled={!selectedVehicleToAdd} variant="secondary">
                <Plus className="w-4 h-4 mr-1" /> {t.add || "Tambah"}
              </Button>
            </div>
            {errors.items && typeof errors.items === 'string' && <p className="text-xs text-danger">{errors.items}</p>}

            {(formData.items && formData.items.length > 0) ? (
              <div className="flex flex-col gap-3 mt-2">
                {formData.items.map((item, index) => {
                  const v = vehicles.find(x => x.vehicleId === item.vehicleId);
                  if (!v && !item.vehicleSnapshot) return null;
                  
                  const plate = item.vehicleSnapshot?.licensePlate || v?.coreVehicle.plateNumber;
                  const brand = item.vehicleSnapshot?.brand || v?.coreVehicle.brand;
                  const model = item.vehicleSnapshot?.model || v?.coreVehicle.vehicleName;
                  const category = item.vehicleSnapshot?.categoryName || v?.categoryName;

                  return (
                    <div key={item.vehicleId} className="flex flex-col md:flex-row gap-4 p-4 border border-border/60 bg-white dark:bg-neutral-900/60 rounded-xl items-start md:items-center relative group">
                      {/* Vehicle Info */}
                      <div className="flex-1 min-w-[200px]">
                        <p className="font-bold text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-foreground">{plate}</p>
                        <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground">{brand} {model}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-border/50 text-[9px] font-bold uppercase tracking-wider">{category || 'Kategori'}</span>
                        </div>
                      </div>

                      {/* Pricing Config */}
                      <div className="flex-2 flex flex-col md:flex-row gap-3 min-w-[300px] items-center">
                        <div className="w-full md:w-1/3">
                          <InputSelect
                            value={item.rateType}
                            onChange={(val) => handleItemChange(index, { rateType: val as RateType, packageId: undefined, duration: val === 'HOURLY' ? 6 : 1 })}
                            options={[
                              { value: 'DAILY', label: t.rateDaily || 'Harian' },
                              { value: 'HOURLY', label: t.rateHourly || 'Per Jam' },
                              { value: 'PACKAGE', label: 'Paket' }
                            ]}
                          />
                        </div>
                        <div className="w-full md:w-2/3">
                          {item.rateType === 'PACKAGE' ? (
                            <InputSelect
                              value={item.packageId || ''}
                              onChange={(val) => handleItemChange(index, { packageId: val })}
                              placeholder={t.selectPackage || "Pilih Paket"}
                              options={(v.packages || []).map(p => ({ value: p.id, label: `${p.name} (${p.durationDays} hari)` }))}
                            />
                          ) : (
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <InputDecimal
                                  value={item.duration}
                                  onChange={(val) => handleItemChange(index, { duration: val || 1 })}
                                  placeholder="Durasi"
                                />
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground font-medium px-1">
                                {item.rateType === 'DAILY' ? (t.day || 'Hari') : (t.hour || 'Jam')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      
                      {/* Subtotal & Actions */}
                      <div className="flex flex-col items-end min-w-[140px] pt-2 md:pt-0 border-t md:border-t-0 border-border/40 w-full md:w-auto mr-4">
                        <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-0.5">{t.returnText || "Pengembalian"}</p>
                        <p className="text-[12px] group-data-[layout=drawer]/form:!text-[11px] group-data-[layout=dialog]/form:!text-[11px] font-semibold text-foreground bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-border/50">
                          {(() => {
                            if (!formData.startDate) return "-";
                            const d = new Date(formData.startDate);
                            if (item.rateType === "HOURLY") {
                              d.setHours(d.getHours() + (item.duration || 1));
                            } else if (item.rateType === "PACKAGE" && item.packageId && v.packages) {
                              const pkg = v.packages.find((p) => p.id === item.packageId);
                              d.setDate(d.getDate() + (pkg?.durationDays || 1));
                            } else {
                              d.setDate(d.getDate() + (item.duration || 1));
                            }
                            return d.toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }).replace(",", "");
                          })()}
                        </p>
                      </div>

                      {/* Subtotal & Actions */}
                      <div className="flex flex-col items-end min-w-[120px] pt-2 md:pt-0 border-t md:border-t-0 border-border/40 w-full md:w-auto">
                        <p className="text-[11px] group-data-[layout=drawer]/form:!text-[10px] group-data-[layout=dialog]/form:!text-[10px] text-muted-foreground font-medium mb-0.5">{t.subtotalRental || "Subtotal Sewa"}</p>
                        <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-bold text-primary">{formatCurrency(item.subtotal)}</p>
                        <div className="flex items-center gap-1 mt-0.5" title={`Deposit Kendaraan: ${formatCurrency(item.depositSnapshot)}`}>
                          <Info className="w-3 h-3 text-muted-foreground" />
                          <p className="text-[10px] text-muted-foreground">{t.depositText || "Jaminan"}: {formatCurrency(item.depositSnapshot)}</p>
                        </div>
                      </div>
                      
                      <button 
                        type="button" 
                        onClick={() => handleRemoveVehicle(item.vehicleId)}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-danger/10 text-danger flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger hover:text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-border/60 rounded-xl text-center flex flex-col items-center justify-center mt-2 bg-neutral-50/50 dark:bg-neutral-900/30">
                <ShoppingCart className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold text-foreground">{t.emptyCart || "Keranjang Masih Kosong"}</p>
                <p className="text-xs text-muted-foreground max-w-[250px] mt-1">{t.emptyCartDesc || "Tambahkan kendaraan untuk mulai mengatur tarif pemesanan."}</p>
              </div>
            )}
          </div>
        </FormCard>
      </div>

      {/* RINGKASAN BOOKING */}
      <FormCard title={t.sectionSummary} description="Cek kembali detail booking sebelum menyimpan." icon={<ClipboardList className="w-5 h-5 text-amber-500" />} iconWrapperClassName="bg-amber-100 dark:bg-amber-900/30" className="mt-2 group-data-[layout=default]/form:lg:col-span-2 group-data-[layout=dialog]/form:lg:col-span-2 group-data-[layout=fullscreen]/form:lg:col-span-2">
        <div className="flex flex-col md:flex-row group-data-[layout=drawer]/form:!flex-col gap-6 pt-2">
          <div className="flex-1 flex flex-col gap-3">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-2 group-data-[layout=drawer]/form:!grid-cols-1 group-data-[layout=drawer]/form:!gap-y-2">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground">{t.fieldCustomer || "Pelanggan"}</span>
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold">{selectedCustomer?.name || '-'}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground">{t.fieldVehicle || "Kendaraan"}</span>
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold">{formData.items?.length || 0} unit</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground">{t.fieldRentalType || "Tipe Rental"}</span>
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold">{formData.rentalType === 'SELF_DRIVE' ? t.rentalTypeSelfDrive : t.rentalTypeWithDriver}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 xl:border-l xl:pl-6 group-data-[layout=drawer]/form:!border-l-0 group-data-[layout=drawer]/form:!pl-0 group-data-[layout=drawer]/form:!border-t group-data-[layout=drawer]/form:!pt-2 group-data-[layout=drawer]/form:!mt-1 border-border/30">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground">Tgl Booking</span>
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold">
                    {new Date(formData.createdAt || new Date()).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 pt-1">
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground">{t.pickupTime || "Waktu Ambil"}</span>
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold">
                    {formData.startDate ? new Date(formData.startDate).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-"}
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 pt-1">
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground">{t.returnMaxTime || "Selesai (Maks)"}</span>
                  <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold text-primary">
                    {(() => {
                      if (!formData.startDate || !formData.items || formData.items.length === 0) return "-";
                      let maxDate = new Date(formData.startDate);
                      formData.items.forEach(item => {
                        const d = new Date(formData.startDate!);
                        const v = vehicles.find(x => x.vehicleId === item.vehicleId);
                        if (item.rateType === "HOURLY") {
                          d.setHours(d.getHours() + (item.duration || 1));
                        } else if (item.rateType === "PACKAGE" && item.packageId && v?.packages) {
                          const pkg = v.packages.find((p) => p.id === item.packageId);
                          d.setDate(d.getDate() + (pkg?.durationDays || 1));
                        } else {
                          d.setDate(d.getDate() + (item.duration || 1));
                        }
                        if (d > maxDate) maxDate = d;
                      });
                      return maxDate.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 w-full pr-0">
              <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-lg p-3 w-full">
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col gap-0.5 max-w-[80%]">
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">Uang Jaminan (Deposit)</span>
                    <span className="text-[9px] text-muted-foreground/80 leading-relaxed mt-0.5">* Ditagih terpisah dari biaya sewa dan akan di-<i>refund</i> utuh saat kendaraan kembali dengan aman.</span>
                  </div>
                  <span className="text-[12px] font-semibold text-amber-700/90 dark:text-amber-400/90 whitespace-nowrap ml-2 mt-0.5">{formatCurrency(formData.deposit || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[280px] group-data-[layout=drawer]/form:!w-full shrink-0 border-t md:border-t-0 md:border-l group-data-[layout=drawer]/form:!border-t group-data-[layout=drawer]/form:!border-l-0 border-border/50 pt-6 md:pt-0 md:pl-6 group-data-[layout=drawer]/form:!pt-6 group-data-[layout=drawer]/form:!pl-0 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground">{t.subtotalRental || "Subtotal Sewa"}</span>
              <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold">{formatCurrency(totalAmount - (formData.driverFee || 0))}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] text-muted-foreground">
                {formData.rentalType === 'WITH_DRIVER' ? (t.driverFeeText || "Biaya Pengemudi") : "Biaya Lainnya"}
              </span>
              <span className="text-[13px] group-data-[layout=drawer]/form:!text-[12px] group-data-[layout=dialog]/form:!text-[12px] font-semibold">
                {formatCurrency(formData.driverFee || 0)}
              </span>
            </div>
            <div className="mb-0 mt-auto bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 w-full">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-[10px] text-red-700 dark:text-red-400 font-semibold uppercase tracking-wider">Total Tagihan Sewa</span>
                  <span className="text-[9px] text-muted-foreground/80 leading-relaxed mt-0.5 group-data-[layout=drawer]/form:text-transparent group-data-[layout=drawer]/form:select-none">* Tagihan murni layanan rental.</span>
                </div>
                <span className="text-[14px] font-bold text-red-800 dark:text-red-300 whitespace-nowrap ml-2">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </FormCard>
    </FormShell>
  );
}
