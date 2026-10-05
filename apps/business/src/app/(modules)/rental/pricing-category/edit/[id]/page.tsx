'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PricingCategoryForm } from '@/features/modules/rental/pricing-category/components/PricingCategoryForm';
import { pricingService } from '@/data/modules/rental/services/pricingService';

export default function EditPricingCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  const group = pricingService.getPricingCategory().find(g => g.id === params.id);
  const rates = pricingService.getRatesByGroupId(params.id);

  const handleSave = (data: any) => {
    pricingService.updatePricingCategory(params.id, {
      name: data.name,
      description: data.description,
      status: data.status,
    }, data.rates);
    router.push('/rental/pricing-category');
  };

  if (!group) return <div>Not found</div>;

  return (
    <PricingCategoryForm
      layout="default"
      open={true}
      initialData={group}
      initialRates={rates.map(r => ({ rateType: r.rateType, amount: r.amount }))}
      onOpenChange={(open) => {
        if (!open) router.push('/rental/pricing-category');
      }}
      onSubmit={handleSave}
      title="Edit Kategori Tarif"
    />
  );
}
