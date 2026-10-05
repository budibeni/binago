'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getPricingCategoryTranslation } from './i18n';
import { PricingCategoryForm, type PricingCategoryFormData } from './components/PricingCategoryForm';
import { pricingService } from '@/data/modules/rental/services/pricingService';
import type { RateType } from '../bookings/types/booking';
import { toast } from '@adatrack/ui';

export function PricingCategoryCreateFeature() {
  const router = useRouter();
  const locale = useBusinessLocale();
  const t = getPricingCategoryTranslation(locale);
  const labels = t;

  const handleSave = (formData: PricingCategoryFormData) => {
    const rates = [
      { rateType: 'DAILY' as RateType, amount: formData.dailyRate },
      { rateType: 'WEEKLY' as RateType, amount: formData.weeklyRate },
      { rateType: 'MONTHLY' as RateType, amount: formData.monthlyRate },
    ];

    pricingService.createPricingCategory({
      name: formData.name,
      description: formData.description,
      status: formData.status
    }, rates);
    
    toast.success(labels.createSuccess);
    router.push('/rental/pricing-category');
    router.refresh();
  };

  const handleCancel = (open: boolean) => {
    if (!open) {
      router.push('/rental/pricing-category');
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-neutral-50/30 dark:bg-neutral-950">
      <PricingCategoryForm
        open={true}
        onOpenChange={handleCancel}
        onSubmit={handleSave}
        title={labels.formAddTitle}
        layout="drawer"
      />
    </div>
  );
}
