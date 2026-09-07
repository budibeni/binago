'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, UserRound, MapPin, Phone, FileText } from 'lucide-react';
import { FormShell, FormCard, InputString, InputDate, InputTextarea, InputPhone, InputEmail, InputSelect } from '@adatrack/ui';
import { groupService } from '@/data/services';
import type { Driver } from '../types/driver';

interface DriverFormProps {
  labels: {
    title: string;
    subtitle: string;
    sectionIdentity: string;
    descIdentity: string;
    sectionContact: string;
    descContact: string;
    sectionAddress: string;
    descAddress: string;
    sectionWork: string;
    descWork: string;
    fullName: string;
    fullNamePlaceholder: string;
    ktpPlaceholder: string;
    pobPlaceholder: string;
    dobPlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    addressPlaceholder: string;
    placement: string;
    placementPlaceholder: string;
    groupSelect: string;
    licensePlaceholder: string;
    cancel: string;
    submit: string;
  };
  initialData?: Partial<Driver>;
  onCancel: () => void;
  onSubmit: (data: Partial<Driver>) => void;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DriverForm({ labels, initialData, onCancel, onSubmit, layout = 'drawer', open, onOpenChange }: DriverFormProps) {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    ktpNumber: initialData?.ktpNumber || '',
    placeOfBirth: initialData?.placeOfBirth || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    placement: initialData?.placement || '',
    groupId: initialData?.groupId || '',
    licenseNumber: initialData?.licenseNumber || '',
    licenseExpiry: initialData?.licenseExpiry || '',
    joinDate: initialData?.joinDate || new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleValueChange = <K extends keyof typeof formData>(name: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name as string]: '' }));
    }
  };

  

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Wajib diisi';
    if (!formData.ktpNumber) newErrors.ktpNumber = 'Wajib diisi';
    if (!formData.phone) newErrors.phone = 'Wajib diisi';
    if (!formData.placement) newErrors.placement = 'Wajib diisi';
    if (!formData.groupId) newErrors.groupId = 'Pilih grup';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'Wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full h-full relative">
      <FormShell
        layout={layout}
        open={open}
        onOpenChange={onOpenChange}
        title={labels.title}
        subtitle={labels.subtitle}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      >
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Kolom Kiri */}
          <div className="flex flex-col gap-6">

            {/* Identitas Card */}
            <FormCard
              title={labels.sectionIdentity}
              description={labels.descIdentity}
              icon={<UserRound className="w-5 h-5 text-danger" />}
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <div className="sm:col-span-2">
                  <InputString
                    id="name"
                    label={labels.fullName}
                    placeholder={labels.fullNamePlaceholder}
                    value={formData.name}
                    onChange={(v) => handleValueChange('name', v)}
                    error={errors.name}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <InputString
                    id="ktpNumber"
                    label="No. KTP"
                    placeholder={labels.ktpPlaceholder}
                    value={formData.ktpNumber}
                    onChange={(v) => handleValueChange('ktpNumber', v)}
                    error={errors.ktpNumber}
                    maxLength={16}
                    required
                  />
                </div>

                <div>
                  <InputString
                    id="placeOfBirth"
                    label="Tempat Lahir"
                    placeholder={labels.pobPlaceholder}
                    value={formData.placeOfBirth}
                    onChange={(v) => handleValueChange('placeOfBirth', v)}
                    error={errors.placeOfBirth}
                  />
                </div>

                <div>
                  <InputDate
                    id="dateOfBirth"
                    label="Tanggal Lahir"
                    value={formData.dateOfBirth}
                    onChange={(v) => handleValueChange('dateOfBirth', v)}
                    error={errors.dateOfBirth}
                    required
                  />
                </div>
              </div>
            </FormCard>

            {/* Alamat Card */}
            <FormCard
              title={labels.sectionAddress}
              description={labels.descAddress}
              icon={<MapPin className="w-5 h-5 text-blue-500" />}
            >

              <div>
                <InputTextarea
                  id="address"
                  label="Alamat Lengkap"
                  placeholder={labels.addressPlaceholder}
                  value={formData.address}
                  onChange={(v) => handleValueChange('address', v)}
                  error={errors.address}
                  rows={4}
                />
              </div>
            </FormCard>

          </div>

          {/* Kolom Kanan */}
          <div className="flex flex-col gap-6">

            {/* Kontak Card */}
            <FormCard
              title={labels.sectionContact}
              description={labels.descContact}
              icon={<Phone className="w-5 h-5 text-green-500" />}
            >

              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <InputPhone
                    id="phone"
                    label="Nomor Telepon"
                    placeholder={labels.phonePlaceholder}
                    value={formData.phone}
                    onChange={(v) => handleValueChange('phone', v)}
                    error={errors.phone}
                    required
                  />
                </div>

                <div>
                  <InputEmail
                    id="email"
                    label="Email"
                    placeholder={labels.emailPlaceholder}
                    value={formData.email}
                    onChange={(v) => handleValueChange('email', v)}
                    error={errors.email}
                  />
                </div>
              </div>
            </FormCard>

            {/* Lisensi & Pekerjaan Card */}
            <FormCard
              title={labels.sectionWork}
              description={labels.descWork}
              icon={<FileText className="w-5 h-5 text-purple-500" />}
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <div className="sm:col-span-2">
                  <InputSelect
                    id="groupId"
                    label="Grup"
                    placeholder={labels.groupSelect}
                    value={formData.groupId}
                    onChange={(v) => handleValueChange('groupId', v)}
                    error={errors.groupId}
                    options={groupService.getDriverGroups().map(group => ({ value: group.id, label: group.name }))}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <InputString
                    id="placement"
                    label={labels.placement}
                    placeholder={labels.placementPlaceholder}
                    value={formData.placement}
                    onChange={(v) => handleValueChange('placement', v)}
                    error={errors.placement}
                    required
                  />
                </div>

                <div>
                  <InputString
                    id="licenseNumber"
                    label="No. SIM"
                    placeholder={labels.licensePlaceholder}
                    value={formData.licenseNumber}
                    onChange={(v) => handleValueChange('licenseNumber', v)}
                    error={errors.licenseNumber}
                    required
                  />
                </div>

                <div>
                  <InputDate
                    id="licenseExpiry"
                    label="Masa Berlaku SIM"
                    value={formData.licenseExpiry}
                    onChange={(v) => handleValueChange('licenseExpiry', v)}
                    error={errors.licenseExpiry}
                  />
                </div>

                <div className="sm:col-span-2 mt-2">
                  <InputDate
                    id="joinDate"
                    label="Tanggal Bergabung"
                    value={formData.joinDate}
                    onChange={(v) => handleValueChange('joinDate', v)}
                    error={errors.joinDate}
                  />
                </div>
              </div>
            </FormCard>

          </div>
        </div>
        </div>
      </FormShell>
    </form>
  );
}
