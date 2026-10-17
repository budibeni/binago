/**
 * Route Service
 *
 * Public facade for route domain, consumed directly by UI feature components.
 */

import type { Route } from '@/features/core/routes/types';
import { routeRepository } from '../repositories/routeRepository';

export const routeService = {
  getRoutes(): Route[] {
    return routeRepository.getAll();
  },

  getRouteById(id: string): Route | undefined {
    return routeRepository.getById(id);
  },

  createRoute(data: Partial<Route>): Route {
    return routeRepository.create(data);
  },

  updateRoute(id: string, data: Partial<Route>): Route | undefined {
    return routeRepository.update(id, data);
  },

  deleteRoute(id: string): boolean {
    return routeRepository.delete(id);
  },

  subscribe(listener: () => void): () => void {
    return routeRepository.subscribe(listener);
  },
};
