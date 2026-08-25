'use client';

import React from 'react';
import { Button, Input, Label } from '@adatrack/ui';
import { User, Phone, MapPin, Building, FileText, Briefcase, Settings } from 'lucide-react';
import { cn } from '@adatrack/utils';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

interface CustomerFormProps {
  customer: Customer | null;
  onCancel: () => void;
  onSave: (data: any) => void;
  labels: Record<string, string>;
}

function SectionCard({ title, description, icon: Icon, children, className }: any) {
  return (
    <div className={cn("bg-white dark:bg-neutral-900 border border-border rounded-xl p-5 shadow-sm h-fit", className)}>
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-danger/10 text-danger flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-0.5 mt-0.5">
          <h3 className="text-[14px] font-bold text-foreground">{title}</h3>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

export function CustomerForm({
  customer,
  onCancel,
  onSave,
  labels,
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
    <div className="flex flex-col h-full w-full relative bg-transparent">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 pb-28">
        <form id="customer-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          
          <div className="flex flex-col gap-6">
            <SectionCard
              title={labels.fieldCustomerType || "Tipe & Status"}
              description="Pilih tipe pelanggan dan status keaktifannya."
              icon={Settings}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{labels.fieldCustomerType} *</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md text-[13px] bg-background border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    disabled={isEditing}
                  >
                    <option value="INDIVIDUAL">{labels.typeIndividual}</option>
                    <option value="COMPANY">{labels.typeCompany}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{labels.fieldStatus} *</Label>
                  <select
                    className="w-full px-3 py-2 border rounded-md text-[13px] bg-background border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                  >
                    <option value="ACTIVE">{labels.statusActive}</option>
                    <option value="INACTIVE">{labels.statusInactive}</option>
                  </select>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title={type === 'INDIVIDUAL' ? "Informasi Identitas" : "Informasi Perusahaan"}
              description={type === 'INDIVIDUAL' ? "Data diri resmi sesuai KTP." : "Informasi legal entitas perusahaan."}
              icon={type === 'INDIVIDUAL' ? User : Building}
            >
              <div className="space-y-2">
                <Label className="text-xs font-semibold">{type === 'INDIVIDUAL' ? labels.fieldFullName : labels.fieldCompanyName} <span className="text-danger">*</span></Label>
                <Input 
                  placeholder={labels.placeholderName} 
                  value={name} onChange={(e) => setName(e.target.value)} 
                />
                {errors.name && <p className="text-[11px] text-danger">{errors.name}</p>}
              </div>

              {type === 'INDIVIDUAL' ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{labels.fieldNik} <span className="text-danger">*</span></Label>
                    <Input 
                      placeholder={labels.placeholderNik} 
                      value={nik} onChange={(e) => setNik(e.target.value)} 
                    />
                    {errors.nik && <p className="text-[11px] text-danger">{errors.nik}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">{labels.fieldBirthPlace}</Label>
                      <Input placeholder="Tempat Lahir" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">{labels.fieldBirthDate}</Label>
                      <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{labels.fieldNib}</Label>
                    <Input placeholder="Nomor Induk Berusaha" value={nib} onChange={(e) => setNib(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{labels.fieldNpwp}</Label>
                    <Input placeholder="Nomor Pokok Wajib Pajak" value={npwp} onChange={(e) => setNpwp(e.target.value)} />
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Informasi Alamat"
              description="Alamat domisili atau alamat operasional perusahaan."
              icon={MapPin}
            >
              <div className="space-y-2">
                <Label className="text-xs font-semibold">{labels.fieldAddress}</Label>
                <Input placeholder="Alamat lengkap" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{labels.fieldCity}</Label>
                  <Input placeholder="Kota" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{labels.fieldProvince}</Label>
                  <Input placeholder="Provinsi" value={province} onChange={(e) => setProvince(e.target.value)} />
                </div>
              </div>
              <div className="w-1/2 pr-2 space-y-2">
                <Label className="text-xs font-semibold">{labels.fieldPostalCode}</Label>
                <Input placeholder="Kode Pos" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
            </SectionCard>
          </div>

          <div className="flex flex-col gap-6">
            <SectionCard
              title="Informasi Kontak"
              description="Nomor telepon dan email untuk keperluan komunikasi."
              icon={Phone}
            >
              <div className="space-y-2">
                <Label className="text-xs font-semibold">{labels.fieldPhone} <span className="text-danger">*</span></Label>
                <Input 
                  placeholder={labels.placeholderPhone} 
                  value={phone} onChange={(e) => setPhone(e.target.value)} 
                />
                {errors.phone && <p className="text-[11px] text-danger">{errors.phone}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">{labels.fieldEmail}</Label>
                <Input 
                  type="email" placeholder={labels.placeholderEmail} 
                  value={email} onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </SectionCard>

            {type === 'INDIVIDUAL' ? (
              <SectionCard
                title={labels.tabSim || "Lisensi & Pekerjaan"}
                description="Detail lisensi berkendara."
                icon={FileText}
              >
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{labels.fieldSimNumber}</Label>
                  <Input placeholder="Nomor SIM" value={simNumber} onChange={(e) => setSimNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{labels.fieldSimType}</Label>
                    <Input placeholder="Contoh: A, B1" value={simType} onChange={(e) => setSimType(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{labels.fieldSimExpiredAt}</Label>
                    <Input type="date" value={simExpiredAt} onChange={(e) => setSimExpiredAt(e.target.value)} />
                  </div>
                </div>
              </SectionCard>
            ) : (
              <SectionCard
                title={labels.tabPic || "Informasi PIC"}
                description="Penanggung jawab atau representatif dari perusahaan."
                icon={Briefcase}
              >
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{labels.fieldPicName} <span className="text-danger">*</span></Label>
                  <Input placeholder="Nama PIC" value={picName} onChange={(e) => setPicName(e.target.value)} />
                  {errors.picName && <p className="text-[11px] text-danger">{errors.picName}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{labels.fieldPicPosition}</Label>
                  <Input placeholder="Jabatan PIC" value={picPosition} onChange={(e) => setPicPosition(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{labels.fieldPicPhone}</Label>
                    <Input placeholder="No HP PIC" value={picPhone} onChange={(e) => setPicPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">{labels.fieldPicEmail}</Label>
                    <Input type="email" placeholder="Email PIC" value={picEmail} onChange={(e) => setPicEmail(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">{labels.fieldPicNik}</Label>
                  <Input placeholder="NIK PIC" value={picNik} onChange={(e) => setPicNik(e.target.value)} />
                </div>
              </SectionCard>
            )}
          </div>
        </form>
      </div>

      {/* Fixed Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 px-4 md:px-8 bg-white dark:bg-neutral-950 border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-10 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-[14px] font-bold text-foreground">
            {isEditing ? labels.actionEdit : labels.addCustomer}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isEditing ? 'Perbarui informasi detail pelanggan.' : 'Masukkan informasi detail pelanggan baru.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="bg-white dark:bg-neutral-900" onClick={onCancel}>
            {labels.cancel || 'Batal'}
          </Button>
          <Button type="submit" variant="primary" className="bg-danger hover:bg-danger/90 text-white" form="customer-form">
            {labels.save || 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
