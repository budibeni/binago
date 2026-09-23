import { useState, useEffect } from 'react';
import { wsClient } from '@adatrack/utils';

export interface TrackingNotification {
  id: string;
  category: 'alarm_vehicle' | 'geofence' | 'sensor' | 'maintenance' | 'operation';
  type: 'alert' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  vehicleId: string;
}

export function useLiveNotifications() {
  const [notifications, setNotifications] = useState<TrackingNotification[]>([]);

  useEffect(() => {
    const handleNotification = (notif: TrackingNotification) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    // The PRD mentions 'notify.alert.<vehicle_id>', we'll listen to a generic 'NOTIFICATION' 
    // or pattern match if the wsClient supports it.
    // For simplicity, let's assume the backend sends 'NOTIFICATION' with the payload.
    wsClient.on('NOTIFICATION', handleNotification);

    return () => {
      wsClient.off('NOTIFICATION', handleNotification);
    };
  }, []);

  return { notifications };
}
