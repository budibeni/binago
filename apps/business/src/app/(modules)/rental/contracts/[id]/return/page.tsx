import { ReturnFeature } from '@/features/modules/rental/returns/ReturnFeature';

export const metadata = {
  title: 'Pengembalian Kendaraan | ADATRACK',
};

export default function ReturnPage({ params }: { params: { id: string } }) {
  return <ReturnFeature contractId={params.id} />;
}
