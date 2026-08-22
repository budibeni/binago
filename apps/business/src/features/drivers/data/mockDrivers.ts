import { Driver, DriverStatusFilter } from '../types/driver';

export const mockDrivers: Driver[] = [
  {
    id: 'drv-001',
    name: 'Budi Santoso',
    phone: '+62 812-3456-7890',
    email: 'budi.s@example.com',
    address: 'Jl. Merdeka No. 10, Jakarta Selatan',
    ktpNumber: '3174012345678901',
    placeOfBirth: 'Jakarta',
    dateOfBirth: '1985-04-12',
    joinDate: '2020-01-15',
    placement: 'Pool Pusat Jakarta',
    groupId: 'dg-01',
    licenseNumber: 'SIM-B2-0987654321',
    licenseExpiry: '2027-05-20',
    status: 'active',
    assignedVehicleId: 'veh-001', // Assigned to a vehicle
    performanceScore: 92,
    history: [
      {
        id: 'hist-1',
        date: '2023-11-10T08:00:00Z',
        type: 'assignment',
        description: 'Ditugaskan ke kendaraan B 1234 CD',
        vehicleId: 'veh-001',
      },
      {
        id: 'hist-2',
        date: '2023-12-05T14:30:00Z',
        type: 'achievement',
        description: 'Pengemudi Teladan Bulan November',
      }
    ],
  },
  {
    id: 'drv-002',
    name: 'Ahmad Rizal',
    phone: '+62 813-4567-8901',
    email: 'ahmad.rizal@example.com',
    address: 'Jl. Ahmad Yani No. 55, Bandung',
    ktpNumber: '3273012345678902',
    placeOfBirth: 'Bandung',
    dateOfBirth: '1990-08-25',
    joinDate: '2021-03-10',
    placement: 'Pool Cabang Bandung',
    groupId: 'dg-02',
    licenseNumber: 'SIM-B1-1234567890',
    licenseExpiry: '2026-08-15',
    status: 'active',
    assignedVehicleId: undefined, // Currently idle
    performanceScore: 88,
    history: [
      {
        id: 'hist-3',
        date: '2023-10-20T09:15:00Z',
        type: 'violation',
        description: 'Peringatan batas kecepatan',
      }
    ],
  },
  {
    id: 'drv-003',
    name: 'Siti Nurhaliza',
    phone: '+62 857-5678-9012',
    email: 'siti.n@example.com',
    address: 'Jl. Sudirman No. 88, Surabaya',
    ktpNumber: '3578012345678903',
    placeOfBirth: 'Surabaya',
    dateOfBirth: '1992-11-05',
    joinDate: '2022-06-01',
    placement: 'Pool Cabang Surabaya',
    groupId: 'dg-03',
    licenseNumber: 'SIM-A-5678901234',
    licenseExpiry: '2025-11-10',
    status: 'on_leave',
    assignedVehicleId: undefined,
    performanceScore: 95,
    history: [
      {
        id: 'hist-4',
        date: '2024-01-10T00:00:00Z',
        type: 'leave',
        description: 'Cuti tahunan (10 Jan - 20 Jan)',
      }
    ],
  },
  {
    id: 'drv-004',
    name: 'Joko Widodo',
    phone: '+62 811-6789-0123',
    email: 'joko.w@example.com',
    address: 'Jl. Slamet Riyadi No. 1, Surakarta',
    ktpNumber: '3372012345678904',
    placeOfBirth: 'Surakarta',
    dateOfBirth: '1988-02-14',
    joinDate: '2019-09-01',
    placement: 'Pool Jawa Tengah',
    groupId: 'dg-01',
    licenseNumber: 'SIM-B2-0192837465',
    licenseExpiry: '2024-09-15',
    status: 'inactive',
    assignedVehicleId: undefined,
    performanceScore: 70,
    history: [
      {
        id: 'hist-5',
        date: '2023-09-01T08:00:00Z',
        type: 'violation',
        description: 'Kecelakaan ringan, dinonaktifkan sementara',
      }
    ],
  },
];

export function filterDrivers(
  drivers: Driver[], 
  search: string, 
  statusFilter: DriverStatusFilter, 
  groupIds: string[]
): Driver[] {
  let result = drivers;

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.ktpNumber.includes(q) ||
      d.phone.includes(q) ||
      d.licenseNumber.toLowerCase().includes(q)
    );
  }

  if (statusFilter !== 'all') {
    result = result.filter(d => d.status === statusFilter);
  }

  if (groupIds.length > 0) {
    result = result.filter(d => d.groupId && groupIds.includes(d.groupId));
  }

  return result;
}
