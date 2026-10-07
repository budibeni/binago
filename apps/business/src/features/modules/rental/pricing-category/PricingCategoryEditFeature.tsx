'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getPricingCategoryTranslation } from './i18n';
import { PricingCategoryForm, type PricingCategoryFormData } from './components/PricingCategoryForm';
import { pricingService } from '@/data/modules/rental/services/pricingService';
import type { RateType } from '../bookings/types/booking';
import { toast } from '@adatrack/ui';

export function PricingCategoryEditFeature({ id }: { id: string }) {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getPricingCategoryTranslation(locale);
  const labels = t;

  const group = pricingService.getPricingCategory().find(g => g.id === id);
  const rates = pricingService.getRatesByGroupId(id);

  const handleSave = (formData: PricingCategoryFormData) => {
    const newRates = [
      { rateType: 'HOURLY' as RateType, amount: formData.hourlyRate || 0 },
      { rateType: 'DAILY' as RateType, amount: formData.dailyRate || 0 },
    ];

    pricingService.updatePricingCategory(id, {
      name: formData.name,
      description: formData.description,
      hourlyDeposit: formData.hourlyDeposit,
      dailyDeposit: formData.dailyDeposit,
      status: formData.status,
      packages: formData.packages
    }, newRates);
    
    toast.success(labels.updateSuccess);
    router.push('/rental/pricing-category');
    router.refresh();
  };

  const handleCancel = (open: boolean) => {
    if (!open) {
      router.push('/rental/pricing-category');
    }
  };

  if (!group) return <div>Not found</div>;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-neutral-50/30 dark:bg-neutral-950">
      <PricingCategoryForm
        open={true}
        onOpenChange={handleCancel}
        onSubmit={handleSave}
        initialData={group}
        initialRates={rates.map(r => ({ rateType: r.rateType, amount: r.amount }))}
        initialPackages={group.packages}
        title={labels.formEditTitle}
        layout="default"
        labels={labels as any}
      />
    </div>
  );
}
