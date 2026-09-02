import type { Checker } from '@/features/modules/transport/checker/types/checker';

export const mockCheckers: Checker[] = [
  {
    id: 'chk-001',
    name: 'Ahmad (Jakarta)',
    assignedGeofenceId: 'geo-001', // Gudang Pusat Jakarta (Terminal)
    status: 'ACTIVE',
  },
  {
    id: 'chk-002',
    name: 'Budi (Cikarang)',
    assignedGeofenceId: 'geo-008', // Kawasan Industri MM2100
    status: 'ACTIVE',
  },
  {
    id: 'chk-003',
    name: 'Cecep (Bandung)',
    assignedGeofenceId: 'geo-011', // Gudang Pasteur
    status: 'ACTIVE',
  },
];
