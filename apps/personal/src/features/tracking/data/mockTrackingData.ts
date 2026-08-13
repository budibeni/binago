import { Vehicle, Trip, PlaybackData, PlaybackPoint } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'v-001',
    plateNumber: 'B 1234 ABC',
    name: 'Mobil Pribadi',
    type: 'Toyota Avanza',
    status: 'driving',
    speed: 45,
    lastUpdate: new Date(Date.now() - 1000 * 60).toISOString(),
    location: {
      lat: -6.2146,
      lng: 106.8451,
      address: 'Jl. Sudirman, Jakarta Pusat',
    },
  },
  {
    id: 'v-002',
    plateNumber: 'B 5678 DEF',
    name: 'Motor Operasional',
    type: 'Honda Beat',
    status: 'parking',
    speed: 0,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    location: {
      lat: -6.2255,
      lng: 106.8112,
      address: 'Jl. MH Thamrin, Jakarta Pusat',
    },
  },
  {
    id: 'v-003',
    plateNumber: 'B 9012 GHI',
    name: 'Mobil Cadangan',
    type: 'Honda Brio',
    status: 'idle',
    speed: 0,
    lastUpdate: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    location: {
      lat: -6.1950,
      lng: 106.8220,
      address: 'Jl. Medan Merdeka, Jakarta Pusat',
    },
  },
  {
    id: 'v-004',
    plateNumber: 'D 3456 JKL',
    name: 'Motor Istri',
    type: 'Yamaha NMAX',
    status: 'offline',
    lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: {
      lat: -6.9147,
      lng: 107.6098,
      address: 'Jl. Asia Afrika, Bandung',
    },
  },
];

const today = new Date();
const getLocalDateString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const dateToday = getLocalDateString(today);
const dateYesterday = getLocalDateString(new Date(today.getTime() - 24 * 60 * 60 * 1000));
const dateOther = getLocalDateString(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000));

export const mockTripsByVehicleId: Record<string, Trip[]> = {
  'v-001': [
    // Today
    {
      id: 't-001-1',
      vehicleId: 'v-001',
      date: dateToday,
      startTime: new Date(today.getTime() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      endTime: new Date(today.getTime() - 1000 * 60 * 60 * 2.4).toISOString(), // 2.4 hours ago
      distance: 18.2,
      duration: 36,
      avgSpeed: 40,
      maxSpeed: 65,
      startAddress: 'Rumah',
      endAddress: 'Kantor',
    },
    {
      id: 't-001-2',
      vehicleId: 'v-001',
      date: dateToday,
      startTime: new Date(today.getTime() - 1000 * 60 * 60 * 1.5).toISOString(),
      endTime: new Date(today.getTime() - 1000 * 60 * 60 * 1.2).toISOString(),
      distance: 9.7,
      duration: 18,
      avgSpeed: 32,
      maxSpeed: 55,
      startAddress: 'Kantor',
      endAddress: 'Customer',
    },
    // Yesterday
    {
      id: 't-001-3',
      vehicleId: 'v-001',
      date: dateYesterday,
      startTime: new Date(today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 16).toISOString(),
      endTime: new Date(today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 15.4).toISOString(),
      distance: 17.5,
      duration: 35,
      avgSpeed: 38,
      maxSpeed: 60,
      startAddress: 'Rumah',
      endAddress: 'Kantor',
    },
    {
      id: 't-001-4',
      vehicleId: 'v-001',
      date: dateYesterday,
      startTime: new Date(today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 6).toISOString(),
      endTime: new Date(today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 5.3).toISOString(),
      distance: 18.1,
      duration: 38,
      avgSpeed: 35,
      maxSpeed: 62,
      startAddress: 'Kantor',
      endAddress: 'Rumah',
    },
    // Other Date
    {
      id: 't-001-5',
      vehicleId: 'v-001',
      date: dateOther,
      startTime: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 8).toISOString(),
      endTime: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 7.1).toISOString(),
      distance: 22.4,
      duration: 54,
      avgSpeed: 42,
      maxSpeed: 70,
      startAddress: 'Rumah',
      endAddress: 'Gudang',
    }
  ],
  'v-002': [
    {
      id: 't-002-1',
      vehicleId: 'v-002',
      date: dateToday,
      startTime: new Date(today.getTime() - 1000 * 60 * 60 * 5).toISOString(),
      endTime: new Date(today.getTime() - 1000 * 60 * 60 * 4.2).toISOString(),
      distance: 12.5,
      duration: 48,
      avgSpeed: 25,
      maxSpeed: 50,
      startAddress: 'Kantor',
      endAddress: 'Gudang',
    }
  ],
  'v-003': [],
  'v-004': []
};

// Helper to generate dummy points
function generateDummyPoints(startLat: number, startLng: number, endLat: number, endLng: number, pointsCount: number, baseTime: Date, durationMinutes: number): PlaybackPoint[] {
  const points: PlaybackPoint[] = [];
  const timeStep = (durationMinutes * 60 * 1000) / pointsCount;
  
  for (let i = 0; i <= pointsCount; i++) {
    const fraction = i / pointsCount;
    // Add some slight curve/noise to make it look like a road instead of straight line
    const noiseLat = Math.sin(fraction * Math.PI) * 0.005;
    const noiseLng = Math.cos(fraction * Math.PI) * 0.005;
    
    points.push({
      lat: startLat + (endLat - startLat) * fraction + noiseLat,
      lng: startLng + (endLng - startLng) * fraction + noiseLng,
      timestamp: new Date(baseTime.getTime() + timeStep * i).toISOString(),
      speed: Math.floor(30 + Math.random() * 30), // Random speed 30-60
      heading: Math.floor(Math.random() * 360),
    });
  }
  return points;
}

export const mockPlaybackData: PlaybackData[] = [
  {
    tripId: 't-001-1',
    points: generateDummyPoints(-6.2000, 106.8166, -6.2200, 106.8300, 20, new Date(today.getTime() - 1000 * 60 * 60 * 3), 36)
  },
  {
    tripId: 't-001-2',
    points: generateDummyPoints(-6.2200, 106.8300, -6.2400, 106.8100, 15, new Date(today.getTime() - 1000 * 60 * 60 * 1.5), 18)
  },
  {
    tripId: 't-001-3',
    points: generateDummyPoints(-6.2000, 106.8166, -6.2200, 106.8300, 20, new Date(today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 16), 35)
  },
  {
    tripId: 't-001-4',
    points: generateDummyPoints(-6.2200, 106.8300, -6.2000, 106.8166, 20, new Date(today.getTime() - 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 6), 38)
  },
  {
    tripId: 't-001-5',
    points: generateDummyPoints(-6.2000, 106.8166, -6.2500, 106.8000, 30, new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000 - 1000 * 60 * 60 * 8), 54)
  },
  {
    tripId: 't-002-1',
    points: generateDummyPoints(-6.1800, 106.8200, -6.1500, 106.8500, 25, new Date(today.getTime() - 1000 * 60 * 60 * 5), 48)
  }
];
