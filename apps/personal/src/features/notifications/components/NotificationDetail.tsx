'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CarFront, BellRing, Navigation2, LogOut, PowerOff, ShieldCheck, ShieldAlert, Circle, Map } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { getTranslation } from '@/i18n';
import { Button, EmptyState } from '@binago/ui';
import { NotificationType } from '../types';
import { mockVehicles } from '@/features/tracking/data/mockTrackingData';

interface NotificationDetailProps {
  notificationId: string;
}

const getEventIcon = (type: NotificationType) => {
  switch (type) {
    case 'vehicle_started': return <Navigation2 className="w-6 h-6 text-green-600 dark:text-green-400" />;
    case 'vehicle_stopped': return <Circle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
    case 'vehicle_offline': return <PowerOff className="w-6 h-6 text-foreground-muted" />;
    case 'device_unplugged': return <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />;
    case 'geofence_enter': return <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />;
    case 'geofence_exit': return <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
    default: return <BellRing className="w-6 h-6 text-foreground-muted" />;
  }
};

const getEventColor = (type: NotificationType) => {
  switch (type) {
    case 'vehicle_started': return 'bg-green-50 dark:bg-green-950/20';
    case 'vehicle_stopped': return 'bg-amber-50 dark:bg-amber-950/20';
    case 'vehicle_offline': return 'bg-neutral-100 dark:bg-neutral-800';
    case 'device_unplugged': return 'bg-red-50 dark:bg-red-950/20';
    case 'geofence_enter': return 'bg-green-50 dark:bg-green-950/20';
    case 'geofence_exit': return 'bg-amber-50 dark:bg-amber-950/20';
    default: return 'bg-neutral-100 dark:bg-neutral-800';
  }
};

export function NotificationDetail({ notificationId }: NotificationDetailProps) {
  const router = useRouter();
  const { notifications, markAsRead } = useNotifications();
  const locale = usePersonalLocale();
  const t = getTranslation(locale);
  const nd = t.notifications.detail;

  const notification = notifications.find(n => n.id === notificationId);

  useEffect(() => {
    if (notification && !notification.read) {
      markAsRead(notification.id);
    }
  }, [notification, markAsRead]);

  const handleBack = () => {
    // If the user navigates back natively, it will pop state, but using router.push to fallback ensures 
    // we don't go to Vehicle Detail by mistake.
    // However, if we came from popover, router.back() goes where we were. 
    // Fallback: router.back()
    router.back();
  };

  const handleViewVehicle = () => {
    if (notification?.vehicleId) {
      router.push(`/?vehicleId=${notification.vehicleId}`);
    }
  };

  if (!notification) {
    return (
      <div className="flex flex-col h-full bg-background md:bg-surface">
        <div className="sticky top-0 z-10 flex items-center px-4 py-4 md:px-8 border-b border-border bg-surface shadow-sm">
          <button 
            onClick={() => router.push('/notifications')}
            className="p-2 -ml-2 rounded-full hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label={nd.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-foreground ml-3">{nd.title}</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <EmptyState
            title={nd.notFound}
            description=""
            icon={BellRing}
            action={<Button onClick={() => router.push('/notifications')}>{nd.back}</Button>}
          />
        </div>
      </div>
    );
  }

  const vehicle = mockVehicles.find(v => v.id === notification.vehicleId);
  const dateObj = new Date(notification.timestamp);
  const timeStr = dateObj.toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = dateObj.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  // Get raw message, apply interpolation
  let message = '';
  switch (notification.type) {
    case 'vehicle_started': message = t.notifications.vehicleStarted; break;
    case 'vehicle_stopped': message = t.notifications.vehicleStopped; break;
    case 'vehicle_offline': message = t.notifications.vehicleOffline; break;
    case 'device_unplugged': message = notification.context?.geofenceName ? t.notifications.deviceUnpluggedTitle : t.notifications.deviceUnplugged; break;
    case 'geofence_enter': message = t.notifications.enteredGeofence; break;
    case 'geofence_exit': message = t.notifications.exitedGeofence; break;
    default: message = '';
  }

  // Format message
  let displayMessage = message;
  const vehicleName = vehicle?.plateNumber || nd.vehicle;
  displayMessage = displayMessage.replace('{vehicle}', vehicleName);
  if (notification.context?.geofenceName) {
    displayMessage = displayMessage.replace('{geofence}', notification.context.geofenceName);
  }
  
  // Format Title
  let title = '';
  switch (notification.type) {
    case 'vehicle_started': title = t.notifications.title + ' - ' + (locale === 'id' ? 'Mulai Bergerak' : 'Started'); break;
    case 'vehicle_stopped': title = t.notifications.title + ' - ' + (locale === 'id' ? 'Berhenti' : 'Stopped'); break;
    case 'vehicle_offline': title = locale === 'id' ? 'Kendaraan Offline' : 'Vehicle Offline'; break;
    case 'device_unplugged': title = t.notifications.deviceUnpluggedTitle; break;
    case 'geofence_enter': title = locale === 'id' ? 'Masuk Geofence' : 'Enter Geofence'; break;
    case 'geofence_exit': title = locale === 'id' ? 'Keluar Geofence' : 'Exit Geofence'; break;
    default: title = t.notifications.title;
  }

  return (
    <div className="flex flex-col h-full bg-background md:bg-surface">
      <div className="sticky top-0 z-10 flex items-center px-4 py-4 md:px-8 border-b border-border bg-surface shadow-sm">
        <button 
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          aria-label={nd.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-foreground ml-3">{nd.title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto p-4 md:p-8">
        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="p-6 md:p-8 flex flex-col gap-4 border-b border-border bg-surface">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${getEventColor(notification.type)}`}>
              {getEventIcon(notification.type)}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                {title}
              </h2>
              {notification.type !== 'device_unplugged' ? (
                <p className="text-foreground-muted text-base">
                  {displayMessage}
                </p>
              ) : (
                <p className="text-foreground-muted text-base">
                  {t.notifications.deviceUnplugged}
                </p>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col gap-6 bg-surface">
            {vehicle && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground-subtle">{nd.vehicle}</span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center shrink-0">
                    <CarFront className="w-5 h-5 text-foreground-muted" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-base">{vehicle.plateNumber}</div>
                    {vehicle.name && <div className="text-sm text-foreground-muted">{vehicle.name}</div>}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground-subtle">{nd.eventTime}</span>
                <div className="text-base text-foreground font-medium">
                  {timeStr}
                  <span className="text-foreground-muted ml-2 text-sm">{dateStr}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground-subtle">{nd.eventType}</span>
                <div className="text-base text-foreground font-medium">
                  {title}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground-subtle">{nd.status}</span>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${notification.read ? 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400' : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'}`}>
                    {notification.read ? nd.read : nd.unread}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action */}
          {vehicle && (
            <div className="p-4 md:p-6 border-t border-border bg-surface-elevated flex justify-end">
              <Button onClick={handleViewVehicle} variant="primary" className="w-full md:w-auto flex items-center gap-2">
                <Map className="w-4 h-4" />
                {nd.viewVehicle}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
