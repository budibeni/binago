export interface PersonalMetricSummary {
  registeredVehicles: number;
  movingVehicles: number;
  activeAlerts: number;
  onlineDevices: number;
}

export const mockPersonalMetrics: PersonalMetricSummary = {
  registeredVehicles: 3,
  movingVehicles: 1,
  activeAlerts: 2,
  onlineDevices: 3,
};
