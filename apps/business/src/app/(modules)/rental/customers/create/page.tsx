import { Metadata } from 'next';
import { CustomerCreateFeature } from '@/features/modules/rental/customers/CustomerCreateFeature';

export const metadata: Metadata = {
  title: 'Tambah Pelanggan - ADATRACK Business',
  description: 'Tambah data pelanggan rental baru.',
};

export default function CustomerCreatePage() {
  return <CustomerCreateFeature />;
}
