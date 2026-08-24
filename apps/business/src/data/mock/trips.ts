import { mockVehicles } from './vehicles';
import { mockRoutes } from './routes';
import { mockGeofences } from './geofences';

// Helper to generate track and events
let seed = 12345;
const random = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const mockTrips = Array.from({ length: 50 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  const vehicle = mockVehicles[i % mockVehicles.length];
  const route = mockRoutes[i % mockRoutes.length];
  
  const statusOptions = ['completed', 'in_progress', 'scheduled'] as const;
  const status = statusOptions[i % statusOptions.length];

  // Mock start time between 1 and 5 days ago
  const startTime = new Date(Date.now() - (random() * 4 + 1) * 24 * 60 * 60 * 1000);
  const endTime = status === 'completed' ? new Date(startTime.getTime() + (random() * 4 + 1) * 60 * 60 * 1000) : undefined;

  // Generate track
  const trackCount = status === 'scheduled' ? 0 : 50;
  const track = [];
  let currentLat = -6.1751; // Start JKT
  let currentLng = 106.8271;
  
  for (let j = 0; j < trackCount; j++) {
    currentLat += (random() - 0.5) * 0.01;
    currentLng += (random() - 0.5) * 0.01;
    track.push({
      timestamp: new Date(startTime.getTime() + j * 60000).toISOString(),
      latitude: currentLat,
      longitude: currentLng,
      speed: Math.floor(random() * 80) + 10,
    });
  }

  // Generate events
  const events = [];
  if (track.length > 10) {
    events.push({
      id: `evt-${num}-1`,
      type: 'overspeed' as const,
      timestamp: track[5].timestamp,
      latitude: track[5].latitude,
      longitude: track[5].longitude,
      description: 'Overspeed detected: 85 km/h',
      severity: 'medium' as const,
    });
    events.push({
      id: `evt-${num}-2`,
      type: 'geofence_exit' as const,
      timestamp: track[2].timestamp,
      latitude: track[2].latitude,
      longitude: track[2].longitude,
      description: 'Exited Geofence',
      severity: 'low' as const,
    });
  }

  return {
    id: `trip-${num}`,
    vehicleId: vehicle.id,
    driverId: vehicle.driverId,
    routeId: route.id,
    startTime: startTime.toISOString(),
    endTime: endTime?.toISOString(),
    distance: Math.floor(random() * 200) + 20,
    duration: Math.floor(random() * 300) + 60,
    avgSpeed: Math.floor(random() * 30) + 40,
    maxSpeed: Math.floor(random() * 40) + 60,
    startAddress: route.name.split(' - ')[0],
    endAddress: route.name.split(' - ')[1],
    status,
    events,
    track
  };
});

export function getTripById(id: string) {
  return mockTrips.find(t => t.id === id);
}

export function getTripsByVehicleId(vehicleId: string) {
  return mockTrips.filter(t => t.vehicleId === vehicleId);
}
