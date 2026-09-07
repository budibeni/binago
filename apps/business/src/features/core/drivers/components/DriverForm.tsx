'use client';

import React from 'react';
import { UserRound, MapPin, Phone, FileText } from 'lucide-react';
import { FormShell, FormCard, InputString, InputDate, InputTextarea, InputPhone, InputEmail, InputSelect, useForm } from '@adatrack/ui';
import { groupService } from '@/data/services';
import { getDriverFormSchema, type Driver } from '../types/driver';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getDriversTranslation } from '../i18n';

interface DriverFormProps {
  driver: Driver | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<Driver>) => void;
  onCancel: () => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
}

const DEFAULT_DRIVER = {
  name: '',
  ktpNumber: '',
  placeOfBirth: '',
  dateOfBirth: '',
  email: '',
  phone: '',
  address: '',
  placement: '',
  groupId: '',
  licenseNumber: '',
  licenseExpiry: '',
  joinDate: new Date().toISOString().split('T')[0],
} as unknown as Driver;

export function DriverForm({
  driver,
  open,
  onOpenChange,
  onSave,
  onCancel,
  layout = 'default',
}: DriverFormProps) {
  const isEdit = !!driver;
  const locale = useBusinessLocale();
  const tD = getDriversTranslation(locale);
  const tF = isEdit ? tD.editPage : tD.addPage;

  const [groups, setGroups] = React.useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
    if (open) {
      setGroups(groupService.getDriverGroups().map(group => ({ value: group.id, label: group.name })));
    }
  }, [open]);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<Driver>({
    initialData: driver || DEFAULT_DRIVER,
    resetOn: [open, driver],
    schema: getDriverFormSchema(tD.validation || {}),
    onSubmit: async (data) => {
      await new Promise((r) => setTimeout(r, 800));
      onSave(data);
    },
  });

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={tF.title}
      subtitle={tF.subtitle}
      onCancel={onCancel}
      onSave={() => handleSubmit()}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      columns={2}
    >
      {/* Kolom Kiri */}
      <div className="flex flex-col gap-6">
        {/* Identitas Card */}
        <FormCard
          title={tF.sectionIdentity}
          description={tF.descIdentity}
          icon={<UserRound className="w-5 h-5 text-danger" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label={tF.fullName}
              placeholder={tF.fullNamePlaceholder}
              value={formData.name || ''}
              onChange={(v) => handleChange('name', v)}
              error={errors.name}
              required
            />
          </div>

          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label="No. KTP"
              placeholder={tF.ktpPlaceholder}
              value={formData.ktpNumber || ''}
              onChange={(v) => handleChange('ktpNumber', v)}
              error={errors.ktpNumber}
              maxLength={16}
              required
            />
          </div>

          <InputString
            label="Tempat Lahir"
            placeholder={tF.pobPlaceholder}
            value={formData.placeOfBirth || ''}
            onChange={(v) => handleChange('placeOfBirth', v)}
            error={errors.placeOfBirth}
          />

          <InputDate
            label="Tanggal Lahir"
            value={formData.dateOfBirth || ''}
            onChange={(v) => handleChange('dateOfBirth', v)}
            error={errors.dateOfBirth}
          />
        </FormCard>

        {/* Alamat Card */}
        <FormCard
          title={tF.sectionAddress}
          description={tF.descAddress}
          icon={<MapPin className="w-5 h-5 text-blue-500" />}
        >
          <InputTextarea
            label="Alamat Lengkap"
            placeholder={tF.addressPlaceholder}
            value={formData.address || ''}
            onChange={(v) => handleChange('address', v)}
            error={errors.address}
            rows={4}
          />
        </FormCard>
      </div>

      {/* Kolom Kanan */}
      <div className="flex flex-col gap-6">
        {/* Kontak Card */}
        <FormCard
          title={tF.sectionContact}
          description={tF.descContact}
          icon={<Phone className="w-5 h-5 text-green-500" />}
        >
          <InputPhone
            label="Nomor Telepon"
            placeholder={tF.phonePlaceholder}
            value={formData.phone || ''}
            onChange={(v) => handleChange('phone', v)}
            error={errors.phone}
            required
          />

          <InputEmail
            label="Email"
            placeholder={tF.emailPlaceholder}
            value={formData.email || ''}
            onChange={(v) => handleChange('email', v)}
            error={errors.email}
          />
        </FormCard>

        {/* Lisensi & Pekerjaan Card */}
        <FormCard
          title={tF.sectionWork}
          description={tF.descWork}
          icon={<FileText className="w-5 h-5 text-purple-500" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputSelect
              label="Grup"
              placeholder={tF.groupSelect}
              value={formData.groupId || ''}
              onChange={(v) => handleChange('groupId', v)}
              error={errors.groupId}
              options={groups}
              required
            />
          </div>

          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label={tF.placement}
              placeholder={tF.placementPlaceholder}
              value={formData.placement || ''}
              onChange={(v) => handleChange('placement', v)}
              error={errors.placement}
              required
            />
          </div>

          <InputString
            label="No. SIM"
            placeholder={tF.licensePlaceholder}
            value={formData.licenseNumber || ''}
            onChange={(v) => handleChange('licenseNumber', v)}
            error={errors.licenseNumber}
            required
          />

          <InputDate
            label="Masa Berlaku SIM"
            value={formData.licenseExpiry || ''}
            onChange={(v) => handleChange('licenseExpiry', v)}
            error={errors.licenseExpiry}
          />

          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputDate
              label="Tanggal Bergabung"
              value={formData.joinDate || ''}
              onChange={(v) => handleChange('joinDate', v)}
              error={errors.joinDate}
            />
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}
