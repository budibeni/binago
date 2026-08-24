/**
 * Route Repository
 */

import type { Route } from '@/features/routes/types';
import { mockRoutes as centralRoutes } from '../mock';

// --- Repository Interface ------------------------------------------------------

export interface RouteRepository {
  getAll(): Route[];
  getById(id: string): Route | undefined;
}

// --- Mock Repository Implementation -------------------------------------------

class MockRouteRepository implements RouteRepository {
  private routes: Route[];

  constructor() {
    this.routes = centralRoutes as unknown as Route[];
  }

  getAll(): Route[] {
    return this.routes;
  }

  getById(id: string): Route | undefined {
    return this.routes.find((r) => r.id === id);
  }
}

// --- Singleton Export ----------------------------------------------------------

export const routeRepository: RouteRepository = new MockRouteRepository();
