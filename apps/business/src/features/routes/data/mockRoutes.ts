/**
 * Proxy: features/routes/data/mockRoutes.ts
 *
 * Backward-compatible adapter. All data comes from routeService.
 */

import type { Route } from '../types';
import { routeService } from '@/data/services/routeService';

export const mockRoutes: Route[] = routeService.getRoutes();
