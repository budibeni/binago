/**
 * Proxy: features/home/data/mockHomeData.ts
 *
 * Backward-compatible adapter. All data comes from homeService.
 */

import { homeService } from '@/data/services/homeService';

export interface MetricSummary {
  totalVehicles: number;
  movingVehicles: number;
  activeAlerts: number;
  tripsToday: number;
  activeVehicles: number;
  idleVehicles: number;
  activeDrivers: number;
  ongoingDeliveries: number;
  onlineDevices: number;
}

export interface FleetAttentionItem {
  id: string;
  type: 'maintenance' | 'offline' | 'alert';
  title: string;
  description: string;
  time: string;
}

export const mockMetricSummary: MetricSummary = homeService.getMetricSummary();
export const mockFleetAttention: FleetAttentionItem[] = homeService.getFleetAttention();
