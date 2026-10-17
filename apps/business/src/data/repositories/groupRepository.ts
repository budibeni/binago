/**
 * Group Repository
 * Single Source of Truth for group data with reactive pub/sub and in-memory store.
 */

import type { Group, GroupType } from '@/features/core/groups/types';
import { mockGroups } from '../mock/groups';

export interface GroupRepository {
  getAll(): Group[];
  getByType(type: GroupType): Group[];
  getVehicleGroups(): Group[];
  getDriverGroups(): Group[];
  getGeofenceGroups(): Group[];
  getRouteGroups(): Group[];
  getById(id: string): Group | undefined;
  create(data: Partial<Group>): Group;
  update(id: string, data: Partial<Group>): Group | undefined;
  delete(id: string): boolean;
  subscribe(listener: () => void): () => void;
}

class MockGroupRepository implements GroupRepository {
  private store: Group[] = [...mockGroups];
  private listeners = new Set<() => void>();

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('GroupRepository listener error:', err);
      }
    });
  }

  getAll(): Group[] {
    return [...this.store];
  }

  getByType(type: GroupType): Group[] {
    return this.store.filter((g) => g.type === type);
  }

  getVehicleGroups(): Group[] {
    return this.getByType('vehicle');
  }

  getDriverGroups(): Group[] {
    return this.getByType('driver');
  }

  getGeofenceGroups(): Group[] {
    return this.getByType('geofence');
  }

  getRouteGroups(): Group[] {
    return this.getByType('route');
  }

  getById(id: string): Group | undefined {
    return this.store.find((g) => g.id === id);
  }

  create(data: Partial<Group>): Group {
    const type = data.type || 'vehicle';
    const prefixMap: Record<GroupType, string> = {
      vehicle: 'grp-v',
      driver: 'grp-d',
      geofence: 'grp-g',
      route: 'grp-r',
    };
    const prefix = prefixMap[type] || 'grp';
    const nextNum = String(this.store.filter((g) => g.type === type).length + 1).padStart(3, '0');
    const newId = `${prefix}-${Date.now().toString().slice(-4)}${nextNum}`;

    const newGroup: Group = {
      id: data.id || newId,
      name: data.name || 'Grup Baru',
      description: data.description || '',
      memberCount: data.memberCount ?? 0,
      type,
    };

    this.store.unshift(newGroup);
    this.notify();
    return newGroup;
  }

  update(id: string, data: Partial<Group>): Group | undefined {
    const index = this.store.findIndex((g) => g.id === id);
    if (index === -1) return undefined;

    const updated: Group = {
      ...this.store[index],
      ...data,
      id, // Preserve original ID
    };

    this.store[index] = updated;
    this.notify();
    return updated;
  }

  delete(id: string): boolean {
    const prevLen = this.store.length;
    this.store = this.store.filter((g) => g.id !== id);
    if (this.store.length !== prevLen) {
      this.notify();
      return true;
    }
    return false;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const groupRepository: GroupRepository = new MockGroupRepository();
