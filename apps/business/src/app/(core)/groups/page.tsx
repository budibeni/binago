import type { Metadata } from 'next';
import { GroupFeature } from '../../../features/core/groups/GroupFeature';

export const metadata: Metadata = {
  title: 'Grup - ADATRACK Business',
  description: 'Kelola grup kendaraan, pengemudi, geofence, dan rute operasional bisnis Anda.',
};

export default function GroupsPage() {
  return (
    <div className="h-[calc(100vh-56px)] w-full">
      <GroupFeature />
    </div>
  );
}
