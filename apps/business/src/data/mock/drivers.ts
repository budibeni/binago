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
    groupId: `grp-00${(i % 6) + 1}`,
    licenseNumber: `SIM-B2-${10000 + i}`,
    licenseExpiry: '2028-01-01',
    status: 'active' as const,
    assignedVehicleId: `veh-${num}`,
    performanceScore: 90,
    history: []
  };
});

export function getDriverById(id: string) {
  return mockDrivers.find(d => d.id === id);
}
