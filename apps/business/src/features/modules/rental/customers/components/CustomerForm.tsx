'use client';

import React from 'react';
import { Dialog, Button, Input, Label, Select } from '@adatrack/ui';
import type { Customer, IndividualCustomer, CompanyCustomer } from '../types/customer';

interface CustomerFormProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
  labels: Record<string, string>;
}

export function CustomerForm({
  customer,
  open,
  onOpenChange,
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
    if (open) {
      if (customer) {
        setType(customer.type);
        setStatus(customer.status);
        setName(customer.name);
        setPhone(customer.phone);
        setEmail(customer.email);
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
          setPicEmail(comp.picEmail);
          setPicNik(comp.picNik);
        }
      } else {
        // Reset form
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
    }
  }, [open, customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
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
    <Dialog open={open} onOpenChange={onOpenChange} title={isEditing ? labels.actionEdit : labels.addCustomer} className="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="py-2 max-h-[70vh] overflow-y-auto pr-2 space-y-6">
            {/* Tipe & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{labels.fieldCustomerType}</Label>
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
                <Label>{labels.fieldStatus}</Label>
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

            {type === 'INDIVIDUAL' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-[14px] text-foreground border-b border-border/60 pb-1">{labels.tabPersonalInfo}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{labels.fieldFullName} *</Label>
                    <Input 
                      placeholder={labels.placeholderName} 
                      value={name} onChange={(e) => setName(e.target.value)} 
                    />
                    {errors.name && <p className="text-[11px] text-danger">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldNik} *</Label>
                    <Input 
                      placeholder={labels.placeholderNik} 
                      value={nik} onChange={(e) => setNik(e.target.value)} 
                    />
                    {errors.nik && <p className="text-[11px] text-danger">{errors.nik}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldBirthPlace}</Label>
                    <Input value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldBirthDate}</Label>
                    <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldPhone} *</Label>
                    <Input 
                      placeholder={labels.placeholderPhone} 
                      value={phone} onChange={(e) => setPhone(e.target.value)} 
                    />
                    {errors.phone && <p className="text-[11px] text-danger">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldEmail}</Label>
                    <Input 
                      type="email" placeholder={labels.placeholderEmail} 
                      value={email} onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>

                <h4 className="font-semibold text-[14px] text-foreground border-b border-border/60 pb-1 pt-2">{labels.tabSim}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{labels.fieldSimNumber}</Label>
                    <Input value={simNumber} onChange={(e) => setSimNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldSimType}</Label>
                    <Input value={simType} onChange={(e) => setSimType(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldSimExpiredAt}</Label>
                    <Input type="date" value={simExpiredAt} onChange={(e) => setSimExpiredAt(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {type === 'COMPANY' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-[14px] text-foreground border-b border-border/60 pb-1">{labels.tabCompanyInfo}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label>{labels.fieldCompanyName} *</Label>
                    <Input 
                      placeholder={labels.placeholderName} 
                      value={name} onChange={(e) => setName(e.target.value)} 
                    />
                    {errors.name && <p className="text-[11px] text-danger">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldNib}</Label>
                    <Input value={nib} onChange={(e) => setNib(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldNpwp}</Label>
                    <Input value={npwp} onChange={(e) => setNpwp(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldPhone} *</Label>
                    <Input 
                      placeholder={labels.placeholderPhone} 
                      value={phone} onChange={(e) => setPhone(e.target.value)} 
                    />
                    {errors.phone && <p className="text-[11px] text-danger">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldEmail}</Label>
                    <Input 
                      type="email" placeholder={labels.placeholderEmail} 
                      value={email} onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>

                <h4 className="font-semibold text-[14px] text-foreground border-b border-border/60 pb-1 pt-2">{labels.tabPic}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{labels.fieldPicName} *</Label>
                    <Input value={picName} onChange={(e) => setPicName(e.target.value)} />
                    {errors.picName && <p className="text-[11px] text-danger">{errors.picName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldPicPosition}</Label>
                    <Input value={picPosition} onChange={(e) => setPicPosition(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldPicPhone}</Label>
                    <Input value={picPhone} onChange={(e) => setPicPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{labels.fieldPicEmail}</Label>
                    <Input type="email" value={picEmail} onChange={(e) => setPicEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>{labels.fieldPicNik}</Label>
                    <Input value={picNik} onChange={(e) => setPicNik(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <h4 className="font-semibold text-[14px] text-foreground border-b border-border/60 pb-1">{labels.tabAddress}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>{labels.fieldAddress}</Label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{labels.fieldCity}</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{labels.fieldProvince}</Label>
                  <Input value={province} onChange={(e) => setProvince(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{labels.fieldPostalCode}</Label>
                  <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </div>
              </div>
            </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {labels.cancel}
          </Button>
          <Button type="submit" variant="primary">
            {labels.save}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
