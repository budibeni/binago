/**
 * Group Service
 */

import type { GroupData } from '@/features/groups/data/mockGroupsData';
import { groupRepository } from '../repositories/groupRepository';

export const groupService = {
  getVehicleGroups(): GroupData[] {
    return groupRepository.getVehicleGroups();
  },

  getDriverGroups(): GroupData[] {
    return groupRepository.getDriverGroups();
  },

  getGeofenceGroups(): GroupData[] {
    return groupRepository.getGeofenceGroups();
  },
};
