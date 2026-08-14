import { NotificationDetail } from '@/features/notifications/components/NotificationDetail';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification Detail - ADATRACK Personal',
  description: 'View notification details.',
};

export default function NotificationDetailPage({ params }: { params: { notificationId: string } }) {
  return (
    <div className="h-full w-full bg-background md:bg-surface-elevated">
      <NotificationDetail notificationId={params.notificationId} />
    </div>
  );
}
