'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReturnFeature as ReturnFormFeature } from '@/features/modules/rental/returns/ReturnFeature';

function CreateReturnForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractId = searchParams.get('contractId') || null;

  return (
    <ReturnFormFeature
      contractId={contractId}
      open={true}
      onOpenChange={(open) => {
        if (!open) router.push('/rental/returns');
      }}
      onSuccess={() => {
        router.push('/rental/returns');
      }}
    />
  );
}

export default function CreateReturnPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateReturnForm />
    </Suspense>
  );
}
