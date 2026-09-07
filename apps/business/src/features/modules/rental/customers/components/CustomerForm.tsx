'use client';

import React from 'react';
import { FormShell, FormCard, InputString, InputDate, InputPhone, InputEmail, InputSelect } from '@adatrack/ui';
import { User, Phone, MapPin, Building, FileText, Briefcase, Settings } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

interface CustomerFormProps {
  customer: Customer | null;
  onCancel: () => void;
  onSave: (data: any) => void;
  labels: Record<string, string>;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SectionCard({ title, description, icon: Icon, children, className }: any) {
  return (
    <FormCard
      title={title}
      description={description}
      icon={<Icon className="w-5 h-5 text-muted-foreground" />}
      className={className}
    >
      {children}
    </FormCard>
  );
}

export function CustomerForm({
  customer,
  onCancel,
  onSave,
  labels,
  layout = 'drawer',
  open,
  onOpenChange,
}: CustomerFormProps) {
  const isEditing = !!customer;
  const [type, setType] = React.useState<'INDIVIDUAL' | 'COMPANY'>('INDIVIDUAL');
  
  // Shared fields
  const [status, setStatus] = React.useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [province, setProvince] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');

  // Individual fields
  const [nik, setNik] = React.useState('');
  const [birthPlace, setBirthPlace] = React.useState('');
  const [birthDate, setBirthDate] = React.useState('');
  const [simNumber, setSimNumber] = React.useState('');
  const [simType, setSimType] = React.useState('');
  const [simExpiredAt, setSimExpiredAt] = React.useState('');

  // Company fields
  const [nib, setNib] = React.useState('');
  const [npwp, setNpwp] = React.useState('');
  const [picName, setPicName] = React.useState('');
  const [picPosition, setPicPosition] = React.useState('');
  const [picPhone, setPicPhone] = React.useState('');
  const [picEmail, setPicEmail] = React.useState('');
  const [picNik, setPicNik] = React.useState('');

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };


