'use client';

import React from 'react';
import { FormShell, FormCard, InputString, InputNumber, InputSelect, InputTextarea } from '@adatrack/ui';
import { Layers, Banknote } from 'lucide-react';
import type { RateType } from '../../bookings/types/booking';
import type { RentalPricingCategory, PricingCategoryStatus } from '../types/pricing';

export interface PricingCategoryFormData {
  name: string;
  description: string;
  status: PricingCategoryStatus;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  defaultDeposit: number;
}

interface PricingCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RentalPricingCategory;
  initialRates?: { rateType: RateType, amount: number }[];
  onSubmit: (data: PricingCategoryFormData) => void;
  title: string;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  labels: Record<string, string>;
}

export function PricingCategoryForm({ open, onOpenChange, initialData, initialRates, onSubmit, title, layout = 'drawer', labels }: PricingCategoryFormProps) {
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
  const [defaultDeposit, setDefaultDeposit] = React.useState<number | null>(0);

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
        setStatus(initialData.status);
        setDefaultDeposit(initialData.defaultDeposit);
        setDailyRate(getInitialRate('DAILY'));
        setWeeklyRate(getInitialRate('WEEKLY'));
        setMonthlyRate(getInitialRate('MONTHLY'));
      } else {
        setName('');
        setDescription('');
        setStatus('ACTIVE');
        setDefaultDeposit(0);
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
      defaultDeposit: defaultDeposit || 0,
    });
  };

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      subtitle={initialData ? (labels.formEditSubtitle || 'Perbarui informasi kategori tarif') : (labels.formAddSubtitle || 'Tambahkan kategori tarif baru')}
      onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      onSave={handleSubmit}
      onCancel={() => onOpenChange(false)}
      saveText={labels.formSave || "Simpan"}
      columns={1}
    >
      <div className="flex flex-col gap-6">
        <FormCard 
          title={labels.formCategoryInfo || "Informasi Kategori"}
          description={labels.formCategoryInfoDesc || "Informasi dasar mengenai kategori tarif."}
          icon={<Layers className="w-5 h-5 text-primary" />}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputString
              label={labels.formNameLabel || "Nama Kategori Tarif"}
              placeholder={labels.formNamePlaceholder || "Misal: MPV Standard"}
              value={name}
              onChange={setName}
              required
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputSelect
              label={labels.formStatusLabel || "Status"}
              value={status}
              onChange={(val: any) => setStatus(val)}
              options={[
                { value: 'ACTIVE', label: labels.statusActive || 'Aktif' },
                { value: 'INACTIVE', label: labels.statusInactive || 'Nonaktif' }
              ]}
              placeholder={labels.formStatusPlaceholder || "Pilih Status"}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputTextarea
              label={labels.formDescLabel || "Deskripsi"}
              placeholder={labels.formDescPlaceholder || "Opsional"}
              value={description}
              onChange={setDescription}
              rows={3}
            />
          </div>
        </FormCard>

        <FormCard 
          title={labels.formRatesInfo || "Tarif Default"}
          description={labels.formRatesInfoDesc || "Atur nominal tarif untuk kategori ini."}
          icon={<Banknote className="w-5 h-5 text-emerald-500" />}
          columns={2}
        >
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label={labels.formDailyLabel || "Tarif Harian (Rp)"}
              value={dailyRate}
              onChange={setDailyRate}
              min={0}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label={labels.formWeeklyLabel || "Tarif Mingguan (Rp)"}
              value={weeklyRate}
              onChange={setWeeklyRate}
              min={0}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label={labels.formMonthlyLabel || "Tarif Bulanan (Rp)"}
              value={monthlyRate}
              onChange={setMonthlyRate}
              min={0}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label={labels.formDepositLabel || "Uang Jaminan (Rp)"}
              value={defaultDeposit}
              onChange={setDefaultDeposit}
              min={0}
            />
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}

