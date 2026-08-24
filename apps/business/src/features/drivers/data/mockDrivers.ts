import { Driver, DriverStatusFilter } from '../types/driver';

import { mockDrivers as centralDrivers } from '../../../data/mock';

export const mockDrivers: Driver[] = centralDrivers.map(d => ({
  ...d,
  history: [] // Add empty history to satisfy the local Driver type if not provided by central mock
}));


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
