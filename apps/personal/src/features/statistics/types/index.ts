export type StatisticPeriod = 'daily' | 'weekly' | 'monthly';

export interface MetricDiff {
  value: number;
  isPositive: boolean;
  label: string; // e.g., 'dibanding kemarin'
  unit?: string; // e.g., 'km/j', '%'
}

export interface MetricValue {
  value: number | string;
  diff?: MetricDiff;
}

export interface StatisticSummary {
  vehicleId: string;
  period: StatisticPeriod;
  dateStr: string; // ISO string representing the start of the period
  totalDistance: MetricValue; // in km
  totalDuration: MetricValue; // in minutes
  tripCount: MetricValue;
  avgSpeed: MetricValue; // in km/h
  maxSpeed: MetricValue; // in km/h
  
  // Optional chart data: distance per unit of time
  // e.g., for daily: distance per hour, weekly: per day, monthly: per day/week
  trendData?: {
    label: string;
    value: number;
  }[];
}
