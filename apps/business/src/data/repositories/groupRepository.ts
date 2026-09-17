/**
 * Group Repository
 */

import type { GroupData } from '@/features/core/groups/data/mockGroupsData';
import { mockVehicleGroups, mockDriverGroups, mockGeofenceGroups, mockRouteGroups } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface GroupRepository {
  getVehicleGroups(): GroupData[];
  getDriverGroups(): GroupData[];
  getGeofenceGroups(): GroupData[];
  getRouteGroups(): GroupData[];
}

// --- Mock Repository Implementation -------------------------------------------

class MockGroupRepository implements GroupRepository {
  getVehicleGroups(): GroupData[] {
    return mockVehicleGroups as GroupData[];
  }

  getDriverGroups(): GroupData[] {
    return mockDriverGroups as GroupData[];
  }

  getGeofenceGroups(): GroupData[] {
    return mockGeofenceGroups as GroupData[];
  }

  getRouteGroups(): GroupData[] {
    return mockRouteGroups as GroupData[];
  }
}

// --- Singleton Export ----------------------------------------------------------

export const groupRepository: GroupRepository = new MockGroupRepository();
