import { ContractCreateFeature } from '@/features/modules/rental/contracts/ContractCreateFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buat Kontrak Rental | ADATRACK Business',
  description: 'Buat kontrak rental kendaraan baru',
};

export default function ContractCreatePage() {
  return <ContractCreateFeature />;
}
