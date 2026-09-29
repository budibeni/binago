import React, { useState } from 'react';
import { cn } from '@adatrack/utils';
import { AlertTriangle, Info, MapPin, Wrench, Radio, Map as MapIcon, Car, Clock, Bell } from 'lucide-react';
import { getTrackingTranslation } from '../../i18n';

export interface TrackingNotificationPanelProps {
  locale: 'id' | 'en';
  visibleVehicleIds?: string[];
  open?: boolean;
  onClose?: () => void;
}

import { useLiveNotifications } from '../../hooks/useLiveNotifications';

export function TrackingNotificationPanel({ open, onClose, locale = 'id', visibleVehicleIds }: TrackingNotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'alarm_vehicle' | 'maintenance' | 'operation'>('all');
  const tTrackingLocal = getTrackingTranslation(locale);
  const { notifications: liveNotifs } = useLiveNotifications();
  const [historicalNotifs, setHistoricalNotifs] = useState<any[]>([]);

  React.useEffect(() => {
    // Fetch historical alerts when panel opens
    const fetchHistoricalAlerts = async () => {
      if (!visibleVehicleIds || visibleVehicleIds.length === 0) return;
      
      try {
        const { api } = await import('@adatrack/utils');
        let allAlerts: any[] = [];
        
        for (const vid of visibleVehicleIds) {
          const res = await api.get('/vehicles/' + vid + '/alerts');
          const data = (res as any)?.data?.data || (res as any)?.data || [];
          allAlerts = [...allAlerts, ...data];
        }
        
        // Sort descending
        allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHistoricalNotifs(allAlerts);
      } catch (err) {
        console.error('Failed to fetch historical alerts', err);
      }
    };
    
    fetchHistoricalAlerts();
  }, [visibleVehicleIds]);

  // Combine live and historical, deduplicate by ID
  const allNotifications = React.useMemo(() => {
    const combined = [...liveNotifs, ...historicalNotifs];
    const unique = combined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return unique;
  }, [liveNotifs, historicalNotifs]);


  const tabs = [
    { id: 'all', label: tTrackingLocal.notifications.all },
    { id: 'alarm_vehicle', label: tTrackingLocal.notifications.alarm, icon: <Car className="h-3.5 w-3.5" /> },
    { id: 'maintenance', label: tTrackingLocal.notifications.maintenance, icon: <Wrench className="h-3.5 w-3.5" /> },
    { id: 'operation', label: tTrackingLocal.notifications.operation, icon: <Clock className="h-3.5 w-3.5" /> },
  ] as const;

  const filteredNotifications = allNotifications.filter((notif) => {
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
              {'icon' in tab && tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-background rounded-lg border border-border overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-foreground-muted p-8">
              <Bell className="h-8 w-8 mb-3 opacity-20" />
              <p className="text-[13px] font-medium">{tTrackingLocal.notifications.none}</p>
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
                      <button className="flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-full mt-2">
                        <MapPin className="h-3 w-3" />
                        <span>{tTrackingLocal.notifications.viewLocation}</span>
                      </button>
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
