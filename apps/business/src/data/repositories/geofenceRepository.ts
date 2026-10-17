/**
 * Geofence Repository
 *
 * In-memory reactive repository managing geofences with pub/sub listener.
 */

import type { Geofence, GeofenceGroup } from '@/features/core/geofences/types';
import { mockGeofences as centralGeofences, mockGeofenceGroups } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface GeofenceRepository {
  getAll(): Geofence[];
  getById(id: string): Geofence | undefined;
  getGroups(): GeofenceGroup[];
  create(data: Partial<Geofence>): Geofence;
  update(id: string, data: Partial<Geofence>): Geofence | undefined;
  delete(id: string): boolean;
  subscribe(listener: () => void): () => void;
}

// --- Mock Repository Implementation -------------------------------------------

class MockGeofenceRepository implements GeofenceRepository {
  private geofences: Geofence[];
  private groups: GeofenceGroup[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.geofences = centralGeofences.map((g) => ({
      ...g,
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2025-01-15T10:30:00Z',
    })) as unknown as Geofence[];

    this.groups = mockGeofenceGroups.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
    }));
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error notifying geofence listener:', err);
      }
    });
  }

  getAll(): Geofence[] {
    return [...this.geofences];
  }

  getById(id: string): Geofence | undefined {
    return this.geofences.find((g) => g.id === id);
  }

  getGroups(): GeofenceGroup[] {
    return [...this.groups];
  }

  create(data: Partial<Geofence>): Geofence {
    const id = data.id || `geo-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newGeofence: Geofence = {
      id,
      name: data.name || 'Batas Wilayah Baru',
      groupId: data.groupId || undefined,
      description: data.description || '',
      status: data.status || 'active',
      geometry: data.geometry!,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    this.geofences = [newGeofence, ...this.geofences];
    this.notify();
    return newGeofence;
  }

  update(id: string, data: Partial<Geofence>): Geofence | undefined {
    const index = this.geofences.findIndex((g) => g.id === id);
    if (index === -1) return undefined;

    const current = this.geofences[index];
    const updated: Geofence = {
      ...current,
      ...data,
      id: current.id, // prevent overwriting ID
      updatedAt: new Date().toISOString(),
    };

    this.geofences[index] = updated;
    this.notify();
    return updated;
  }

  delete(id: string): boolean {
    const prevLength = this.geofences.length;
    this.geofences = this.geofences.filter((g) => g.id !== id);
    const deleted = this.geofences.length < prevLength;
    if (deleted) {
      this.notify();
    }
    return deleted;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

// --- Singleton Export ----------------------------------------------------------

export const geofenceRepository: GeofenceRepository = new MockGeofenceRepository();
