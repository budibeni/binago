'use client';

import React from 'react';
import { UserCircle, MapPin, Phone, Briefcase } from 'lucide-react';
import { FormShell, FormCard, InputString, InputTextarea, InputPhone, InputEmail, InputSelect, useForm } from '@adatrack/ui';
import { getPersonelFormSchema, type Personel } from '../types/personel';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getPersonelTranslation } from '../i18n';

interface PersonelFormProps {
  personel: Personel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Personel>) => void;
  onCancel: () => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
}

const DEFAULT_PERSONEL = {
  name: '',
  personelType: '',
  nik: '',
  phone: '',
  email: '',
  address: '',
  status: 'ACTIVE',
  notes: '',
} as unknown as Personel;

export function PersonelForm({
  personel,
  open,
  onOpenChange,
  onSave,
  onCancel,
  layout = 'default',
}: PersonelFormProps) {
  const locale = useBusinessLocale();
  const tP = getPersonelTranslation(locale);
  const isEdit = !!personel;

  const typeOptions = [
    { value: 'CHECKER', label: tP.types.CHECKER },
    { value: 'MECHANIC', label: tP.types.MECHANIC },
    { value: 'STAFF', label: tP.types.STAFF },
    { value: 'MANAGEMENT', label: tP.types.MANAGEMENT },
    { value: 'OTHER', label: tP.types.OTHER },
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: tP.status.active },
    { value: 'INACTIVE', label: tP.status.inactive },
  ];

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<Personel>({
    initialData: personel || DEFAULT_PERSONEL,
    resetOn: [open, personel],
    schema: getPersonelFormSchema(tP.validation || {}),
    onSubmit: async (data) => {
      onSave(data);
    },
  });

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? tP.form.editTitle : tP.form.addTitle}
      subtitle={isEdit ? tP.form.editSubtitle : tP.form.addSubtitle}
      layout={layout}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      onSave={() => handleSubmit()}
      columns={2}
    >
      {/* Kolom Kiri */}
      <div className="flex flex-col gap-6">
        <FormCard
          title={tP.table.colIdentity}
          description={tP.form.descIdentity}
          icon={<UserCircle className="w-5 h-5 text-danger" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label={tP.labels.name}
              placeholder="John Doe"
              value={formData.name || ''}
              onChange={(v) => handleChange('name', v)}
              error={errors.name}
              required
            />
          </div>

          <InputSelect
            label={tP.labels.type}
            options={typeOptions}
            placeholder="Pilih Tipe Personel"
            value={formData.personelType || ''}
            onChange={(v) => handleChange('personelType', v)}
            error={errors.personelType}
            required
          />

          <InputString
            label={tP.labels.nik}
            placeholder="1234567890"
            value={formData.nik || ''}
            onChange={(v) => handleChange('nik', v)}
            error={errors.nik}
          />

          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputSelect
              label={tP.labels.status}
              options={statusOptions}
              value={formData.status || ''}
              onChange={(v) => handleChange('status', v)}
              error={errors.status}
              required
            />
          </div>
        </FormCard>
      </div>

      {/* Kolom Kanan */}
      <div className="flex flex-col gap-6">
        <FormCard
          title="Kontak & Alamat"
          icon={<Phone className="w-5 h-5 text-danger" />}
          description={tP.form.descAddress}
        >
          <InputPhone
            label={tP.labels.phone}
            value={formData.phone || ''}
            onChange={(v) => handleChange('phone', v)}
            error={errors.phone}
          />

          <InputEmail
            label={tP.labels.email}
            value={formData.email || ''}
            onChange={(v) => handleChange('email', v)}
            error={errors.email}
          />

          <InputTextarea
            label={tP.labels.address}
            placeholder="Jl. Merdeka No. 1"
            value={formData.address || ''}
            onChange={(v) => handleChange('address', v)}
            error={errors.address}
            rows={3}
          />
        </FormCard>

        <FormCard
          title={tP.labels.notes}
          icon={<Briefcase className="w-5 h-5 text-danger" />}
          description={tP.form.descNotes}
        >
          <InputTextarea
            label={tP.labels.notes}
            placeholder="..."
            value={formData.notes || ''}
            onChange={(v) => handleChange('notes', v)}
            error={errors.notes}
            rows={3}
          />
        </FormCard>
      </div>
    </FormShell>
  );
}
