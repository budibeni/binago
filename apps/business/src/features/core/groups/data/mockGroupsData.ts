/**
 * Proxy: features/groups/data/mockGroupsData.ts
 *
 * Backward-compatible adapter. All data comes from groupService.
 */

import { groupService } from '@/data/services/groupService';

export interface GroupData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: 'vehicle' | 'driver' | 'geofence';
}

export const mockVehicleGroups: GroupData[] = groupService.getVehicleGroups();
export const mockDriverGroups: GroupData[] = groupService.getDriverGroups();
export const mockGeofenceGroups: GroupData[] = groupService.getGeofenceGroups();
