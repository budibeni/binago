/**
 * Proxy: features/tracking/data/mockTrackingData.ts
 *
 * Backward-compatible adapter. All data comes from trackingService.
 * New code should import from '@/data/services' directly.
 */

import type { TrackingVehicle, TrackingVehicleGroup, Trip, PlaybackData } from '../types/tracking';
import { trackingService } from '@/data/services/trackingService';
export type { MockPlaybackTrackPoint, MockPlaybackData } from '@/data/repositories/trackingRepository';

export const mockVehicles: TrackingVehicle[] = trackingService.getLiveVehicles();
export const mockVehicleGroups: TrackingVehicleGroup[] = trackingService.getLiveVehicleGroups();

export function getMockTripsByVehicleId(vehicleId: string): Trip[] {
  return trackingService.getTripsByVehicleId(vehicleId);
}

// mockTripsByVehicleId kept for legacy consumers
export const mockTripsByVehicleId: Record<string, Trip[]> = {};
(function buildTripMap() {
  mockVehicles.forEach((v) => {
    mockTripsByVehicleId[v.id] = trackingService.getTripsByVehicleId(v.id);
  });
})();

export const mockPlaybackData: PlaybackData[] = [];

/**
 * generateMockPlaybackData — kept for backward compatibility with TrackingFeature.
 * Delegates to trackingService.
 */
export function generateMockPlaybackData(vehicleId: string, startDatetime: Date) {
  return trackingService.getPlaybackData(vehicleId, startDatetime);
}
