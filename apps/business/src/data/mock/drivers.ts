export const mockDrivers = [
  {
    id: 'drv-001', name: 'Budi Santoso', phone: '+62 812-3456-7890', email: 'budi.s@example.com',
    address: 'Jl. Merdeka No. 10, Jakarta Selatan', ktpNumber: '3174012345678901', placeOfBirth: 'Jakarta',
    dateOfBirth: '1985-04-12', joinDate: '2020-01-15', placement: 'Pool Pusat Jakarta',
    groupId: 'grp-001', licenseNumber: 'SIM-B2-0987654321', licenseExpiry: '2027-05-20',
    status: 'active' as const, assignedVehicleId: 'veh-001', performanceScore: 92, history: []
  },
  {
    id: 'drv-002', name: 'Yudi Kurniawan', phone: '+62 812-3456-7891', email: 'yudi.k@example.com',
    address: 'Jl. Jend Sudirman No. 2, Jakarta Pusat', ktpNumber: '3174012345678902', placeOfBirth: 'Bandung',
    dateOfBirth: '1988-08-21', joinDate: '2021-03-10', placement: 'Pool Pusat Jakarta',
    groupId: 'grp-001', licenseNumber: 'SIM-B2-0987654322', licenseExpiry: '2028-01-15',
    status: 'active' as const, assignedVehicleId: 'veh-002', performanceScore: 88, history: []
  },
  {
    id: 'drv-003', name: 'Agus Setiawan', phone: '+62 812-3456-7892', email: 'agus.s@example.com',
    address: 'Jl. Thamrin No. 9, Jakarta Pusat', ktpNumber: '3174012345678903', placeOfBirth: 'Semarang',
    dateOfBirth: '1990-11-05', joinDate: '2021-06-22', placement: 'Pool Pusat Jakarta',
    groupId: 'grp-001', licenseNumber: 'SIM-B2-0987654323', licenseExpiry: '2026-10-10',
    status: 'active' as const, assignedVehicleId: 'veh-003', performanceScore: 95, history: []
  },
  {
    id: 'drv-004', name: 'Joko Susilo', phone: '+62 812-3456-7893', email: 'joko.s@example.com',
    address: 'Jl. Daan Mogot No. 4, Tangerang', ktpNumber: '3174012345678904', placeOfBirth: 'Tangerang',
    dateOfBirth: '1992-02-14', joinDate: '2022-01-05', placement: 'Gudang Tangerang',
    groupId: 'grp-002', licenseNumber: 'SIM-B2-0987654324', licenseExpiry: '2029-02-14',
    status: 'active' as const, assignedVehicleId: 'veh-004', performanceScore: 85, history: []
  },
  {
    id: 'drv-005', name: 'Dedi Mulyadi', phone: '+62 812-3456-7894', email: 'dedi.m@example.com',
    address: 'Jl. Pahlawan Seribu, Tangerang', ktpNumber: '3174012345678905', placeOfBirth: 'Banten',
    dateOfBirth: '1987-07-30', joinDate: '2019-11-12', placement: 'Gudang Tangerang',
    groupId: 'grp-002', licenseNumber: 'SIM-B2-0987654325', licenseExpiry: '2025-12-01',
    status: 'on_leave' as const, assignedVehicleId: 'veh-005', performanceScore: 90, history: []
  },
  {
    id: 'drv-006', name: 'Hendra Saputra', phone: '+62 812-3456-7895', email: 'hendra.s@example.com',
    address: 'Jl. Raya Bekasi, Bekasi', ktpNumber: '3174012345678906', placeOfBirth: 'Bekasi',
    dateOfBirth: '1991-05-18', joinDate: '2020-08-08', placement: 'Gudang Bekasi',
    groupId: 'grp-003', licenseNumber: 'SIM-B2-0987654326', licenseExpiry: '2027-08-08',
    status: 'active' as const, assignedVehicleId: 'veh-006', performanceScore: 89, history: []
  },
  {
    id: 'drv-007', name: 'Iwan Fals', phone: '+62 812-3456-7896', email: 'iwan.f@example.com',
    address: 'Jl. Narogong, Bekasi', ktpNumber: '3174012345678907', placeOfBirth: 'Jakarta',
    dateOfBirth: '1983-09-02', joinDate: '2018-02-20', placement: 'Gudang Bekasi',
    groupId: 'grp-003', licenseNumber: 'SIM-B2-0987654327', licenseExpiry: '2026-03-15',
    status: 'active' as const, assignedVehicleId: 'veh-007', performanceScore: 96, history: []
  },
  {
    id: 'drv-008', name: 'Asep Sunarya', phone: '+62 812-3456-7897', email: 'asep.s@example.com',
    address: 'Jl. Pasteur No. 1, Bandung', ktpNumber: '3174012345678908', placeOfBirth: 'Bandung',
    dateOfBirth: '1989-12-11', joinDate: '2021-09-10', placement: 'Pool Bandung',
    groupId: 'grp-004', licenseNumber: 'SIM-B2-0987654328', licenseExpiry: '2028-11-20',
    status: 'active' as const, assignedVehicleId: 'veh-008', performanceScore: 91, history: []
  },
  {
    id: 'drv-009', name: 'Rudi Hermawan', phone: '+62 812-3456-7898', email: 'rudi.h@example.com',
    address: 'Jl. Riau No. 5, Bandung', ktpNumber: '3174012345678909', placeOfBirth: 'Garut',
    dateOfBirth: '1993-01-25', joinDate: '2022-04-01', placement: 'Pool Bandung',
    groupId: 'grp-004', licenseNumber: 'SIM-B2-0987654329', licenseExpiry: '2029-01-10',
    status: 'active' as const, assignedVehicleId: 'veh-009', performanceScore: 84, history: []
  },
  {
    id: 'drv-010', name: 'Surya Pratama', phone: '+62 812-3456-7899', email: 'surya.p@example.com',
    address: 'Jl. Ahmad Yani No. 10, Surabaya', ktpNumber: '3174012345678910', placeOfBirth: 'Surabaya',
    dateOfBirth: '1986-06-16', joinDate: '2019-07-15', placement: 'Gudang Surabaya',
    groupId: 'grp-005', licenseNumber: 'SIM-B2-0987654330', licenseExpiry: '2026-06-15',
    status: 'active' as const, assignedVehicleId: 'veh-010', performanceScore: 93, history: []
  },
  {
    id: 'drv-011', name: 'Tono Subagyo', phone: '+62 812-3456-7900', email: 'tono.s@example.com',
    address: 'Jl. Darmo No. 8, Surabaya', ktpNumber: '3174012345678911', placeOfBirth: 'Malang',
    dateOfBirth: '1990-03-30', joinDate: '2020-10-05', placement: 'Gudang Surabaya',
    groupId: 'grp-005', licenseNumber: 'SIM-B2-0987654331', licenseExpiry: '2027-02-28',
    status: 'active' as const, assignedVehicleId: 'veh-011', performanceScore: 87, history: []
  },
  {
    id: 'drv-012', name: 'Cahyo Widodo', phone: '+62 812-3456-7901', email: 'cahyo.w@example.com',
    address: 'Jl. Serang Raya, Banten', ktpNumber: '3174012345678912', placeOfBirth: 'Serang',
    dateOfBirth: '1984-11-22', joinDate: '2018-05-18', placement: 'Pool Banten',
    groupId: 'grp-006', licenseNumber: 'SIM-B2-0987654332', licenseExpiry: '2025-11-10',
    status: 'active' as const, assignedVehicleId: 'veh-012', performanceScore: 94, history: []
  },
  {
    id: 'drv-013', name: 'Wawan Gunawan', phone: '+62 812-3456-7902', email: 'wawan.g@example.com',
    address: 'Jl. Cilegon No. 2, Banten', ktpNumber: '3174012345678913', placeOfBirth: 'Cilegon',
    dateOfBirth: '1988-04-05', joinDate: '2021-12-01', placement: 'Pool Banten',
    groupId: 'grp-006', licenseNumber: 'SIM-B2-0987654333', licenseExpiry: '2028-05-05',
    status: 'inactive' as const, assignedVehicleId: 'veh-013', performanceScore: 78, history: []
  },
  {
    id: 'drv-014', name: 'Dimas Anggara', phone: '+62 812-3456-7903', email: 'dimas.a@example.com',
    address: 'Jl. Kemang No. 7, Jakarta Selatan', ktpNumber: '3174012345678914', placeOfBirth: 'Depok',
    dateOfBirth: '1994-08-19', joinDate: '2023-01-10', placement: 'Pool Pusat Jakarta',
    groupId: 'grp-001', licenseNumber: 'SIM-B2-0987654334', licenseExpiry: '2029-08-10',
    status: 'active' as const, assignedVehicleId: 'veh-014', performanceScore: 86, history: []
  },
  {
    id: 'drv-015', name: 'Reza Rahadian', phone: '+62 812-3456-7904', email: 'reza.r@example.com',
    address: 'Jl. BSD City, Tangerang', ktpNumber: '3174012345678915', placeOfBirth: 'Tangerang',
    dateOfBirth: '1991-09-09', joinDate: '2020-02-25', placement: 'Gudang Tangerang',
    groupId: 'grp-002', licenseNumber: 'SIM-B2-0987654335', licenseExpiry: '2027-04-12',
    status: 'active' as const, assignedVehicleId: 'veh-015', performanceScore: 92, history: []
  },
  {
    id: 'drv-016', name: 'Farhan Maulana', phone: '+62 812-3456-7905', email: 'farhan.m@example.com',
    address: 'Jl. Cikarang, Bekasi', ktpNumber: '3174012345678916', placeOfBirth: 'Bekasi',
    dateOfBirth: '1987-10-14', joinDate: '2019-09-01', placement: 'Gudang Bekasi',
    groupId: 'grp-003', licenseNumber: 'SIM-B2-0987654336', licenseExpiry: '2026-09-01',
    status: 'active' as const, assignedVehicleId: 'veh-016', performanceScore: 89, history: []
  },
  {
    id: 'drv-017', name: 'Ilham Akbar', phone: '+62 812-3456-7906', email: 'ilham.a@example.com',
    address: 'Jl. Cibaduyut, Bandung', ktpNumber: '3174012345678917', placeOfBirth: 'Cimahi',
    dateOfBirth: '1995-03-21', joinDate: '2023-05-15', placement: 'Pool Bandung',
    groupId: 'grp-004', licenseNumber: 'SIM-B2-0987654337', licenseExpiry: '2030-03-15',
    status: 'active' as const, assignedVehicleId: 'veh-017', performanceScore: 95, history: []
  },
  {
    id: 'drv-018', name: 'Bayu Seta', phone: '+62 812-3456-7907', email: 'bayu.s@example.com',
    address: 'Jl. Perak Barat, Surabaya', ktpNumber: '3174012345678918', placeOfBirth: 'Gresik',
    dateOfBirth: '1989-12-30', joinDate: '2021-11-20', placement: 'Gudang Surabaya',
    groupId: 'grp-005', licenseNumber: 'SIM-B2-0987654338', licenseExpiry: '2028-12-10',
    status: 'active' as const, assignedVehicleId: 'veh-018', performanceScore: 91, history: []
  },
  {
    id: 'drv-019', name: 'Rizky Febian', phone: '+62 812-3456-7908', email: 'rizky.f@example.com',
    address: 'Jl. Anyer, Banten', ktpNumber: '3174012345678919', placeOfBirth: 'Pandeglang',
    dateOfBirth: '1993-07-07', joinDate: '2022-08-08', placement: 'Pool Banten',
    groupId: 'grp-006', licenseNumber: 'SIM-B2-0987654339', licenseExpiry: '2029-07-07',
    status: 'active' as const, assignedVehicleId: 'veh-019', performanceScore: 88, history: []
  },
  {
    id: 'drv-020', name: 'Kevin Sanjaya', phone: '+62 812-3456-7909', email: 'kevin.s@example.com',
    address: 'Jl. Pluit, Jakarta Utara', ktpNumber: '3174012345678920', placeOfBirth: 'Jakarta',
    dateOfBirth: '1990-09-15', joinDate: '2020-03-12', placement: 'Pool Pusat Jakarta',
    groupId: 'grp-001', licenseNumber: 'SIM-B2-0987654340', licenseExpiry: '2027-09-10',
    status: 'on_leave' as const, assignedVehicleId: 'veh-020', performanceScore: 97, history: []
  }
];

export function getDriverById(id: string) {
  return mockDrivers.find(d => d.id === id);
}
