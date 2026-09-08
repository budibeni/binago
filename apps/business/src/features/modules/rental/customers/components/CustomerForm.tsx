'use client';

import React from 'react';
import { FormShell, FormCard, InputString, InputDate, InputPhone, InputEmail, InputSelect, useForm } from '@adatrack/ui';
import { User, Phone, MapPin, Building, FileText, Briefcase, Settings } from 'lucide-react';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';
import { getCustomerFormSchema } from '../types/customer';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getRentalCustomersTranslation } from '../i18n';

interface CustomerFormProps {
  customer: Customer | null;
  onCancel: () => void;
  onSave: (data: Partial<Customer>) => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_CUSTOMER = {
  type: 'INDIVIDUAL',
  status: 'ACTIVE',
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  
  // Individual
  nik: '',
  birthPlace: '',
  birthDate: '',
  simNumber: '',
  simType: '',
  simExpiredAt: '',

  // Company
  nib: '',
  npwp: '',
  picName: '',
  picPosition: '',
  picPhone: '',
  picEmail: '',
  picNik: '',
} as unknown as Customer;

export function CustomerForm({
  customer,
  onCancel,
  onSave,
  layout = 'default',
  open,
  onOpenChange,
}: CustomerFormProps) {
  const isEditing = !!customer;
  const locale = useBusinessLocale();
  const t = getRentalCustomersTranslation(locale);

  // Initialize data bridging the Individual/Company difference
  const initialData = React.useMemo(() => {
    if (!customer) return DEFAULT_CUSTOMER;
    return { ...customer } as unknown as Customer;
  }, [customer]);

  const { formData, errors, isSubmitting, handleChange, handleSubmit, setFormData } = useForm<any>({
    initialData,
    resetOn: [open, customer],
    schema: getCustomerFormSchema(t.validation || {}),
    onSubmit: async (data) => {
      await new Promise(r => setTimeout(r, 800)); // simulate API call
      
      const baseData = {
        type: data.type,
        status: data.status,
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        province: data.province,
        postalCode: data.postalCode,
      };

      if (data.type === 'INDIVIDUAL') {
        onSave({
          ...baseData,
          nik: (data as any).nik,
          birthPlace: (data as any).birthPlace,
          birthDate: (data as any).birthDate,
          simNumber: (data as any).simNumber,
          simType: (data as any).simType,
          simExpiredAt: (data as any).simExpiredAt,
          ktpPhoto: '/images/dummy-ktp.jpg',
          simPhoto: '/images/dummy-sim.jpg',
        } as IndividualCustomer);
      } else {
        onSave({
          ...baseData,
          nib: (data as any).nib,
          npwp: (data as any).npwp,
          picName: (data as any).picName,
          picPosition: (data as any).picPosition,
          picPhone: (data as any).picPhone,
          picEmail: (data as any).picEmail,
          picNik: (data as any).picNik,
          picKtpPhoto: '/images/dummy-ktp.jpg',
        } as CompanyCustomer);
      }
    },
  });

  const type = formData.type || 'INDIVIDUAL';

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? t.actionEdit : t.addCustomer}
      subtitle={isEditing ? 'Perbarui informasi detail pelanggan.' : 'Masukkan informasi detail pelanggan baru.'}
      onCancel={onCancel}
      cancelText={t.cancel || 'Batal'}
      saveText={t.save || 'Simpan'}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      columns={2}
    >
      {/* Kolom Kiri */}
      <div className="flex flex-col gap-6">
        <FormCard
          title={t.fieldCustomerType || "Tipe & Status"}
          description="Pilih tipe pelanggan dan status keaktifannya."
          icon={<Settings className="w-5 h-5 text-muted-foreground" />}
          columns={2}
        >
          <InputSelect
            label={t.fieldCustomerType}
            value={type}
            onChange={(v) => {
              handleChange('type', v as any);
            }}
            disabled={isEditing}
            options={[
              { value: 'INDIVIDUAL', label: t.typeIndividual },
              { value: 'COMPANY', label: t.typeCompany }
            ]}
            required
          />
          <InputSelect
            label={t.fieldStatus}
            value={formData.status || 'ACTIVE'}
            onChange={(v) => handleChange('status', v as any)}
            options={[
              { value: 'ACTIVE', label: t.statusActive },
              { value: 'INACTIVE', label: t.statusInactive }
            ]}
            required
          />
        </FormCard>

