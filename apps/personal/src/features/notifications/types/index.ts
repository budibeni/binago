export type NotificationType = 
  | 'vehicle_started'
  | 'vehicle_stopped'
  | 'vehicle_offline'
  | 'device_unplugged'
  | 'geofence_enter'
  | 'geofence_exit'
  | 'vehicle_security';

export interface NotificationEvent {
  id: string;
  type: NotificationType;
  vehicleId: string;
  timestamp: string; // ISO string
  read: boolean;
  context?: Record<string, string>; // e.g., geofenceName
}
