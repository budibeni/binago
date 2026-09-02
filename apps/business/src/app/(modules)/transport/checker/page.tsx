import { CheckerFeature } from '@/features/modules/transport/checker/CheckerFeature';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checker Penumpang | Transport | ADATRACK',
  description: 'Manajemen penumpang naik turun untuk operasional Transport',
};

export default function CheckerPage() {
  return (
    <div className="p-6">
      <CheckerFeature />
    </div>
  );
}
