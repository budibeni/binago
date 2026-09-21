export const mockDrivers = Array.from({ length: 50 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  return {
    id: `drv-${num}`,
    name: `Driver ${num}`,
    phone: `+62 812-3456-${1000 + i}`,
    email: `driver${num}@example.com`,
    address: `Jl. Dummy No. ${i + 1}`,
    ktpNumber: `317401234567${8000 + i}`,
    placeOfBirth: 'Jakarta',
    dateOfBirth: '1990-01-01',
    joinDate: '2021-01-01',
    placement: 'Pool Pusat',
    groupId: `grp-d-00${(i % 4) + 1}`,
    licenseNumber: `SIM-B2-${10000 + i}`,
    licenseExpiry: '2028-01-01',
    status: (i % 7 === 0 ? 'on_leave' : i % 11 === 0 ? 'inactive' : 'active') as 'active' | 'inactive' | 'on_leave',
    assignedVehicleId: i % 3 === 0 ? undefined : `veh-${num}`,
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
