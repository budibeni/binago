'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { NotificationEvent } from '../types';
import { initialMockNotifications } from '../data/mockNotifications';

export interface NotificationSettings {
  movement: boolean;
  stop: boolean;
  offline: boolean;
  deviceUnplugged: boolean;
  enterGeofence: boolean;
  exitGeofence: boolean;
}

interface NotificationContextValue {
  notifications: NotificationEvent[];
  settings: NotificationSettings;
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  addNotification: (notification: Omit<NotificationEvent, 'id' | 'read' | 'timestamp'>) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationEvent[]>(initialMockNotifications);
  
  const [settings, setSettings] = useState<NotificationSettings>({
    movement: true,
    stop: false,
    offline: true,
    deviceUnplugged: true, // New mock event
    enterGeofence: true,
    exitGeofence: true,
  });

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notif => {
      if (notif.type === 'vehicle_started' && !settings.movement) return false;
      if (notif.type === 'vehicle_stopped' && !settings.stop) return false;
      if (notif.type === 'vehicle_offline' && !settings.offline) return false;
      if (notif.type === 'device_unplugged' && !settings.deviceUnplugged) return false;
      if (notif.type === 'geofence_enter' && !settings.enterGeofence) return false;
      if (notif.type === 'geofence_exit' && !settings.exitGeofence) return false;
      return true;
    });
  }, [notifications, settings]);

  const unreadCount = useMemo(() => filteredNotifications.filter(n => !n.read).length, [filteredNotifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addNotification = (notification: Omit<NotificationEvent, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: NotificationEvent = {
      ...notification,
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const value = {
    notifications: filteredNotifications,
    settings,
    unreadCount,
    markAsRead,
    markAllAsRead,
    updateSettings,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
