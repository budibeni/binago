'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PricingCategoryForm } from '@/features/modules/rental/pricing-category/components/PricingCategoryForm';
import { pricingService } from '@/data/modules/rental/services/pricingService';

export default function CreatePricingCategoryPage() {
  const router = useRouter();

  const handleSave = (data: any) => {
    pricingService.createPricingCategory({
      name: data.name,
      description: data.description,
      status: data.status,
    }, data.rates);
    router.push('/rental/pricing-category');
  };

  return (
    <PricingCategoryForm
      layout="default"
      open={true}
      initialData={undefined}
      initialRates={[]}
      onOpenChange={(open) => {
        if (!open) router.push('/rental/pricing-category');
      }}
      onSubmit={handleSave}
      title="Tambah Kategori Tarif"
    />
  );
}
