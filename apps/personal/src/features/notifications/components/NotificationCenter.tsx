'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { NotificationItem } from './NotificationItem';
import { NotificationEvent } from '../types';

export function NotificationCenter() {
  const router = useRouter();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const n = t.notifications;

  const handleBack = () => {
    router.back();
  };

  const handleNotificationClick = (id: string, _vehicleId: string) => {
    // Navigate to detail page where it will automatically be marked as read
    router.push(`/notifications/${id}`);
  };

  // Group notifications by date (Today, Yesterday, etc.)
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, NotificationEvent[]> = {};
    const now = new Date();
    
    // Sort descending by timestamp
    const sorted = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    sorted.forEach(notif => {
      const date = new Date(notif.timestamp);
      
      let key = '';
      const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

      if (isToday) {
        key = locale === 'en' ? 'Today' : 'Hari ini';
      } else if (isYesterday) {
        key = locale === 'en' ? 'Yesterday' : 'Kemarin';
      } else {
        key = date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(notif);
    });
    
    return groups;
  }, [notifications, locale]);

  return (
    <div className="flex flex-col h-full bg-background md:bg-surface">
      {/* Mobile/Desktop Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-8 border-b border-border bg-surface shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label={t.common.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-foreground">{n.title}</h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">{n.markAllAsRead}</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-3xl mx-auto p-4 md:p-8">
        {notifications.length > 0 ? (
          <div className="flex flex-col gap-8 pb-10">
            {Object.entries(groupedNotifications).map(([groupKey, items]) => (
              <div key={groupKey} className="flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-sm font-semibold text-foreground-muted shrink-0">{groupKey}</h2>
                  <div className="h-px bg-border flex-1" />
                </div>
                
                <div className="bg-surface rounded-2xl border border-border overflow-hidden divide-y divide-border shadow-sm">
                  {items.map(notif => (
                    <NotificationItem 
                      key={notif.id} 
                      notification={notif} 
                      locale={locale} 
                      onClick={() => handleNotificationClick(notif.id, notif.vehicleId || '')}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center text-foreground-subtle mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {n.emptyStateTitle}
            </h3>
            <p className="text-sm text-foreground-muted">
              {n.emptyStateDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
