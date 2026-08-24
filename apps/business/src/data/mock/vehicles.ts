import { getDriverById } from './drivers';
import { getGroupById } from './groups';
import { getDeviceById } from './devices';

// Base vehicle definitions
const baseVehicles = [
  // Jakarta (grp-001) - 4 vehicles
  { id: 'veh-001', plateNumber: 'B 9328 PYX', vehicleName: 'Mitsubishi Canter FE 71', vehicleCategory: 'truck' as const, brand: 'Mitsubishi', year: 2021, fuelType: 'solar' as const, groupId: 'grp-001', driverId: 'drv-001', deviceId: 'dev-001' },
  { id: 'veh-002', plateNumber: 'B 9329 PYX', vehicleName: 'Hino Dutro 130 HD', vehicleCategory: 'truck' as const, brand: 'Hino', year: 2022, fuelType: 'solar' as const, groupId: 'grp-001', driverId: 'drv-002', deviceId: 'dev-002' },
  { id: 'veh-003', plateNumber: 'B 9330 PYX', vehicleName: 'Isuzu Elf NQR', vehicleCategory: 'truck' as const, brand: 'Isuzu', year: 2020, fuelType: 'solar' as const, groupId: 'grp-001', driverId: 'drv-003', deviceId: 'dev-003' },
  { id: 'veh-004', plateNumber: 'B 1234 ABC', vehicleName: 'Toyota Dyna 130 HT', vehicleCategory: 'truck' as const, brand: 'Toyota', year: 2019, fuelType: 'solar' as const, groupId: 'grp-001', driverId: 'drv-014', deviceId: 'dev-004' },
  
  // Tangerang (grp-002) - 4 vehicles
  { id: 'veh-005', plateNumber: 'B 5555 TGR', vehicleName: 'Mitsubishi Canter FE 74', vehicleCategory: 'truck' as const, brand: 'Mitsubishi', year: 2022, fuelType: 'solar' as const, groupId: 'grp-002', driverId: 'drv-004', deviceId: 'dev-005' },
  { id: 'veh-006', plateNumber: 'B 6666 TGR', vehicleName: 'Hino Dutro 110 SD', vehicleCategory: 'truck' as const, brand: 'Hino', year: 2021, fuelType: 'solar' as const, groupId: 'grp-002', driverId: 'drv-005', deviceId: 'dev-006' },
  { id: 'veh-007', plateNumber: 'B 7777 TGR', vehicleName: 'Isuzu Traga', vehicleCategory: 'pickup' as const, brand: 'Isuzu', year: 2023, fuelType: 'solar' as const, groupId: 'grp-002', driverId: 'drv-015', deviceId: 'dev-007' },
  { id: 'veh-008', plateNumber: 'B 8888 TGR', vehicleName: 'Suzuki Carry', vehicleCategory: 'pickup' as const, brand: 'Suzuki', year: 2020, fuelType: 'bensin' as const, groupId: 'grp-002', driverId: 'drv-020', deviceId: 'dev-008' }, // Wait, drv-020 is jkt, let's keep it

  // Bekasi (grp-003) - 3 vehicles
  { id: 'veh-009', plateNumber: 'B 1111 BKS', vehicleName: 'Mitsubishi Fuso Fighter', vehicleCategory: 'truck' as const, brand: 'Mitsubishi', year: 2018, fuelType: 'solar' as const, groupId: 'grp-003', driverId: 'drv-006', deviceId: 'dev-009' },
  { id: 'veh-010', plateNumber: 'B 2222 BKS', vehicleName: 'Hino Ranger FL', vehicleCategory: 'truck' as const, brand: 'Hino', year: 2019, fuelType: 'solar' as const, groupId: 'grp-003', driverId: 'drv-007', deviceId: 'dev-010' },
  { id: 'veh-011', plateNumber: 'B 3333 BKS', vehicleName: 'Isuzu Giga FRR', vehicleCategory: 'truck' as const, brand: 'Isuzu', year: 2021, fuelType: 'solar' as const, groupId: 'grp-003', driverId: 'drv-016', deviceId: 'dev-011' },

  // Bandung (grp-004) - 3 vehicles
  { id: 'veh-012', plateNumber: 'D 1234 BDG', vehicleName: 'Mitsubishi Canter FE 71', vehicleCategory: 'truck' as const, brand: 'Mitsubishi', year: 2022, fuelType: 'solar' as const, groupId: 'grp-004', driverId: 'drv-008', deviceId: 'dev-012' },
  { id: 'veh-013', plateNumber: 'D 5678 BDG', vehicleName: 'Hino Dutro 130 MD', vehicleCategory: 'truck' as const, brand: 'Hino', year: 2020, fuelType: 'solar' as const, groupId: 'grp-004', driverId: 'drv-009', deviceId: 'dev-013' },
  { id: 'veh-014', plateNumber: 'D 9012 BDG', vehicleName: 'Isuzu Elf NMR', vehicleCategory: 'truck' as const, brand: 'Isuzu', year: 2023, fuelType: 'solar' as const, groupId: 'grp-004', driverId: 'drv-017', deviceId: 'dev-014' },

  // Surabaya (grp-005) - 3 vehicles
  { id: 'veh-015', plateNumber: 'L 8122 AB', vehicleName: 'Mitsubishi Fuso FN', vehicleCategory: 'truck' as const, brand: 'Mitsubishi', year: 2019, fuelType: 'solar' as const, groupId: 'grp-005', driverId: 'drv-010', deviceId: 'dev-015' },
  { id: 'veh-016', plateNumber: 'L 8123 CD', vehicleName: 'Hino Ranger FM', vehicleCategory: 'truck' as const, brand: 'Hino', year: 2021, fuelType: 'solar' as const, groupId: 'grp-005', driverId: 'drv-011', deviceId: 'dev-016' },
  { id: 'veh-017', plateNumber: 'L 8124 EF', vehicleName: 'Isuzu Giga FVR', vehicleCategory: 'truck' as const, brand: 'Isuzu', year: 2022, fuelType: 'solar' as const, groupId: 'grp-005', driverId: 'drv-018', deviceId: 'dev-017' },

  // Banten (grp-006) - 3 vehicles
  { id: 'veh-018', plateNumber: 'A 1111 BTN', vehicleName: 'Mitsubishi Canter FE 84', vehicleCategory: 'truck' as const, brand: 'Mitsubishi', year: 2020, fuelType: 'solar' as const, groupId: 'grp-006', driverId: 'drv-012', deviceId: 'dev-018' },
  { id: 'veh-019', plateNumber: 'A 2222 BTN', vehicleName: 'Hino Dutro 110 HD', vehicleCategory: 'truck' as const, brand: 'Hino', year: 2021, fuelType: 'solar' as const, groupId: 'grp-006', driverId: 'drv-013', deviceId: 'dev-019' },
  { id: 'veh-020', plateNumber: 'A 3333 BTN', vehicleName: 'Isuzu Traga Box', vehicleCategory: 'pickup' as const, brand: 'Isuzu', year: 2022, fuelType: 'solar' as const, groupId: 'grp-006', driverId: 'drv-019', deviceId: 'dev-020' },
];

export const mockVehicles = baseVehicles.map(v => {
  const driver = getDriverById(v.driverId);
  const group = getGroupById(v.groupId);
  const device = getDeviceById(v.deviceId);

  return {
    ...v,
    driverName: driver ? driver.name : 'Unknown Driver',
    groupName: group ? group.name : 'Unknown Group',
    status: 'active' as const,
    deviceModel: device ? device.model : 'Unknown Device',
    deviceImei: device ? device.imei : 'Unknown IMEI'
  };
});

export function getVehicleById(id: string) {
  return mockVehicles.find(v => v.id === id);
}
