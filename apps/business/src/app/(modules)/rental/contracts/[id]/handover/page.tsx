import { HandoverFeature } from '@/features/modules/rental/handover/HandoverFeature';

export default function HandoverPage({ params }: { params: { id: string } }) {
  return <HandoverFeature contractId={params.id} />;
}