        <FormCard
          title={type === 'INDIVIDUAL' ? "Informasi Identitas" : "Informasi Perusahaan"}
          description={type === 'INDIVIDUAL' ? "Data diri resmi sesuai KTP." : "Informasi legal entitas perusahaan."}
          icon={type === 'INDIVIDUAL' ? <User className="w-5 h-5 text-muted-foreground" /> : <Building className="w-5 h-5 text-muted-foreground" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label={type === 'INDIVIDUAL' ? t.fieldFullName : t.fieldCompanyName}
              value={formData.name || ''}
              onChange={(v) => handleChange('name', v)}
              error={errors.name} 
              required
              placeholder={t.placeholderName}
            />
          </div>

          {type === 'INDIVIDUAL' ? (
            <>
              <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
                <InputString
                  label={t.fieldNik}
                  value={(formData as any).nik || ''}
                  onChange={(v) => handleChange('nik', v)}
                  error={errors.nik} 
                  required
                  placeholder={t.placeholderNik}
                />
              </div>
              <InputString
                label={t.fieldBirthPlace}
                value={(formData as any).birthPlace || ''}
                onChange={(v) => handleChange('birthPlace', v)}
                error={errors.birthPlace}
                placeholder="Tempat Lahir"
              />
              <InputDate
                label={t.fieldBirthDate}
                value={(formData as any).birthDate || ''}
                onChange={(v) => handleChange('birthDate', v)}
                error={errors.birthDate}
              />
            </>
          ) : (
            <>
              <InputString
                label={t.fieldNib}
                value={(formData as any).nib || ''}
                onChange={(v) => handleChange('nib', v)}
                error={errors.nib}
                placeholder="Nomor Induk Berusaha"
              />
              <InputString
                label={t.fieldNpwp}
                value={(formData as any).npwp || ''}
                onChange={(v) => handleChange('npwp', v)}
                error={errors.npwp}
                placeholder="Nomor Pokok Wajib Pajak"
              />
            </>
          )}
        </FormCard>

        <FormCard
          title="Informasi Alamat"
          description="Alamat domisili atau alamat operasional perusahaan."
          icon={<MapPin className="w-5 h-5 text-muted-foreground" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label={t.fieldAddress}
              value={formData.address || ''}
              onChange={(v) => handleChange('address', v)}
              error={errors.address}
              placeholder="Alamat lengkap"
            />
          </div>
          <InputString
            label={t.fieldCity}
            value={formData.city || ''}
            onChange={(v) => handleChange('city', v)}
            error={errors.city}
            placeholder="Kota"
          />
          <InputString
            label={t.fieldProvince}
            value={formData.province || ''}
            onChange={(v) => handleChange('province', v)}
            error={errors.province}
            placeholder="Provinsi"
          />
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label={t.fieldPostalCode}
              value={formData.postalCode || ''}
              onChange={(v) => handleChange('postalCode', v)}
              error={errors.postalCode}
              placeholder="Kode Pos"
            />
          </div>
        </FormCard>
      </div>

      {/* Kolom Kanan */}
      <div className="flex flex-col gap-6">
        <FormCard
          title="Informasi Kontak"
          description="Nomor telepon dan email untuk keperluan komunikasi."
          icon={<Phone className="w-5 h-5 text-muted-foreground" />}
        >
          <InputPhone
            label={t.fieldPhone}
            value={formData.phone || ''}
            onChange={(v) => handleChange('phone', v)}
            error={errors.phone} 
            required
            placeholder={t.placeholderPhone}
          />
          <InputEmail
            label={t.fieldEmail}
            value={formData.email || ''}
            onChange={(v) => handleChange('email', v)}
            error={errors.email}
            placeholder={t.placeholderEmail}
          />
        </FormCard>

        {type === 'INDIVIDUAL' ? (
          <FormCard
            title={t.tabSim || "Lisensi & Pekerjaan"}
            description="Detail lisensi berkendara."
            icon={<FileText className="w-5 h-5 text-muted-foreground" />}
            columns={2}
          >
            <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
              <InputString
                label={t.fieldSimNumber}
                value={(formData as any).simNumber || ''}
                onChange={(v) => handleChange('simNumber', v)}
                error={errors.simNumber}
                placeholder="Nomor SIM"
              />
            </div>
            <InputString
              label={t.fieldSimType}
              value={(formData as any).simType || ''}
              onChange={(v) => handleChange('simType', v)}
              error={errors.simType}
              placeholder="Contoh: A, B1"
            />
            <InputDate
              label={t.fieldSimExpiredAt}
              value={(formData as any).simExpiredAt || ''}
              onChange={(v) => handleChange('simExpiredAt', v)}
              error={errors.simExpiredAt}
            />
          </FormCard>
        ) : (
          <FormCard
            title={t.tabPic || "Informasi PIC"}
            description="Penanggung jawab atau representatif dari perusahaan."
            icon={<Briefcase className="w-5 h-5 text-muted-foreground" />}
            columns={2}
          >
            <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
              <InputString
                label={t.fieldPicName}
                value={(formData as any).picName || ''}
                onChange={(v) => handleChange('picName', v)}
                error={errors.picName} 
                required
                placeholder={t.placeholderName}
              />
            </div>
            <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
              <InputString
                label={t.fieldPicPosition}
                value={(formData as any).picPosition || ''}
                onChange={(v) => handleChange('picPosition', v)}
                error={errors.picPosition}
                placeholder="Jabatan PIC"
              />
            </div>
            <InputPhone
              label={t.fieldPicPhone}
              value={(formData as any).picPhone || ''}
              onChange={(v) => handleChange('picPhone', v)}
              error={errors.picPhone}
              placeholder="No HP PIC"
            />
            <InputEmail
              label={t.fieldPicEmail}
              value={(formData as any).picEmail || ''}
              onChange={(v) => handleChange('picEmail', v)}
              error={errors.picEmail}
              placeholder="Email PIC"
            />
            <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
              <InputString
                label={t.fieldPicNik}
                value={(formData as any).picNik || ''}
                onChange={(v) => handleChange('picNik', v)}
                error={errors.picNik}
                placeholder="NIK PIC"
              />
            </div>
          </FormCard>
        )}
      </div>
    </FormShell>
  );
}
