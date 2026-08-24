/**
 * Group Repository
 */

import type { GroupData } from '@/features/core/groups/data/mockGroupsData';
import { mockGroups } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface GroupRepository {
  getVehicleGroups(): GroupData[];
  getDriverGroups(): GroupData[];
  getGeofenceGroups(): GroupData[];
}

// --- Mock Repository Implementation -------------------------------------------

class MockGroupRepository implements GroupRepository {
  getVehicleGroups(): GroupData[] {
    return mockGroups as GroupData[];
  }

  getDriverGroups(): GroupData[] {
    return mockGroups.map((g) => ({
      ...g,
      id: g.id.replace('grp', 'dg'),
      type: 'driver' as const,
    }));
  }

  getGeofenceGroups(): GroupData[] {
    return mockGroups.map((g) => ({
      ...g,
      id: g.id.replace('grp', 'gg'),
      type: 'geofence' as const,
    }));
  }
}

// --- Singleton Export ----------------------------------------------------------

export const groupRepository: GroupRepository = new MockGroupRepository();
