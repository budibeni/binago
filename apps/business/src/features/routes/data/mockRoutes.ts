import { Route } from '../types';

export const mockRoutes: Route[] = [
  {
    id: 'rt-001',
    name: 'Gudang Pusat - Pool Tangerang',
    description: 'Rute distribusi reguler dari gudang utama ke pool kendaraan.',
    origin: { type: 'geofence', geofenceId: 'gf-01' },
    stops: [],
    destination: { type: 'geofence', geofenceId: 'gf-02' },
    plannedDistance: 25.5,
    estimatedDuration: 45,
    plannedPath: {
      type: 'multiline',
      coordinates: [
        { lat: -6.1751, lng: 106.8271 },
        { lat: -6.1851, lng: 106.8000 },
        { lat: -6.2021, lng: 106.6521 },
      ]
    },
    status: 'active',
    createdAt: '2025-01-20T08:00:00Z',
    updatedAt: '2025-01-20T08:00:00Z',
  },
  {
    id: 'rt-002',
    name: 'Pool Tangerang - Pelabuhan',
    description: 'Rute pengiriman kargo via pelabuhan.',
    origin: { type: 'geofence', geofenceId: 'gf-02' },
    stops: [
      { id: 'stop-1', sequence: 1, location: { type: 'geofence', geofenceId: 'gf-01' } }
    ],
    destination: { type: 'geofence', geofenceId: 'gf-03' },
    plannedDistance: 40.2,
    estimatedDuration: 90,
    status: 'inactive',
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-02-16T11:00:00Z',
  },
  {
    id: 'rt-003',
    name: 'Site Proyek - Basecamp',
    description: 'Rute logistik antar titik koordinat.',
    origin: { type: 'coordinate', latitude: -6.2250, longitude: 106.8000, radius: 100, address: 'Site Proyek Sudirman' },
    stops: [
      { id: 'stop-2', sequence: 1, location: { type: 'coordinate', latitude: -6.2350, longitude: 106.8100, radius: 250, address: 'Pabrik Semen' } }
    ],
    destination: { type: 'coordinate', latitude: -6.2450, longitude: 106.8200, radius: 500, address: 'Basecamp Operasional' },
    plannedDistance: 12.0,
    estimatedDuration: 30,
    status: 'active',
    createdAt: '2025-02-20T10:00:00Z',
    updatedAt: '2025-02-20T11:00:00Z',
  }
];
