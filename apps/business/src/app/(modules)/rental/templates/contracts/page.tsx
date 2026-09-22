import React from 'react';
import { ContractTemplatesFeature } from '@/features/modules/rental/templates/ContractTemplatesFeature';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Template Kontrak Rental | ADATRACK',
  description: 'Manajemen template kontrak rental',
};

export default function RentalContractTemplatesPage() {
  return <ContractTemplatesFeature />;
}
