/**
 * Tracking Service
 *
 * Entry point for Live, Playback, and Heatmap data.
 * All three modes use the same vehicle entity.
 */

import type {
  TrackingVehicle,
  TrackingVehicleGroup,
  Trip,
} from '@/features/core/tracking/types/tracking';
import {
  trackingRepository,
  type MockPlaybackData,
  type HeatmapPoint,
} from '../repositories/trackingRepository';

export const trackingService = {
  /**
   * Live: get all vehicles with current status and location.
   */
  getLiveVehicles(): TrackingVehicle[] {
    return trackingRepository.getLiveVehicles();
  },

  /**
   * Live: get vehicles grouped by group — used by VehicleList sidebar.
   */
  getLiveVehicleGroups(): TrackingVehicleGroup[] {
    return trackingRepository.getLiveVehicleGroups();
  },

  /**
   * Playback: get trips for a vehicle (for trip selection list).
   */
  getTripsByVehicleId(vehicleId: string): Trip[] {
    return trackingRepository.getTripsByVehicleId(vehicleId);
  },

  /**
   * Playback: generate realistic GPS playback track for a given vehicle and date.
   */
  getPlaybackData(vehicleId: string, startDatetime: Date): MockPlaybackData {
    return trackingRepository.getPlaybackData(vehicleId, startDatetime);
  },

  /**
   * Heatmap: get weighted location points from tracking state.
   * Uses the same vehicle data as Live — no separate dataset.
   */
  getHeatmapPoints(vehicleId?: string): HeatmapPoint[] {
    return trackingRepository.getHeatmapPoints(vehicleId);
  },
};

// Re-export types needed by feature consumers
export type { MockPlaybackData, HeatmapPoint };
