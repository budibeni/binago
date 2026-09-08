import { Metadata } from 'next';
import LogFeature from '../../../features/core/access/log/LogFeature';

export const metadata: Metadata = {
  title: 'Log Card | ADATRACK',
  description: 'Riwayat penggunaan Card dan aktivitas akses.',
};

export default function LogPage() {
  return <LogFeature />;
}
