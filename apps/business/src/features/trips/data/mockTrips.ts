import { Trip, TripTrackPoint, TripEvent, TripStatus, TripEventType } from '../types/trips';
import { mockVehicles } from '../../vehicles/data/mockVehicles';
import { mockRoutes } from '../../routes/data/mockRoutes';
import { mockGeofences } from '../../geofences/data/mockGeofences';

// Generate 30 mock trips with realistic Indonesian data
const locations = [
  'Pool Jakarta', 'Gudang Depok', 'Pabrik Karawang', 'Distributor Bandung',
  'Retail Bogor', 'Gudang Cikarang', 'Tangerang Hub', 'Bekasi Transit',
  'Pelabuhan Tanjung Priok', 'Bandara Soekarno Hatta', 'Cirebon Hub', 'Purwakarta'
];

const generateTrack = (startLat: number, startLng: number, count: number): TripTrackPoint[] => {
  const track: TripTrackPoint[] = [];
  let currentLat = startLat;
  let currentLng = startLng;
  const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // yesterday
  
  for (let i = 0; i < count; i++) {
    currentLat += (Math.random() - 0.5) * 0.01;
    currentLng += (Math.random() - 0.5) * 0.01;
    track.push({
      timestamp: new Date(startTime.getTime() + i * 60000).toISOString(),
      latitude: currentLat,
      longitude: currentLng,
      speed: Math.floor(Math.random() * 80) + 10,
    });
  }
  return track;
};

const generateEvents = (track: TripTrackPoint[]): TripEvent[] => {
  const events: TripEvent[] = [];
  if (track.length === 0) return events;
  
  events.push({
    id: `ev-${Math.random().toString(36).substr(2, 9)}`,
    time: track[0].timestamp,
    type: 'ignition_on',
    title: 'Ignition ON',
    location: [track[0].longitude, track[0].latitude]
  });
  
  if (track.length > 5) {
    events.push({
      id: `ev-${Math.random().toString(36).substr(2, 9)}`,
      time: track[Math.floor(track.length / 4)].timestamp,
      type: 'overspeed',
      title: 'Overspeed',
      description: '85 km/h',
      location: [track[Math.floor(track.length / 4)].longitude, track[Math.floor(track.length / 4)].latitude]
    });
  }
  
  if (track.length > 10) {
    events.push({
      id: `ev-${Math.random().toString(36).substr(2, 9)}`,
      time: track[Math.floor(track.length / 2)].timestamp,
      type: 'geofence_in',
      title: 'Masuk Geofence',
      description: 'Rest Area KM 57',
      location: [track[Math.floor(track.length / 2)].longitude, track[Math.floor(track.length / 2)].latitude]
    });
  }
  
  events.push({
    id: `ev-${Math.random().toString(36).substr(2, 9)}`,
    time: track[track.length - 1].timestamp,
    type: 'ignition_off',
    title: 'Ignition OFF',
    location: [track[track.length - 1].longitude, track[track.length - 1].latitude]
  });
  
  return events;
};

export const mockTrips: Trip[] = Array.from({ length: 30 }).map((_, i) => {
  const vIndex = i % mockVehicles.length;
  const vehicle = mockVehicles[vIndex];
  const origin = locations[i % locations.length];
  const destination = locations[(i + 3) % locations.length];
  const hasRoute = i % 3 !== 0; // 2/3 of trips have routes
  const route = hasRoute ? mockRoutes[i % mockRoutes.length] : null;
  
  const isOngoing = i < 3; // First 3 are ongoing
  const status: TripStatus = isOngoing ? 'ongoing' : 'completed';
  
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - (i % 7)); // Spread over last 7 days
  baseDate.setHours(6 + (i % 12), (i * 15) % 60, 0, 0); // Random start time
  
  const durationSec = Math.floor(Math.random() * 14400) + 1800; // 30m to 4h
  const endTime = new Date(baseDate.getTime() + durationSec * 1000);
  
  const track = generateTrack(-6.200000, 106.816666, isOngoing ? 15 : 45); // Jakarta center roughly
  const events = generateEvents(track);
  
  return {
    id: `trip-${(i + 1).toString().padStart(3, '0')}`,
    vehicleId: vehicle.id,
    vehicleName: vehicle.plateNumber,
    driverId: vehicle.driverId || undefined,
    driverName: vehicle.driverName || undefined,
    
    startTime: baseDate.toISOString(),
    endTime: isOngoing ? null : endTime.toISOString(),
    
    origin: origin,
    destination: destination,
    
    distance: Math.floor(Math.random() * 200) + 15 + Math.random(),
    duration: durationSec,
    movingDuration: Math.floor(durationSec * 0.8),
    stoppedDuration: Math.floor(durationSec * 0.2),
    
    stopCount: Math.floor(Math.random() * 5),
    averageSpeed: Math.floor(Math.random() * 40) + 20,
    maxSpeed: Math.floor(Math.random() * 40) + 60,
    
    status,
    
    routeId: route ? route.id : null,
    routeName: route ? route.name : null,
    
    events: isOngoing ? events.slice(0, 2) : events,
    track
  };
});
