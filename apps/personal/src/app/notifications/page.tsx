import { NotificationCenter } from '@/features/notifications/components/NotificationCenter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications - BINAGO Personal',
  description: 'View all your GPS tracking notifications.',
};

export default function NotificationsPage() {
  return (
    <div className="h-full w-full bg-surface">
      <NotificationCenter />
    </div>
  );
}
