'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ContractCreateFeature } from '@/features/modules/rental/contracts/ContractCreateFeature';

export default function CreateContractPage() {
  const router = useRouter();

  return (
    <ContractCreateFeature
      open={true}
      onOpenChange={(open) => {
        if (!open) router.push('/rental/contracts');
      }}
      onSuccess={() => {
        router.push('/rental/contracts');
      }}
    />
  );
}
