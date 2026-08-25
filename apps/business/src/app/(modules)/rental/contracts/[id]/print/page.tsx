import { ContractPrintFeature } from '@/features/modules/rental/contracts/ContractPrintFeature';

export default function PrintContractPage({ params }: { params: { id: string } }) {
  return <ContractPrintFeature contractId={params.id} />;
}
