/**
 * Route Service
 */

import type { Route } from '@/features/routes/types';
import { routeRepository } from '../repositories/routeRepository';

export const routeService = {
  getRoutes(): Route[] {
    return routeRepository.getAll();
  },

  getRouteById(id: string): Route | undefined {
    return routeRepository.getById(id);
  },
};
