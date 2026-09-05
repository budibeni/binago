import { Metadata } from 'next';
import { ScheduleEditFeature } from '@/features/modules/transport/schedules/ScheduleEditFeature';

export const metadata: Metadata = {
  title: 'Edit Jadwal Operasional - ADATRACK Business',
  description: 'Perbarui jadwal operasional armada.',
};

export default function ScheduleEditPage({ params }: { params: { id: string } }) {
  return <ScheduleEditFeature id={params.id} />;
}
