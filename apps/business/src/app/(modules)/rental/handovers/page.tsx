import { Suspense } from 'react';
import { HandoverFeature } from '@/features/modules/rental/handover/HandoverFeature';

export const metadata = {
  title: 'Serah Terima Kendaraan | ADATRACK',
};

export default function HandoversPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HandoverFeature />
    </Suspense>
  );
}
