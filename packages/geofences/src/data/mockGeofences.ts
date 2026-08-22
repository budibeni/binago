import { Geofence, GeofenceGroup } from '../types';

export const mockGeofenceGroups: GeofenceGroup[] = [
  { id: 'group-1', name: 'Cabang Jakarta' },
  { id: 'group-2', name: 'Cabang Banten' },
];

export const mockGeofences: Geofence[] = [
  {
    id: 'gf-01',
    groupId: 'group-1',
    name: 'Gudang Utama Jakarta',
    description: 'Area bongkar muat pusat Jakarta',
    status: 'active',
    geometry: {
      type: 'polygon',
      coordinates: [
        { lat: -6.1751, lng: 106.8271 },
        { lat: -6.1751, lng: 106.8281 },
        { lat: -6.1761, lng: 106.8281 },
        { lat: -6.1761, lng: 106.8271 },
        { lat: -6.1751, lng: 106.8271 },
      ]
    },
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
  },
  {
    id: 'gf-02',
    groupId: 'group-2',
    name: 'Pool Kendaraan Tangerang',
    description: 'Pool parkir armada operasional',
    status: 'active',
    geometry: {
      type: 'multiline',
      coordinates: [
        { lat: -6.2021, lng: 106.6521 },
        { lat: -6.2051, lng: 106.6541 },
        { lat: -6.2081, lng: 106.6511 }
      ]
    },
    createdAt: '2025-02-05T09:15:00Z',
    updatedAt: '2025-02-10T14:20:00Z',
  },
  {
    id: 'gf-03',
    groupId: 'group-1',
    name: 'Area Terlarang Pelabuhan',
    description: 'Zona merah tidak boleh masuk',
    status: 'inactive',
    geometry: {
      type: 'polygon',
      coordinates: [
        { lat: -6.1021, lng: 106.8821 },
        { lat: -6.1021, lng: 106.8921 },
        { lat: -6.1121, lng: 106.8921 },
        { lat: -6.1121, lng: 106.8821 },
        { lat: -6.1021, lng: 106.8821 },
      ]
    },
    createdAt: '2025-03-20T11:45:00Z',
    updatedAt: '2025-03-21T08:10:00Z',
  }
];
