'use client';

import React from 'react';
import { Button, Input, Label, FormShell, FormCard, InputSelect } from '@adatrack/ui';
import type { RateType } from '../../reservations/types/reservation';
import type { RentalPricingGroup, PricingGroupStatus } from '../types/pricing';

export interface PricingGroupFormData {
  name: string;
  description: string;
  status: PricingGroupStatus;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
}

interface PricingGroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RentalPricingGroup;
  initialRates?: { rateType: RateType, amount: number }[];
  onSubmit: (data: PricingGroupFormData) => void;
  title: string;
}

export function PricingGroupForm({ open, onOpenChange, initialData, initialRates, onSubmit, title }: PricingGroupFormProps) {
  const getInitialRate = (type: RateType) => {
    if (!initialRates) return 0;
    const rate = initialRates.find(r => r.rateType === type);
    return rate ? rate.amount : 0;
  };

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState<PricingGroupStatus>('ACTIVE');
  const [dailyRate, setDailyRate] = React.useState('');
  const [weeklyRate, setWeeklyRate] = React.useState('');
  const [monthlyRate, setMonthlyRate] = React.useState('');

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
        setStatus(initialData.status);
        setDailyRate(getInitialRate('DAILY').toString());
        setWeeklyRate(getInitialRate('WEEKLY').toString());
        setMonthlyRate(getInitialRate('MONTHLY').toString());
      } else {
        setName('');
        setDescription('');
        setStatus('ACTIVE');
        setDailyRate('');
        setWeeklyRate('');
        setMonthlyRate('');
      }
    }
  }, [open, initialData, initialRates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onSubmit({
      name,
      description,
      status,
      dailyRate: Number(dailyRate) || 0,
      weeklyRate: Number(weeklyRate) || 0,
      monthlyRate: Number(monthlyRate) || 0,
    });
  };

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      onSubmit={handleSubmit}
      layout="dialog"
      onCancel={() => onOpenChange(false)}
      saveText="Simpan"
    >
      <FormCard title="Informasi Grup">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Grup Tarif</Label>
            <Input 
              placeholder="Misal: MPV Standard" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Input 
              placeholder="Opsional" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <InputSelect
              value={status}
              onChange={(val: any) => setStatus(val)}
              options={[
                { value: 'ACTIVE', label: 'Aktif' },
                { value: 'INACTIVE', label: 'Nonaktif' }
              ]}
              placeholder="Pilih Status"
            />
          </div>
        </div>
      </FormCard>

      <FormCard title="Tarif Default">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tarif Harian (Rp)</Label>
            <Input 
              type="number" 
              min={0}
              value={dailyRate}
              onChange={e => setDailyRate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Tarif Mingguan (Rp)</Label>
            <Input 
              type="number" 
              min={0}
              value={weeklyRate}
              onChange={e => setWeeklyRate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Tarif Bulanan (Rp)</Label>
            <Input 
              type="number" 
              min={0}
              value={monthlyRate}
              onChange={e => setMonthlyRate(e.target.value)} 
            />
          </div>
        </div>
      </FormCard>
    </FormShell>
  );
}
