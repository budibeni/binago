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
  },
  {
    id: 'rt-004', name: 'Distribusi Selatan', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.17, lng: 106.82 }, { lat: -6.20, lng: 106.82 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-005', name: 'Distribusi Utara', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.17, lng: 106.82 }, { lat: -6.14, lng: 106.82 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-006', name: 'Distribusi Barat', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.17, lng: 106.82 }, { lat: -6.17, lng: 106.79 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-007', name: 'Distribusi Timur', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.17, lng: 106.82 }, { lat: -6.17, lng: 106.85 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-008', name: 'Jalur Alternatif Barat', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.18, lng: 106.80 }, { lat: -6.20, lng: 106.78 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-009', name: 'Route Harian Gudang', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.19, lng: 106.83 }, { lat: -6.21, lng: 106.83 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-010', name: 'Route Antar Cabang', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.22, lng: 106.84 }, { lat: -6.25, lng: 106.85 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-011', name: 'Route Retail A', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.15, lng: 106.85 }, { lat: -6.16, lng: 106.87 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-012', name: 'Route Retail B', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.15, lng: 106.80 }, { lat: -6.16, lng: 106.78 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-013', name: 'Route Maintenance', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.20, lng: 106.85 }, { lat: -6.22, lng: 106.88 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-014', name: 'Route Proyek X', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.12, lng: 106.80 }, { lat: -6.10, lng: 106.82 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'rt-015', name: 'Route Proyek Y', description: '', status: 'active',
    origin: { type: 'geofence', geofenceId: 'gf-01' }, stops: [], destination: { type: 'geofence', geofenceId: 'gf-01' },
    plannedDistance: 10, estimatedDuration: 20,
    plannedPath: { type: 'multiline', coordinates: [{ lat: -6.25, lng: 106.80 }, { lat: -6.27, lng: 106.80 }] },
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2025-01-20T08:00:00Z'
  }
];
