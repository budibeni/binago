import { ContractFeature } from '@/features/modules/rental/contracts/ContractFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontrak Rental | ADATRACK Business',
  description: 'Manajemen kontrak rental kendaraan',
};

export default function ContractsPage() {
  return <ContractFeature />;
}
