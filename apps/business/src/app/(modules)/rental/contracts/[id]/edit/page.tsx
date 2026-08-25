import { ContractEditFeature } from '@/features/modules/rental/contracts/ContractEditFeature';

export default function EditContractPage({ params }: { params: { id: string } }) {
  return <ContractEditFeature contractId={params.id} />;
}
