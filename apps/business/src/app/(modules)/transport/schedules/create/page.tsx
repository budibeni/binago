import { Metadata } from 'next';
import { ScheduleCreateFeature } from '@/features/modules/transport/schedules/ScheduleCreateFeature';

export const metadata: Metadata = {
  title: 'Buat Jadwal Operasional - ADATRACK Business',
  description: 'Buat jadwal operasional baru.',
};

export default function ScheduleCreatePage() {
  return <ScheduleCreateFeature />;
}
