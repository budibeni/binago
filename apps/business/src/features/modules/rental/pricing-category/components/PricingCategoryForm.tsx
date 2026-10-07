'use client';

import React from 'react';
import { FormShell, FormCard, InputString, InputNumber, InputSelect, InputTextarea, useForm } from '@adatrack/ui';
import { Layers, Banknote, Plus, Trash2 } from 'lucide-react';
import type { RateType } from '../../bookings/types/booking';
import type { RentalPricingCategory, PricingCategoryStatus, RentalPackage } from '../types/pricing';
import { getPricingCategoryFormSchema } from '../types/pricing';
import { Button } from '@adatrack/ui';

export interface PricingCategoryFormData {
  name: string;
  description: string;
  status: PricingCategoryStatus;
  hourlyRate: number;
  dailyRate: number;
  packages: RentalPackage[];
  hourlyDeposit: number;
  dailyDeposit: number;
}

interface PricingCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RentalPricingCategory;
  initialRates?: { rateType: RateType, amount: number }[];
  initialPackages?: RentalPackage[];
  onSubmit: (data: PricingCategoryFormData) => void;
  title: string;
  layout?: 'default' | 'drawer' | 'dialog' | 'fullscreen';
  labels: Record<string, string>;
}

export function PricingCategoryForm({ open, onOpenChange, initialData, initialRates, initialPackages, onSubmit, title, layout = 'drawer', labels }: PricingCategoryFormProps) {
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
        hourlyDeposit: initialData.hourlyDeposit || 0,
        dailyDeposit: initialData.dailyDeposit || 0,
        hourlyRate: getInitialRate('HOURLY'),
        dailyRate: getInitialRate('DAILY'),
        packages: initialPackages || [],
      };
    }
    return {
      name: '',
      description: '',
      status: 'ACTIVE' as PricingCategoryStatus,
      hourlyDeposit: 0,
      dailyDeposit: 0,
      hourlyRate: 0,
      dailyRate: 0,
      packages: [],
    };
  }, [initialData, initialRates, initialPackages]);

  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useForm<any>({
    initialData: initialFormData,
    resetOn: [open, initialData, initialRates, initialPackages],
    schema: getPricingCategoryFormSchema(labels || {}),
    onSubmit: async (data) => {
      onSubmit(data as PricingCategoryFormData);
    }
  });

  const handleAddPackage = () => {
    const newPackages = [...(formData.packages || []), { id: `new-${Date.now()}`, name: '', durationDays: 1, price: 0 }];
    handleChange('packages', newPackages);
  };

  const handleUpdatePackage = (index: number, field: keyof RentalPackage, value: any) => {
    const newPackages = [...(formData.packages || [])];
    newPackages[index] = { ...newPackages[index], [field]: value };
    handleChange('packages', newPackages);
  };

  const handleRemovePackage = (index: number) => {
    const newPackages = [...(formData.packages || [])];
    newPackages.splice(index, 1);
    handleChange('packages', newPackages);
  };

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
      columns={2}
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
          title={labels.formRatesInfo || "Tarif Default (Reguler)"}
          description="Tarif dasar untuk penyewaan reguler (harian/jam) atau overtime."
          icon={<Banknote className="w-5 h-5 text-emerald-500" />}
          columns={2}
        >
          <div className="col-span-1">
            <InputNumber
              label="Tarif Per Jam (Rp)"
              value={formData.hourlyRate}
              onChange={(v) => handleChange('hourlyRate', v)}
              error={errors.hourlyRate}
              min={0}
            />
          </div>
          <div className="col-span-1">
            <InputNumber
              label="Deposit Per Jam (Rp)"
              value={formData.hourlyDeposit}
              onChange={(v) => handleChange('hourlyDeposit', v)}
              error={errors.hourlyDeposit}
              min={0}
            />
          </div>
          <div className="col-span-1">
            <InputNumber
              label={labels.formDailyLabel || "Tarif Harian (Rp)"}
              value={formData.dailyRate}
              onChange={(v) => handleChange('dailyRate', v)}
              error={errors.dailyRate}
              min={0}
            />
          </div>
          <div className="col-span-1">
            <InputNumber
              label="Deposit Harian (Rp)"
              value={formData.dailyDeposit}
              onChange={(v) => handleChange('dailyDeposit', v)}
              error={errors.dailyDeposit}
              min={0}
            />
          </div>
        </FormCard>
        </div>

        <div className="flex flex-col gap-6">
        <FormCard 
          title="Daftar Paket Sewa"
          description="Tambahkan paket khusus seperti Paket Mingguan (7 Hari) atau Bulanan (30 Hari)."
          icon={<Banknote className="w-5 h-5 text-emerald-500" />}
          columns={1}
        >
          <div className="flex flex-col gap-4">
            {(formData.packages || []).map((pkg: RentalPackage, index: number) => (
              <div key={pkg.id || index} className="flex flex-col gap-4 border p-4 rounded-xl border-border/60 bg-white dark:bg-neutral-900/60 shadow-sm relative">
                <div className="absolute top-2 right-2">
                  <Button type="button" variant="ghost" onClick={() => handleRemovePackage(index)} className="text-danger hover:text-danger hover:bg-danger/10 h-8 w-8 p-0 rounded-full">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-[3fr_2fr] gap-4 pr-8">
                  <InputString
                    label="Nama Paket"
                    placeholder="Misal: Paket 7 Hari"
                    value={pkg.name}
                    onChange={(v) => handleUpdatePackage(index, 'name', v)}
                  />
                  <InputNumber
                    label="Durasi (Hari)"
                    value={pkg.durationDays}
                    onChange={(v) => handleUpdatePackage(index, 'durationDays', v)}
                    min={1}
                  />
                </div>
                
                <div className="grid grid-cols-[3fr_2fr] gap-4 pr-8">
                  <InputNumber
                    label="Harga Paket (Rp)"
                    value={pkg.price}
                    onChange={(v) => handleUpdatePackage(index, 'price', v)}
                    min={0}
                  />
                  <InputNumber
                    label="Deposit (Rp)"
                    value={pkg.deposit}
                    onChange={(v) => handleUpdatePackage(index, 'deposit', v)}
                    min={0}
                  />
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={handleAddPackage} className="border-dashed w-full h-10 text-muted-foreground hover:text-primary">
              <Plus className="w-4 h-4 mr-2" /> Tambah Paket Baru
            </Button>
          </div>
        </FormCard>
        </div>
    </FormShell>
  );
}

