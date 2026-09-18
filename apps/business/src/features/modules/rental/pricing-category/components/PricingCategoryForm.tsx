'use client';

import React from 'react';
import { FormShell, FormCard, InputString, InputNumber, InputSelect, InputTextarea } from '@adatrack/ui';
import { Layers, Banknote } from 'lucide-react';
import type { RateType } from '../../reservations/types/reservation';
import type { RentalPricingCategory, PricingCategoryStatus } from '../types/pricing';

export interface PricingCategoryFormData {
  name: string;
  description: string;
  status: PricingCategoryStatus;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
}

interface PricingCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RentalPricingCategory;
  initialRates?: { rateType: RateType, amount: number }[];
  onSubmit: (data: PricingCategoryFormData) => void;
  title: string;
}

export function PricingCategoryForm({ open, onOpenChange, initialData, initialRates, onSubmit, title }: PricingCategoryFormProps) {
  const getInitialRate = (type: RateType) => {
    if (!initialRates) return 0;
    const rate = initialRates.find(r => r.rateType === type);
    return rate ? rate.amount : 0;
  };

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [status, setStatus] = React.useState<PricingCategoryStatus>('ACTIVE');
  const [dailyRate, setDailyRate] = React.useState<number | null>(0);
  const [weeklyRate, setWeeklyRate] = React.useState<number | null>(0);
  const [monthlyRate, setMonthlyRate] = React.useState<number | null>(0);

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
        setStatus(initialData.status);
        setDailyRate(getInitialRate('DAILY'));
        setWeeklyRate(getInitialRate('WEEKLY'));
        setMonthlyRate(getInitialRate('MONTHLY'));
      } else {
        setName('');
        setDescription('');
        setStatus('ACTIVE');
        setDailyRate(0);
        setWeeklyRate(0);
        setMonthlyRate(0);
      }
    }
  }, [open, initialData, initialRates]);

  const handleSubmit = () => {
    if (!name) return;

    onSubmit({
      name,
      description,
      status,
      dailyRate: dailyRate || 0,
      weeklyRate: weeklyRate || 0,
      monthlyRate: monthlyRate || 0,
    });
  };

  return (
    <FormShell
      layout="drawer"
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      subtitle={initialData ? 'Perbarui informasi kategori tarif' : 'Tambahkan kategori tarif baru'}
      onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      onSave={handleSubmit}
      onCancel={() => onOpenChange(false)}
      saveText="Simpan"
      columns={1}
    >
      <div className="flex flex-col gap-6">
        <FormCard 
          title="Informasi Kategori"
          description="Informasi dasar mengenai kategori tarif."
          icon={<Layers className="w-5 h-5 text-primary" />}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label="Nama Kategori Tarif"
              placeholder="Misal: MPV Standard"
              value={name}
              onChange={setName}
              required
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputSelect
              label="Status"
              value={status}
              onChange={(val: any) => setStatus(val)}
              options={[
                { value: 'ACTIVE', label: 'Aktif' },
                { value: 'INACTIVE', label: 'Nonaktif' }
              ]}
              placeholder="Pilih Status"
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputTextarea
              label="Deskripsi"
              placeholder="Opsional"
              value={description}
              onChange={setDescription}
              rows={3}
            />
          </div>
        </FormCard>

        <FormCard 
          title="Tarif Default"
          description="Atur nominal tarif untuk kategori ini."
          icon={<Banknote className="w-5 h-5 text-emerald-500" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label="Tarif Harian (Rp)"
              value={dailyRate}
              onChange={setDailyRate}
              min={0}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label="Tarif Mingguan (Rp)"
              value={weeklyRate}
              onChange={setWeeklyRate}
              min={0}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label="Tarif Bulanan (Rp)"
              value={monthlyRate}
              onChange={setMonthlyRate}
              min={0}
            />
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}

