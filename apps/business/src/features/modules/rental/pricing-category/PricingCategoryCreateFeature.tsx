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
      { rateType: 'HOURLY' as RateType, amount: formData.hourlyRate || 0 },
      { rateType: 'DAILY' as RateType, amount: formData.dailyRate || 0 },
    ];

    // Ideally pricingService should support saving packages too
    // pricingService.createPricingCategory({...}, rates, formData.packages);
    pricingService.createPricingCategory({
      code: formData.name.substring(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-4),
      name: formData.name,
      description: formData.description || '',
      hourlyDeposit: formData.hourlyDeposit || 0,
      dailyDeposit: formData.dailyDeposit || 0,
      packages: formData.packages || [],
      status: formData.status || 'ACTIVE'
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
        layout="default"
        labels={labels as any}
      />
    </div>
  );
}
