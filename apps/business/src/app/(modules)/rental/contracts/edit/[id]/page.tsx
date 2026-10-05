'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ContractEditFeature } from '@/features/modules/rental/contracts/ContractEditFeature';

export default function EditContractPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <ContractEditFeature
      contractId={params.id}
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
