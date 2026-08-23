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
  },
  {
    id: 'gf-04', groupId: 'group-1', name: 'Gudang Tangerang', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.2, lng: 106.6}, {lat: -6.21, lng: 106.6}, {lat: -6.21, lng: 106.61}, {lat: -6.2, lng: 106.6}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-05', groupId: 'group-1', name: 'Gudang Bekasi', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.25, lng: 107.0}, {lat: -6.26, lng: 107.0}, {lat: -6.26, lng: 107.01}, {lat: -6.25, lng: 107.0}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-06', groupId: 'group-1', name: 'Gudang Depok', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.4, lng: 106.8}, {lat: -6.41, lng: 106.8}, {lat: -6.41, lng: 106.81}, {lat: -6.4, lng: 106.8}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-07', groupId: 'group-1', name: 'Gudang Bogor', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.6, lng: 106.8}, {lat: -6.61, lng: 106.8}, {lat: -6.61, lng: 106.81}, {lat: -6.6, lng: 106.8}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-08', groupId: 'group-1', name: 'Pool Kendaraan Jakarta', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.1, lng: 106.8}, {lat: -6.11, lng: 106.8}, {lat: -6.11, lng: 106.81}, {lat: -6.1, lng: 106.8}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-09', groupId: 'group-1', name: 'Kantor Pusat', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.22, lng: 106.82}, {lat: -6.23, lng: 106.82}, {lat: -6.23, lng: 106.83}, {lat: -6.22, lng: 106.82}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-10', groupId: 'group-1', name: 'Workshop Jakarta', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.15, lng: 106.85}, {lat: -6.16, lng: 106.85}, {lat: -6.16, lng: 106.86}, {lat: -6.15, lng: 106.85}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-11', groupId: 'group-1', name: 'Workshop Depok', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.42, lng: 106.82}, {lat: -6.43, lng: 106.82}, {lat: -6.43, lng: 106.83}, {lat: -6.42, lng: 106.82}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-12', groupId: 'group-1', name: 'Customer A', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.3, lng: 106.8}, {lat: -6.31, lng: 106.8}, {lat: -6.31, lng: 106.81}, {lat: -6.3, lng: 106.8}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-13', groupId: 'group-1', name: 'Customer B', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.32, lng: 106.82}, {lat: -6.33, lng: 106.82}, {lat: -6.33, lng: 106.83}, {lat: -6.32, lng: 106.82}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-14', groupId: 'group-1', name: 'Customer C', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.34, lng: 106.84}, {lat: -6.35, lng: 106.84}, {lat: -6.35, lng: 106.85}, {lat: -6.34, lng: 106.84}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-15', groupId: 'group-1', name: 'Customer D', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.36, lng: 106.86}, {lat: -6.37, lng: 106.86}, {lat: -6.37, lng: 106.87}, {lat: -6.36, lng: 106.86}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-16', groupId: 'group-1', name: 'Customer E', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.38, lng: 106.88}, {lat: -6.39, lng: 106.88}, {lat: -6.39, lng: 106.89}, {lat: -6.38, lng: 106.88}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-17', groupId: 'group-1', name: 'SPBU Cilangkap', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.4, lng: 106.9}, {lat: -6.41, lng: 106.9}, {lat: -6.41, lng: 106.91}, {lat: -6.4, lng: 106.9}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-18', groupId: 'group-1', name: 'SPBU Kalimalang', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.2, lng: 106.9}, {lat: -6.21, lng: 106.9}, {lat: -6.21, lng: 106.91}, {lat: -6.2, lng: 106.9}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-19', groupId: 'group-1', name: 'Rest Area KM 19', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.25, lng: 107.05}, {lat: -6.26, lng: 107.05}, {lat: -6.26, lng: 107.06}, {lat: -6.25, lng: 107.05}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-20', groupId: 'group-1', name: 'Rest Area KM 35', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.3, lng: 107.1}, {lat: -6.31, lng: 107.1}, {lat: -6.31, lng: 107.11}, {lat: -6.3, lng: 107.1}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-21', groupId: 'group-1', name: 'Hub Jakarta', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.1, lng: 106.9}, {lat: -6.11, lng: 106.9}, {lat: -6.11, lng: 106.91}, {lat: -6.1, lng: 106.9}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-22', groupId: 'group-1', name: 'Hub Bekasi', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.2, lng: 107.1}, {lat: -6.21, lng: 107.1}, {lat: -6.21, lng: 107.11}, {lat: -6.2, lng: 107.1}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-23', groupId: 'group-1', name: 'Hub Tangerang', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.15, lng: 106.6}, {lat: -6.16, lng: 106.6}, {lat: -6.16, lng: 106.61}, {lat: -6.15, lng: 106.6}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-24', groupId: 'group-1', name: 'Cabang Jakarta Selatan', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.28, lng: 106.8}, {lat: -6.29, lng: 106.8}, {lat: -6.29, lng: 106.81}, {lat: -6.28, lng: 106.8}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'gf-25', groupId: 'group-1', name: 'Cabang Jakarta Timur', description: '', status: 'active',
    geometry: { type: 'polygon', coordinates: [{lat: -6.22, lng: 106.9}, {lat: -6.23, lng: 106.9}, {lat: -6.23, lng: 106.91}, {lat: -6.22, lng: 106.9}] },
    createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-15T10:30:00Z'
  }
];
