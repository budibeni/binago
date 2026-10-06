'use client';

import React from 'react';
import { FormShell, FormCard, InputString, InputNumber, InputSelect, InputTextarea, useForm } from '@adatrack/ui';
import { Layers, Banknote } from 'lucide-react';
import type { RateType } from '../../bookings/types/booking';
import type { RentalPricingCategory, PricingCategoryStatus } from '../types/pricing';
import { getPricingCategoryFormSchema } from '../types/pricing';

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

  const initialFormData = React.useMemo(() => {
    if (initialData) {
      return {
        name: initialData.name,
        description: initialData.description || '',
        status: initialData.status,
        defaultDeposit: initialData.defaultDeposit || 0,
        dailyRate: getInitialRate('DAILY'),
        weeklyRate: getInitialRate('WEEKLY'),
        monthlyRate: getInitialRate('MONTHLY'),
      };
    }
    return {
      name: '',
      description: '',
      status: 'ACTIVE' as PricingCategoryStatus,
      defaultDeposit: 0,
      dailyRate: 0,
      weeklyRate: 0,
      monthlyRate: 0,
    };
  }, [initialData, initialRates]);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<any>({
    initialData: initialFormData,
    resetOn: [open, initialData, initialRates],
    schema: getPricingCategoryFormSchema(labels || {}),
    onSubmit: async (data) => {
      onSubmit(data as PricingCategoryFormData);
    }
  });

  return (
    <FormShell
      layout={layout}
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      subtitle={initialData ? (labels.formEditSubtitle || 'Perbarui informasi kategori tarif') : (labels.formAddSubtitle || 'Tambahkan kategori tarif baru')}
      onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      onSave={() => handleSubmit()}
      isSubmitting={isSubmitting}
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
              value={formData.name || ''}
              onChange={(v) => handleChange('name', v)}
              error={errors.name}
              required
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputSelect
              label={labels.formStatusLabel || "Status"}
              value={formData.status || 'ACTIVE'}
              onChange={(v) => handleChange('status', v)}
              error={errors.status}
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
              value={formData.description || ''}
              onChange={(v) => handleChange('description', v)}
              error={errors.description}
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
              value={formData.dailyRate}
              onChange={(v) => handleChange('dailyRate', v)}
              error={errors.dailyRate}
              min={0}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label={labels.formWeeklyLabel || "Tarif Mingguan (Rp)"}
              value={formData.weeklyRate}
              onChange={(v) => handleChange('weeklyRate', v)}
              error={errors.weeklyRate}
              min={0}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label={labels.formMonthlyLabel || "Tarif Bulanan (Rp)"}
              value={formData.monthlyRate}
              onChange={(v) => handleChange('monthlyRate', v)}
              error={errors.monthlyRate}
              min={0}
            />
          </div>
          <div className="col-span-1 group-data-[layout=default]/form:md:col-span-2 group-data-[layout=fullscreen]/form:md:col-span-2">
            <InputNumber
              label={labels.formDepositLabel || "Uang Jaminan (Rp)"}
              value={formData.defaultDeposit}
              onChange={(v) => handleChange('defaultDeposit', v)}
              error={errors.defaultDeposit}
              min={0}
            />
          </div>
        </FormCard>
      </div>
    </FormShell>
  );
}

