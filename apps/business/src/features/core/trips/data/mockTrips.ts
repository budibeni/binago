/**
 * Proxy: features/trips/data/mockTrips.ts
 *
 * Backward-compatible adapter. All data comes from tripService.
 */

import type { Trip } from '../types/trips';
import { tripService } from '@/data/services/tripService';

export const mockTrips: Trip[] = tripService.getTrips() as unknown as Trip[];
