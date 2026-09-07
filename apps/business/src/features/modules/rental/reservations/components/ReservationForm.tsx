'use client';

import React, { useMemo } from 'react';
import { User, Car, Calendar, DollarSign, FileText, ClipboardList } from 'lucide-react';
import { Button, FormShell, FormCard, InputSelect, InputDateTime, InputDecimal, InputString, InputTextarea, InputCheckbox, InputMultiCheckbox, useForm } from '@adatrack/ui';
import type { Customer } from '@/features/modules/rental/customers/types/customer';
import type { RentalVehicle } from '@/features/modules/rental/vehicles/types/rentalVehicle';
import type { RateType, RentalType, Reservation } from '../types/reservation';
import { getReservationFormSchema } from '../types/reservation';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getReservationTranslation } from '../i18n';

export interface ReservationFormData {
  id?: string;
  customerId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  duration: number;
  rentalType: RentalType;
  rateType: RateType;
  deposit: number;
  paymentMethod?: string;
  notes: string;
  needDriver?: boolean;
  needDelivery?: boolean;
  needFuel?: boolean;
  needInsurance?: boolean;
  pickupLocation?: string;
  dropoffLocation?: string;
}

interface ReservationFormProps {
  initialData?: Partial<ReservationFormData>;
  customers: Customer[];
  vehicles: RentalVehicle[];
  onSubmit: (data: ReservationFormData) => void;
  onCancel: () => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_FORM_DATA: ReservationFormData = {
  customerId: '',
  vehicleId: '',
  startDate: '',
  endDate: '',
  duration: 1,
  rentalType: 'SELF_DRIVE',
  rateType: 'DAILY',
  deposit: 0,
  paymentMethod: 'TRANSFER',
  notes: '',
  needDriver: false,
  needDelivery: false,
  needFuel: false,
  needInsurance: false,
  pickupLocation: '',
  dropoffLocation: '',
};

export function ReservationForm({
  initialData,
  customers,
  vehicles,
  onSubmit,
  onCancel,
  layout = 'default',
  open,
  onOpenChange,
}: ReservationFormProps) {
  const locale = useBusinessLocale();
  const t = getReservationTranslation(locale);
  const isEditing = !!initialData?.id;

  const { formData, errors, isSubmitting, handleChange, handleSubmit, setFormData } = useForm<ReservationFormData>({
    initialData: initialData ? { ...DEFAULT_FORM_DATA, ...initialData } : DEFAULT_FORM_DATA,
    resetOn: [open],
    schema: getReservationFormSchema(t.validation || {}),
    onSubmit: async (data) => {
      await new Promise(r => setTimeout(r, 800)); // simulate API
      onSubmit(data as ReservationFormData);
    },
  });

  const selectedCustomer = useMemo(() => customers.find(c => c.id === formData.customerId), [customers, formData.customerId]);
  const selectedVehicle = useMemo(() => vehicles.find(v => v.vehicleId === formData.vehicleId || v.id === formData.vehicleId), [vehicles, formData.vehicleId]);

  // Derived state calculations based on dates and rate
  React.useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays !== formData.duration) {
        setFormData(prev => ({ ...prev, duration: diffDays }));
      }
    }
  }, [formData.startDate, formData.endDate, setFormData]);

  const totalAmount = useMemo(() => {
    if (!selectedVehicle) return 0;
    const duration = formData.duration || 1;
    let rate = selectedVehicle.dailyRate;
    if (formData.rateType === 'WEEKLY') rate = selectedVehicle.weeklyRate || (selectedVehicle.dailyRate * 7);
    if (formData.rateType === 'MONTHLY') rate = selectedVehicle.monthlyRate || (selectedVehicle.dailyRate * 30);
    return rate * duration;
  }, [selectedVehicle, formData.duration, formData.rateType]);

  const remainingAmount = useMemo(() => {
    return totalAmount - (formData.deposit || 0);
  }, [totalAmount, formData.deposit]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Reservasi' : t.addReservation}
      subtitle="Masukkan informasi detail reservasi."
      onCancel={onCancel}
      cancelText={t.cancel || 'Batal'}
      onSave={() => handleSubmit()}
      saveText={t.save || 'Simpan'}
      isSubmitting={isSubmitting}
      columns={2}
    >
      <div className="flex flex-col gap-6">
        {/* 1. INFORMASI UTAMA */}
        <FormCard title={t.sectionGeneral} description="Pilih pelanggan, kendaraan, dan tipe rental." icon={<User className="w-5 h-5 text-muted-foreground" />}>
          <div className="flex flex-col gap-6">
            <div className="flex items-end gap-3">
              <div className="flex-1">
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
            </div>

            {selectedCustomer && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-border/30 -mt-2">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputSelect
                  label={t.fieldVehicle}
                  value={formData.vehicleId || ''}
                  onChange={(val) => handleChange('vehicleId', val)}
                  placeholder={t.selectVehiclePlaceholder}
                  options={vehicles.filter(v => v.status === 'READY' || v.status === 'RESERVED' || v.vehicleId === formData.vehicleId).map(v => ({ value: v.vehicleId, label: `${v.coreVehicle.plateNumber} - ${v.coreVehicle.brand} ${v.coreVehicle.vehicleName}` }))}
                  error={errors.vehicleId}
                  required
                />
              </div>
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
            </div>

            {selectedVehicle && (
              <div className="grid grid-cols-4 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-border/30 -mt-2">
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
        </FormCard>

        {/* 2. WAKTU & LOKASI */}
        <FormCard title={t.sectionTimeLocation} description="Tentukan waktu dan lokasi pengambilan serta pengembalian kendaraan." icon={<Calendar className="w-5 h-5 text-muted-foreground" />}>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <InputDateTime
                label={t.fieldStartDate}
                value={formData.startDate || ''}
                onChange={(val) => handleChange('startDate', val ? new Date(val).toISOString() : '')}
                error={errors.startDate}
                required
              />
              <InputString
                label={t.fieldPickupLocation || 'Lokasi Pengambilan'}
                value={formData.pickupLocation || ''}
                onChange={(val) => handleChange('pickupLocation', val)}
                placeholder={t.pickupPlaceholder || 'Contoh: Bandara, Stasiun'}
              />
            </div>
            <div className="flex flex-col gap-4">
              <InputDateTime
                label={t.fieldEndDate}
                value={formData.endDate || ''}
                onChange={(val) => handleChange('endDate', val ? new Date(val).toISOString() : '')}
                error={errors.endDate}
                required
              />
              <InputString
                label={t.fieldDropoffLocation || 'Lokasi Pengembalian'}
                value={formData.dropoffLocation || ''}
                onChange={(val) => handleChange('dropoffLocation', val)}
                placeholder={t.pickupPlaceholder || 'Contoh: Bandara, Stasiun'}
              />
            </div>
          </div>
        </FormCard>
      </div>

      <div className="flex flex-col gap-6">
        {/* 3. DETAIL PEMBAYARAN */}
        <FormCard title={t.sectionPricing} description="Detail tarif sewa dan total biaya." icon={<DollarSign className="w-5 h-5 text-muted-foreground" />}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <InputSelect
                label={t.fieldUsedRate}
                value={formData.rateType || 'DAILY'}
                onChange={(val) => handleChange('rateType', val as RateType)}
                options={[
                  { value: 'DAILY', label: 'Tarif Harian' },
                  { value: 'WEEKLY', label: 'Tarif Mingguan' },
                  { value: 'MONTHLY', label: 'Tarif Bulanan' }
                ]}
              />
            </div>
            <div>
              <InputString
                label={t.fieldDuration}
                value={`${formData.duration} hari`}
                onChange={() => { }}
                disabled
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 block">{t.fieldTotalEstimate}</label>
              <div className="h-10 px-3 rounded-lg border border-danger/20 bg-danger/5 flex items-center text-sm">
                <span className="text-danger font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <InputDecimal
                label={t.fieldDeposit}
                value={formData.deposit || 0}
                onChange={(val) => handleChange('deposit', val !== null ? val : 0)}
                prefixIcon={<span className="text-muted-foreground text-sm font-medium">Rp</span>}
                placeholder="0"
              />
            </div>
            <div className="col-span-1">
              <InputSelect
                label={t.fieldPaymentMethod || 'Metode Pembayaran'}
                value={formData.paymentMethod || 'TRANSFER'}
                onChange={(val) => handleChange('paymentMethod', val)}
                options={[
                  { value: 'TRANSFER', label: t.paymentTransfer || 'Transfer Bank' },
                  { value: 'CASH', label: t.paymentCash || 'Tunai' },
                  { value: 'CARD', label: t.paymentCard || 'Kartu Kredit' }
                ]}
              />
            </div>
          </div>
        </FormCard>

        {/* 4. KEBUTUHAN TAMBAHAN */}
        <FormCard title={t.sectionAdditional} description="Layanan ekstra dan catatan." icon={<FileText className="w-5 h-5 text-muted-foreground" />}>
          <div className="flex flex-col gap-6">
            <InputMultiCheckbox
              label={t.fieldAdditionalNeeds}
              value={[
                formData.needDriver ? 'driver' : '',
                formData.needDelivery ? 'delivery' : '',
                formData.needFuel ? 'fuel' : '',
                formData.needInsurance ? 'insurance' : ''
              ].filter(Boolean)}
              onChange={(val) => {
                handleChange('needDriver', val.includes('driver'));
                handleChange('needDelivery', val.includes('delivery'));
                handleChange('needFuel', val.includes('fuel'));
                handleChange('needInsurance', val.includes('insurance'));
              }}
              options={[
                { value: 'driver', label: t.needDriver || 'Pakai Supir' },
                { value: 'delivery', label: t.needDelivery || 'Layanan Antar-Jemput' },
                { value: 'fuel', label: t.needFuel || 'BBM Termasuk (Full to Full)' },
                { value: 'insurance', label: t.needInsurance || 'Asuransi Kendaraan' }
              ]}
            />
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
        </FormCard>
      </div>

      {/* RINGKASAN RESERVASI */}
      <FormCard title={t.sectionSummary} description="Cek kembali detail reservasi sebelum menyimpan." icon={<ClipboardList className="w-5 h-5 text-muted-foreground" />} className="group-data-[layout=default]/form:lg:col-span-2 group-data-[layout=dialog]/form:lg:col-span-2 group-data-[layout=fullscreen]/form:lg:col-span-2">
        <div className="flex flex-col md:flex-row group-data-[layout=drawer]/form:!flex-col gap-6">
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
              <span className="text-sm font-semibold">{formData.rentalType === 'SELF_DRIVE' ? t.rentalTypeSelfDrive : t.rentalTypeWithDriver}</span>
            </div>
          </div>

          <div className="w-full md:w-[280px] group-data-[layout=drawer]/form:!w-full shrink-0 border-t md:border-t-0 md:border-l group-data-[layout=drawer]/form:!border-t group-data-[layout=drawer]/form:!border-l-0 border-border/50 pt-6 md:pt-0 md:pl-6 group-data-[layout=drawer]/form:!pt-6 group-data-[layout=drawer]/form:!pl-0 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Total Estimasi</span>
              <span className="text-sm font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground">Deposit</span>
              <span className="text-sm font-semibold">{formatCurrency(formData.deposit || 0)}</span>
            </div>

            <div className="mt-auto bg-danger/5 border border-danger/10 rounded-lg p-3">
              <p className="text-[11px] text-muted-foreground font-semibold mb-1">{t.remainingEstimate}</p>
              <p className="text-lg font-bold text-danger">{formatCurrency(remainingAmount)}</p>
            </div>
          </div>
        </div>
      </FormCard>
    </FormShell>
  );
}
