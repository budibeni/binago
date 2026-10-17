/**
 * Group Service
 * Public facade for group operations.
 */

import type { Group, GroupType } from '@/features/core/groups/types';
import { groupRepository } from '../repositories/groupRepository';

export const groupService = {
  getAll(): Group[] {
    return groupRepository.getAll();
  },

  getByType(type: GroupType): Group[] {
    return groupRepository.getByType(type);
  },

  getVehicleGroups(): Group[] {
    return groupRepository.getVehicleGroups();
  },

  getDriverGroups(): Group[] {
    return groupRepository.getDriverGroups();
  },

  getGeofenceGroups(): Group[] {
    return groupRepository.getGeofenceGroups();
  },

  getRouteGroups(): Group[] {
    return groupRepository.getRouteGroups();
  },

  getGroupById(id: string): Group | undefined {
    return groupRepository.getById(id);
  },

  createGroup(data: Partial<Group>): Group {
    return groupRepository.create(data);
  },

  updateGroup(id: string, data: Partial<Group>): Group | undefined {
    return groupRepository.update(id, data);
  },

  deleteGroup(id: string): boolean {
    return groupRepository.delete(id);
  },

  subscribe(listener: () => void): () => void {
    return groupRepository.subscribe(listener);
  },
};
