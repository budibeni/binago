import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@adatrack/ui';
import { useNotifications } from '../context/NotificationContext';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { NotificationItem } from './NotificationItem';
import { useRouter } from 'next/navigation';
import { cn } from '@adatrack/utils';

export function NotificationPopover() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const router = useRouter();
  
  const [open, setOpen] = useState(false);

  // Get top 5 notifications
  const recentNotifications = notifications
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const handleNotificationClick = (id: string, _vehicleId: string) => {
    // Let the detail page mark it as read upon mount
    setOpen(false);
    router.push(`/notifications/${id}`);
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push('/notifications');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-2 text-foreground-muted hover:text-foreground transition-colors rounded-full hover:bg-surface-elevated outline-none focus-visible:ring-2 focus-visible:ring-red-500",
            open && "bg-surface-elevated text-foreground"
          )}
          aria-label={t.notifications.title}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-surface"></span>
            </span>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        align="end" 
        sideOffset={8}
        className="w-80 sm:w-96 p-0 overflow-hidden rounded-2xl flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface shrink-0">
          <h3 className="font-bold text-foreground text-sm">{t.notifications.title}</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              {t.notifications.markAllAsRead}
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {recentNotifications.length > 0 ? (
            <div className="divide-y divide-border">
              {recentNotifications.map(notif => (
                <NotificationItem 
                  key={notif.id} 
                  notification={notif} 
                  locale={locale} 
                  onClick={() => handleNotificationClick(notif.id, notif.vehicleId)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center text-foreground-subtle mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                {t.notifications.emptyStateTitle}
              </p>
              <p className="text-xs text-foreground-muted">
                {t.notifications.emptyStateDesc}
              </p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-2 border-t border-border bg-surface shrink-0">
            <button
              onClick={handleViewAll}
              className="w-full py-2.5 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded-xl transition-colors"
            >
              {t.notifications.viewAll}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