  React.useEffect(() => {
    if (customer) {
      setType(customer.type);
      setStatus(customer.status);
      setName(customer.name);
      setPhone(customer.phone);
      setEmail(customer.email || '');
      setAddress(customer.address);
      setCity(customer.city);
      setProvince(customer.province);
      setPostalCode(customer.postalCode);

      if (customer.type === 'INDIVIDUAL') {
        const ind = customer as IndividualCustomer;
        setNik(ind.nik);
        setBirthPlace(ind.birthPlace);
        setBirthDate(ind.birthDate);
        setSimNumber(ind.simNumber);
        setSimType(ind.simType);
        setSimExpiredAt(ind.simExpiredAt);
      } else {
        const comp = customer as CompanyCustomer;
        setNib(comp.nib);
        setNpwp(comp.npwp);
        setPicName(comp.picName);
        setPicPosition(comp.picPosition);
        setPicPhone(comp.picPhone);
        setPicEmail(comp.picEmail || '');
        setPicNik(comp.picNik);
      }
    } else {
      setType('INDIVIDUAL');
      setStatus('ACTIVE');
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setCity('');
      setProvince('');
      setPostalCode('');
      
      setNik('');
      setBirthPlace('');
      setBirthDate('');
      setSimNumber('');
      setSimType('');
      setSimExpiredAt('');

      setNib('');
      setNpwp('');
      setPicName('');
      setPicPosition('');
      setPicPhone('');
      setPicEmail('');
      setPicNik('');
    }
    setErrors({});
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Wajib diisi';
    if (!phone.trim()) newErrors.phone = 'Wajib diisi';

    if (type === 'INDIVIDUAL') {
      if (!nik.trim()) newErrors.nik = 'Wajib diisi';
    } else {
      if (!picName.trim()) newErrors.picName = 'Wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top to see errors if needed
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const baseData = {
      type,
      status,
      name,
      phone,
      email,
      address,
      city,
      province,
      postalCode,
    };

    if (type === 'INDIVIDUAL') {
      onSave({
        ...baseData,
        nik,
        ktpPhoto: '/images/dummy-ktp.jpg',
        birthPlace,
        birthDate,
        simNumber,
        simType,
        simExpiredAt,
        simPhoto: '/images/dummy-sim.jpg',
      });
    } else {
      onSave({
        ...baseData,
        nib,
        npwp,
        picName,
        picPosition,
        picPhone,
        picEmail,
        picNik,
        picKtpPhoto: '/images/dummy-ktp.jpg',
      });
    }
  };

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? labels.actionEdit : labels.addCustomer}
      subtitle={isEditing ? 'Perbarui informasi detail pelanggan.' : 'Masukkan informasi detail pelanggan baru.'}
      onCancel={onCancel}
      cancelText={labels.cancel || 'Batal'}
      saveText={labels.save || 'Simpan'}
      saveProps={{ form: 'customer-form' }}
    >
      <div className="px-4 md:px-8 py-8">
        <form id="customer-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          
          <div className="flex flex-col gap-6">
            <SectionCard
              title={labels.fieldCustomerType || "Tipe & Status"}
              description="Pilih tipe pelanggan dan status keaktifannya."
              icon={Settings}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputSelect
                    id="type"
                    label={labels.fieldCustomerType}
                    value={type}
                    onChange={(v) => { setType(v as any); clearError('type'); }}
                    disabled={isEditing}
                    options={[
                      { value: 'INDIVIDUAL', label: labels.typeIndividual },
                      { value: 'COMPANY', label: labels.typeCompany }
                    ]}
                    required
                  />
                </div>
                <div>
                  <InputSelect
                    id="status"
                    label={labels.fieldStatus}
                    value={status}
                    onChange={(v) => { setStatus(v as any); clearError('status'); }}
                    options={[
                      { value: 'ACTIVE', label: labels.statusActive },
                      { value: 'INACTIVE', label: labels.statusInactive }
                    ]}
                    required
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title={type === 'INDIVIDUAL' ? "Informasi Identitas" : "Informasi Perusahaan"}
              description={type === 'INDIVIDUAL' ? "Data diri resmi sesuai KTP." : "Informasi legal entitas perusahaan."}
              icon={type === 'INDIVIDUAL' ? User : Building}
            >
                              <InputString
                  id="name"
                  label={type === 'INDIVIDUAL' ? labels.fieldFullName : labels.fieldCompanyName}
                  value={name}
                  onChange={(v) => { setName(v); clearError('name'); }}
                   error={errors.name} required
                  placeholder={labels.placeholderName}
                />

              {type === 'INDIVIDUAL' ? (
                <>
                                  <InputString
                  id="nik"
                  label={labels.fieldNik}
                  value={nik}
                  onChange={(v) => { setNik(v); clearError('nik'); }}
                   error={errors.nik} required
                      placeholder={labels.placeholderNik}
                />
                  <div className="grid grid-cols-2 gap-4">
                                    <InputString
                  id="birthPlace"
                  label={labels.fieldBirthPlace}
                  value={birthPlace}
                  onChange={(v) => { setBirthPlace(v); clearError('birthPlace'); }}
                   error={errors.birthPlace}
                      placeholder="Tempat Lahir"
                />
                                    <InputDate
                  id="birthDate"
                  label={labels.fieldBirthDate}
                  value={birthDate}
                  onChange={(v) => { setBirthDate(v); clearError('birthDate'); }}
                   error={errors.birthDate}
                />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                                  <InputString
                  id="nib"
                  label={labels.fieldNib}
                  value={nib}
                  onChange={(v) => { setNib(v); clearError('nib'); }}
                   error={errors.nib}
                    placeholder="Nomor Induk Berusaha"
                />
                                  <InputString
                  id="npwp"
                  label={labels.fieldNpwp}
                  value={npwp}
                  onChange={(v) => { setNpwp(v); clearError('npwp'); }}
                   error={errors.npwp}
                    placeholder="Nomor Pokok Wajib Pajak"
                />
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Informasi Alamat"
              description="Alamat domisili atau alamat operasional perusahaan."
              icon={MapPin}
            >
                              <InputString
                  id="address"
                  label={labels.fieldAddress}
                  value={address}
                  onChange={(v) => { setAddress(v); clearError('address'); }}
                   error={errors.address}
                placeholder="Alamat lengkap"
                />
              <div className="grid grid-cols-2 gap-4">
                                <InputString
                  id="city"
                  label={labels.fieldCity}
                  value={city}
                  onChange={(v) => { setCity(v); clearError('city'); }}
                   error={errors.city}
                  placeholder="Kota"
                />
                                <InputString
                  id="province"
                  label={labels.fieldProvince}
                  value={province}
                  onChange={(v) => { setProvince(v); clearError('province'); }}
                   error={errors.province}
                  placeholder="Provinsi"
                />
              </div>
                              <InputString
                  id="postalCode"
                  label={labels.fieldPostalCode}
                  value={postalCode}
                  onChange={(v) => { setPostalCode(v); clearError('postalCode'); }}
                   error={errors.postalCode}
                  placeholder="Kode Pos"
                />
            </SectionCard>
          </div>

          <div className="flex flex-col gap-6">
            <SectionCard
              title="Informasi Kontak"
              description="Nomor telepon dan email untuk keperluan komunikasi."
              icon={Phone}
            >
                              <InputPhone
                  id="phone"
                  label={labels.fieldPhone}
                  value={phone}
                  onChange={(v) => { setPhone(v); clearError('phone'); }}
                   error={errors.phone} required
                  placeholder={labels.placeholderPhone}
                />
                              <InputEmail
                  id="email"
                  label={labels.fieldEmail}
                  value={email}
                  onChange={(v) => { setEmail(v); clearError('email'); }}
                   error={errors.email}
                  placeholder={labels.placeholderEmail}
                />
            </SectionCard>

            {type === 'INDIVIDUAL' ? (
              <SectionCard
                title={labels.tabSim || "Lisensi & Pekerjaan"}
                description="Detail lisensi berkendara."
                icon={FileText}
              >
                                <InputString
                  id="simNumber"
                  label={labels.fieldSimNumber}
                  value={simNumber}
                  onChange={(v) => { setSimNumber(v); clearError('simNumber'); }}
                   error={errors.simNumber}
                  placeholder="Nomor SIM"
                />
                <div className="grid grid-cols-2 gap-4">
                                  <InputString
                  id="simType"
                  label={labels.fieldSimType}
                  value={simType}
                  onChange={(v) => { setSimType(v); clearError('simType'); }}
                   error={errors.simType}
                    placeholder="Contoh: A, B1"
                />
                                  <InputDate
                  id="simExpiredAt"
                  label={labels.fieldSimExpiredAt}
                  value={simExpiredAt}
                  onChange={(v) => { setSimExpiredAt(v); clearError('simExpiredAt'); }}
                   error={errors.simExpiredAt}
                />
                </div>
              </SectionCard>
            ) : (
              <SectionCard
                title={labels.tabPic || "Informasi PIC"}
                description="Penanggung jawab atau representatif dari perusahaan."
                icon={Briefcase}
              >
                                <InputString
                  id="picName"
                  label={labels.fieldPicName}
                  value={picName}
                  onChange={(v) => { setPicName(v); clearError('picName'); }}
                   error={errors.picName} required
                    placeholder={labels.placeholderPicName}
                />
                                <InputString
                  id="picPosition"
                  label={labels.fieldPicPosition}
                  value={picPosition}
                  onChange={(v) => { setPicPosition(v); clearError('picPosition'); }}
                   error={errors.picPosition}
                    placeholder="Jabatan PIC"
                />
                <div className="grid grid-cols-2 gap-4">
                                  <InputPhone
                  id="picPhone"
                  label={labels.fieldPicPhone}
                  value={picPhone}
                  onChange={(v) => { setPicPhone(v); clearError('picPhone'); }}
                   error={errors.picPhone}
                    placeholder="No HP PIC"
                />
                                  <InputEmail
                  id="picEmail"
                  label={labels.fieldPicEmail}
                  value={picEmail}
                  onChange={(v) => { setPicEmail(v); clearError('picEmail'); }}
                   error={errors.picEmail}
                    placeholder="Email PIC"
                />
                </div>
                                <InputString
                  id="picNik"
                  label={labels.fieldPicNik}
                  value={picNik}
                  onChange={(v) => { setPicNik(v); clearError('picNik'); }}
                   error={errors.picNik}
                  placeholder="NIK PIC"
                />
              </SectionCard>
            )}
          </div>
        </form>
      </div>
    </FormShell>
  );
}
