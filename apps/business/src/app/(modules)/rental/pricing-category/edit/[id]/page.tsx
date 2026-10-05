'use client';

import React from 'react';
import { PricingCategoryEditFeature } from '@/features/modules/rental/pricing-category/PricingCategoryEditFeature';

export default function EditPricingCategoryPage({ params }: { params: { id: string } }) {
  return <PricingCategoryEditFeature id={params.id} />;
}
