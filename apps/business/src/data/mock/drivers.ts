const FIRST_NAMES = [
  'Budi', 'Agus', 'Hendra', 'Eko', 'Dedi', 'Rudi', 'Bambang', 'Ahmad',
  'Wahyu', 'Rizky', 'Surya', 'Fajar', 'Teguh', 'Indra', 'Tri', 'Danang',
  'Joko', 'Ade', 'Sigit', 'Aris', 'Bayu', 'Gilang', 'Ilham', 'Wawan', 'Yudi'
];

const LAST_NAMES = [
  'Santoso', 'Setiawan', 'Wijaya', 'Prasetyo', 'Kurniawan', 'Hermawan',
  'Hidayat', 'Saputra', 'Nugroho', 'Pratama', 'Wibowo', 'Kusuma', 'Gunawan',
  'Susanto', 'Utomo', 'Siregar', 'Firmansyah', 'Subagyo', 'Irawan', 'Pamungkas'
];

export const mockDrivers = Array.from({ length: 50 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;

  return {
    id: `drv-${num}`,
    name: fullName,
    phone: `+62 812-3456-${(1000 + i).toString()}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    address: `Jl. Logistik No. ${i + 1}, Jakarta`,
    ktpNumber: `317401234567${(8000 + i).toString()}`,
    placeOfBirth: i % 2 === 0 ? 'Jakarta' : 'Surabaya',
    dateOfBirth: '1990-01-01',
    joinDate: '2021-01-01',
    placement: 'Pool Pusat',
    groupId: `grp-d-00${(i % 4) + 1}`,
    licenseNumber: `SIM-B2-${(10000 + i).toString()}`,
    licenseExpiry: '2028-01-01',
    status: (i % 7 === 0 ? 'on_leave' : i % 11 === 0 ? 'inactive' : 'active') as 'active' | 'inactive' | 'on_leave',
    assignedVehicleId: i % 4 === 0 ? undefined : `veh-${num}`,
    performanceScore: 60 + ((i * 13) % 41), // deterministic pseudo-random for hydration
    performanceMetrics: {
      harshDriving: i % 5,
      speeding: (i * 2) % 4,
      overIdling: i % 3,
      fatigueDriving: i % 2,
    },
    history: []
  };
});

export function getDriverById(id: string) {
  return mockDrivers.find(d => d.id === id);
}
