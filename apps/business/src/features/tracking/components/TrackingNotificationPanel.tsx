import React, { useState } from 'react';
import { cn } from '@adatrack/utils';
import { AlertTriangle, Info, MapPin, Wrench, Radio, Map as MapIcon, Car, Clock } from 'lucide-react';

export interface TrackingNotificationPanelProps {
  locale: 'id' | 'en';
  visibleVehicleIds?: string[];
}

type NotificationCategory = 'all' | 'geofence' | 'alarm_vehicle' | 'sensor' | 'maintenance' | 'operation';

const mockNotifications = [
  {
    id: '1',
    category: 'alarm_vehicle',
    type: 'alert',
    title: 'Overspeed Alert',
    message: 'B 9027 PU exceeded speed limit (85 km/h)',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    vehicleId: 'veh-001',
  },
  {
    id: '2',
    category: 'geofence',
    type: 'info',
    title: 'Geofence Entry',
    message: 'B 9329 PYX entered "Warehouse Jakarta"',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    vehicleId: 'veh-002',
  },
  {
    id: '3',
    category: 'alarm_vehicle',
    type: 'warning',
    title: 'Device Offline',
    message: 'B 9062 PYX has been offline for 2 hours',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    vehicleId: 'veh-003',
  },
  {
    id: '4',
    category: 'sensor',
    type: 'warning',
    title: 'Low Fuel Sensor',
    message: 'B 9481 JYY fuel level is below 15%',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    vehicleId: 'veh-004',
  },
  {
    id: '5',
    category: 'maintenance',
    type: 'info',
    title: 'Service Reminder',
    message: 'B 9091 UXY is due for routine oil change',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    vehicleId: 'veh-005',
  },
  {
    id: '6',
    category: 'operation',
    type: 'info',
    title: 'Trip Completed',
    message: 'B 9666 JYX completed delivery trip to Bandung',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    vehicleId: 'veh-006',
  },
];

export function TrackingNotificationPanel({ locale, visibleVehicleIds }: TrackingNotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<NotificationCategory>('all');

  const tabs: { id: NotificationCategory; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: locale === 'en' ? 'All' : 'Semua' },
    { id: 'geofence', label: 'Geofence', icon: <MapIcon className="h-3.5 w-3.5" /> },
    { id: 'alarm_vehicle', label: locale === 'en' ? 'Alarm Vehicle' : 'Alarm Kendaraan', icon: <Car className="h-3.5 w-3.5" /> },
    { id: 'sensor', label: 'Sensor', icon: <Radio className="h-3.5 w-3.5" /> },
    { id: 'maintenance', label: locale === 'en' ? 'Maintenance' : 'Perawatan', icon: <Wrench className="h-3.5 w-3.5" /> },
    { id: 'operation', label: locale === 'en' ? 'Operation' : 'Operasional', icon: <Clock className="h-3.5 w-3.5" /> },
  ];

  const filteredNotifications = mockNotifications.filter((notif) => {
    const matchesTab = activeTab === 'all' || notif.category === activeTab;
    const matchesVehicle = !visibleVehicleIds || visibleVehicleIds.includes(notif.vehicleId);
    return matchesTab && matchesVehicle;
  });

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const getIcon = (type: string, category: string) => {
    if (category === 'maintenance') return <Wrench className="h-4 w-4 text-primary" />;
    if (category === 'sensor') return <Radio className="h-4 w-4 text-warning" />;
    if (category === 'geofence') return <MapIcon className="h-4 w-4 text-primary" />;

    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-danger" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info':
      default: return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full bg-surface overflow-auto border-t border-border">
      <div className="p-3 lg:p-4 max-w-full lg:max-w-5xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-3 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-foreground-muted hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-background rounded-lg border border-border overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-foreground-muted text-sm">
              {locale === 'en' ? 'No notifications found' : 'Tidak ada notifikasi'}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className="flex items-start gap-3 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                >
                  <div className="shrink-0 mt-0.5">
                    {getIcon(notif.type, notif.category)}
                  </div>
                  <div className="flex flex-1 min-w-0 justify-between items-start gap-4">
                    {/* Kolom 1: Title & Description */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground truncate mb-0.5">{notif.title}</h3>
                      <p className="text-xs text-foreground-muted line-clamp-2">{notif.message}</p>
                    </div>

                    {/* Kolom 2: Datetime & Location */}
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs text-foreground-muted whitespace-nowrap mb-1">{formatDate(notif.timestamp)}</span>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <MapPin className="h-3 w-3" />
                        <span>{locale === 'en' ? 'View Location' : 'Lihat Lokasi'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
