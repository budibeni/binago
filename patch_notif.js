const fs = require('fs');
const file = 'apps/business/src/features/core/tracking/components/activity/TrackingNotificationPanel.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('fetchHistoricalAlerts')) {
  content = content.replace(
    "const { notifications } = useLiveNotifications();",
    `const { notifications: liveNotifs } = useLiveNotifications();
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
`
  );
  
  content = content.replace(/const filteredNotifications = notifications\.filter/g, 'const filteredNotifications = allNotifications.filter');
  
  fs.writeFileSync(file, content);
  console.log('Patched TrackingNotificationPanel');
}
