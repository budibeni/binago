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
  type: 'vehicle' | 'driver' | 'geofence' | 'route';
}
