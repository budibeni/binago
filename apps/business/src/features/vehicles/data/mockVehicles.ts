import type { Vehicle, VehicleGroup } from '../types/vehicle';
import { mockGroups, mockVehicles as centralVehicles, mockTrackingState } from '../../../data/mock';

export const mockVehicleGroups: VehicleGroup[] = mockGroups as VehicleGroup[];
export const mockVehicles: Vehicle[] = centralVehicles.map(v => {
  const tracking = mockTrackingState.find(t => t.vehicleId === v.id);
  return {
    ...v,
    status: tracking?.status || 'offline',
    odometer: 48000, // mock fallback
    lastServiceKm: 40000,
    nextServiceKm: 50000,
    lastUpdate: tracking?.lastUpdate || new Date().toISOString(),
    registrationExpiry: '2027-01-01',
  };
}) as unknown as Vehicle[];

// --- Helpers -----------------------------------------------------------------

export function filterVehicles(
  vehicles: Vehicle[],
  search: string,
  status: string,
  groupIds: string[],
): Vehicle[] {
  const q = search.toLowerCase().trim();
  return vehicles.filter((v) => {
    const matchSearch =
      !q ||
      v.plateNumber.toLowerCase().includes(q) ||
      v.vehicleName.toLowerCase().includes(q) ||
      (v.driverName?.toLowerCase().includes(q) ?? false);
    const matchStatus = status === 'all' || v.status === status;
    const matchGroup = groupIds.length === 0 || groupIds.includes(v.groupId);
    return matchSearch && matchStatus && matchGroup;
  });
}

