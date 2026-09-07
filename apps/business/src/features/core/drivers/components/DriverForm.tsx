'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, UserRound, MapPin, Phone, FileText } from 'lucide-react';
import { Button, Input, Label, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, FormShell, FormCard } from '@adatrack/ui';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="name" className="text-xs font-semibold">{labels.fullName} <span className="text-danger">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={labels.fullNamePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    className="h-10 text-sm"
                  />
                  {errors.name && <span className="text-[10px] text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="ktpNumber" className="text-xs font-semibold">No. KTP <span className="text-danger">*</span></Label>
                  <Input
                    id="ktpNumber"
                    name="ktpNumber"
                    placeholder={labels.ktpPlaceholder}
                    value={formData.ktpNumber}
                    onChange={handleChange}
                    error={!!errors.ktpNumber}
                    maxLength={16}
                    className="h-10 text-sm"
                  />
                  {errors.ktpNumber && <span className="text-[10px] text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.ktpNumber}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="placeOfBirth" className="text-xs font-semibold">Tempat Lahir</Label>
                  <Input
                    id="placeOfBirth"
                    name="placeOfBirth"
                    placeholder={labels.pobPlaceholder}
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    className="h-10 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dateOfBirth" className="text-xs font-semibold">Tanggal Lahir <span className="text-danger">*</span></Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    placeholder={labels.dobPlaceholder}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="h-10 text-sm"
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

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="address" className="text-xs font-semibold">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder={labels.addressPlaceholder}
                  value={formData.address}
                  onChange={handleChange}
                  rows={4}
                  className="resize-none text-sm"
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
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">Nomor Telepon <span className="text-danger">*</span></Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder={labels.phonePlaceholder}
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    className="h-10 text-sm"
                  />
                  {errors.phone && <span className="text-[10px] text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={labels.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className="h-10 text-sm"
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
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Grup <span className="text-danger">*</span></Label>
                  <Select value={formData.groupId} onValueChange={(val) => handleSelectChange('groupId', val)}>
                    <SelectTrigger error={!!errors.groupId} className="h-10 text-sm">
                      <SelectValue placeholder={labels.groupSelect} />
                    </SelectTrigger>
                    <SelectContent>
                      {groupService.getDriverGroups().map(group => (
                        <SelectItem key={group.id} value={group.id} className="text-sm">
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.groupId && <span className="text-[10px] text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.groupId}</span>}
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="placement" className="text-xs font-semibold">{labels.placement} <span className="text-danger">*</span></Label>
                  <Input
                    id="placement"
                    name="placement"
                    placeholder={labels.placementPlaceholder}
                    value={formData.placement}
                    onChange={handleChange}
                    error={!!errors.placement}
                    className="h-10 text-sm"
                  />
                  {errors.placement && <span className="text-[10px] text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.placement}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="licenseNumber" className="text-xs font-semibold">Nomor SIM <span className="text-danger">*</span></Label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    placeholder={labels.licensePlaceholder}
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    error={!!errors.licenseNumber}
                    className="h-10 text-sm"
                  />
                  {errors.licenseNumber && <span className="text-[10px] text-danger flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.licenseNumber}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="licenseExpiry" className="text-xs font-semibold">Masa Berlaku SIM</Label>
                  <Input
                    id="licenseExpiry"
                    name="licenseExpiry"
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                    className="h-10 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2 mt-2">
                  <Label htmlFor="joinDate" className="text-xs font-semibold">Tanggal Bergabung</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="h-10 text-sm"
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
