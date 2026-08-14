import React from 'react';
import { Play, Square, WifiOff, Plug, MapPin } from 'lucide-react';
import { NotificationEvent } from '../types';
import { getTranslation } from '@/i18n';
import { Locale } from '@adatrack/types';
import { cn } from '@adatrack/utils';
import { mockVehicles } from '../../tracking/data/mockTrackingData';

interface NotificationItemProps {
  notification: NotificationEvent;
  locale: Locale;
  onClick: () => void;
}

export function NotificationItem({ notification, locale, onClick }: NotificationItemProps) {
  const t = getTranslation(locale);
  const n = t.notifications;

  const vehicle = mockVehicles.find(v => v.id === notification.vehicleId);
  const vehicleNameOrPlate = vehicle ? vehicle.plateNumber : 'Unknown';

  const formatMessage = () => {
    switch (notification.type) {
      case 'vehicle_started':
        return n.vehicleStarted.replace('{vehicle}', vehicleNameOrPlate);
      case 'vehicle_stopped':
        return n.vehicleStopped.replace('{vehicle}', vehicleNameOrPlate);
      case 'vehicle_offline':
        return n.vehicleOffline.replace('{vehicle}', vehicleNameOrPlate);
      case 'device_unplugged':
        return n.deviceUnplugged;
      case 'geofence_enter':
        return n.enteredGeofence
          .replace('{vehicle}', vehicleNameOrPlate)
          .replace('{geofence}', notification.context?.geofenceName || 'Area');
      case 'geofence_exit':
        return n.exitedGeofence
          .replace('{vehicle}', vehicleNameOrPlate)
          .replace('{geofence}', notification.context?.geofenceName || 'Area');
      default:
        return '';
    }
  };

  const getTitle = () => {
    switch (notification.type) {
      case 'device_unplugged':
        return n.deviceUnpluggedTitle;
      default:
        return vehicleNameOrPlate; // Usually the vehicle plate is the title for other events
    }
  };

  const getIconAndColors = () => {
    switch (notification.type) {
      case 'vehicle_started':
        return { Icon: Play, color: 'text-green-600 dark:text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' };
      case 'vehicle_stopped':
        return { Icon: Square, color: 'text-amber-600 dark:text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' };
      case 'vehicle_offline':
        return { Icon: WifiOff, color: 'text-neutral-500 dark:text-neutral-400', bg: 'bg-neutral-100 dark:bg-neutral-800/50' };
      case 'device_unplugged':
        return { Icon: Plug, color: 'text-red-600 dark:text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' };
      case 'geofence_enter':
        return { Icon: MapPin, color: 'text-green-600 dark:text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' };
      case 'geofence_exit':
        return { Icon: MapPin, color: 'text-amber-600 dark:text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' };
      default:
        return { Icon: MapPin, color: 'text-neutral-500', bg: 'bg-neutral-100' };
    }
  };

  const { Icon, color, bg } = getIconAndColors();

  const formatRelativeTime = (isoString: string) => {
    const now = Date.now();
    const then = new Date(isoString).getTime();
    const diff = now - then;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 1) return new Date(isoString).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' });
    if (days === 1) return locale === 'en' ? 'Yesterday' : 'Kemarin';
    if (hours > 0) return new Date(isoString).toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    if (minutes > 0) return locale === 'en' ? `${minutes}m ago` : `${minutes} menit lalu`;
    return locale === 'en' ? 'just now' : 'baru saja';
  };

  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "flex gap-3 p-3 transition-colors cursor-pointer group outline-none",
        notification.read 
          ? "bg-surface hover:bg-surface-elevated opacity-75"
          : "bg-red-50/30 dark:bg-red-950/10 hover:bg-red-50/50 dark:hover:bg-red-950/20"
      )}
    >
      <div className={cn("shrink-0 w-10 h-10 rounded-full flex items-center justify-center", bg)}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm truncate",
            notification.read ? "font-medium text-foreground" : "font-bold text-foreground"
          )}>
            {getTitle()}
          </p>
          <span className="shrink-0 text-xs text-foreground-muted whitespace-nowrap mt-0.5">
            {formatRelativeTime(notification.timestamp)}
          </span>
        </div>
        <p className={cn(
          "text-sm line-clamp-2 mt-0.5",
          notification.read ? "text-foreground-muted" : "text-foreground"
        )}>
          {formatMessage()}
        </p>
      </div>
      {!notification.read && (
        <div className="shrink-0 w-2 h-2 rounded-full bg-red-500 mt-1.5" aria-hidden="true" />
      )}
    </div>
  );
}
