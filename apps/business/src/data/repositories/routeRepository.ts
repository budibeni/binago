/**
 * Route Repository
 *
 * In-memory reactive repository managing standard routes with pub/sub listener.
 */

import type { Route } from '@/features/core/routes/types';
import { mockRoutes as centralRoutes } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface RouteRepository {
  getAll(): Route[];
  getById(id: string): Route | undefined;
  create(data: Partial<Route>): Route;
  update(id: string, data: Partial<Route>): Route | undefined;
  delete(id: string): boolean;
  subscribe(listener: () => void): () => void;
}

// --- Mock Repository Implementation -------------------------------------------

class MockRouteRepository implements RouteRepository {
  private routes: Route[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.routes = centralRoutes as unknown as Route[];
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error notifying route listener:', err);
      }
    });
  }

  getAll(): Route[] {
    return [...this.routes];
  }

  getById(id: string): Route | undefined {
    return this.routes.find((r) => r.id === id);
  }

  create(data: Partial<Route>): Route {
    const id = data.id || `route-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newRoute: Route = {
      id,
      name: data.name || 'Rute Baru',
      description: data.description || '',
      groupId: data.groupId || undefined,
      origin: data.origin || { type: 'coordinate', latitude: -6.1751, longitude: 106.8271 },
      stops: data.stops || [],
      destination: data.destination || { type: 'coordinate', latitude: -6.1823, longitude: 106.6277 },
      plannedPath: data.plannedPath,
      plannedDistance: data.plannedDistance,
      estimatedDuration: data.estimatedDuration,
      status: data.status || 'active',
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    this.routes = [newRoute, ...this.routes];
    this.notify();
    return newRoute;
  }

  update(id: string, data: Partial<Route>): Route | undefined {
    const index = this.routes.findIndex((r) => r.id === id);
    if (index === -1) return undefined;

    const current = this.routes[index];
    const updated: Route = {
      ...current,
      ...data,
      id: current.id, // prevent overwriting ID
      updatedAt: new Date().toISOString(),
    };

    this.routes[index] = updated;
    this.notify();
    return updated;
  }

  delete(id: string): boolean {
    const prevLength = this.routes.length;
    this.routes = this.routes.filter((r) => r.id !== id);
    const deleted = this.routes.length < prevLength;
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

export const routeRepository: RouteRepository = new MockRouteRepository();
