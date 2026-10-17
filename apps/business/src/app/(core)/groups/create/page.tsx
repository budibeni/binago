import type { Metadata } from 'next';
import { GroupCreateFeature } from '../../../../features/core/groups/GroupCreateFeature';

export const metadata: Metadata = {
  title: 'Tambah Grup - ADATRACK Business',
  description: 'Tambahkan grup operasional baru ke sistem.',
};

export default function CreateGroupPage() {
  return <GroupCreateFeature />;
}
