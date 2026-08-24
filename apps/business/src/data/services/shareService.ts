/**
 * Share Service
 *
 * Location sharing session management.
 * Uses unified vehicle data — no separate vehicle/driver dataset.
 */

import type { ShareSession } from '@/features/core/sharing/types';
import { shareRepository, generateToken } from '../repositories/shareRepository';
import { trackingService } from './trackingService';

export const shareService = {
  /**
   * Get initial sessions for context state initialization.
   */
  getInitialSessions(): ShareSession[] {
    return shareRepository.getInitialSessions();
  },

  /**
   * Get a vehicle's current location — uses live tracking data.
   * Ensures sharing uses the same vehicle entity as Live mode.
   */
  getVehicleCurrentLocation(vehicleId: string) {
    const vehicles = trackingService.getLiveVehicles();
    return vehicles.find((v) => v.id === vehicleId)?.location ?? null;
  },

  /**
   * Resolve a public share token to a session.
   */
  resolveToken(token: string): ShareSession | undefined {
    return shareRepository.getByToken(token);
  },

  /**
   * Generate a new unique share token.
   */
  generateToken(): string {
    return generateToken();
  },
};
