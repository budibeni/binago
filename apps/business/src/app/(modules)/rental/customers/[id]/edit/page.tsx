import { Metadata } from 'next';
import { CustomerEditFeature } from '@/features/modules/rental/customers/CustomerEditFeature';

export const metadata: Metadata = {
  title: 'Edit Pelanggan - ADATRACK Business',
  description: 'Ubah data pelanggan rental.',
};

export default function CustomerEditPage({ params }: { params: { id: string } }) {
  return <CustomerEditFeature id={params.id} />;
}
